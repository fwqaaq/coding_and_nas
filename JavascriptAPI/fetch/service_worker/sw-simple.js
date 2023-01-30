self.addEventListener('install', () => {
  self.skipWaiting();
})

self.addEventListener('fetch', event => {
  const scope = self.registration.scope;
  if (event.request.url === scope || event.request.url === scope + 'index.html') {
    const newUrl = scope + 'sw-installed.html';
    console.log('respondWith', newUrl);
    event.respondWith(fetch(newUrl))
  } else {
    console.log('VER', 2, event.request.url)
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
  if (contentLength === null) {
    // don't track download progress if we can't compare against a total size
    console.warn('Response size header unavailable. Cannot measure progress');
    return response;
  }

  let loaded = 0;
  debugReadIterations = 0; // direct correlation to server's response buffer size
  const total = parseInt(contentLength, 10);
  const reader = response.body.getReader();

  return new Response(
    new ReadableStream({
      start(controller) {
        // get client to post message. Awaiting resolution first read() progress
        // is sent for progress indicator accuracy
        let client;
        console.log(clients)
        clients.get(clientId).then(c => {
          client = c;
          read();
        });

        function read() {
          debugReadIterations++;
          reader.read().then(({ done, value }) => {
            if (done) {
              console.log('read()', debugReadIterations);
              controller.close();
              return;
            }

            controller.enqueue(value);
            loaded += value.byteLength;
            // console.log('    SW', Math.round(loaded/total*100)+'%');
            dispatchProgress({ client, loaded, total });
            read();
          })
            .catch(error => {
              // error only typically occurs if network fails mid-download
              console.error('error in read()', error);
              controller.error(error)
            });
        }
      },

      // Firefox excutes this on page stop, Chrome does not
      cancel(reason) {
        console.log('cancel()', reason);
      }
    })
  )
}

function dispatchProgress({ client, loaded, total }) {
  client.postMessage({ loaded, total })
}