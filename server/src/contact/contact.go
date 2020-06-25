package contact

import (
	"encoding/json"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type message struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Subject   string `json:"subject,omitempty"`
	Content   string `json:"content"`
}

// POST message
func POST() func(c *gin.Context) {
	return func(c *gin.Context) {
		m := &message{}
		payload, _ := c.GetRawData()
		json.Unmarshal(payload, m)
		fromAndTo := &mail.Email{
			Name:    "SlidesAeroService",
			Address: "contact@slidesaeroservice.com",
		}
		_, err := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY")).Send(mail.NewSingleEmail(mail.NewEmail(fromAndTo.Name, "contact@slidesaeroservice.com"), "Message from contact form", mail.NewEmail(fromAndTo.Name, "contact@slidesaeroservice.com"), m.FirstName+" "+m.LastName+" ("+m.Email+") has contacted you through SlidesAeroService contact form with subject \""+m.Subject+"\". "+m.Content, "<p>"+m.FirstName+" "+m.LastName+" ("+m.Email+") has contacted you through SlidesAeroService contact form with subject <b>\""+m.Subject+"\"</b>.</p><br><hr><br><p>"+m.Content+"</p>"))
		if err == nil {
			c.JSON(201, &gin.H{
				"statusCode": "201",
				"message":    "Created",
				"error":      nil,
				"meta": gin.H{
					"payload": m,
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
