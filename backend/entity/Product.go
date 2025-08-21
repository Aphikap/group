package entity

import "gorm.io/gorm"

type Product struct {
	gorm.Model

	Name        string `gorm:"type:varchar(100);not null" json:"name"`
	Description string `gorm:"type:varchar(255);not null" json:"description"`

    Post_a_New_Product []Post_a_New_Product `gorm:"foreignKey:Product_ID"`
    ProductImage []ProductImage `gorm:"foreignKey:Product_ID"`
}
