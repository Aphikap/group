package controller

import (
	"strings"

	"example.com/sa-example2/config"
	"example.com/sa-example2/entity"
	"github.com/gin-gonic/gin"
)

func CreateShopProfile(c *gin.Context) {
	var input struct {
		ShopName        string             `json:"shop_name" binding:"required"`
		Slogan          string             `json:"slogan" binding:"required"`
		ShopDescription string             `json:"shop_description" binding:"required"`
		LogoPath        string             `json:"logo_path" binding:"required"`
		Address         entity.ShopAddress `json:"address" binding:"required"`
		CategoryID      uint               `json:"category_id" binding:"required"`
		SellerID        uint               `json:"seller_id" binding:"required"`
	}

	db := config.DB()

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// 🔽 เช็กว่าผู้ขายมีร้านอยู่แล้วไหม
	var existing entity.ShopProfile
	if err := db.Where("seller_id = ?", input.SellerID).First(&existing).Error; err == nil {
		c.JSON(400, gin.H{"error": "ผู้ขายรายนี้มีร้านค้าอยู่แล้ว"})
		return
	}

	tx := db.Begin()

	if err := tx.Create(&input.Address).Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"error": "ไม่สามารถสร้างที่อยู่ได้"})
		return
	}

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

		// ✅ ตรวจสอบว่าเป็นข้อผิดพลาดจาก UNIQUE constraint หรือไม่ (SQLite)
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			c.JSON(400, gin.H{"error": "ชื่อร้านค้านี้ถูกใช้แล้ว"})
			return
		}

		c.JSON(500, gin.H{"error": "ไม่สามารถสร้างร้านค้าได้"})
		return
	}

	tx.Commit()
	c.JSON(200, gin.H{"data": shop})
}
