package utils

import "github.com/gen4ralz/react-golang-ecommerce/token"

// Config stores all configuration of the application
type Config struct {
	DBScource		string
	ServerAddress	string
	Auth 			token.Auth
}