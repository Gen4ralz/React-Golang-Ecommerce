package api

import (
	"github.com/gen4ralz/react-golang-ecommerce/store"
	"github.com/gen4ralz/react-golang-ecommerce/utils"
	"github.com/gofiber/fiber/v2"
)

// Server serves HTTP requests for booking service.
type Server struct {
	config 	utils.Config
	store	store.Store
	app 	*fiber.App
}

// NewServer creates a new HTTP server and setup routing.
func NewServer(config utils.Config, store store.Store) *Server {
	server := &Server{
		config: config,
		store: store,
	}

	app := fiber.New()

	app.Get("/home", server.home)
	app.Post("/user/register", server.createUser)
	app.Post("/user/login", server.loginUser)

	server.app = app
	return server
}

// Start runs the HTTP server on a specific address.
func (server *Server) Start(address string) error {
	return server.app.Listen(address)
}

// Helper function for handling errors.
func errorResponse(err error) fiber.Map {
	return fiber.Map{"error": err.Error()}
}