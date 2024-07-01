package mod

import (
	"github.com/golang-jwt/jwt/v5"
)

// Key struct
type Key struct {
	Key []byte
}

type Vaildator interface {
	Encode(claims jwt.Claims) (string, error)
	Decode(sign string, claims jwt.Claims) error
}

func (k *Key) Encode(c jwt.Claims) (string, error) {
	// Create the JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	// Create a string from the token
	sign, err := token.SignedString(k.Key)
	return sign, err
}

func (k *Key) Decode(sign string, c jwt.Claims) error {
	_, err := jwt.ParseWithClaims(sign, c, func(t *jwt.Token) (interface{}, error) {
		return k.Key, nil
	})
	return err
}

var users = map[string]string{
	"user": "password",
}

var jwtKey = Key{
	Key: []byte("fwqaaq"),
}

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}
