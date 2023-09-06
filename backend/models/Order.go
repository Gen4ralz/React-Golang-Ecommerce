package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OrderDocument struct {
	OrderID			primitive.ObjectID	 `json:"order_id" bson:"_id"`
	UserID          string   			 `json:"user_id" bson:"user_id"`
	Products        []CartProductForSave `json:"products" bson:"products"`
	ShippingAddress ShippingPayload      `json:"shipping_address" bson:"shipping_address"`
	PaymentMethod   string               `json:"payment_method" bson:"payment_method"`
	PaymentResult   PaymentResult        `json:"payment_result" bson:"payment_result"`
	Total           float64              `json:"total" bson:"total"`
	ShippingPrice   int                  `json:"shipping_price" bson:"shipping_price"`
	IsPaid          bool                 `json:"isPaid" bson:"isPaid"`
	Status          OrderStatus          `json:"status" bson:"status"`
	PaidAt          time.Time			 `json:"paidAt" bson:"paidAt"`
	DeliveredAt		time.Time			 `json:"deliveredAt" bson:"deliveredAt"`
	CreatedAt 		time.Time            `json:"created_at" bson:"created_at"`
	UpdatedAt 		time.Time            `json:"updated_at" bson:"updated_at"`
}

type PaymentResult struct {
	Status string `json:"payment_status" bson:"payment_status"`
	Email  string `json:"payment_email" bson:"payment_email"`
}

type OrderStatus string

const (
	OrderStatusNotProcessed OrderStatus = "Not Processed"
	OrderStatusProcessing   OrderStatus = "Processing"
	OrderStatusDispatched   OrderStatus = "Dispatched"
	OrderStatusCancelled    OrderStatus = "Cancelled"
	OrderStatusCompleted    OrderStatus = "Completed"
)