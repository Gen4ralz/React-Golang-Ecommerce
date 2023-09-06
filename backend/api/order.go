package api

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/gen4ralz/react-golang-ecommerce/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type requestPlaceOrder struct {
	Payment 	string						`json:"payment_method"`
	Products 	[]models.CartProductForSave `json:"products"`
	Total		float64						`json:"total"`
	Address		models.Address				`json:"shipping_address"`
}

func (server *Server) placeOrder(c *fiber.Ctx) error {
	// Bind item into Go struct
	var req requestPlaceOrder
	if err := c.BodyParser(&req); err != nil {
		log.Println("error when bind item", err)
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	// Verify token
	tokenString, _, err := server.config.Auth.GetTokenFromHeaderAndVerify(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}
	// Get user email from tokenString
	userEmail, err := server.config.Auth.SearchUserEmailFromToken(tokenString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	// Get user from user email
	user, err := server.store.GetUserByEmail(userEmail)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	// Set order arg prepare for save to database
	arg := models.OrderDocument {
		OrderID: primitive.NewObjectID(),
		UserID: user.ID.Hex(),
		PaymentMethod: req.Payment,
		Total: req.Total,
		ShippingPrice: 0,
		IsPaid: false,
		Status: models.OrderStatusNotProcessed,
		ShippingAddress: models.ShippingPayload{
			FullName: req.Address.FullName,
			Address: req.Address.Address,
			Country: req.Address.Country,
			PhoneNumber: req.Address.PhoneNumber,
		},
		Products: req.Products,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	// Save order to database
	orderID, err := server.store.SaveOrder(arg)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	// Convert Hex ID to string
	order_id := orderID.Hex();
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintf("Save Order %s into database successfully", order_id),
		Data: order_id,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}

type requestOrder struct {
	ID	string	`json:"id"`
}

func (server *Server) getOrder(c *fiber.Ctx) error {
	req := requestOrder {
		ID: c.Params("id"),
	}
	log.Println("OrderID", req.ID)
	// Verify token
	tokenString, _, err := server.config.Auth.GetTokenFromHeaderAndVerify(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}
	// Get user email from tokenString
	userEmail, err := server.config.Auth.SearchUserEmailFromToken(tokenString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	// Get user from user email
	user, err := server.store.GetUserByEmail(userEmail)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	// Convert order string ID into primitive ID
	orderID, _ := primitive.ObjectIDFromHex(req.ID)
	order, err := server.store.GetOrderByID(orderID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	
	if order.UserID != user.ID.Hex() {
		err := errors.New("user_id from token and user_id from order don't match")
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	} 
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintf("Get order %s from database successfully", req.ID),
		Data: order,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}