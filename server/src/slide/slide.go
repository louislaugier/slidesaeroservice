package slides

import (
	"encoding/json"
	"log"
	"math"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/louislaugier/sas/server/database"
)

type slide struct {
	ID            uuid.UUID `json:"id"`
	Title         string    `json:"title"`
	ImagePath     string    `json:"image_path"`
	PublishDate   time.Time `json:"publish_date,omitempty"`
	Description   string    `json:"description"`
	Price         float64   `json:"price"`
	Stock         int       `json:"stock"`
	Category      string    `json:"category"`
	Subcategory   string    `json:"subcategory"`
	AverageRating float64   `json:"average_rating,omitempty"`
	SalesPrice    float64   `json:"sales_price,omitempty"`
	OnSale        bool      `json:"on_sale"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// GET slides or a slide
func GET() func(c *gin.Context) {
	return func(c *gin.Context) {
		query := database.StandardizeQuery(c.Request.URL.Query())
		slideRows, err := database.Postgres.Query("SELECT id, title, image_path, publish_date, description, price, stock, category_id, subcategory_id, sales_price, on_sale, created_at, updated_at FROM slides" + query + ";")
		defer slideRows.Close()
		if err == nil {
			slides := []*slide{}
			for slideRows.Next() {
				s := &slide{}
				slideRows.Scan(&s.ID, &s.Title, &s.ImagePath, &s.PublishDate, &s.Description, &s.Price, &s.Stock, &s.Category, &s.Subcategory, &s.SalesPrice, &s.OnSale, &s.CreatedAt, &s.UpdatedAt)
				commentRows, _ := database.Postgres.Query("SELECT rating WHERE slide_id='" + s.ID.String() + "';")
				defer commentRows.Close()
				ratings := []float64{}
				for commentRows.Next() {
					rating := 0.00
					commentRows.Scan(rating)
					ratings = append(ratings, rating)
				}
				if ratings != nil {
					total := 0.0
					for _, v := range ratings {
						total += v
					}
					s.AverageRating = math.Round(total/0.01) * 0.01 / float64(len(ratings))
				}
				slides = append(slides, s)
			}
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query":       c.Request.URL.Query(),
					"resultCount": len(slides),
				},
				"data": slides,
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

// POST slide
func POST() func(c *gin.Context) {
	return func(c *gin.Context) {
		s := &slide{
			ID:        uuid.New(),
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, s)
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("INSERT INTO slides (id, title, image_path, publish_date, description, price, stock, category_id, subcategory_id, sales_price, on_sale, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);", s.ID, s.Title, s.ImagePath, s.PublishDate, s.Description, s.Price, s.Stock, s.Category, s.Subcategory, s.SalesPrice, s.OnSale, s.CreatedAt, s.UpdatedAt)
			tx.Commit()
			c.JSON(201, &gin.H{
				"statusCode": "201",
				"message":    "Created",
				"error":      nil,
				"meta": gin.H{
					"payload": s,
				},
			})
		} else {
			c.JSON(500, &gin.H{
				"statusCode": "500",
				"message":    "Internal Server Error",
				"error":      err.Error(),
				"meta": gin.H{
					"payload": s,
				},
			})
			log.Println(err)
		}
	}
}

// PUT slide
func PUT() func(c *gin.Context) {
	return func(c *gin.Context) {
		query := database.StandardizeQuery(c.Request.URL.Query())
		s := &slide{
			UpdatedAt: time.Now(),
		}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, s)
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("UPDATE slides SET title = $1, image_path = $2, publish_date = $3, description = $4, price = $5, stock = $6, category_id = $7, subcategory_id = $8, sales_price = $9, on_sale = $10, updated_at = $11"+query+";", s.Title, s.ImagePath, s.PublishDate, s.Description, s.Price, s.Stock, s.Category, s.Subcategory, s.SalesPrice, s.OnSale, s.UpdatedAt)
			tx.Commit()
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query":   c.Request.URL.Query(),
					"payload": s,
				},
			})
		} else {
			c.JSON(500, &gin.H{
				"statusCode": "500",
				"message":    "Internal Server Error",
				"error":      err.Error(),
				"meta": gin.H{
					"query":   c.Request.URL.Query(),
					"payload": s,
				},
			})
			log.Println(err)
		}
	}
}

// DELETE slide
func DELETE() func(c *gin.Context) {
	return func(c *gin.Context) {
		query := database.StandardizeQuery(c.Request.URL.Query())
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("DELETE FROM slides" + query + ";")
			tx.Commit()
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
