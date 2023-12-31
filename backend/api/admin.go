package api

import (
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/gen4ralz/react-golang-ecommerce/models"
	"github.com/gen4ralz/react-golang-ecommerce/utils"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// -------------------- Category -------------------------

func (server *Server) getCategories(c *fiber.Ctx) error {
	// Check role
	isAdmin, err := server.IsAdmin(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	if !isAdmin {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
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
	// Check role
	isAdmin, err := server.IsAdmin(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	if !isAdmin {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

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
	// Check Role
	isAdmin, err := server.IsAdmin(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	if !isAdmin {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	var req requestDeleteCategory

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	err = server.store.RemoveCategoryByID(req.ID)
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

type requestUpdateCategory struct {
	ID		string	`json:"id"`
	Name	string	`json:"name"`
}

func (server *Server) updateCategory(c *fiber.Ctx) error {
	// Check Role
	isAdmin, err := server.IsAdmin(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	if !isAdmin {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	var req requestUpdateCategory

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	category_id, _ := primitive.ObjectIDFromHex(req.ID)

	arg := models.Category{
		ID: category_id,
		Name: req.Name,
		Slug: utils.Slugify(req.Name),
		UpdatedAt: time.Now(),
	}

	err = server.store.UpdateCategory(&arg)
	if err != nil {
		log.Println("Error at update category")
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Get all categories
	categories, err := server.store.AllCategories()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("Category has been updated successfully"),
		Data: categories,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}


// -------------------- Coupon -------------------------


func (server *Server) getCoupons(c *fiber.Ctx) error {
	// Check Role
	isAdmin, err := server.IsAdmin(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	if !isAdmin {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	// Get all categories
	coupons, err := server.store.AllCoupons()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("Get All Coupons successfully"),
		Data: coupons,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}

type requestCreateCoupon struct {
	Name		string	`json:"coupon"`
	Discount	string	`json:"discount"`
	StartDate	string	`json:"start_date"`
	EndDate		string	`json:"end_date"`
}

func (server *Server) createCoupon(c *fiber.Ctx) error {
	// Check role
	isAdmin, err := server.IsAdmin(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	if !isAdmin {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	var req requestCreateCoupon

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Check category name
	existCoupon, err := server.store.GetCouponByName(req.Name)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}
	if existCoupon != nil {
		err := errors.New("coupon already exist, Try a different name")
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	go_startDate, err := time.Parse("2006-01-02T15:04:05.999Z", req.StartDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	go_endDate, err := time.Parse("2006-01-02T15:04:05.999Z", req.EndDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	discount, err := strconv.Atoi(req.Discount)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Prepare argument for save new coupon in database
	arg := models.Coupon{
		ID: primitive.NewObjectID(),
		Coupon: strings.ToUpper(req.Name),
		Discount: discount,
		StartDate: go_startDate,
		EndDate: go_endDate,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Create New Coupon in database
	_, err = server.store.CreateCoupon(arg)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Get all coupons
	coupons, err := server.store.AllCoupons()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintf("Coupon %v has been created successfully", req.Name),
		Data: coupons,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}

type requestDeleteCoupon struct {
	ID	string	`json:"id"`
}

func (server *Server) removeCoupon(c *fiber.Ctx) error {
	// Check Role
	isAdmin, err := server.IsAdmin(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	if !isAdmin {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	var req requestDeleteCoupon

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	err = server.store.RemoveCouponByID(req.ID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	// Get all coupons
	coupons, err := server.store.AllCoupons()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("Coupon has been deleted successfully"),
		Data: coupons,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}

type requestUpdateCoupon struct {
	ID			string	`json:"id"`
	Name		string	`json:"coupon"`
	Discount	string	`json:"discount"`
	StartDate	string	`json:"start_date"`
	EndDate		string	`json:"end_date"`
}

func (server *Server) updateCoupon(c *fiber.Ctx) error {
	// Check role
	isAdmin, err := server.IsAdmin(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	if !isAdmin {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	var req requestUpdateCoupon

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	coupon_id, _ := primitive.ObjectIDFromHex(req.ID)

	discount, _ := strconv.Atoi(req.Discount)

	go_start_date, err :=time.Parse("2006-01-02T15:04:05.999Z", req.StartDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	go_end_date, err := time.Parse("2006-01-02T15:04:05.999Z", req.EndDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	} 

	arg := models.Coupon{
		ID: coupon_id,
		Coupon: req.Name,
		Discount: discount,
		StartDate: go_start_date,
		EndDate: go_end_date,
		UpdatedAt: time.Now(),
	}

	err = server.store.UpdateCoupon(&arg)
	if err != nil {
		log.Println("Error at update coupon")
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}

	// Get all coupons
	coupons, err := server.store.AllCoupons()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse(err))
	}
	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("Coupon has been updated successfully"),
		Data: coupons,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}


// -------------------- Product -------------------------


type responseGetAllProducts struct {
		ID           primitive.ObjectID   	`json:"_id"`
		Name         string               	`json:"name"`
		Description  string               	`json:"description"`
		Brand        string               	`json:"brand"`
		Slug         string               	`json:"slug"`
		Category     *models.Category   	`json:"category"`
		SubCategory  []primitive.ObjectID 	`json:"sub_category"`
		Details      []models.Details       `json:"details"`
		Questions    []models.Questions     `json:"questions"`
		SubProducts  []models.SubProduct    `json:"subProducts"`
		CreatedAt    time.Time            	`json:"created_at"`
		UpdatedAt    time.Time            	`json:"updated_at"`
		V            int                  	`json:"__v"`
		NumReviews   int                  	`json:"numReviews"`
		Rating       float64              	`json:"rating"`
		RefundPolicy string               	`json:"refundPolicy"`
		Reviews      []models.Reviews       `json:"reviews"`
		Shipping     int                  	`json:"shipping"`
}

// ------- For case study custom struct payload ------------------
// type responseGetAllProducts struct {
// 	Products	[]struct {
// 		ID           primitive.ObjectID   	`json:"_id"`
// 		Name         string               	`json:"name"`
// 		Description  string               	`json:"description"`
// 		Brand        string               	`json:"brand"`
// 		Slug         string               	`json:"slug"`
// 		Category     *models.Category   	`json:"category"`
// 		SubCategory  []primitive.ObjectID 	`json:"sub_category"`
// 		Details      []models.Details       `json:"details"`
// 		Questions    []models.Questions     `json:"questions"`
// 		SubProducts  []models.SubProduct    `json:"subProducts"`
// 		CreatedAt    time.Time            	`json:"created_at"`
// 		UpdatedAt    time.Time            	`json:"updated_at"`
// 		V            int                  	`json:"__v"`
// 		NumReviews   int                  	`json:"numReviews"`
// 		Rating       float64              	`json:"rating"`
// 		RefundPolicy string               	`json:"refundPolicy"`
// 		Reviews      []models.Reviews       `json:"reviews"`
// 		Shipping     int                  	`json:"shipping"`
// 	}	`json:"products"`
// }

func (server *Server) adminGetAllProducts(c *fiber.Ctx) error {
	isAdmin, err := server.IsAdmin(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	if !isAdmin {
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse(err))
	}

	products, err := server.store.AllProducts()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	categories, err := server.store.AllCategories()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse(err))
	}

	category_map := make(map[primitive.ObjectID]*models.Category)

	var data []responseGetAllProducts

	for _, category := range categories {
		category_map[category.ID] = category
	}

	for _, product := range products {
		category, found := category_map[product.Category]
		if !found {
			continue
		}

		data = append(data, responseGetAllProducts{
			ID:           product.ID,
			Name:         product.Name,
			Description:  product.Description,
			Brand:        product.Brand,
			Slug:         product.Slug,
			Category:     category,
			SubCategory:  product.SubCategory,
			Details:      product.Details,
			Questions:    product.Questions,
			SubProducts:  product.SubProducts,
			CreatedAt:    product.CreatedAt,
			UpdatedAt:    product.UpdatedAt,
			V:            product.V,
			NumReviews:   product.NumReviews,
			Rating:       product.Rating,
			RefundPolicy: product.RefundPolicy,
			Reviews:      product.Reviews,
			Shipping:     product.Shipping,
		})

// ------- For case study custom struct payload ------------------
		// resp.Products = append(resp.Products, struct{
		// 	ID primitive.ObjectID "json:\"_id\""; 
		// 	Name string "json:\"name\""; 
		// 	Description string "json:\"description\""; 
		// 	Brand string "json:\"brand\""; 
		// 	Slug string "json:\"slug\""; 
		// 	Category *models.Category "json:\"category\""; 
		// 	SubCategory []primitive.ObjectID "json:\"sub_category\""; 
		// 	Details []models.Details "json:\"details\""; 
		// 	Questions []models.Questions "json:\"questions\""; 
		// 	SubProducts []models.SubProduct "json:\"subProducts\""; 
		// 	CreatedAt time.Time "json:\"created_at\""; 
		// 	UpdatedAt time.Time "json:\"updated_at\""; 
		// 	V int "json:\"__v\""; 
		// 	NumReviews int "json:\"numReviews\""; 
		// 	Rating float64 "json:\"rating\""; 
		// 	RefundPolicy string "json:\"refundPolicy\""; 
		// 	Reviews []models.Reviews "json:\"reviews\""; 
		// 	Shipping int "json:\"shipping\""}{
		// 		ID: product.ID,
		// 		Name: product.Name,
		// 		Description: product.Description,
		// 		Brand: product.Brand,
		// 		Slug: product.Slug,
		// 		Category: category,
		// 		SubCategory: product.SubCategory,
		// 		Details: product.Details,
		// 		Questions: product.Questions,
		// 		SubProducts: product.SubProducts,
		// 		CreatedAt: product.CreatedAt,
		// 		UpdatedAt: product.UpdatedAt,
		// 		V: product.V,
		// 		NumReviews: product.NumReviews,
		// 		Rating: product.Rating,
		// 		RefundPolicy: product.RefundPolicy,
		// 		Reviews: product.Reviews,
		// 		Shipping: product.Shipping,
		// 	})

	}

	payload := jsonResponse {
		Error: false,
		Message: fmt.Sprintln("Get All product successfully"),
		Data: data,
	}
	return c.Status(fiber.StatusAccepted).JSON(payload)
}