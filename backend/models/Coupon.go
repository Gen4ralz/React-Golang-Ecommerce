package models

import "time"

type Coupon struct {
	Coupon    string    `json:"coupon" bson:"coupon"`
	StartDate string    `json:"start_date" bson:"start_date"`
	EndDate   string    `json:"end_date" bson:"end_date"`
	Discount  int       `json:"discount" bson:"discount"`
	CreatedAt time.Time `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time `json:"updated_at" bson:"updated_at"`
}