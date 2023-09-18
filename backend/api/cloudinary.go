package api

import (
	"context"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gofiber/fiber/v2"
)

func (server *Server) uploadFile(c *fiber.Ctx) error {
	cloudName := server.config.Cloudinary.NAME
	cloudKey := server.config.Cloudinary.PUBLIC_KEY
	cloudSecret := server.config.Cloudinary.SECRET_KEY

	cld, err := cloudinary.NewFromParams(cloudName, cloudKey, cloudSecret)
	if err != nil {
		return c.Status(401).JSON(errorResponse(err))
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second * 10)
	defer cancel()

	// Create an empty array to store the uploaded images
	images := []map[string]string{}

	// Use fiber context to parse form entity
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(500).JSON(errorResponse(err))
	}
	// Get path by key "path" from form-data 
	// -> return slice of string but choose the first one
	path := form.Value["path"][0]

	// Get files by key "file" from form-data 
	files := form.File["file"]

	// Loop in files if have multiple items
	for _, file := range files {

	formFile, err := file.Open()
		if err != nil {
		return c.Status(500).JSON(errorResponse(err))
	}

	// Upload formFile to cloudinary
	result, err := cld.Upload.Upload(ctx, formFile, uploader.UploadParams{
		Folder: path,
	})
	if err != nil {
		return c.Status(500).JSON(errorResponse(err))
	}
	// Add the uploaded image to the array
	images = append(images, map[string]string{
		"url":       result.SecureURL,
		"public_id": result.PublicID,
	})
	}

	return c.Status(200).JSON(images)
}