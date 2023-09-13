package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/gen4ralz/react-golang-ecommerce/api"
	"github.com/gen4ralz/react-golang-ecommerce/db"
	"github.com/gen4ralz/react-golang-ecommerce/store"
	"github.com/gen4ralz/react-golang-ecommerce/token"
	"github.com/gen4ralz/react-golang-ecommerce/utils"
)

func main() {
	mongoURL := os.Getenv("DBSOURCE")
	serverAddress := os.Getenv("SERVERADDRESS")
	jwt_secret  := os.Getenv("JWT_SECRET")
	jwt_issuer := os.Getenv("JWT_ISSUER")
	jwt_audience := os.Getenv("JWT_AUDIENCE")
	cookie_domain := os.Getenv("COOKIE_DOMAIN")
	paypal_id := os.Getenv("PAYPAL_CLIENT_ID")
	stripe_pub_key := os.Getenv("STRIPE_PUBLIC_KEY")
	stripe_secret_key := os.Getenv("STRIPE_SECRET_KEY")
	cloudiry_name := os.Getenv("CLOUDINARY_NAME")
	cloudiry_key := os.Getenv("CLOUDINARY_KEY")
	cloudiry_secret := os.Getenv("CLOUDINARY_SECRET")

	config := utils.Config{
		DBScource:     mongoURL,
		ServerAddress: serverAddress,
		Auth: token.Auth{
			Issuer: jwt_issuer,
			Secret: jwt_secret,
			Audience: jwt_audience,
			CookieDomain: cookie_domain,
			TokenExipry: 24 * time.Hour,
		},
		Paypal: utils.PAYPAL{
			CLIENT_ID: paypal_id,
		},
		Stripe: utils.STRIPE{
			PUBLIC_KEY: stripe_pub_key,
			SECRET_KEY: stripe_secret_key,
		},
		Cloudinary: utils.CLOUDINARY{
			NAME: cloudiry_name,
			PUBLIC_KEY: cloudiry_key,
			SECRET_KEY: cloudiry_secret,
		},
	}

	log.Println("Connecting to database...")
	mongoClient, err := db.ConnectToMongo(mongoURL)
	if err != nil {
		log.Panic(err)
	}
	client := mongoClient

	// Create context in order to disconnect
	ctx, cancel := context.WithTimeout(context.Background(), 15 * time.Second)
	defer cancel()

	// Close connection
	defer func ()  {
		if err = client.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()

	store := store.NewMongoDBStore(client)
	server := api.NewServer(config, store)

	err = server.Start(config.ServerAddress)
	if err != nil {
		log.Fatal("cannot start server:", err)
	}
}