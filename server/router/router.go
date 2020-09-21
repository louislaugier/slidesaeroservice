package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // Postgres driver
	"github.com/louislaugier/sas/server/src/contact"
	"github.com/louislaugier/sas/server/src/session"
	"github.com/louislaugier/sas/server/src/slide"
	"github.com/louislaugier/sas/server/src/user"
)

// Start the router
func Start() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		ExposeHeaders:    []string{"Content-Type", "Date"},
		AllowCredentials: true,
		// AllowOriginFunc: func(origin string) bool {
		// 	return origin == "http://localhost:3000"
		// },
		AllowAllOrigins: true,
	}))

	r.GET("/api/v1/slides", slide.GET())
	r.GET("/api/v1/slides/count", slide.CountGET())
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
	r.POST("/api/v1/user/reset-password", user.PasswordTokenPOST())
	r.DELETE("/api/v1/user/emails-unsubscribe", user.ContactDELETE())

	r.GET("/api/v1/login", session.TokenGET())
	r.GET("/api/v1/session", session.GET())
	r.DELETE("/api/v1/session", session.DELETE())
	r.GET("/api/v1/cart", session.CartGET())
	r.POST("/api/v1/cart", session.CartPOST())
	r.DELETE("/api/v1/cart", session.CartDELETE())

	r.POST("/api/v1/contact", contact.POST())

	return r
}
