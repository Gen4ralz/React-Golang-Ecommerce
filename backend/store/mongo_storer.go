package store

import (
	"github.com/gen4ralz/react-golang-ecommerce/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Storer interface {
	AllProducts() ([]*models.Product, error)
	GetProductBySlug(string) (*models.Product, error)
	GetProductById(id primitive.ObjectID) (*models.Product, error)
	GetCategoryByID(id primitive.ObjectID) (*models.Category, error)
	AllCategories() ([]*models.Category, error)
	SaveCart(models.CartDocument) (error)
	GetCartByUserID(string) (*models.CartDocument, error)
	RemoveCartByUserID(string) (error)
	SaveOrder(models.OrderDocument) (primitive.ObjectID, error)
	GetOrderByID(orderid primitive.ObjectID) (*models.OrderDocument, error)
	CreateUser(arg *models.CreateUserParams) (primitive.ObjectID, error)
	GetUserByID(userid primitive.ObjectID) (*models.User, error)
	GetUserByEmail(string) (*models.User, error)
	SaveAddress(user *models.User) (error)
	GetRecentAddress(userid primitive.ObjectID) (*models.Address, error)
	UpdateAddressByAddressId(userID, addressID primitive.ObjectID) error
	GetAllAddressByUserId(userID primitive.ObjectID) ([]models.Address, error)
	DeleteAddressByAddressId(userID, addressID primitive.ObjectID) error
	CreateCoupon(docs models.Coupon) (primitive.ObjectID, error)
	GetCouponByID(couponID primitive.ObjectID) (*models.Coupon, error)
	GetCouponByName(name string) (*models.Coupon, error)
	UpdateOrder(order *models.OrderDocument) (error)
	GetCategoryByName(name string) (*models.Category, error)
	CreateCategory(docs models.Category) (primitive.ObjectID, error)
	RemoveCategoryByID(id string) error
}