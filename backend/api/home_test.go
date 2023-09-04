package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gen4ralz/react-golang-ecommerce/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func TestHomeHandler(t *testing.T) {
	// Create a new Fiber app and server for testing
	app := fiber.New()
	config := utils.Config{}
	server := newTestServer(t, config, nil)

	// Register the "/home" route with the home handler
	app.Get("/home", server.home)

	// Create a test request to the "/home" route
	req := httptest.NewRequest(http.MethodGet, "/home", nil)

	// Use fiber.NewTest to simulate the request and capture the response
	resp, err := app.Test(req)
	assert.NoError(t, err)
	defer resp.Body.Close()

	// Check the response status code
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// Parse the JSON response
	var payload struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}
	err = json.NewDecoder(resp.Body).Decode(&payload)
	assert.NoError(t, err)

	// Check the values in the JSON response
	assert.Equal(t, "active", payload.Status)
	assert.Equal(t, "Ecommerce_app server up and running", payload.Message)
	assert.Equal(t, "1.0.0", payload.Version)
}