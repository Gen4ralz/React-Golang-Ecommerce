package api

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gen4ralz/react-golang-ecommerce/models"
	"github.com/gen4ralz/react-golang-ecommerce/token"
	"github.com/gen4ralz/react-golang-ecommerce/utils"
	"github.com/gofiber/fiber/v2"
)

type jsonResponse struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

type createUserRequest struct {
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type userResponse struct {
	ID			string				`json:"id"`
	FullName 	string  			`json:"full_name"`
	Email 		string  			`json:"email"`
	Role		string				`json:"role"`
	Image		string				`json:"image"`
	Addresses	[]models.Address	`json:"addresses"`
}

func (server *Server) createUser(c *fiber.Ctx) error {
	var req createUserRequest
	if err := c.BodyParser(&req); err != nil {
		return  c.Status(http.StatusBadRequest).JSON(errorResponse(err))

	}

	log.Println(req.Email)
	log.Println(req.Password)
	log.Println(req.FullName)

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
		
	}

	arg := models.CreateUserParams {
		HashedPassword: hashedPassword,
		FullName: req.FullName,
		Email: req.Email,
		Role: "user",
		Image: "https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642478/992490_b0iqzq.png",
		Addresses: []models.Address{},
	}

	userID, err := server.store.CreateUser(&arg)
	if err != nil {
		return c.Status(http.StatusConflict).JSON(errorResponse(err))
		
	}

	user, err := server.store.GetUserByID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
		
	}

	user_id := user.ID.Hex()

	u := token.JwtUser {
		ID: user_id,
		Email: user.Email,
		FullName: user.FullName,
	}

	token, err := server.config.Auth.GenerateTokenPair(&u)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	dataResponse := loginUserResponse {
		AccessToken: token.Token,
		User: userResponse{
			ID: user_id,
			FullName: user.FullName,
			Email: user.Email,
			Role: user.Role,
			Image: user.Image,
			Addresses: user.Addresses,
			},
	}

	payload := jsonResponse {
			Error: false,
			Message: fmt.Sprintf("Email: %s, successfully created!", user.Email),
			Data: dataResponse,
	}

	return c.Status(fiber.StatusCreated).JSON(payload)
}

type loginUserRequest struct {
	Email	string	`json:"email"`
	Password	string	`json:"password"`
}

type loginUserResponse struct {
	AccessToken	string			`json:"access_token"`
	User		userResponse	`json:"user"`
}

func (server *Server) loginUser(c *fiber.Ctx) error {
	var req loginUserRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	user, err := server.store.GetUserByEmail(req.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	err = utils.CheckPassword(req.Password, user.Password)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	user_id := user.ID.Hex()

	u := token.JwtUser {
		ID: user_id,
		Email: user.Email,
		FullName: user.FullName,
	}

	token, err := server.config.Auth.GenerateTokenPair(&u)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	dataResponse := loginUserResponse {
		AccessToken: token.Token,
		User: userResponse{
			ID: user_id,
			FullName: user.FullName,
			Email: user.Email,
			Role: user.Role,
			Image: user.Image,
			Addresses: user.Addresses,
			},
	}

	payload := jsonResponse {
			Error: false,
			Message: fmt.Sprintf("Email: %s, successfully login!", user.Email),
			Data: dataResponse,
	}

	return c.Status(fiber.StatusAccepted).JSON(payload)
}