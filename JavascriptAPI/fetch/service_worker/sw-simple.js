self.addEventListener('install', () => {
  self.skipWaiting();
})

self.addEventListener('fetch', event => {
  // 如果在 localhost 中，这里的 scope 作用域是：http://127.0.0.1:5501/JavascriptAPI/fetch/service_worker/
  const scope = self.registration.scope;
  // request.url 是当前的请求页面：http://127.0.0.1:5501/JavascriptAPI/fetch/service_worker/index.html
  if (event.request.url === scope || event.request.url === scope + 'index.html') {
    const newUrl = scope + 'sw-installed.html';
    // 将新的页面给请求响应
    event.respondWith(fetch(newUrl))
  } else {
    // 如果 reques.url 变成图像的 url，则会从该分支 https://audio.fwqaq.us/banner/wlop.png
    // 其中 event.request.url 还会有一些 chrome-extension 的请求
    if (event.request.url.includes("chrome-extension")) return
    event.respondWith(fetchWithProgressMonitor(event))
  }
})

function fetchWithProgressMonitor(event) {
  /*  
   *  当请求的 credentials 模式是 include，响应的 'Access-Control-Allow-Origin' 标头禁止是通配符。
   *  这里我们将忽略 credentials
   */
  const newRequest = new Request(event.request, {
    mode: 'cors',
    credentials: 'omit'
  })
  return fetch(newRequest).then(response => respondWithProgressMonitor(event.clientId, response));
}

function respondWithProgressMonitor(clientId, response) {
  if (!response.ok) {
    console.log('HTTP error')
    return response;
  }

  const contentLength = response.headers.get('content-length')
  // chrome-extension 请求协议是没有 content-length 的
  if (contentLength === null) {
    // 这里是没有得到总大小的情况
    console.warn('Response size header unavailable. Cannot measure progress');
    return response;
  }

  let loaded = 0;
  debugReadIterations = 0; // 该大小与服务器的缓冲区大小有关
  const total = parseInt(contentLength, 10);
  const reader = response.body.getReader();

  return new Response(
    new ReadableStream({
      start(controller) {
        // 让客户端发布消息。等待第一次解析 read() 进度
        // 使用 read() 发送进度
        let client;
        clients.get(clientId).then(c => {
          client = c;
          read();
        });

        function read() {
          debugReadIterations++;
          reader.read().then(({ done, value }) => {
            if (done) {
              // 关闭 readablestream
              controller.close();
              return;
            }
            controller.enqueue(value);
            loaded += value.byteLength;
            dispatchProgress({ client, loaded, total });
            read();
          })
            .catch(error => {
              console.error('error in read()', error);
              controller.error(error)
            });
        }
      },
      cancel(reason) {
        console.log('cancel()', reason);
      }
    })
  )
}

function dispatchProgress({ client, loaded, total }) {
  // 不会立即调用
  client.postMessage({ loaded, total })
}