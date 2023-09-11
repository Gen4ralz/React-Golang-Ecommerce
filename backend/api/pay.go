package api

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/stripe/stripe-go/v75"
	"github.com/stripe/stripe-go/v75/paymentintent"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type requestStripe struct {
	ID	    string	`json:"id"`
	Amount	float64	`json:"amount"`
	OrderId	string	`json:"order_id"`	
}
func (server *Server) payWithStripe(c *fiber.Ctx) error {
	var req requestStripe
	
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	req.OrderId = c.Params("orderid")

	// Verify token
	tokenString, _, err := server.config.Auth.GetTokenFromHeaderAndVerify(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}
	userEmail, err := server.config.Auth.SearchUserEmailFromToken(tokenString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Get User From Database
	user, err := server.store.GetUserByEmail(userEmail)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Check Existing Cart
	userID := user.ID.Hex()

	stripe.Key = server.config.Stripe.SECRET_KEY

	params := &stripe.PaymentIntentParams{
		Amount: stripe.Int64(int64(req.Amount * 100)),
		Currency: stripe.String("THB"),
		Description: stripe.String("DOSIMPLE Store"),
		PaymentMethod: stripe.String(req.ID),
		Confirm: stripe.Bool(true),
		ReturnURL:   stripe.String("http://localhost/order/" + req.OrderId),
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	log.Println("Payment_Intent-->", pi)

	orderID, _ := primitive.ObjectIDFromHex(req.OrderId)
	order, err := server.store.GetOrderByID(orderID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	order.IsPaid = true
	order.PaidAt = time.Now()
	order.PaymentResult.Status = string(pi.Status)
	order.PaymentResult.Email = pi.ReceiptEmail
	order.PaymentResult.ID = pi.ID

	err = server.store.UpdateOrder(order)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// If payment is success and already update order
	// then delete cart
	err = server.store.RemoveCartByUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintf("Order %v paid with stripe successfully", req.OrderId),
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}

type requestPaypal struct {
	OrderId	string	`json:"order_id"`
	ID	    string	`json:"id"`
	Status	string	`json:"status"`
	Payer	Payer	`json:"payer"`
}

type Payer struct {
	Email	string	`json:"email_address"`
}

func (server *Server) payWithPayPal(c *fiber.Ctx) error {
	var req requestPaypal
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	req.OrderId = c.Params("orderid")

	log.Println("Request Paypal->", req)

	// Verify token
	tokenString, _, err := server.config.Auth.GetTokenFromHeaderAndVerify(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}
	userEmail, err := server.config.Auth.SearchUserEmailFromToken(tokenString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	// Get User From Database
	user, err := server.store.GetUserByEmail(userEmail)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// convert primitive to string
	userID := user.ID.Hex()
	// convert string to primitive
	orderID, _ := primitive.ObjectIDFromHex(req.OrderId)

	order, err := server.store.GetOrderByID(orderID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	if req.Status == "COMPLETED" {
		order.IsPaid = true
		order.PaidAt = time.Now()
		order.PaymentResult.Status = req.Status
		order.PaymentResult.Email = req.Payer.Email
		order.PaymentResult.ID = req.ID
		err = server.store.UpdateOrder(order)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
		}
	} else {
		err := errors.New("payment is not complete")
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// If payment is success and already update order
	// then delete cart
	err = server.store.RemoveCartByUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintf("Order %v paid with stripe successfully", req.OrderId),
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}