package mod

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func Refresh(w http.ResponseWriter, r *http.Request) {
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

	// Refresh the token when old token is going to expire(in the 30s before expiration)
	if time.Until(claims.ExpiresAt.Time) < 30*time.Second {
		w.WriteHeader(http.StatusAccepted)
		return
	}

	expirationTime := time.Now().Add(5 * time.Minute)
	claims.ExpiresAt = jwt.NewNumericDate(expirationTime)
	tokenString, err := jwtKey.Encode(claims)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Authorization", "Bearer "+tokenString)
}
