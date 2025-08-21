package main

import (
	"log"

	"example.com/sa-example2/config"
	"example.com/sa-example2/routes"
	"github.com/joho/godotenv"
)

const PORT = "8000"

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system env")
	}

	// open connection database
	config.ConnectionDB()

	// Generate databases
	config.SetupDatabase()
	r := routes.SetupRouter()
	r.Run(":8080")

}
