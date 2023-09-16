package api

import (
	"errors"
	"fmt"
	"log"

	"github.com/gen4ralz/react-golang-ecommerce/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type addressPayload struct {
	Shipping	models.ShippingPayload `json:"shipping"`
}

func (server *Server) saveAddress(c *fiber.Ctx) error {
	var address addressPayload
	// Bind Item to Go struct
	if err := c.BodyParser(&address); err != nil {
		log.Println("error when bind item", err)
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Get user id in context from Auth middleware
	userID, found := c.Locals("userID").(string)
	if !found {
		err := errors.New("user ID not found in context")
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Convert string to primitive
	user_id, _ := primitive.ObjectIDFromHex(userID)
	// Get user from user email
	user, err := server.store.GetUserByID(user_id)
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
	addresses,err := server.store.GetAllAddressByUserId(user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("Save address to database successfully"),
		Data: addresses,
	}

	return c.Status(fiber.StatusAccepted).JSON(payload)
}


type requestDeleteAddressID struct {
	ID	string	`json:"delete_address_id"`
}

func (server *Server) deleteAddress(c *fiber.Ctx) error {
	var req requestDeleteAddressID
	// Bind Item to Go struct
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	log.Println("address_id_for_delete->>", req.ID)

	// Get user id in context from Auth middleware
	userID, found := c.Locals("userID").(string)
	if !found {
		err := errors.New("user ID not found in context")
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Convert string to primitive
	user_id, _ := primitive.ObjectIDFromHex(userID)

	// Get user from user email
	user, err := server.store.GetUserByID(user_id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Convert string to primitive Object
	addressID, err := primitive.ObjectIDFromHex(req.ID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Delete address by addressID
	err = server.store.DeleteAddressByAddressId(user.ID, addressID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Get All Address by UserID
	addresses, err := server.store.GetAllAddressByUserId(user.ID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Check address
	// If all address active is false -> Set most recent address to true
	activeIndex := -1
	for i, address := range addresses {
		if address.Active {
			activeIndex = i
		}
	}

	if activeIndex == -1 && len(addresses) > 1 {
		addresses[len(addresses) - 1].Active = true
		err = server.store.UpdateAddressByAddressId(user.ID, addresses[len(addresses) - 1].ID)
				if err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
		}	
	}

	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("delete address successfully"),
		Data: addresses,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}


type requestActiveAddressID struct {
	ID	string	`json:"active_address_id"`
}

func (server *Server) changeActiveAddress(c *fiber.Ctx) error {
	var req requestActiveAddressID
	// Bind Item to Go struct
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	log.Println("address_id_forchange_active->>", req.ID)

	// Get user id in context from Auth middleware
	userID, found := c.Locals("userID").(string)
	if !found {
		err := errors.New("user ID not found in context")
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Convert string to primitive
	user_id, _ := primitive.ObjectIDFromHex(userID)

	// Get user from user email
	user, err := server.store.GetUserByID(user_id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Convert string to primitive Object
	addressID, err := primitive.ObjectIDFromHex(req.ID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Update active address to true by addressID
	err = server.store.UpdateAddressByAddressId(user.ID, addressID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Get All Address by UserID
	addresses, err := server.store.GetAllAddressByUserId(user.ID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("change active address successfully"),
		Data: addresses,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}