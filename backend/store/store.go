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

func (m *MongoDBStore) UpdateOrder(order *models.OrderDocument) (error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	filter := bson.M{
		"_id": order.OrderID,
	}

	update := bson.M{
		"$set": bson.M{
			"payment_result.id": order.PaymentResult.ID,
			"payment_result.status": order.PaymentResult.Status,
			"payment_result.email": order.PaymentResult.Email,
			"isPaid": order.IsPaid,
			"status": order.Status,
			"paidAt": order.PaidAt,
		},
	}

	_, err := m.OrdersCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}
	return nil
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

func (m *MongoDBStore) AllCategories() ([]*models.Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	option := options.Find()
	option.SetSort(bson.D{{Key: "createdAt", Value: -1}})

	cursor, err := m.CategoriesCollection.Find(context.TODO(), bson.D{}, option)
	if err != nil {
		log.Println("Finding all docs error:", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var categories []*models.Category

	for cursor.Next(ctx) {
		var category models.Category

		err := cursor.Decode(&category)
		if err != nil {
			log.Println("Error decoding category into slice: ", err)
			return nil, err
		} else {
			categories = append(categories, &category)
		}
	}
	return categories, nil
}

func (m *MongoDBStore) GetCategoryByName(name string) (*models.Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()
	
	var category models.Category

	err := m.CategoriesCollection.FindOne(ctx, bson.M{"name": name}).Decode(&category)
	if err == mongo.ErrNoDocuments {
		// Coupon not found, return nil without an error.
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &category, nil
}

func (m *MongoDBStore) CreateCategory(docs models.Category) (primitive.ObjectID, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	res, err := m.CategoriesCollection.InsertOne(ctx, docs)
	if err != nil {
		return primitive.NilObjectID, err
	}

	insertedID, ok := res.InsertedID.(primitive.ObjectID)
	if !ok {
		return primitive.NilObjectID, fmt.Errorf("failed to convert inserted ID to primitive.ObjectID")
	}

	return insertedID, nil
}

func (m *MongoDBStore) RemoveCategoryByID(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()
	
	categoryID, _ := primitive.ObjectIDFromHex(id)

	_, err := m.CategoriesCollection.DeleteOne(ctx, bson.M{"_id": categoryID})
	if err != nil {
		return err
	}

	return nil	
}

func (m *MongoDBStore) UpdateCategory(arg *models.Category) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	filter := bson.M{
		"_id": arg.ID,
	}

	update := bson.M{
		"$set": bson.M{
			"name": arg.Name,
			"slug": arg.Slug,
			"updatedAt": arg.UpdatedAt,
		},
	}

	if _, err := m.CategoriesCollection.UpdateOne(ctx, filter, update); err != nil {
		return err
	}
	return nil
}

func (m *MongoDBStore) AllCoupons() ([]*models.Coupon, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	option := options.Find()
	option.SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := m.CouponsCollection.Find(context.TODO(), bson.D{}, option)
	if err != nil {
		log.Println("Finding all docs error:", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var coupons []*models.Coupon

	for cursor.Next(ctx) {
		var coupon models.Coupon

		err := cursor.Decode(&coupon)
		if err != nil {
			log.Println("Error decoding category into slice: ", err)
			return nil, err
		} else {
			coupons = append(coupons, &coupon)
		}
	}
	return coupons, nil
}

func (m *MongoDBStore) RemoveCouponByID(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()
	
	couponID, _ := primitive.ObjectIDFromHex(id)

	_, err := m.CouponsCollection.DeleteOne(ctx, bson.M{"_id": couponID})
	if err != nil {
		return err
	}

	return nil	
}

func (m *MongoDBStore) UpdateCoupon(arg *models.Coupon) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	filter := bson.M{
		"_id": arg.ID,
	}

	update := bson.M{
		"$set": bson.M{
			"coupon": arg.Coupon,
			"discount": arg.Discount,
			"start_date": arg.StartDate,
			"end_date": arg.EndDate,
			"updated_at": arg.UpdatedAt,
		},
	}

	if _, err := m.CouponsCollection.UpdateOne(ctx, filter, update); err != nil {
		return err
	}
	return nil
}

func (m *MongoDBStore) GetAllProductNameAndSubProducts() ([]*models.ProductSubSet, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	projection := bson.M{
		"name": 1,
		"subProducts": 1,
	}

	cursor, err := m.ProductsCollection.Find(ctx, bson.M{}, options.Find().SetProjection(projection))
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []*models.ProductSubSet

	for cursor.Next(ctx) {
		var result models.ProductSubSet
		if err := cursor.Decode(&result); err != nil {
			return nil, err
		}
		results = append(results, &result)
	}

	return results, nil
}





