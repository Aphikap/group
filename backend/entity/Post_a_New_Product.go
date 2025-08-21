package entity

import (
	"time"

	"gorm.io/gorm"
)

type Post_a_New_Product struct {
	gorm.Model

	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	Price     float64   `gorm:"type:decimal(10,2);not null" json:"price"`
	Quantity  int       `gorm:"default:1" json:"quantity"`

	Product_ID *uint
	Product    Product `gorm:"foreignKey:Product_ID" `

	Category_ID *uint
	Category    Category `gorm:"foreignKey:Category_ID"`

	SellerID *uint
	Seller    Seller `gorm:"foreignKey:SellerID;references:ID"`
}
