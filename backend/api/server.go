package api

import (
	"errors"

	"github.com/gen4ralz/react-golang-ecommerce/store"
	"github.com/gen4ralz/react-golang-ecommerce/utils"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
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


	// Authenticated routes group
	authenticated := app.Group("/auth")
	// Use auth middleware
	authenticated.Use(AuthMiddleware((server.config.Auth)))

		// Cartscreen
		authenticated.Post("/cart/saveCart", server.saveCart)

		// Checkoutscreen
		authenticated.Get("/cart/getCart", server.getCart)
		authenticated.Post("/address/saveAddress", server.saveAddress)
		authenticated.Post("/address/deleteAddress", server.deleteAddress)
		authenticated.Post("/address/changeActiveAddress", server.changeActiveAddress)
		authenticated.Post("/coupon/apply", server.applyCoupon)
		authenticated.Post("/order/placeOrder", server.placeOrder)

		// Orderscreen
		authenticated.Get("/order/getOrder/:id", server.getOrder)
		authenticated.Post("/pay/:orderid/paywithstripe", server.payWithStripe)
		authenticated.Post("/pay/:orderid/paywithpaypal", server.payWithPayPal)

		// Adminscreen
		// category
		authenticated.Get("/admin/categories", server.getCategories)
		authenticated.Post("/admin/createCategory", server.createCategory)
		authenticated.Delete("/admin/removeCategory", server.removeCategory)
		authenticated.Put("/admin/updateCategory", server.updateCategory)
		// coupon
		authenticated.Get("/admin/coupons", server.getCoupons)
		authenticated.Post("/admin/createCoupon", server.createCoupon)
		authenticated.Delete("/admin/removeCoupon", server.removeCoupon)
		authenticated.Put("/admin/updateCoupon", server.updateCoupon)
		// product
		authenticated.Get("/admin/products", server.adminGetAllProducts)

		// Tool
		authenticated.Post("/upload", server.uploadFile)

	server.app = app
	return server
}

// Start runs the HTTP server on a specific address.
func (server *Server) Start(address string) error {
	return server.app.Listen(address)
}

// -------------- Helper function --------------------

// Helper function for handling errors.
func errorResponse(err error) fiber.Map {
	return fiber.Map{"error": err.Error()}
}

// Helper function for handling admin role.
func (server *Server) IsAdmin(c *fiber.Ctx) (bool, error) {
	// Get user id in context from Auth middleware
	userID, found := c.Locals("userID").(string)
	if !found {
		err := errors.New("user ID not found in context")
		return false, err
	}
	// Convert string to primitive
	user_id, _ := primitive.ObjectIDFromHex(userID)

	// Get user from user email
	user, err := server.store.GetUserByID(user_id)
	if err != nil {
		err := errors.New("user not found in database")
		return false, err
	}

	// Check role
	if user.Role != "admin" {
		err := errors.New("role is not admin")
		return false, err
	}
	return true, nil
}