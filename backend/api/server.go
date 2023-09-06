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

	// Home
	app.Get("/home", server.home)

	// User
	app.Post("/user/register", server.createUser)
	app.Post("/user/login", server.loginUser)

	// Product
	app.Get("/product/getAllProducts", server.getAllProducts)
	app.Get("/product/getProductBySlug/:slug", server.getProductBySlug)
	app.Get("/product/getProductById/:id", server.getProductBeforeAddtoCartById)

	// Cart
	app.Post("/cart/saveCart", server.saveCart)
	app.Get("/cart/getCart", server.getCart)

	// Checkout
	app.Post("/user/saveAddress", server.saveAddress)

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