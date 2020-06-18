package router

import (
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // Postgres driver
	"github.com/louislaugier/sas/server/src/slides"
	"github.com/louislaugier/sas/server/src/user"
)

// Start the router
func Start() *gin.Engine {
	// gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.GET("/api/v1/slides", slides.GET())
	r.POST("/api/v1/slides", slides.POST())
	r.PUT("/api/v1/slides", slides.PUT())
	r.DELETE("/api/v1/slides", slides.DELETE())
	r.GET("/api/v1/users", user.GET())
	r.POST("/api/v1/users", user.POST())
	return r
}
