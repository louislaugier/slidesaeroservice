package session

import (
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/louislaugier/sas/server/database"
)

// CartGET from Redis
func CartGET() func(c *gin.Context) {
	return func(c *gin.Context) {
		items, err := database.Redis.LRange(database.Context, c.Request.URL.Query()["cartToken"][0], 0, -1).Result()
		if err == nil {
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query":        c.Request.URL.Query(),
					"result_count": len(items),
				},
				"data": items,
			})
		} else {
			c.JSON(500, &gin.H{
				"statusCode": "500",
				"message":    "Internal Server Error",
				"error":      err.Error(),
				"meta": gin.H{
					"query":        c.Request.URL.Query(),
					"result_count": len(items),
				},
				"data": items,
			})
			log.Println(err)
		}
	}
}

// CartPOST to Redis
func CartPOST() func(c *gin.Context) {
	return func(c *gin.Context) {
		userID := c.Request.URL.Query()["cartToken"][0]
		account := userID
		if userID == "new_guest_cookie" {
			account = uuid.New().String()
		}
		_, err := database.Redis.LPush(database.Context, account, c.Request.URL.Query()["slide"][0]).Result()
		if err == nil {
			c.JSON(201, &gin.H{
				"statusCode": "201",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query": c.Request.URL.Query(),
				},
				"data": account,
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

// CartDELETE from Redis
func CartDELETE() func(c *gin.Context) {
	return func(c *gin.Context) {
		quantity, _ := strconv.ParseInt(c.Request.URL.Query()["count"][0], 10, 64)
		_, err := database.Redis.LRem(database.Context, c.Request.URL.Query()["cartToken"][0], quantity, c.Request.URL.Query()["slide"][0]).Result()
		if err == nil {
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query": c.Request.URL.Query(),
				},
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
