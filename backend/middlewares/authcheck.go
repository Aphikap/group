package middleware

import (
	"net/http"
	"os"
	"strings"

	"example.com/sa-example2/config"
	"example.com/sa-example2/entity"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type MyClaims struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func AuthGuard() gin.HandlerFunc {
	return func(c *gin.Context) {
		h := c.GetHeader("Authorization")
		if h == "" || !strings.HasPrefix(h, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "missing bearer token"})
			return
		}
		tokenStr := strings.TrimPrefix(h, "Bearer ")

		secret := os.Getenv("SECRET")
		claims := &MyClaims{}

		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenUnverifiable
			}
			return []byte(secret), nil
		})
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "invalid token"})
			return
		}

		// ผ่านแล้ว → set ลง context
		c.Set("username", claims.Username)
		c.Set("id", claims.ID)
		c.Next()
	}
}

func SellerOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		// ต้องผ่าน AuthGuard แล้ว (มี username/id ใน context)
		usernameAny, exists := c.Get("username")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "unauthorized"})
			return
		}
		username, _ := usernameAny.(string)

		var s entity.Seller
		if err := config.DB().
			Preload("ShopProfile").
			Where("username = ?", username).
			First(&s).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "unauthorized"})
			return
		}

		if s.ShopProfile == nil {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "seller only (no shop profile)"})
			return
		}

		// ผ่านได้ → ไปต่อ
		c.Next()
	}
}
