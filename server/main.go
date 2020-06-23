package main

import (
	"github.com/joho/godotenv"
	"github.com/louislaugier/sas/server/router"
)

func main() {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}
	router.Start().Run()
}
