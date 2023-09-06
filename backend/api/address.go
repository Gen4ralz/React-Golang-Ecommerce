package api

import (
	"fmt"
	"log"

	"github.com/gen4ralz/react-golang-ecommerce/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AddressPayload struct {
	Shipping	models.ShippingPayload `json:"shipping"`
}

func (server *Server) saveAddress(c *fiber.Ctx) error {
	var address AddressPayload
	if err := c.BodyParser(&address); err != nil {
		log.Println("error when bind item", err)
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	log.Println("address payload for save:", address)
	// Verify token
	tokenString, _, err := server.config.Auth.GetTokenFromHeaderAndVerify(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}
	userEmail, err := server.config.Auth.SearchUserEmailFromToken(tokenString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	user, err := server.store.GetUserByEmail(userEmail)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	newAddress := models.Address {
		ID: primitive.NewObjectID(),
		FullName: address.Shipping.FullName,
		PhoneNumber: address.Shipping.PhoneNumber,
		Address: address.Shipping.Address,
		Country: address.Shipping.Country,
		Active: true,
	}

	// Set older address active to false
	for index := range user.Addresses {
		user.Addresses[index].Active = false
	} 

	// Add new address into user address
	user.Addresses = append(user.Addresses, newAddress)

	// Save updated user with new address in database
	err = server.store.SaveAddress(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Get recent address
	recentAddress, err := server.store.GetRecentAddress(user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("Save address to database successfully"),
		Data: recentAddress,
	}

	return c.Status(fiber.StatusAccepted).JSON(payload)
}