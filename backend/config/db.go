package config

import (
	"fmt"
	"log"

	"example.com/sa-example2/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {

	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {
	db.AutoMigrate(
		&entity.Seller{},
		&entity.Category{},
		&entity.Post_a_New_Product{},
		&entity.Product{},
		&entity.ProductImage{},
		&entity.ShopAddress{},
		&entity.ShopCategory{},
		&entity.ShopProfile{},
	)
	categories := []entity.ShopCategory{
		{CategoryName: "เสื้อผ้าแฟชั่น"},
		{CategoryName: "อิเล็กทรอนิก"},
		{CategoryName: "อาหาร"},
		{CategoryName: "ของใช้จำเป็น"},
		{CategoryName: "เกมมิ่งเกียร์"},
	}

	for _, cat := range categories {
		result := db.FirstOrCreate(&cat, entity.ShopCategory{CategoryName: cat.CategoryName})
		if result.Error != nil {
			log.Println("เพิ่มหมวดหมู่ล้มเหลว:", result.Error)
		} else {
			fmt.Println("เพิ่มหมวดหมู่:", cat.CategoryName)
		}
	}

	// เพิ่มผู้ขายตัวอย่าง
	seller := entity.Seller{
		Username:    "seller01",
		Password:    "password123", // ควร hash ก่อนเก็บจริง
		PhoneNumber: "0801234567",
		Address:     "123 หมู่ 5 ตำบลทดสอบ อำเภอเมือง จังหวัดทดสอบ",
		FirstName:   "สมชาย",
		LastName:    "ใจดี",
	}

	result := db.FirstOrCreate(&seller, entity.Seller{Username: seller.Username})
	if result.Error != nil {
		log.Println("เพิ่มผู้ขายล้มเหลว:", result.Error)
	} else {
		fmt.Println("เพิ่มผู้ขาย:", seller.Username)
	}
	newSeller := entity.Seller{
		Username:    "seller2",
		Password:    "password2",
		PhoneNumber: "0987654321",
		Address:     "123 หมู่บ้านใหม่",
		FirstName:   "สมชาย",
		LastName:    "ใจดี",
	}

	if err := db.Create(&newSeller).Error; err != nil {
		log.Println("เพิ่มผู้ขายล้มเหลว:", err)
	} else {
		log.Println("เพิ่มผู้ขายสำเร็จ:", newSeller)
	}

}

func CreateShopProfile(c *gin.Context) {
	var input struct {
		ShopName        string             `json:"shop_name" binding:"required"`
		Slogan          string             `json:"slogan" binding:"required"`
		ShopDescription string             `json:"shop_description" binding:"required"`
		LogoPath        string             `json:"logo_path" binding:"required"`
		Address         entity.ShopAddress `json:"address" binding:"required"`
		CategoryID      uint               `json:"shopCategoryID" binding:"required"`
		SellerID        uint               `json:"seller_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// สร้าง Address ก่อน
	tx := db.Begin()
	if err := tx.Create(&input.Address).Error; err != nil {
		tx.Rollback()
		// handle error
	}

	// สร้าง ShopProfile โดยเชื่อม AddressID
	shop := entity.ShopProfile{
		ShopName:        input.ShopName,
		Slogan:          input.Slogan,
		ShopDescription: input.ShopDescription,
		LogoPath:        input.LogoPath,
		AddressID:       &input.Address.ID,
		ShopCategoryID:  &input.CategoryID,
		SellerID:        &input.SellerID,
	}

	if err := tx.Create(&shop).Error; err != nil {
		tx.Rollback()
		// handle error
	}

	c.JSON(200, gin.H{"data": shop})
	tx.Commit()
}
