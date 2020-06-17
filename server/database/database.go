package database

import (
	"database/sql"
	"log"

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
