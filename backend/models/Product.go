package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Product struct {
	ID           primitive.ObjectID   `json:"_id" bson:"_id"`
	Name         string               `json:"name" bson:"name"`
	Description  string               `json:"description" bson:"description"`
	Brand        string               `json:"brand" bson:"brand"`
	Slug         string               `json:"slug" bson:"slug"`
	Category     primitive.ObjectID   `json:"category" bson:"category"`
	SubCategory  []primitive.ObjectID `json:"sub_category" bson:"sub_category"`
	Details      []Details            `json:"details" bson:"details"`
	Questions    []Questions          `json:"questions" bson:"questions"`
	SubProducts  []SubProduct         `json:"subProducts" bson:"subProducts"`
	CreatedAt    time.Time            `json:"created_at" bson:"created_at"`
	UpdatedAt    time.Time            `json:"updated_at" bson:"updated_at"`
	V            int                  `json:"__v" bson:"__v"`
	NumReviews   int                  `json:"numReviews" bson:"numReviews"`
	Rating       float64              `json:"rating" bson:"rating"`
	RefundPolicy string               `json:"refundPolicy" bson:"refundPolicy"`
	Reviews      []Reviews            `json:"reviews" bson:"reviews"`
	Shipping     int                  `json:"shipping" bson:"shipping"`
}

type Details struct {
	Name  string `json:"name" bson:"name"`
	Value string `json:"value" bson:"value"`
	ID    primitive.ObjectID `json:"_id" bson:"_id"`
}

type Questions struct {
	Question string `json:"question" bson:"question"`
	Answer   string `json:"answer" bson:"answer"`
}

type SubProduct struct {
	SKU                string   `json:"sku" bson:"sku"`
	Images             []Image  `json:"images" bson:"images"`
	DescriptionImages  []string `json:"description_images,omitempty" bson:"description_images,omitempty"`
	Colors             Colors   `json:"colors" bson:"colors"`
	Sizes              []Sizes  `json:"sizes" bson:"sizes"`
	Discount           int      `json:"discount" bson:"discount"`
	Sold               int      `json:"sold" bson:"sold"`
}

type Image struct {
	URL       string `json:"url" bson:"url"`
	PublicURL string `json:"public_url" bson:"public_url"`
}

type Colors struct {
	Color string `json:"color" bson:"color"`
	Image string `json:"image" bson:"image"`
}

type Sizes struct {
	Size  string  `json:"size" bson:"size"`
	Qty   int     `json:"qty" bson:"qty"`
	Price float64 `json:"price" bson:"price"`
}

type Reviews struct {
	ReviewBy   primitive.ObjectID `json:"reviewBy" bson:"reviewBy"`
	Rating     float64            `json:"rating" bson:"rating"`
	Review     string             `json:"review" bson:"review"`
	Size       string             `json:"size" bson:"size"`
	Style      Colors             `json:"style" bson:"style"`
	Fit        string             `json:"fit" bson:"fit"`
	Images     []Image            `json:"images" bson:"images"`
	ID         primitive.ObjectID `json:"_id" bson:"_id"`
	CreatedAt  time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt  time.Time          `json:"updated_at" bson:"updated_at"`
}