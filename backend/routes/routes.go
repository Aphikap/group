package routes

import (
	"time"

	"example.com/sa-example2/config" // เปลี่ยนตามโมดูลคุณ
	"example.com/sa-example2/controller"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173", "http://localhost:3000"},
		// หรือ frontend origin ของคุณ
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	// Serve static files
	r.Static("/uploads", "./uploads")

	api := r.Group("/api")
	{
		api.POST("/upload-logo", controller.UploadLogo)
		// เพิ่ม API routes อื่น ๆ ที่นี่
		api.POST("/shop-profiles", config.CreateShopProfile)

		//register login
		api.POST("/register",controller.RegisterSeller)
		api.POST("/login",controller.LoginSeller)
		api.GET("/current-user",controller.CurrentSeller)
		
		

	}

	return r
}
