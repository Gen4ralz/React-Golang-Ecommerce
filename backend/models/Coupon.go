package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Coupon struct {
	ID		  primitive.ObjectID	`json:"coupon_id" bson:"_id"`
	Coupon    string    			`json:"coupon" bson:"coupon"`
	StartDate time.Time 			`json:"start_date" bson:"start_date"`
	EndDate   time.Time    			`json:"end_date" bson:"end_date"`
	Discount  int       			`json:"discount" bson:"discount"`
	CreatedAt time.Time 			`json:"created_at" bson:"created_at"`
	UpdatedAt time.Time 			`json:"updated_at" bson:"updated_at"`
}