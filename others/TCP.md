# TCP

> When we want to build a TCP server in the Rust, JavaScript and other high-level languages, we can use the standard lib to build the server easily.

1. First, we need to create a TCP listener, and bind it to a port.
2. Then, we can accept the incoming connections, and handle the connections in a new thread.
   * In Deno/Rust, get the **incoming connections**(stream) from the `accept()` method of the listener.
   * Beacuse there are many streams in the connections, Rust/Deno provides another method to get the **connection stream**.
      * Rust: `for stream in listener.incoming() {}`
      * Deno: `for await (const stream of listener) {}`
3. Finally, we can *write*/*read* the data from the connection `stream`.(TCP connection is **persistent connection**.)

For example:

```ts
const listener = Deno.listen({
  hostname: '0.0.0.0',
  port: 8080,
  transport: 'tcp',
})
const encoder = new TextEncoder()

async function main() {
  for (;;) {
    const stream = await listener.accept()
    handleStream(stream)
  }
}

async function handleStream(stream: Deno.Conn) {
  stream.write(encoder.encode('Hello World\n'))
  const buffer = new Uint8Array(1024)
  while (true) {
    const n = await stream.read(buffer)
    if (n === null) break
    stream.write(buffer.slice(0, n))
  }
  console.log('connection closed', stream.rid)
  stream.close()
}

main()
```

In Rust with `incoming`: <https://github.com/fwqaaq/HTTP/blob/78b5fa8bb2c0cdb37127dec78a6842e0b47d1fb2/src/small_chat.rs#L102>

## Socket

>Socket is an abstract concept in computer network that represents the endpoint in a network communication between two nodes. In network programming, a socket is a fundamental building block used for sending and receiving data in a network.

In most cases, we never pay attention to the socket, but without exception, the TCP implementation in most language is based on the socket.

* TCP Sockets: These sockets are used for establishing reliable, ordered, and bidirectional.
* UDP Sockets: Compared to TCP sockets, UDP sockets provide a simpler by exchanging data in the form of independent packets(called datagrams). And UDP sockets are not reliable and ordered.

> How to create a TCP server with socket in C?

1. **Creating a Socket**: Create a socket based on the required communication type (TCP, UDP) and protocol.
2. **Binding the Socket** (optional, typically for servers): Bind the socket to a network address and port.
3. **Listening for Connections** (TCP only, typically for servers): In TCP, the server socket listens for connection requests from clients.
4. **Accepting Connections** (TCP only, typically for servers): The server accepts connection requests from clients to establish communication.
5. **Connecting to a Socket** (typically for clients): The client socket attempts to connect to the server's socket.
6. **Sending and Receiving Data**: Once a connection is established, data can be sent and received through the socket.
7. **Closing the Socket**: After communication is complete, the socket is closed to free up resources.

```c
#include <errno.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>

#define PORT 8080
#define BUFFER_SIZE 1024

int createTCPServer(int port) {
    int s, yes = 1;
    struct sockaddr_in server_addr;

    if ((s = socket(AF_INET, SOCK_STREAM, 0)) == -1) { // create a socket for TCP, `SOCK_DGRAM` for UDP
        perror("Socket creation failed");
        exit(1);
    }

    setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes));  // Best effort.

    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET; // set the address family(IPv4), AF_INET6 for IPv6
    server_addr.sin_addr.s_addr =
        htonl(INADDR_ANY);  // set the IP(0.0.0.0) address in the big-endin format
    server_addr.sin_port = htons(port);

    if (bind(s, (struct sockaddr *)&server_addr, sizeof(server_addr)) == -1 ||
        listen(s, 511) == -1) { // listen for connections on a socket
        close(s);
        exit(1);
    }

    printf("TCP server listening on port %d\n", port);

    return s;
}

int acceptClient(int server_socket) { // accept a connection on a socket
    int s;
    while (1) {
        struct sockaddr_in client_addr;
        socklen_t client_len = sizeof(client_addr);
        s = accept(server_socket, (struct sockaddr *)&client_addr, &client_len);
        if (s == -1) {
            if (errno == EINTR)
                continue; /* Try again. */
            else
                return -1;
        }
        break;
    }
    return s;
}

int main() {
    int server_socket = createTCPServer(PORT);
    int client_socket = acceptClient(server_socket);

    int n;
    char buffer[BUFFER_SIZE];
    while ((n = read(client_socket, buffer, BUFFER_SIZE)) > 0) {
        write(STDOUT_FILENO, buffer, n);
        write(client_socket, buffer, n);
    }

    close(client_socket);
    close(server_socket);
    return 0;
}
```
