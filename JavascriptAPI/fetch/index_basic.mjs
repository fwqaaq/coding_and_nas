const elprogress = document.getElementById("progress")

function status(text) {
  document.getElementById('status').innerText = text
}

status("downloading with fetch ...")

fetch('https://audio.fwqaq.us/banner/wlop.png').then(
  response => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`)
    }
    if (!response.body) {
      throw new Error('ReadableStream not yet supported')
    }

    const contentLength = response.headers.get("x-file-size") ?? response.headers.get("content-length")
    if (contentLength === null) {
      throw new Error("Resposne size header unavailable")
    }
    const total = contentLength
    let loaded = 0
    return new Response(
      new ReadableStream({
        start(controller) {
          const reader = response.body.getReader()
          read()

          function read() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close()
                return
              }

              loaded += value.byteLength
              progress({ loaded, total })
              // enqueue the next data chunk into our target stream
              controller.enqueue(value)
              read()
            }).catch(error => {
              console.error(error)
              controller.error(error)
            })
          }
        }
      }))
  }).then(response => response.blob()).then(
    // display the image only when the image is completely downloaded
    data => {
      status("download successful")
      document.getElementById('img').src = URL.createObjectURL(data)
    }).catch(
      error => {
        console.log(error)
        status(error)
      }
    )

function progress({ loaded, total }) {
  elprogress.innerHTML = Math.round(loaded / total * 100) + '%'
}