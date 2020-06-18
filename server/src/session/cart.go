package session

import (
	"context"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
)

// CartGET from Redis
func CartGET() func(c *gin.Context) {
	return func(c *gin.Context) {
		ctx := context.Background()
		rd := redis.NewClient(&redis.Options{
			Addr:     "localhost:6379",
			Password: "",
			DB:       0,
		})
		rd.Set(ctx, "key", "value", 0)
		val, _ := rd.Get(ctx, "key").Result()
		fmt.Println("key", val)
	}
}

// CartPOST to Redis
func CartPOST() func(c *gin.Context) {
	return func(c *gin.Context) {
		slideID := c.Request.URL.Query()["slide"][0]
		log.Println(slideID)
		// tx, err := database.Db.Begin()
		// if err == nil {
		// 	// tx.Exec("UPDATE categories SET id = $1, title = $2, is_subcategory = $3, parent_category = $4"+query+";", cg.ID, cg.Title, cg.IsSubcategory, cg.ParentCategory)
		// 	// tx.Commit()
		// 	c.JSON(200, &gin.H{
		// 		"statusCode": "200",
		// 		"message":    "OK",
		// 		"error":      nil,
		// 		"meta": gin.H{
		// 			"query":   c.Request.URL.Query(),
		// 			"payload": cg,
		// 		},
		// 		"data": nil,
		// 	})
		// } else {
		// 	c.JSON(500, &gin.H{
		// 		"statusCode": "500",
		// 		"message":    "Internal Server Error",
		// 		"error":      err.Error(),
		// 		"meta": gin.H{
		// 			"query":   c.Request.URL.Query(),
		// 			"payload": cg,
		// 		},
		// 		"data": nil,
		// 	})
		// 	log.Println(err)
		// }
	}
}
