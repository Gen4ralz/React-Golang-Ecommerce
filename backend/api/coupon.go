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

func (server *Server) seedCoupon(c *fiber.Ctx) error {
	// Set start date to now
	startDate := time.Now()
	// Set end date to start date + 15 days
	endDate := startDate.Add(15 * 24 * time.Hour)
	// Prepare coupon data for save
	coupon := models.Coupon {
		ID: primitive.NewObjectID(),
		Coupon: "DOSIMPLE",
		StartDate: startDate,
		EndDate: endDate,
		Discount: 150,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	// Save coupon to database -> Return couponID
	couponID, err := server.store.CreateCoupon(coupon)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	// Get coupon by couponID
	newCoupon, err := server.store.GetCouponByID(couponID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintf("Coupon %v has created successfully", newCoupon.Coupon),
		Data: newCoupon,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}

type requestApplyCoupon struct {
	Name	string	`json:"coupon"`
}

type responseCoupon struct {
	Name				string	`json:"coupon"`
	Discount			float64	`json:"discount"`
	PriceAfterDiscount	float64	`json:"total_after_discount"`
}

func (server *Server) applyCoupon(c *fiber.Ctx) error {
	var req requestApplyCoupon
	
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	log.Println("Coupon Name ->>", req.Name)

	// Get user id in context from Auth middleware
	userID, found := c.Locals("userID").(string)
	if !found {
		err := errors.New("user ID not found in context")
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Check existing coupon
	existCoupon, err := server.store.GetCouponByName(req.Name)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	// If not found coupon -> return error
	if existCoupon == nil {
		err := errors.New("invalid coupon")
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	presentDate := time.Now()
	// Check coupon expire date
	if presentDate.After(existCoupon.EndDate) {
		err := errors.New("coupon is expired")
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	cart, err := server.store.GetCartByUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	priceAfter := cart.CartTotal - float64(existCoupon.Discount)
	data := responseCoupon {
		Name: existCoupon.Coupon,
		Discount: float64(existCoupon.Discount),
		PriceAfterDiscount: priceAfter,
	}
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintf("Coupon %v is apply successfully", existCoupon.Coupon),
		Data: data,
	}

	return c.Status(fiber.StatusAccepted).JSON(payload)
}