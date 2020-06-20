package slides

import (
	"encoding/json"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/louislaugier/sas/server/database"
)

type category struct {
	ID             uuid.UUID `json:"id"`
	Title          string    `json:"title"`
	IsSubcategory  bool      `json:"is_subcategory"`
	ParentCategory string    `json:"parent_category,omitempty"`
	SlidesCount    int       `json:"slides_count"`
}

// CategoriesGET for slides
func CategoriesGET() func(c *gin.Context) {
	return func(c *gin.Context) {
		query := database.StandardizeQuery(c.Request.URL.Query())
		categoryRows, err := database.Postgres.Query("SELECT id, title, is_subcategory, parent_category FROM categories" + query + ";")
		defer categoryRows.Close()
		if err == nil {
			categories := []*category{}
			for categoryRows.Next() {
				cg := &category{}
				categoryRows.Scan(&cg.ID, &cg.Title, &cg.IsSubcategory, &cg.ParentCategory)
				col := ""
				if cg.IsSubcategory {
					col = "subcategory_id"
				} else {
					col = "category_id"
				}
				slideRowsCount, _ := database.Postgres.Query("SELECT COUNT(*) FROM slides WHERE " + col + " = '" + cg.ID.String() + "';")
				defer slideRowsCount.Close()
				for slideRowsCount.Next() {
					slideRowsCount.Scan(&cg.SlidesCount)
				}
				categories = append(categories, cg)
			}
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query":        c.Request.URL.Query(),
					"result_count": len(categories),
				},
				"data": categories,
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

// CategoryPOST for slides
func CategoryPOST() func(c *gin.Context) {
	return func(c *gin.Context) {
		cg := &category{
			ID: uuid.New(),
		}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, c)
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("INSERT INTO categories (id, title, is_subcategory, parent_category) VALUES ($1, $2, $3, $4);", cg.ID, cg.Title, cg.IsSubcategory, cg.ParentCategory)
			tx.Commit()
			c.JSON(201, &gin.H{
				"statusCode": "201",
				"message":    "Created",
				"error":      nil,
				"meta": gin.H{
					"payload": cg,
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

// CategoryPUT for slides
func CategoryPUT() func(c *gin.Context) {
	return func(c *gin.Context) {
		query := database.StandardizeQuery(c.Request.URL.Query())
		cg := &category{}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, cg)
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("UPDATE categories SET id = $1, title = $2, is_subcategory = $3, parent_category = $4"+query+";", cg.ID, cg.Title, cg.IsSubcategory, cg.ParentCategory)
			tx.Commit()
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query":   c.Request.URL.Query(),
					"payload": cg,
				},
			})
		} else {
			c.JSON(500, &gin.H{
				"statusCode": "500",
				"message":    "Internal Server Error",
				"error":      err.Error(),
				"meta": gin.H{
					"query":   c.Request.URL.Query(),
					"payload": cg,
				},
			})
			log.Println(err)
		}
	}
}

// CategoryDELETE for slides
func CategoryDELETE() func(c *gin.Context) {
	return func(c *gin.Context) {
		query := database.StandardizeQuery(c.Request.URL.Query())
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("DELETE FROM categories" + query + ";")
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
