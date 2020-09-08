package slide

import (
	"database/sql"
	"encoding/json"
	"log"
	"math"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/louislaugier/sas/server/database"
)

// Slide export
type Slide struct {
	ID            uuid.UUID       `json:"id"`
	Title         string          `json:"title"`
	ImagePath     string          `json:"image_path"`
	IsKodak       bool            `json:"is_kodak"`
	Description   string          `json:"description"`
	Price         float64         `json:"price"`
	Stock         int             `json:"stock"`
	CategoryID    uuid.UUID       `json:"category_id"`
	SubcategoryID uuid.UUID       `json:"subcategory_id"`
	AverageRating float64         `json:"average_rating,omitempty"`
	SalesPrice    sql.NullFloat64 `json:"sales_price"`
	OnSale        bool            `json:"on_sale"`
	CreatedAt     time.Time       `json:"created_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
}

// GET slides or a slide
func GET() func(c *gin.Context) {
	return func(c *gin.Context) {
		id, ID := c.Request.URL.Query()["id"]
		query := ""
		if ID {
			query = " WHERE id = '" + id[0] + "'"
		}
		search, isSearch := c.Request.URL.Query()["search"]
		if isSearch {
			if ID {
				query = " WHERE id = '" + id[0] + "' AND title = '" + search[0] + "'"
			} else {
				query = " WHERE title = '" + search[0] + "'"
			}
		}
		q, parentcat := c.Request.URL.Query()["category_id"]
		if parentcat {
			if ID || query != "" {
				query = " AND category_id = '" + q[0] + "'"
			} else {
				query = " WHERE category_id = '" + q[0] + "'"
			}
		}
		q, subcat := c.Request.URL.Query()["subcategory_id"]
		if subcat {
			if ID || query != "" {
				query = " AND subcategory_id = '" + q[0] + "'"
			} else {
				query = " WHERE subcategory_id = '" + q[0] + "'"
			}
		}
		operator := " AND"
		if query == "" {
			operator = "WHERE"
		}
		queryParams := database.StandardizeQuery(c.Request.URL.Query(), operator)
		slideRows, err := database.Postgres.Query("SELECT id, title, image_path, is_kodak, description, price, stock, category_id, subcategory_id, sales_price, on_sale, created_at, updated_at FROM slides" + query + queryParams + ";")
		defer slideRows.Close()
		if err == nil {
			slides := []*Slide{}
			for slideRows.Next() {
				s := &Slide{}
				slideRows.Scan(&s.ID, &s.Title, &s.ImagePath, &s.IsKodak, &s.Description, &s.Price, &s.Stock, &s.CategoryID, &s.SubcategoryID, &s.SalesPrice, &s.OnSale, &s.CreatedAt, &s.UpdatedAt)
				commentRows, _ := database.Postgres.Query("SELECT rating FROM comments WHERE slide_id = '" + s.ID.String() + "';")
				defer commentRows.Close()
				ratings := []float64{}
				for commentRows.Next() {
					rating := 0.0
					commentRows.Scan(&rating)
					ratings = append(ratings, rating)
				}
				if len(ratings) > 0 {
					total := 0.0
					for _, v := range ratings {
						total += v
					}
					s.AverageRating = math.Round(total/0.01) * 0.01 / float64(len(ratings))
				}
				slides = append(slides, s)
			}
			if isSearch {
				categoryRows, _ := database.Postgres.Query("SELECT id, is_subcategory FROM categories WHERE title = '" + search[0] + "';")
				defer categoryRows.Close()
				for categoryRows.Next() {
					cg := Category{}
					categoryRows.Scan(&cg.ID, &cg.IsSubcategory)
					col := "category_id"
					if cg.IsSubcategory {
						col = "subcategory_id"
					}
					slideRows, err = database.Postgres.Query("SELECT id, title, image_path, is_kodak, description, price, stock, category_id, subcategory_id, sales_price, on_sale, created_at, updated_at FROM slides WHERE " + col + "= '" + cg.ID.String() + "';")
					defer slideRows.Close()
					for slideRows.Next() {
						s := &Slide{}
						slideRows.Scan(&s.ID, &s.Title, &s.ImagePath, &s.IsKodak, &s.Description, &s.Price, &s.Stock, &s.CategoryID, &s.SubcategoryID, &s.SalesPrice, &s.OnSale, &s.CreatedAt, &s.UpdatedAt)
						slides = append(slides, s)
					}
				}
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

// CountGET for all slides
func CountGET() func(c *gin.Context) {
	return func(c *gin.Context) {
		countRow, err := database.Postgres.Query("SELECT COUNT(id) FROM slides;")
		defer countRow.Close()
		if err == nil {
			count := 0
			for countRow.Next() {
				countRow.Scan(&count)
			}
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"resultCount": count,
				},
				"data": count,
			})
		} else {
			c.JSON(500, &gin.H{
				"statusCode": "500",
				"message":    "Internal Server Error",
				"error":      err.Error(),
			})
			log.Println(err)
		}
	}
}

// POST slide
func POST() func(c *gin.Context) {
	return func(c *gin.Context) {
		s := &Slide{
			ID:        uuid.New(),
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, s)
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("INSERT INTO slides (id, title, image_path, origin_date, description, price, stock, category_id, subcategory_id_id, sales_price, on_sale, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);", s.ID, s.Title, s.ImagePath, s.IsKodak, s.Description, s.Price, s.Stock, s.CategoryID, s.SubcategoryID, s.SalesPrice, s.OnSale, s.CreatedAt, s.UpdatedAt)
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
		queryParams := database.StandardizeQuery(c.Request.URL.Query(), "WHERE")
		s := &Slide{
			UpdatedAt: time.Now(),
		}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, s)
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("UPDATE slides SET title = $1, image_path = $2, description = $3, price = $4, stock = $5, category_id = $6, subcategory_id_id = $7, sales_price = $8, on_sale = $9, updated_at = $10, is_kodak = $11"+queryParams+";", s.Title, s.ImagePath, s.Description, s.Price, s.Stock, s.CategoryID, s.SubcategoryID, s.SalesPrice, s.OnSale, s.UpdatedAt, s.IsKodak)
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
		queryParams := database.StandardizeQuery(c.Request.URL.Query(), "WHERE")
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("DELETE FROM slides" + queryParams + ";")
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
