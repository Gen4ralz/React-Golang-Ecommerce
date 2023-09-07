package store

import (
	"context"
	"fmt"
	"time"

	"github.com/gen4ralz/react-golang-ecommerce/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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
	CouponsCollection *mongo.Collection
}

func NewMongoDBStore(client *mongo.Client) Store {
	db := client.Database("ecommerces")

	productsCollection := db.Collection("products")
	categoriesCollection := db.Collection("categories")
	cartsCollection := db.Collection("carts")
	ordersCollection := db.Collection("orders")
	usersCollection := db.Collection("users")
	couponsCollection := db.Collection("coupons")

	return &MongoDBStore{
		ProductsCollection: productsCollection, 
		CategoriesCollection: categoriesCollection,
		CartsCollection: cartsCollection,
		OrdersCollection: ordersCollection,
		UsersCollection: usersCollection,
		CouponsCollection: couponsCollection,
	}
}

func (m *MongoDBStore) GetCategoryByID(id primitive.ObjectID) (*models.Category, error) {
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

func (m *MongoDBStore) CreateCoupon(docs models.Coupon) (primitive.ObjectID, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	res, err := m.CouponsCollection.InsertOne(ctx, docs)
	if err != nil {
		return primitive.NilObjectID, err
	}

	insertedID, ok := res.InsertedID.(primitive.ObjectID)
	if !ok {
		return primitive.NilObjectID, fmt.Errorf("failed to convert inserted ID to primitive.ObjectID")
	}

	return insertedID, nil
}

func (m *MongoDBStore) GetCouponByID(couponID primitive.ObjectID) (*models.Coupon, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()
	
	var coupon models.Coupon

	err := m.CouponsCollection.FindOne(ctx, bson.M{"_id": couponID}).Decode(&coupon)
	if err == mongo.ErrNoDocuments {
		// Coupon not found, return nil without an error.
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &coupon, nil
}

func (m *MongoDBStore) GetCouponByName(name string) (*models.Coupon, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()
	
	var coupon models.Coupon

	err := m.CouponsCollection.FindOne(ctx, bson.M{"coupon": name}).Decode(&coupon)
	if err == mongo.ErrNoDocuments {
		// Coupon not found, return nil without an error.
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &coupon, nil
}