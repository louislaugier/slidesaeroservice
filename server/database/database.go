package database

import (
	"context"
	"database/sql"
	"net/url"
	"strings"

	"github.com/go-redis/redis"
	_ "github.com/lib/pq" // Postgres driver
)

// Postgres is a SQL database pointer, Redis is a Redis client pointer
var Postgres, Redis = connect()

// Context for Redis
var Context = context.Background()

func connect() (*sql.DB, *redis.Client) {
	db, _ := sql.Open("postgres", "postgres://postgres:postgres@127.0.0.1:5432/sas?sslmode=disable")
	err := db.Ping()
	if err != nil {
		panic(err)
	}
	rd := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
	})
	_, err = rd.Ping(Context).Result()
	if err != nil {
		panic(err)
	}
	return db, rd
}

// StandardizeQuery from HTTP to SQL
func StandardizeQuery(query url.Values, operator string) string {
	ID := ""
	orderBy := ""
	order := ""
	limit := ""
	offset := ""
	if _, i := query["id"]; i {
		orderBy = operator + " id='" + query["id"][0] + "' "
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
