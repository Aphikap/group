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

func AuthGuard() gin.HandlerFunc {
	return func(c *gin.Context) {
		h := c.GetHeader("Authorization")
		if h == "" || !strings.HasPrefix(h, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "missing bearer token"})
			return
		}
		tokenStr := strings.TrimPrefix(h, "Bearer ")
		secret := os.Getenv("SECRET")

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenUnverifiable
			}
			return []byte(secret), nil
		})
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "invalid token"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "invalid claims"})
			return
		}

		// เก็บลง context
		if v, ok := claims["username"].(string); ok {
			c.Set("username", v)
		}
		if v, ok := claims["id"].(float64); ok {
			c.Set("id", uint(v))
		}

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
