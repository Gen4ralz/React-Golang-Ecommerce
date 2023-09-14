package api

import (
	"github.com/gen4ralz/react-golang-ecommerce/store"
	"github.com/gen4ralz/react-golang-ecommerce/utils"
	"github.com/gofiber/fiber/v2"
)

// Server serves HTTP requests for ecommerce service.
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

	// Check server health
	app.Get("/home", server.home)

	// Seeds
	app.Get("/seed/coupon", server.seedCoupon)

	// Homescreen
	app.Get("/product/getAllProducts", server.getAllProducts)

	// Loginscreen
	app.Post("/user/register", server.createUser)
	app.Post("/user/login", server.loginUser)

	// Productscreen
	app.Get("/product/getProductBySlug/:slug", server.getProductBySlug)
	app.Get("/product/getProductById/:id", server.getProductBeforeAddtoCartById)

	// Cartscreen
	app.Post("/cart/saveCart", server.saveCart)

	// Checkoutscreen
	app.Get("/cart/getCart", server.getCart)
	app.Post("/address/saveAddress", server.saveAddress)
	app.Post("/address/deleteAddress", server.deleteAddress)
	app.Post("/address/changeActiveAddress", server.changeActiveAddress)
	app.Post("/coupon/apply", server.applyCoupon)
	app.Post("/order/placeOrder", server.placeOrder)

	// Orderscreen
	app.Get("/order/getOrder/:id", server.getOrder)
	app.Post("/pay/:orderid/paywithstripe", server.payWithStripe)
	app.Post("/pay/:orderid/paywithpaypal", server.payWithPayPal)

	// Adminscreen
	app.Get("/admin/categories", server.getCategories)
	app.Post("/admin/createCategory", server.createCategory)

	// Tool
	app.Post("/upload", server.uploadFile)

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