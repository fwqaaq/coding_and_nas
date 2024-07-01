package mod

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

func Welcome(w http.ResponseWriter, r *http.Request) {
	// Get the token from the cookie
	c, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		// Return bad request for other errors
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	token := c.Value

	claims := &Claims{}

	err = jwtKey.Decode(token, claims)

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
