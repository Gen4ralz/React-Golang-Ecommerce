package store

import (
	"github.com/gen4ralz/react-golang-ecommerce/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Storer interface {
	AllProducts() ([]*models.Product, error)
	GetProductBySlug(string) (*models.Product, error)
	GetProductById(id primitive.ObjectID) (*models.Product, error)
	GetCategoryByProductID(id primitive.ObjectID) (*models.Category, error)
	SaveCart(models.CartDocument) (error)
	GetCartByUserID(string) (*models.CartDocument, error)
	RemoveCartByUserID(string) (error)
	SaveOrder(models.OrderDocument) (primitive.ObjectID, error)
	GetOrderByID(orderid primitive.ObjectID) (*models.OrderDocument, error)
	CreateUser(arg *models.CreateUserParams) (primitive.ObjectID, error)
	GetUserByID(userid primitive.ObjectID) (*models.User, error)
	GetUserByEmail(string) (*models.User, error)
}