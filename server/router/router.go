package router

import (
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // Postgres driver
	"github.com/louislaugier/sas/server/src/session"
	slide "github.com/louislaugier/sas/server/src/slide"
	"github.com/louislaugier/sas/server/src/user"
)

// Start the router
func Start() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.GET("/api/v1/slides", slide.GET())
	r.POST("/api/v1/slide", slide.POST())
	r.PUT("/api/v1/slide", slide.PUT())
	r.DELETE("/api/v1/slide", slide.DELETE())
	r.GET("/api/v1/slides/categories", slide.CategoriesGET())
	r.POST("/api/v1/slides/category", slide.CategoryPOST())
	r.PUT("/api/v1/slides/category", slide.CategoryPUT())
	r.DELETE("/api/v1/slides/category", slide.CategoryDELETE())

	r.GET("/api/v1/users", user.GET())
	r.POST("/api/v1/user", user.POST())
	r.PUT("/api/v1/user", user.PUT())
	r.DELETE("/api/v1/user", user.DELETE())
	r.PUT("/api/v1/user/activate", user.Activation())
	r.POST("/api/v1/user/reset-password", user.PasswordReset())

	r.GET("/api/v1/login", session.TokenGET())
	r.GET("/api/v1/session", session.GET())
	r.GET("/api/v1/cart", session.CartGET())
	r.POST("/api/v1/cart", session.CartPOST())
	r.DELETE("/api/v1/cart", session.CartDELETE())

	return r
}
