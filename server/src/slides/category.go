package slides

import "github.com/gin-gonic/gin"

type category struct {
	ID             int    `json:"id"`
	Title          string `json:"title"`
	IsSubcategory  bool   `json:"is_subcategory"`
	ParentCategory string `json:"parent_category"`
	SlidesCount    int    `json:"slides_count"`
}

// CategoriesGET for slides
func CategoriesGET() func(c *gin.Context) {
	return func(c *gin.Context) {
	}
}
