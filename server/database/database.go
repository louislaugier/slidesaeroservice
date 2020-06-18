package database

import (
	"database/sql"
	"log"
	"net/url"
	"strings"

	_ "github.com/lib/pq" // Postgres driver
)

// Db is a SQL database pointer
var Db = connect()

func connect() *sql.DB {
	db, _ := sql.Open("postgres", "postgres://postgres:postgres@127.0.0.1:5432/sas?sslmode=disable")
	err := db.Ping()
	if err != nil {
		log.Fatal("Can't connect to database.")
	}
	return db
}

// StandardizeQuery from HTTP to SQL
func StandardizeQuery(query url.Values) string {
	ID := ""
	orderBy := ""
	order := ""
	limit := ""
	offset := ""
	if _, i := query["id"]; i {
		orderBy = "WHERE id='" + query["id"][0] + "' "
	}
	if _, i := query["orderby"]; i {
		orderBy = "ORDER BY " + query["orderby"][0] + " "
	}
	if _, i := query["order"]; i {
		order = query["order"][0] + " "
	}
	if _, i := query["limit"]; i {
		limit = "LIMIT " + query["limit"][0] + " "
	}
	if _, i := query["offset"]; i {
		offset = "OFFSET " + query["offset"][0] + " "
	}
	return strings.TrimSuffix(" "+ID+orderBy+order+limit+offset, " ")
}
