package user

import (
	"encoding/json"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/louislaugier/sas/server/database"
)

type user struct {
	ID            uuid.UUID `json:"id"`
	Username      string    `json:"username"`
	FirstName     string    `json:"first_name"`
	LastName      string    `json:"last_name"`
	Email         string    `json:"email"`
	StreetAddress string    `json:"street_address"`
	PostCode      string    `json:"postcode"`
	City          string    `json:"city"`
	Country       string    `json:"country"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at,omitempty"`
}

// POST user
func POST() func(c *gin.Context) {
	return func(c *gin.Context) {
		u := &user{
			ID:        uuid.New(),
			CreatedAt: time.Now(),
		}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, u)
		tx, err := database.Db.Begin()
		if err == nil {
			tx.Exec("INSERT INTO users (id, username, first_name, last_name, email, street_address, postcode, city, country, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);", u.ID, u.Username, u.FirstName, u.LastName, u.Email, u.StreetAddress, u.PostCode, u.City, u.Country, u.CreatedAt)
			tx.Commit()
			c.JSON(201, &gin.H{
				"statusCode": "201",
				"message":    "Created",
				"error":      nil,
				"meta": gin.H{
					"payload": u,
				},
				"data": nil,
			})
		} else {
			c.JSON(500, &gin.H{
				"statusCode": "500",
				"message":    "Internal Server Error",
				"error":      err.Error(),
				"meta": gin.H{
					"query":       c.Request.URL.Query(),
					"resultCount": 0,
				},
				"data": nil,
			})
			log.Println(err)
		}
	}
}
