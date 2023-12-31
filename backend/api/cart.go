package api

import (
	"errors"
	"fmt"
	"time"

	"github.com/gen4ralz/react-golang-ecommerce/models"
	"github.com/gen4ralz/react-golang-ecommerce/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/mitchellh/mapstructure"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SelectedPayload struct {
	ID				string				`json:"id"`
	Brand			string				`json:"brand"`
	Description		string				`json:"description"`
	Name			string				`json:"name"`
	Shipping		int					`json:"shipping"`
	Slug			string				`json:"slug"`
	Images			[]models.Image		`json:"images"`
	Sku				string				`json:"sku"`
	Price			float64				`json:"price"`
	PriceBefore		float64				`json:"price_before"`
	Quantity		int					`json:"quantity"`
	Style			int					`json:"style"`
	Size			string				`json:"size"`
	Color			models.Colors		`json:"color"`
	Qty				int					`json:"qty"`
	Uid				string				`json:"_uid"`
}
func (server *Server) saveCart(c *fiber.Ctx) error {
	var req interface{}
	
	if err := c.BodyParser(&req); err != nil {
		err = errors.New("invalid request payload")
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	var selectedDataList []SelectedPayload

    if err := mapstructure.Decode(req, &selectedDataList); err != nil {
        err = errors.New("error decoding request data")
        return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
    }

	// Get user id in context from Auth middleware
	userID, found := c.Locals("userID").(string)
	if !found {
		err := errors.New("user ID not found in context")
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	existing_cart, err := server.store.GetCartByUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Remove existing cart in database if found
	if existing_cart != nil {
		err = server.store.RemoveCartByUserID(userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
		}
	}

	// Prepare cart data for save
	var products []models.CartProductForSave
	for _, selectedData := range selectedDataList {
		var product models.CartProductForSave
		productID, _ := primitive.ObjectIDFromHex(selectedData.ID)
		product.ProductID = productID
		product.Name = selectedData.Name
		product.Image = selectedData.Images[0].URL
		product.Price = selectedData.Price
		product.Size = selectedData.Size
		product.Color = models.Colors{
			Color: selectedData.Color.Color,
			Image: selectedData.Color.Image,
		}
		product.Qty = selectedData.Qty

		products = append(products, product)
	}
	// Calculate total price
	var cartTotal float64
	for _, product := range products {
		cartTotal += product.Price * float64(product.Qty) 
	}
	// Prepare cart argument for save in database
	arg := models.CartDocument {
		UserID: userID,
		Products: products,
		CartTotal: utils.RoundFloat(cartTotal, 2),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	err = server.store.SaveCart(arg)
	if err != nil {
		err = errors.New("cannot save cart to database")
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("Save cart into database successfully"),
	}

	return c.Status(fiber.StatusAccepted).JSON(payload)
}

func (server *Server) getCart(c *fiber.Ctx) error {
	// Get user id in context from Auth middleware
	userID, found := c.Locals("userID").(string)
	if !found {
		err := errors.New("user ID not found in context")
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Get Cart by user id
	existing_cart, err := server.store.GetCartByUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	// IF not found cart from database set payload error to true with status 200
	if existing_cart == nil {
		payload := jsonResponse {
			Error: true,
			Message: fmt.Sprintln("not found cart in database"),
		}
		return c.Status(fiber.StatusAccepted).JSON(payload)
	}
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("Get cart from database successfully"),
		Data: existing_cart,
	}

	return c.Status(fiber.StatusAccepted).JSON(payload)
}