package api

import (
	"github.com/gen4ralz/react-golang-ecommerce/token"
	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware(config token.Auth) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get token from request headers
		tokenString, _, err := config.GetTokenFromHeaderAndVerify(c)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
		}

		// Parse token and get user information
		userID, err := config.SearchUserIDFromToken(tokenString)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
		}

		// Store userID in context for use in route handlers
		c.Locals("userID", userID)

		return c.Next()
	}
}