package user

import (
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/louislaugier/sas/server/database"
	sendgrid "github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// EmailHTML returns an email HTML template
func EmailHTML(URI string, activationToken string, firstName string, lastName string, message string, buttonText string) string {
	return `<!doctype html><html><head><meta name="viewport" content="width=device-width"/><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>Confirmation e-mail</title><style>img{border: none;-ms-interpolation-mode: bicubic;max-width: 100%;}body{background-color: #f6f6f6;font-family: sans-serif;-webkit-font-smoothing: antialiased;font-size: 14px;line-height: 1.4;margin: 0;padding: 0;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}table{border-collapse: separate;mso-table-lspace: 0pt;mso-table-rspace: 0pt;width: 100%;}table td{font-family: sans-serif;font-size: 14px;vertical-align: top;}.body{background-color: #f6f6f6;width: 100%;}.container{display: block;margin: 0 auto !important;max-width: 580px;padding: 10px;width: 580px;}.content{box-sizing: border-box;display: block;margin: 0 auto;max-width: 580px;padding: 10px;}.main{background: #ffffff;border-radius: 3px;width: 100%;}.wrapper{box-sizing: border-box;padding: 20px;}.content-block{font-size:10px !important;padding-bottom: 10px;}.footer{clear: both;margin-top: 10px;text-align: center;width: 100%;}.footer td,.footer p,.footer span,.footer a{color: #999999;font-size: 12px;text-align: center;}h1,h2,h3,h4{color: #000000;font-family: sans-serif;font-weight: 400;line-height: 1.4;margin: 0;margin-bottom: 30px;}h1{font-size: 35px;font-weight: 300;text-align: center;text-transform: capitalize;}p,ul,ol{font-family: sans-serif;font-size: 14px;font-weight: normal;margin: 0;margin-bottom: 15px;}p li,ul li,ol li{list-style-position: inside;margin-left: 5px;}a{color: #3498db;text-decoration: underline;}.btn{box-sizing: border-box;width: 45%;}.btn > tbody > tr > td{padding-bottom: 15px;}.btn table{width: auto;margin: 20px 0 35px 0;}.btn table td{background-color: #ffffff;border-radius: 5px;text-align: center;}.btn a{background-color: #ffffff;border: solid 1px #3498db;border-radius: 5px;box-sizing: border-box;color: #3498db;cursor: pointer;display: inline-block;font-size: 14px;font-weight: bold;margin: 0;padding: 12px 25px;text-decoration: none;}.btn-primary table td{background-color: #3498db;}.btn-primary a{background-color: #3498db;border-color: #3498db;color: #ffffff;}.last{margin-bottom: 0;}.first{margin-top: 0;}.align-center{text-align: center;}.align-right{text-align: right;}.align-left{text-align: left;}.clear{clear: both;}.mt0{margin-top: 0;}.mb0{margin-bottom: 0;}.preheader{color: transparent;display: none;height: 0;max-height: 0;max-width: 0;opacity: 0;overflow: hidden;mso-hide: all;visibility: hidden;width: 0;}hr{border: 0;border-bottom: 1px solid #f6f6f6;margin: 20px 0;}@media only screen and (max-width: 620px){table[class=body] h1{font-size: 28px !important;margin-bottom: 10px !important;}table[class=body] p,table[class=body] ul,table[class=body] ol,table[class=body] td,table[class=body] span,table[class=body] a{font-size: 16px !important;}table[class=body] .wrapper,table[class=body] .article{padding: 10px !important;}table[class=body] .content{padding: 0 !important;}table[class=body] .container{padding: 0 !important;width: 100% !important;}table[class=body] .main{border-left-width: 0 !important;border-radius: 0 !important;border-right-width: 0 !important;}table[class=body] .btn table{width: 100% !important;}table[class=body] .btn a{width: 100% !important;}table[class=body] .img-responsive{height: auto !important;max-width: 100% !important;width: auto !important;}}@media all{.ExternalClass{width: 100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height: 100%;}.apple-link a{color: inherit !important;font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height: inherit !important;text-decoration: none !important;}#MessageViewBody a{color: inherit;text-decoration: none;font-size: inherit;font-family: inherit;font-weight: inherit;line-height: inherit;}.btn-primary table td:hover{background-color: #34495e !important;}.btn-primary a:hover{background-color: #34495e !important;border-color: #34495e !important;}}</style></head><body class=""><span class="preheader">Hi ` + firstName + ` ` + lastName + `, Thanks for signing up and welcome to SlidesAeroService. Please click on the link below to activate your account:</span><table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body"><tr><td>&nbsp;</td><td class="container"><div class="content"><table role="presentation" class="main"><tr><td class="wrapper"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td><p>Hi ` + firstName + ` ` + lastName + `,</p><p>` + message + `</p><table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary"><tbody><tr><td align="left"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td> <a href="https://slidesaeroservice.com/` + URI + activationToken + `" target="_blank">` + buttonText + `</a> </td></tr></tbody></table></td></tr></tbody></table><p>SlidesAeroService Team</p></td></tr></table></td></tr></table><div class="footer"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="content-block">You may <a href="http://i.imgur.com/CScmqnj.gif">unsubscribe</a> from this mailing list.</td></tr></table></div></div></td><td>&nbsp;</td></tr></table></body></html>`
}

// Activation after signup
func Activation() func(c *gin.Context) {
	return func(c *gin.Context) {
		verified := false
		email := c.Request.URL.Query()["email"][0]
		userRow, err := database.Postgres.Query("SELECT email, email_verified FROM users WHERE email = '" + email + "';")
		defer userRow.Close()
		if err == nil {
			email := ""
			for userRow.Next() {
				userRow.Scan(&email, &verified)
			}
			msg := "OK"
			if email != "" {
				if !verified {
					token, err := database.Redis.Get(database.Context, c.Request.URL.Query()["email"][0]).Result()
					if err != nil {
						msg = "Expired token"
					}
					if token == c.Request.URL.Query()["token"][0] {
						tx, _ := database.Postgres.Begin()
						tx.Exec("UPDATE users SET email_verified = $1, updated_at = $2 WHERE email = '"+email+"';", true, time.Now())
						tx.Commit()
						txn, _ := database.Postgres.Begin()
						txn.Exec("INSERT INTO contacts (email) VALUES ($1);", email)
						txn.Commit()
						database.Redis.Del(database.Context, email)
					}
				} else {
					msg = "User already verified"
				}
			} else {
				msg = "Non-existing user"
			}
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    msg,
				"error":      nil,
				"meta": gin.H{
					"query": c.Request.URL.Query(),
				},
				"data": "",
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

// PasswordTokenPOST sends token by email
func PasswordTokenPOST() func(c *gin.Context) {
	return func(c *gin.Context) {
		u := user{}
		email := c.Request.URL.Query()["email"][0]
		userRow, err := database.Postgres.Query("SELECT first_name, last_name, email_verified FROM users WHERE email = '" + email + "';")
		defer userRow.Close()
		if err == nil {
			msg := "OK"
			for userRow.Next() {
				userRow.Scan(&u.FirstName, &u.LastName, &u.EmailVerified)
			}
			if u.FirstName == "" {
				msg = "Unknown e-mail address"
			}
			token := ""
			if u.EmailVerified {
				d, _ := time.ParseDuration("1h")
				t := uuid.New()
				database.Redis.Set(database.Context, email, t, d)
				token = t.String()
				sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY")).Send(mail.NewSingleEmail(mail.NewEmail("SlidesAeroService", "contact@slidesaeroservice.com"), "Reset your password", mail.NewEmail(u.FirstName+" "+u.LastName, u.Email), "Plain text", EmailHTML("reset_password&token=", token, u.FirstName, u.LastName, "Message", "Reset password")))
			}
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    msg,
				"error":      nil,
				"meta": gin.H{
					"query": c.Request.URL.Query(),
				},
				"data": token,
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

// ContactDELETE to stop receiving marketing emails
func ContactDELETE() func(c *gin.Context) {
	return func(c *gin.Context) {
		email := c.Request.URL.Query()["email"][0]
		userRows, err := database.Postgres.Query("SELECT emails_enabled FROM contacts WHERE email ='" + email + "';")
		defer userRows.Close()
		if err == nil {
			msg := "OK"
			u := user{}
			for userRows.Next() {
				userRows.Scan(&u.EmailsEnabled)
			}
			if !u.EmailsEnabled {
				msg = "Already unsubscribed"
			} else if u.Email == "" {
				msg = "Unknown e-mail address"
			} else {
				txn, _ := database.Postgres.Begin()
				txn.Exec("DELETE FROM contacts WHERE email = '" + u.Email + "';")
				txn.Commit()
			}
			c.JSON(200, &gin.H{
				"statusCode": "200",
				"message":    msg,
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
