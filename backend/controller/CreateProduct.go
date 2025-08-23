package controller

import (
	"net/http"

	"example.com/sa-example2/config"
	"example.com/sa-example2/entity"
	"github.com/gin-gonic/gin"
)

// controller/post_product.go

// dto/post_product.go
type CreateProductRequest struct {
	ProductName string   `json:"product_name" binding:"required"`
	Description string   `json:"description" binding:"required"`
	Price       float64  `json:"price" binding:"required"`
	Quantity    int      `json:"quantity" binding:"required"`
	CategoryID  uint     `json:"category_id" binding:"required"`
	SellerID    uint     `json:"seller_id" binding:"required"`
	Images      []string `json:"images" binding:"required"`
}


func CreateProduct(c *gin.Context) {
	var req CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ครบ"})
		return
	}

	// 1. สร้าง Product
	product := entity.Product{
		Name:        req.ProductName,
		Description: req.Description,
	}
	if err := config.DB().Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "สร้างสินค้าไม่สำเร็จ"})
		return
	}

	// 2. สร้าง Post_a_New_Product
	post := entity.Post_a_New_Product{
		Price:      req.Price,
		Quantity:   req.Quantity,
		Product_ID: &product.ID,
		Category_ID: &req.CategoryID,
		SellerID:   &req.SellerID,
	}
	if err := config.DB().Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "โพสต์สินค้าไม่สำเร็จ"})
		return
	}

	// 3. บันทึกรูปภาพ
	var images []entity.ProductImage
	for _, url := range req.Images {
		images = append(images, entity.ProductImage{
			ImagePath:  url,
			Product_ID: &product.ID,
		})
	}
	if err := config.DB().Create(&images).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "บันทึกรูปภาพไม่สำเร็จ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "สร้างสินค้าสำเร็จ",
		"product": product,
	})
}
