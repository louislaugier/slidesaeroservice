package search

import (
	"log"
	"reflect"

	"github.com/gin-gonic/gin"
	"github.com/louislaugier/sas/server/database"
	"github.com/louislaugier/sas/server/src/slide"
)

// GET search results
func GET() func(c *gin.Context) {
	return func(c *gin.Context) {
		slideRows, err := database.Postgres.Query("SELECT id FROM slides WHERE title ='" + c.Request.URL.Query()["query"][0] + "';")
		categoryRows, err := database.Postgres.Query("SELECT id FROM categories WHERE title ='" + c.Request.URL.Query()["query"][0] + "';")
		defer slideRows.Close()
		defer categoryRows.Close()
		if err == nil {
			results := [][]*interface{}{}
			slides := []*slide.Slide{}
			for slideRows.Next() {
				s := &slide.Slide{}
				slideRows.Scan(s)
				slides = append(slides, s)
			}
			categories := []*slide.Category{}
			for categoryRows.Next() {
				c := &slide.Category{}
				slideRows.Scan(c)
				categories = append(categories, c)
			}
			results = append(results, reflect.ValueOf(slides).Interface().([]*interface{}))
			results = append(results, reflect.ValueOf(categories).Interface().([]*interface{}))
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    "OK",
				"error":      nil,
				"meta": gin.H{
					"query":        c.Request.URL.Query(),
					"result_count": len(slides) + len(categories),
				},
				"data": results,
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
