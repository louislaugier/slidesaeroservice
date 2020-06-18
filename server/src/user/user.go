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
	PaypalEmail   string    `json:"paypal_email,omitempty"`
	IsAdmin       bool      `json:"is_admin"`
}

// GET users or a user
func GET() func(c *gin.Context) {
	return func(c *gin.Context) {
		query := database.StandardizeQuery(c.Request.URL.Query())
		userRows, err := database.Db.Query("SELECT id, username, first_name, last_name, email, street_address, postcode, city, country, created_at, updated_at, paypal_email, is_admin FROM users" + query + ";")
		defer userRows.Close()
		if err == nil {
			users := []*user{}
			for userRows.Next() {
				u := &user{}
				userRows.Scan(&u.ID, &u.Username, &u.FirstName, &u.LastName, &u.Email, &u.StreetAddress, &u.PostCode, &u.City, &u.Country, &u.CreatedAt, &u.UpdatedAt, &u.PaypalEmail, &u.IsAdmin)
				users = append(users, u)
			}
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query":       c.Request.URL.Query(),
					"resultCount": len(users),
				},
				"data": users,
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

// POST user
func POST() func(c *gin.Context) {
	return func(c *gin.Context) {
		u := &user{
			ID:        uuid.New(),
			CreatedAt: time.Now(),
			IsAdmin:   false,
		}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, u)
		tx, err := database.Db.Begin()
		if err == nil {
			tx.Exec("INSERT INTO users (id, username, first_name, last_name, email, street_address, postcode, city, country, created_at, paypal_email, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);", u.ID, u.Username, u.FirstName, u.LastName, u.Email, u.StreetAddress, u.PostCode, u.City, u.Country, u.CreatedAt, u.PaypalEmail, u.IsAdmin)
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

// PUT user
func PUT() func(c *gin.Context) {
	return func(c *gin.Context) {
		query := database.StandardizeQuery(c.Request.URL.Query())
		u := &user{
			UpdatedAt: time.Now(),
		}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, u)
		tx, err := database.Db.Begin()
		if err == nil {
			tx.Exec("UPDATE users SET first_name = $1, last_name = $2, email = $3, street_address = $4, postcode = $5, city = $6, country = $7, updated_at = $8"+query+";", u.FirstName, u.LastName, u.Email, u.StreetAddress, u.PostCode, u.City, u.Country, u.UpdatedAt)
			tx.Commit()
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query":   c.Request.URL.Query(),
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
					"query":   c.Request.URL.Query(),
					"payload": u,
				},
				"data": nil,
			})
			log.Println(err)
		}
	}
}

// DELETE user
func DELETE() func(c *gin.Context) {
	return func(c *gin.Context) {
		query := database.StandardizeQuery(c.Request.URL.Query())
		userRows, err := database.Db.Query("SELECT id, username, first_name, last_name, email, street_address, postcode, city, country, created_at, updated_at, paypal_email FROM users" + query + ";")
		defer userRows.Close()
		if err == nil {
			u := &user{}
			for userRows.Next() {
				userRows.Scan(&u.ID, &u.Username, &u.FirstName, &u.LastName, &u.Email, &u.StreetAddress, &u.PostCode, &u.City, &u.Country, &u.CreatedAt, &u.UpdatedAt, &u.PaypalEmail)
			}
			tx, _ := database.Db.Begin()
			_, err = tx.Exec("DELETE FROM users" + query + ";")
			tx.Commit()
			txn, _ := database.Db.Begin()
			txn.Exec("INSERT INTO deleted_users (id, username, first_name, last_name, email, street_address, postcode, city, country, created_at, updated_at, paypal_email, deleted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);", u.ID, u.Username, u.FirstName, u.LastName, u.Email, u.StreetAddress, u.PostCode, u.City, u.Country, u.CreatedAt, u.UpdatedAt, u.PaypalEmail, time.Now())
			txn.Commit()
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
				"data": nil,
			})
			log.Println(err)
		}
	}
}
