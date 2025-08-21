package entity

import "gorm.io/gorm"

type ProductImage struct {
	gorm.Model
	
	ImagePath string   `gorm:"type:varchar(255);not null" json:"image_path"`
	

	Product_ID *uint
	Product   Product `gorm:"foreignKey:Product_ID"`
}
