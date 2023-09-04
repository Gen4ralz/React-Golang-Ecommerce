package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CartDocument struct {
	UserID    string                    `json:"user_id" bson:"user_id"`
	Products  []CartProductForSave 		`json:"products" bson:"products"`
	CartTotal float64                   `json:"cart_total" bson:"cart_total"`
	CreatedAt time.Time                 `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time             	`json:"updated_at" bson:"updated_at"`
}

type CartProductForSave struct {
	ProductID		primitive.ObjectID	`json:"product_id" bson:"product_id"`
	Name			string				`json:"name" bson:"name"`
	Image			string				`json:"image" bson:"image"`
	Price			float64				`json:"price" bson:"price"`
	Size			string				`json:"size" bson:"size"`
	Color			Colors				`json:"color" bson:"color"`
	Qty				int					`json:"qty" bson:"qty"`
}