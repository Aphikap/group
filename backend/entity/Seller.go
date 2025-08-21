package entity

import (
	"gorm.io/gorm"
)

type Seller struct {
	gorm.Model
	Username    string `gorm:"type:varchar(100);unique;not null" json:"username"`
	Password    string `gorm:"type:varchar(100);not null" json:"password"`
	 PhoneNumber string `gorm:"type:varchar(20)" json:"phone_number,omitempty"`
    Address     string `gorm:"type:varchar(255)" json:"address,omitempty"`
    FirstName   string `gorm:"type:varchar(100)" json:"first_name,omitempty"`
    LastName    string `gorm:"type:varchar(100)" json:"last_name,omitempty"`

	Post_a_New_Product []Post_a_New_Product `gorm:"foreignKey:SellerID"`
	ShopProfile *ShopProfile `gorm:"foreignKey:SellerID"`
}
