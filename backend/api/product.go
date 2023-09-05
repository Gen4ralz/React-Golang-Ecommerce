package api

import (
	"errors"
	"fmt"
	"sort"
	"strconv"
	"time"

	"github.com/gen4ralz/react-golang-ecommerce/models"
	"github.com/gen4ralz/react-golang-ecommerce/utils"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func (server *Server) getAllProducts(c *fiber.Ctx) error {
	products, err := server.store.AllProducts()
	if err != nil {
		err = errors.New("product not found")
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	payload := jsonResponse {
		Error: false,
		Message: "Get all Products success!",
		Data: products,
	}

	return c.Status(fiber.StatusAccepted).JSON(payload)
}

type requestProductPayload struct {
	Slug	string 	`json:"slug"`
	Style	string	`json:"style"`
	Size	string	`json:"size"`
}

type responseProductPayload struct {
	ID				string				`json:"id"`
	Brand			string				`json:"brand"`
	CategoryID		string				`json:"category"`
	Description		string				`json:"description"`
	Details			[]models.Details	`json:"details"`
	Name			string				`json:"name"`
	NumReviews		int					`json:"numReviews"`
	Questions		[]models.Questions	`json:"questions"`
	Rating			float64				`json:"rating"`
	RefundPolicy	string				`json:"refundPolicy"`
	Reviews			[]models.Reviews	`json:"reviews"`
	Shipping		int					`json:"shipping"`
	Slug			string				`json:"slug"`
	CategoryName	string				`json:"category_name"`
	Images			[]models.Image		`json:"images"`
	Sizes			[]models.Sizes		`json:"sizes"`
	Sku				string				`json:"sku"`
	Colors			[]models.Colors		`json:"colors"`
	PriceRange		string				`json:"price_range"`
	Price			float64				`json:"price"`
	PriceBefore		float64				`json:"price_before"`
	Discount		int					`json:"discount"`
	Sold			int					`json:"sold"`
	Quantity		int					`json:"quantity"`
	CreatedAt		time.Time 			`json:"created_at"`
	UpdateAt		time.Time			`json:"updated_at"`
	SubProduct		[]models.SubProduct	`json:"subProducts"`
	Style			int					`json:"style"`
}

func (server *Server) getProductBySlug(c *fiber.Ctx) error {
	req := requestProductPayload{
		Slug: c.Params("slug"),
		Style: c.Query("style"),
		Size: c.Query("size"),
	}

	// Get Product By Slug
	product, err := server.store.GetProductBySlug(req.Slug)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			err = errors.New("product not found")
			return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
		} else {
			return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
		}
	}

	// Get Category
	category, err := server.store.GetCategoryByID(product.Category)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Get Subproduct
	styleIndex, _ := strconv.Atoi(req.Style)
	var subProduct *models.SubProduct
	if styleIndex >= 0 && styleIndex < len(product.SubProducts) {
		subProduct = &product.SubProducts[styleIndex]
	} else {
		err = errors.New("invalid style index")
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Get Colors
	var colors []models.Colors
	for _,v := range product.SubProducts {
		colors = append(colors, v.Colors)
	}

	// Get Price_range
	var prices []float64
	for _, size := range subProduct.Sizes {
		prices = append(prices, size.Price)
	}
	sort.Float64s(prices)
	var price_range string
	if len(prices) > 1 {
		price_range = fmt.Sprintf("From %v to %v THB", int(prices[0]), int(prices[len(prices)-1]))
	} else {
		price_range = ""
	}

	// Get QTY
	sizeIndex, _ := strconv.Atoi(req.Size)
	quantity := subProduct.Sizes[sizeIndex].Qty

	// Get Price after discount
	var price float64
	if subProduct.Discount > 0 {
		discountPrice := subProduct.Sizes[sizeIndex].Price - (subProduct.Sizes[sizeIndex].Price / float64(subProduct.Discount))
		price = utils.RoundFloat(discountPrice, 2)
	} else {
		price = subProduct.Sizes[sizeIndex].Price
	}

	// Get Price before
	price_before := subProduct.Sizes[sizeIndex].Price

	data := responseProductPayload {
		ID: product.ID.Hex(),
		Name: product.Name,
		Brand: product.Brand,
		CategoryID: product.Category.Hex(),
		Description: product.Description,
		Details: product.Details,
		NumReviews: product.NumReviews,
		Questions: product.Questions,
		Rating: product.Rating,
		RefundPolicy: product.RefundPolicy,
		Reviews: product.Reviews,
		Shipping: product.Shipping,
		CategoryName: category.Name,
		Images: subProduct.Images,
		Sizes: subProduct.Sizes,
		Sku: subProduct.SKU,
		Colors: colors,
		PriceRange: price_range,
		Price: price,
		PriceBefore: price_before,
		Discount: subProduct.Discount,
		Sold: subProduct.Sold,
		Quantity: quantity,
		Slug: product.Slug,
		SubProduct: product.SubProducts,
		Style: styleIndex,
		CreatedAt: product.CreatedAt,
		UpdateAt: product.UpdatedAt,
	}

	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintf("Get product %s by Slug successfully", product.Name),
		Data: data,
	}

	return c.Status(fiber.StatusAccepted).JSON(payload)
}

type requestPayloadForAddtoCart struct {
	Id		string 	`json:"id"`
	Style	string	`json:"style"`
	Size	string	`json:"size"`
}

type responsePayloadForAddtoCart struct {
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
}

func (server *Server) getProductBeforeAddtoCartById(c *fiber.Ctx) error {
	return nil
}