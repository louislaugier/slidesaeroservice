package database

import (
	"context"
	"database/sql"
	"net/url"
	"os"
	"strings"

	"github.com/go-redis/redis"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // Postgres driver
)

// Context for Redis
var Context = context.Background()

// Postgres is a SQL database pointer, Redis is a Redis client pointer
var Postgres, Redis = connect()

func connect() (*sql.DB, *redis.Client) {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	db, _ := sql.Open("postgres", "postgres://postgres:"+os.Getenv("DB_PASSWORD")+"@"+os.Getenv("DB_HOST")+":5432/"+os.Getenv("DB_NAME")+"?sslmode=disable")
	err := db.Ping()
	if err != nil {
		panic(err)
	}
	rd := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: os.Getenv("REDIS_PASSWORD"),
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
