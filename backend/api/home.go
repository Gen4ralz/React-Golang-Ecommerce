package api

import (
	"github.com/gofiber/fiber/v2"
)

func (server *Server) home(c *fiber.Ctx) error {
	var payload = struct {
		Status string		`json:"status"`
		Message string		`json:"message"`
		Version string		`json:"version"`
	}{
		Status: "active",
		Message: "Ecommerce_app server up and running",
		Version: "1.0.0",
	}
	return c.Status(fiber.StatusOK).JSON(payload)
}