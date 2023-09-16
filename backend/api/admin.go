package api

import (
	"errors"
	"fmt"
	"time"

	"github.com/gen4ralz/react-golang-ecommerce/models"
	"github.com/gen4ralz/react-golang-ecommerce/utils"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (server *Server) getCategories(c *fiber.Ctx) error {
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
	// Check role
	if user.Role != "admin" {
		err := errors.New("access denied")
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	// Get all categories
	categories, err := server.store.AllCategories()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("Get All Categories successfully"),
		Data: categories,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}

type requestCreateCategory struct {
	Name	string	`json:"name"`
}
func (server *Server) createCategory(c *fiber.Ctx) error {
	var req requestCreateCategory
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	// Check category name
	existCategory, err := server.store.GetCategoryByName(req.Name)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	if existCategory != nil {
		err := errors.New("category already exist, Try a different name")
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	
	// Convert Name to slug by helper function
	slug := utils.Slugify(req.Name)

	// Prepare argument for save new category in database
	arg := models.Category{
		ID: primitive.NewObjectID(),
		Name: req.Name,
		Slug: slug,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		V: 1,
	}

	// Create New Category in database
	_, err = server.store.CreateCategory(arg)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Get all categories
	categories, err := server.store.AllCategories()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintf("Category %v has been created successfully", req.Name),
		Data: categories,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}

type requestDeleteCategory struct {
	ID	string	`json:"id"`
}

func (server *Server) removeCategory(c *fiber.Ctx) error {
	var req requestDeleteCategory

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	err := server.store.RemoveCategoryByID(req.ID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Get all categories
	categories, err := server.store.AllCategories()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("Category has been deleted successfully"),
		Data: categories,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}