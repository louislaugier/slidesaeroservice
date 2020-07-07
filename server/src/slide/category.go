package slide

import (
	"encoding/json"
	"log"

	"github.com/bradfitz/slice"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/louislaugier/sas/server/database"
)

// Category export
type Category struct {
	ID               uuid.UUID `json:"id"`
	Title            string    `json:"title"`
	IsSubcategory    bool      `json:"is_subcategory"`
	ParentCategoryID uuid.UUID `json:"parent_category_id,omitempty"`
	SlidesCount      int       `json:"slides_count"`
}

// CategoriesGET for slides
func CategoriesGET() func(c *gin.Context) {
	return func(c *gin.Context) {
		_, ID := c.Request.URL.Query()["id"]
		query := ""
		q, subcat := c.Request.URL.Query()["is_subcategory"]
		if subcat {
			if ID {
				query = " AND is_subcategory = '" + q[0] + "'"
			} else {
				query = " WHERE is_subcategory = '" + q[0] + "'"
			}
		}
		q, parentcat := c.Request.URL.Query()["parent_category_id"]
		if parentcat {
			if ID {
				query = " parent_category_id = '" + q[0] + "'"
			} else {
				query = " WHERE parent_category_id = '" + q[0] + "'"
			}
		}
		operator := " AND"
		if query == "" {
			operator = "WHERE"
		}
		queryParams := database.StandardizeQuery(c.Request.URL.Query(), operator)
		categoryRows, err := database.Postgres.Query("SELECT id, title, is_subcategory, parent_category_id FROM categories" + query + queryParams + ";")
		defer categoryRows.Close()
		if err == nil {
			categories := []*Category{}
			for categoryRows.Next() {
				cg := &Category{}
				categoryRows.Scan(&cg.ID, &cg.Title, &cg.IsSubcategory, &cg.ParentCategoryID)
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
			slice.Sort(categories[:], func(i, j int) bool {
				return categories[i].SlidesCount > categories[j].SlidesCount
			})
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
		cg := &Category{
			ID: uuid.New(),
		}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, c)
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("INSERT INTO categories (id, title, is_subcategory, parent_category_id) VALUES ($1, $2, $3, $4);", cg.ID, cg.Title, cg.IsSubcategory, cg.ParentCategoryID)
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
		queryParams := database.StandardizeQuery(c.Request.URL.Query(), "WHERE")
		cg := &Category{}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, cg)
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("UPDATE categories SET id = $1, title = $2, is_subcategory = $3, parent_category_id = $4"+queryParams+";", cg.ID, cg.Title, cg.IsSubcategory, cg.ParentCategoryID)
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
		queryParams := database.StandardizeQuery(c.Request.URL.Query(), "WHERE")
		tx, err := database.Postgres.Begin()
		if err == nil {
			tx.Exec("DELETE FROM categories" + queryParams + ";")
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
