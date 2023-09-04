package store

import (
	"context"
	"fmt"

	"github.com/gen4ralz/react-golang-ecommerce/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (m *MongoDBStore) CreateUser(payload *models.CreateUserParams) (primitive.ObjectID, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	res, err := m.UsersCollection.InsertOne(ctx, payload)
	if err != nil {
		return primitive.NilObjectID, err
	}
	insertedID, ok := res.InsertedID.(primitive.ObjectID)
	if !ok {
		return primitive.NilObjectID, fmt.Errorf("failed to convert inserted ID to primitive.ObjectID")
	}

	return insertedID, nil
}

func (m *MongoDBStore) GetUserByID(userid primitive.ObjectID) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	var user models.User

	err := m.UsersCollection.FindOne(ctx, bson.M{"_id": userid}).Decode(&user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *MongoDBStore) GetUserByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	var user models.User

	err := m.UsersCollection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}