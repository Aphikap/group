package routes

import (
	"time"

	// เปลี่ยนตามโมดูลคุณ
	"example.com/sa-example2/controller"
	middleware "example.com/sa-example2/middlewares"

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
		api.POST("/upload-Product", controller.UploadProductImages)
		// เพิ่ม API routes อื่น ๆ ที่นี่
		api.POST("/shop-profiles", controller.CreateShopProfile)
		api.POST("/post-Product", controller.CreateProduct)

		//register login
		api.POST("/register", controller.RegisterSeller)
		api.POST("/login", controller.LoginSeller)
		api.GET("/current-user", middleware.AuthGuard(), controller.CurrentSeller)

	}

	return r
}
