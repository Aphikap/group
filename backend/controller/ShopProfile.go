package controller

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"example.com/sa-example2/config"
	"example.com/sa-example2/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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

func ListMyProfile(c *gin.Context) {
	sellerID, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "ไม่พบ seller ID"})
		return
	}

	var Profile entity.ShopProfile
	if err := config.DB().
		Where("seller_id = ?", sellerID).
		Preload("ShopAddress").
		Preload("Category").
		Preload("Seller").
		First(&Profile).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลร้านค้าได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": Profile})


}
type AddressInput struct {
	Address     *string `json:"address"`
	SubDistrict *string `json:"sub_district"`
	District    *string `json:"district"`
	Province    *string `json:"province"`
	
}
type UpdateShopProfileInput struct {
	SellerID        uint          `json:"seller_id" binding:"required"`
	ShopName        *string       `json:"shop_name"`
	Slogan          *string       `json:"slogan"`
	ShopDescription *string       `json:"shop_description"`
	LogoPath        *string       `json:"logo_path"`
	CategoryID      *uint         `json:"category_id"`
	Address         *AddressInput `json:"address"` // มีอยู่แล้ว แค่อัปเดต
}

func UpdateShopProfile(c *gin.Context) {
	db := config.DB()

	var in UpdateShopProfileInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// หาโปรไฟล์จาก seller_id
	var p entity.ShopProfile
	if err := db.Preload("ShopAddress").
		Where("seller_id = ?", in.SellerID).
		First(&p).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	oldLogo := p.LogoPath // เก็บ path เดิมไว้เทียบ

	// ทำให้เป็น all-or-nothing
	if err := db.Transaction(func(tx *gorm.DB) error {
		// --- อัปเดต ShopProfile (partial) ---
		upd := map[string]interface{}{}
		if in.ShopName != nil        { upd["shop_name"] = *in.ShopName }
		if in.Slogan != nil          { upd["slogan"] = *in.Slogan }
		if in.ShopDescription != nil { upd["shop_description"] = *in.ShopDescription }
		if in.LogoPath != nil        { upd["logo_path"] = *in.LogoPath }
		if in.CategoryID != nil      { upd["shop_category_id"] = *in.CategoryID }

		if len(upd) > 0 {
			if err := tx.Model(&entity.ShopProfile{}).
				Where("id = ?", p.ID).
				Updates(upd).Error; err != nil {
				return err
			}
		}

		// --- อัปเดต Address (partial) ---
		if in.Address != nil && p.AddressID != nil {
			addrUpd := map[string]interface{}{}
			if in.Address.Address != nil     { addrUpd["address"] = *in.Address.Address }
			if in.Address.SubDistrict != nil { addrUpd["sub_district"] = *in.Address.SubDistrict }
			if in.Address.District != nil    { addrUpd["district"] = *in.Address.District }
			if in.Address.Province != nil    { addrUpd["province"] = *in.Address.Province }

			if len(addrUpd) > 0 {
				if err := tx.Model(&entity.ShopAddress{}).
					Where("id = ?", *p.AddressID).
					Updates(addrUpd).Error; err != nil {
					return err
				}
			}
		}
		return nil
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ลบไฟล์โลโก้เก่า (ทำหลัง commit เท่านั้น)
	if in.LogoPath != nil && oldLogo != *in.LogoPath {
    clean := strings.TrimPrefix(filepath.Clean(oldLogo), "/") // ✅ S1017
    if strings.HasPrefix(clean, "uploads/logo/") {            // safety guard
        _ = os.Remove(clean)
    }
}

	// โหลดข้อมูลล่าสุดส่งกลับ
	_ = db.Preload("ShopAddress").Preload("Category").First(&p, p.ID).Error
	c.JSON(http.StatusOK, gin.H{"data": p})
}