package utils

import "github.com/gen4ralz/react-golang-ecommerce/token"

// Config stores all configuration of the application
type Config struct {
	DBScource		string
	ServerAddress	string
	Paypal			PAYPAL
	Stripe			STRIPE
	Auth 			token.Auth
}

type PAYPAL struct {
	CLIENT_ID		string
	CLIENT_SECRET	string
}

type STRIPE struct {
	PUBLIC_KEY		string
	SECRET_KEY		string
}