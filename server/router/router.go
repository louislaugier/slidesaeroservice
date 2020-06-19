package router

import (
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // Postgres driver
	"github.com/louislaugier/sas/server/src/session"
	slides "github.com/louislaugier/sas/server/src/slide"
	"github.com/louislaugier/sas/server/src/user"
)

// Start the router
func Start() *gin.Engine {
	// gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.GET("/api/v1/slides", slides.GET())
	r.POST("/api/v1/slide", slides.POST())
	r.PUT("/api/v1/slide", slides.PUT())
	r.DELETE("/api/v1/slide", slides.DELETE())
	r.GET("/api/v1/slides/categories", slides.CategoriesGET())
	r.POST("/api/v1/slides/category", slides.CategoryPOST())
	r.PUT("/api/v1/slides/category", slides.CategoryPUT())
	r.DELETE("/api/v1/slides/category", slides.CategoryDELETE())

	r.GET("/api/v1/user", user.GET())
	r.POST("/api/v1/user", user.POST())
	r.PUT("/api/v1/user", user.PUT())
	r.DELETE("/api/v1/user", user.DELETE())

	r.GET("/api/v1/login", session.Login())
	r.GET("/api/v1/session", session.GET())
	r.GET("/api/v1/cart", session.CartGET())
	r.POST("/api/v1/cart", session.CartPOST())
	r.DELETE("/api/v1/cart", session.CartDELETE())

	return r
}
