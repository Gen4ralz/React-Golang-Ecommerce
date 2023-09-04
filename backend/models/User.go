package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID          primitive.ObjectID	`json:"user_id" bson:"_id"`
	Email       string `json:"email" bson:"email"`
	Password    string `json:"password" bson:"password"`
	FullName    string `json:"full_name" bson:"full_name"`
	Role        string `json:"role" bson:"role"`
	Image       string `json:"image" bson:"image"`
	Addresses   []Address	`json:"addresses" bson:"addresses"`
	Updated_at  time.Time	`json:"updated_at" bson:"updated_at"`
	Created_at	time.Time	`json:"created_at" bson:"created_at"`
}

type Address struct {
	ID         	primitive.ObjectID `json:"address_id" bson:"_id"`
	FullName   	string 	`json:"full_name" bson:"full_name"`
	PhoneNumber string 	`json:"phone_number" bson:"phone_number"`
	Address    	string 	`json:"address" bson:"address"`
	Country    	string 	`json:"country" bson:"country"`
	Active     	bool   	`json:"active" bson:"active"`
}

type CreateUserParams struct {
	HashedPassword string `json:"password" bson:"password"`
	FullName       string `json:"full_name" bson:"full_name"`
	Email          string `json:"email" bson:"email"`
	Role           string `json:"role" bson:"role"`
	Image          string `json:"image" bson:"image"`
	Addresses      []Address	`json:"addresses" bson:"addresses"`
}

type ShippingPayload struct {
	FullName	string	`json:"full_name"`
	Address		string	`json:"address"`
	PhoneNumber	string	`json:"phone_number"`
	Country		string	`json:"country"`
}