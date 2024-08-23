package mod

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

func Welcome(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")[7:]

	claims := &Claims{}

	err := jwtKey.Decode(token, claims)

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	w.Write([]byte("Welcome " + claims.Username))

}
