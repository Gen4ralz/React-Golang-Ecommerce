package store

import (
	"context"
	"log"

	"github.com/gen4ralz/react-golang-ecommerce/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (m *MongoDBStore) AllProducts() ([]*models.Product, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	option := options.Find()
	option.SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := m.ProductsCollection.Find(context.TODO(), bson.D{}, option)
	if err != nil {
		log.Println("Finding all docs error:", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var products []*models.Product

	for cursor.Next(ctx) {
		var product models.Product

		err := cursor.Decode(&product)
		if err != nil {
			log.Println("Error decoding product into slice: ", err)
			return nil, err
		} else {
			products = append(products, &product)
		}
	}
	return products, nil
}


func (m *MongoDBStore) GetProductBySlug(slug string) (*models.Product, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	var product models.Product

	err := m.ProductsCollection.FindOne(ctx, bson.M{"slug": slug}).Decode(&product)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &product, nil
}

func (m *MongoDBStore) GetProductById(id primitive.ObjectID) (*models.Product, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	var product models.Product

	err := m.ProductsCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&product)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &product, nil
}