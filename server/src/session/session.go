package session

import (
	"crypto/md5"
	"encoding/hex"
	"log"
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
					"query": c.Request.URL.Query(),
				},
				"data": ID,
			})
		} else {
			c.JSON(500, &gin.H{
				"statusCode": "500",
				"message":    "Internal Server Error",
				"error":      err.Error(),
				"meta": gin.H{
					"query": c.Request.URL.Query(),
				},
			})
			log.Println(err)
		}
	}
}

// TokenGET for 30-day cookie & transfer guest cart to user cart
func TokenGET() func(c *gin.Context) {
	return func(c *gin.Context) {
		p := md5.Sum([]byte(c.Request.URL.Query()["password"][0]))
		h := hex.EncodeToString(p[:])
		userRow, err := database.Postgres.Query("SELECT id, email_verified FROM users WHERE email = '" + c.Request.URL.Query()["email"][0] + "' AND password = '" + h + "';")
		if err == nil {
			defer userRow.Close()
			ID := ""
			ec := false
			for userRow.Next() {
				userRow.Scan(&ID, &ec)
			}
			token := ""
			code := 200
			if ID != "" && ec {
				token = uuid.New().String()
				d, _ := time.ParseDuration("30d")
				database.Redis.Set(database.Context, token, ID, d)
				if c.Request.URL.Query()["guestCart"][0] != "none" {
					items, _ := database.Redis.LRange(database.Context, c.Request.URL.Query()["guestCart"][0], 0, -1).Result()
					for _, v := range items {
						database.Redis.LPush(database.Context, ID, v)
					}
				}
			} else {
				code = 401
			}
			c.JSON(code, &gin.H{
				"statusCode": code,
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query": c.Request.URL.Query(),
				},
				"data": token,
			})
		} else {
			c.JSON(500, &gin.H{
				"statusCode": "500",
				"message":    "Internal Server Error",
				"error":      err.Error(),
				"meta": gin.H{
					"query": c.Request.URL.Query(),
				},
			})
			log.Println(err)
		}
	}
}

// DELETE session to logout
func DELETE() func(c *gin.Context) {
	return func(c *gin.Context) {
		_, err := database.Redis.Del(database.Context, c.Request.URL.Query()["token"][0]).Result()
		if err == nil {
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query": c.Request.URL.Query(),
				},
				"data": nil,
			})
		} else {
			c.JSON(500, &gin.H{
				"statusCode": "500",
				"message":    "Internal Server Error",
				"error":      err.Error(),
				"meta": gin.H{
					"query": c.Request.URL.Query(),
				},
			})
			log.Println(err)
		}
	}
}
