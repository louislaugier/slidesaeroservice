package session

import (
	"crypto/md5"
	"encoding/hex"
	"log"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/louislaugier/sas/server/database"
)

// GET user ID from token
func GET() func(c *gin.Context) {
	return func(c *gin.Context) {
		ID, err := database.Redis.Get(database.Context, c.Request.URL.Query()["token"][0]).Result()
		if err == nil {
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query": gin.H{},
				},
				"data": ID,
			})
		} else {
			c.JSON(500, &gin.H{
				"statusCode": "500",
				"message":    "Internal Server Error",
				"error":      err.Error(),
				"meta": gin.H{
					"query": gin.H{},
				},
			})
			log.Println(err)
		}
	}
}

// Login with email or username
func Login() func(c *gin.Context) {
	return func(c *gin.Context) {
		log.Println(c.Request.URL.Query()["password"][0])
		l := "username"
		if strings.Contains(c.Request.URL.Query()["user"][0], "@") {
			l = "email"
		}
		p := md5.Sum([]byte(c.Request.URL.Query()["password"][0]))
		h := hex.EncodeToString(p[:])
		userRow, err := database.Postgres.Query("SELECT id FROM users WHERE " + l + " = '" + c.Request.URL.Query()["user"][0] + "' AND password = '" + h + "';")
		if err == nil {
			defer userRow.Close()
			ID := ""
			for userRow.Next() {
				userRow.Scan(&ID)
			}
			token := ""
			if ID != "" {
				token = uuid.New().String()
				d, _ := time.ParseDuration("15d")
				database.Redis.Set(database.Context, token, ID, d)
			}
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query": gin.H{},
				},
				"data": token,
			})
		} else {
			c.JSON(500, &gin.H{
				"statusCode": "500",
				"message":    "Internal Server Error",
				"error":      err.Error(),
				"meta": gin.H{
					"query": gin.H{},
				},
			})
			log.Println(err)
		}
	}
}
