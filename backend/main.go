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