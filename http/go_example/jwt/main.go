package main

import (
	"grpc_example/jwt/mod"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/signin", mod.Signin)
	http.HandleFunc("/welcome", mod.Welcome)
	http.HandleFunc("/refresh", mod.Refresh)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
