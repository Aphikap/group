package controller

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"example.com/sa-example2/config"
	"example.com/sa-example2/entity"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

/********** DTOs **********/
type SellerRegisterReq struct {
	Username string `json:"username" binding:"required,min=3,max=100"`
	Password string `json:"password" binding:"required,min=6,max=100"`
}

type SellerLoginReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type PublicSeller struct {
	ID        uint   `json:"id"`
	Username  string `json:"username"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
}

func toPublicSeller(s entity.Seller) PublicSeller {
	ps := PublicSeller{ID: s.ID, Username: s.Username}
	if s.FirstName != "" {
		fmt.Println("มีค่า FirstName:", s.FirstName)
	} else {
		fmt.Println("ยังไม่ได้กรอก FirstName")
	}

	return ps
}

/********** Handlers **********/
// POST /api/sellers/register
func RegisterSeller(c *gin.Context) {
	var req SellerRegisterReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid body", "error": err.Error()})
		return
	}

	db := config.DB()

	// check duplicate username
	var count int64
	if err := db.Model(&entity.Seller{}).Where("username = ?", req.Username).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "db error"})
		return
	}
	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "username already exists"})
		return
	}

	// hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "hash error"})
		return
	}

	s := entity.Seller{
		Username: req.Username,
		Password: string(hash),
		// ฟิลด์อื่น ๆ (PhoneNumber/Address/FirstName/LastName) ไม่ต้องกรอกตอนนี้
	}
	if err := db.Create(&s).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "create seller failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"seller": toPublicSeller(s)})
}

// POST /api/sellers/login
func LoginSeller(c *gin.Context) {
	var req SellerLoginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid body", "error": err.Error()})
		return
	}

	db := config.DB()
	var s entity.Seller
	if err := db.Where("username = ?", req.Username).First(&s).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusBadRequest, gin.H{"message": "seller not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "db error"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(s.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "password invalid"})
		return
	}

	secret := os.Getenv("SECRET")
	claims := jwt.MapClaims{
		"id":       s.ID,
		"username": s.Username,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(secret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "token error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"payload": claims,
		"token":   signed,
	})
}

func CurrentSeller(c *gin.Context) {
	usernameAny, _ := c.Get("username")
	username, _ := usernameAny.(string)

	var s entity.Seller
	if err := config.DB().
		Preload("ShopProfile"). // สำคัญ! จะได้เช็คได้
		Where("username = ?", username).
		First(&s).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "db error"})
		return
	}

	hasShop := s.ShopProfile != nil

	c.JSON(http.StatusOK, gin.H{
		"seller": gin.H{
			"id":         s.ID,
			"username":   s.Username,
			"first_name": s.FirstName,
			"last_name":  s.LastName,
		},
		"has_shop": hasShop, // 👈 ใช้ตัวนี้ตัดสินฝั่งหน้าเว็บว่าจะโชว์ layout ไหน
	})
}
