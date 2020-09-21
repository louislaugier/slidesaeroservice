package user

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/louislaugier/sas/server/database"

	sendgrid "github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type user struct {
	ID            uuid.UUID `json:"id"`
	FirstName     string    `json:"first_name"`
	LastName      string    `json:"last_name"`
	Email         string    `json:"email"`
	Password      string    `json:"password"`
	StreetAddress string    `json:"street_address"`
	PostCode      string    `json:"postcode"`
	City          string    `json:"city"`
	Country       string    `json:"country"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at,omitempty"`
	IsAdmin       bool      `json:"is_admin"`
	EmailVerified bool      `json:"email_verified"`
	EmailsEnabled bool      `json:"emails_enabled"`
}

// GET users or a user
func GET() func(c *gin.Context) {
	return func(c *gin.Context) {
		queryParams := database.StandardizeQuery(c.Request.URL.Query(), "WHERE")
		userRows, err := database.Postgres.Query("SELECT id, first_name, last_name, email, password, street_address, postcode, city, country, created_at, updated_at, is_admin, email_verified FROM users" + queryParams + ";")
		defer userRows.Close()
		if err == nil {
			users := []*user{}
			for userRows.Next() {
				u := &user{}
				userRows.Scan(&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.Password, &u.StreetAddress, &u.PostCode, &u.City, &u.Country, &u.CreatedAt, &u.UpdatedAt, &u.IsAdmin, &u.EmailVerified)
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
					"query": c.Request.URL.Query(),
				},
			})
			log.Println(err)
		}
	}
}

// POST user
func POST() func(c *gin.Context) {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	return func(c *gin.Context) {
		u := &user{
			ID:        uuid.New(),
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			IsAdmin:   false,
		}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, u)
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("INSERT INTO users (id, first_name, last_name, email, password, street_address, postcode, city, country, created_at, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);", u.ID, u.FirstName, u.LastName, u.Email, u.Password, u.StreetAddress, u.PostCode, u.City, u.Country, u.CreatedAt, u.IsAdmin)
			tx.Commit()
			activationToken := uuid.New()
			d, _ := time.ParseDuration("1h")
			database.Redis.Set(database.Context, u.Email, activationToken, d)
			sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY")).Send(mail.NewSingleEmail(mail.NewEmail("SlidesAeroService", "contact@slidesaeroservice.com"), "Account activation", mail.NewEmail(u.FirstName+" "+u.LastName, u.Email), "Hi "+u.FirstName+u.LastName+", Thanks for signing up and welcome to SlidesAeroService. Please click on the link below to activate your account: Verify e-mail address", EmailHTML("verify&token=", activationToken.String(), u.FirstName, u.LastName, "Thanks for signing up and welcome to SlidesAeroService. Please click on the link below to activate your account:", "Verify e-mail address")))
			c.JSON(201, &gin.H{
				"statusCode": "201",
				"message":    "Created",
				"error":      nil,
				"meta": gin.H{
					"payload": u,
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

// PUT user
func PUT() func(c *gin.Context) {
	return func(c *gin.Context) {
		col := c.Request.URL.Query()["col"][0]
		val := c.Request.URL.Query()["val"][0]
		queryParams := database.StandardizeQuery(c.Request.URL.Query(), "WHERE")
		tx, err := database.Postgres.Begin()
		if err == nil {
			msg := "OK"
			if col == "password" {
				// if c.Request.URL.Query()["val"][0] == redis.get(email)
				op := c.Request.URL.Query()["old_pwd"][0]
				userRow, _ := database.Postgres.Query("SELECT email, password FROM users" + queryParams + ";")
				defer userRow.Close()
				u := user{}
				for userRow.Next() {
					userRow.Scan(&u.Email, &u.Password)
				}
				if op == u.Password {
					tx.Exec("UPDATE users SET password = $1, updated_at = $2"+queryParams+";", val, time.Now())
					database.Redis.Del(database.Context, u.Email)
				} else {
					msg = "Incorrect password"
				}
			} else {
				tx.Exec("UPDATE users SET "+col+" = $1, updated_at = $2"+queryParams+";", val, time.Now())
			}
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    msg,
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

// DELETE user
func DELETE() func(c *gin.Context) {
	return func(c *gin.Context) {
		queryParams := database.StandardizeQuery(c.Request.URL.Query(), "WHERE")
		userRows, err := database.Postgres.Query("SELECT id, first_name, last_name, email, password, street_address, postcode, city, country, created_at, updated_at, FROM users" + queryParams + ";")
		defer userRows.Close()
		if err == nil {
			u := &user{}
			for userRows.Next() {
				userRows.Scan(&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.Password, &u.StreetAddress, &u.PostCode, &u.City, &u.Country, &u.CreatedAt, &u.UpdatedAt)
			}
			tx, _ := database.Postgres.Begin()
			_, err = tx.Exec("DELETE FROM users" + queryParams + ";")
			tx.Commit()
			txn, _ := database.Postgres.Begin()
			txn.Exec("INSERT INTO deleted_users (id, first_name, last_name, email, street_address, postcode, city, country, created_at, updated_at, deleted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);", u.ID, u.FirstName, u.LastName, u.Email, u.StreetAddress, u.PostCode, u.City, u.Country, u.CreatedAt, u.UpdatedAt, time.Now())
			txn.Commit()
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
