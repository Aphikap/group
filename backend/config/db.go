package config

import (
	"fmt"
	"log"

	"example.com/sa-example2/entity"
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

	categoriesProduct := []entity.Category{
		{Name: "เสื้อผ้าแฟชั่น"},
		{Name: "อิเล็กทรอนิก"},
		{Name: "อาหาร"},
		{Name: "ของใช้จำเป็น"},
		{Name: "เกมมิ่งเกียร์"},
	}

	for _, cat := range categoriesProduct {
		result := db.FirstOrCreate(&cat, entity.Category{Name: cat.Name})
		if result.Error != nil {
			log.Println("เพิ่ม Category สินค้าล้มเหลว:", result.Error)
		} else {
			fmt.Println("เพิ่ม Category สินค้า:", cat.Name)
		}
	}
}
