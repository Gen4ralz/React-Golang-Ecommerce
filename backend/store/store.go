package store

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/gen4ralz/react-golang-ecommerce/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const dbTimeOut = time.Second * 15

type Store interface{
	Storer
}

type MongoDBStore struct {
	ProductsCollection *mongo.Collection
	CategoriesCollection *mongo.Collection
	CartsCollection	*mongo.Collection
	OrdersCollection *mongo.Collection
	UsersCollection *mongo.Collection
}

func NewMongoDBStore(client *mongo.Client) Store {
	db := client.Database("ecommerces")

	productsCollection := db.Collection("products")
	categoriesCollection := db.Collection("categories")
	cartsCollection := db.Collection("carts")
	ordersCollection := db.Collection("orders")
	usersCollection := db.Collection("users")

	return &MongoDBStore{
		ProductsCollection: productsCollection, 
		CategoriesCollection: categoriesCollection,
		CartsCollection: cartsCollection,
		OrdersCollection: ordersCollection,
		UsersCollection: usersCollection,
	}
}

func (m *MongoDBStore) AllProducts()([]*models.Product, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	option := options.Find()
	option.SetSort(bson.D{{Key: "created_at",Value: -1}})

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
			log.Println("Error decoding product into slice: ",err)
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

func (m *MongoDBStore) GetCategoryByProductID(id primitive.ObjectID) (*models.Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	var category models.Category

	err := m.CategoriesCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&category)
	if err != nil {
		return nil, err
	}

	return &category, nil
}

func (m *MongoDBStore) GetCartByUserID(userID string) (*models.CartDocument, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	var cart models.CartDocument

	err := m.CartsCollection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&cart)
	if err != nil {
		if err == mongo.ErrNoDocuments {
            // Return nil and no error when no cart is found
            return nil, nil
        }
        return nil, err
	}

	return &cart, nil

}

func (m *MongoDBStore) SaveCart(docs models.CartDocument) (error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	_, err := m.CartsCollection.InsertOne(ctx, docs)
	if err != nil {
		return err
	}

	return nil
}

func (m *MongoDBStore) RemoveCartByUserID(userID string) (error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	_, err := m.CartsCollection.DeleteOne(ctx, bson.M{"user_id": userID})
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoDBStore) SaveOrder(docs models.OrderDocument) (primitive.ObjectID, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	res, err := m.OrdersCollection.InsertOne(ctx, docs)
	if err != nil {
		return primitive.NilObjectID, err
	}

	insertedID, ok := res.InsertedID.(primitive.ObjectID)
	if !ok {
		return primitive.NilObjectID, fmt.Errorf("failed to convert inserted ID to primitive.ObjectID")
	}

	return insertedID, nil
}

func (m *MongoDBStore) GetOrderByID(orderid primitive.ObjectID) (*models.OrderDocument, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	var order models.OrderDocument

	err := m.OrdersCollection.FindOne(ctx, bson.M{"_id": orderid}).Decode(&order)
	if err != nil {
		return nil, err
	}

	return &order, nil
}