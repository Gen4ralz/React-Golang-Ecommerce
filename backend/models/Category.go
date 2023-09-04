package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Category struct {
	ID        primitive.ObjectID   `json:"_id" bson:"_id"`
	Name      string    `json:"name" bson:"name"`
	Slug      string    `json:"slug" bson:"slug"`
	CreatedAt time.Time `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time `json:"updated_at" bson:"updated_at"`
	V         int       `json:"__v" bson:"__v"`
}