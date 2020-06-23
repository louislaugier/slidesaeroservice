package main

import (
	"github.com/joho/godotenv"
	"github.com/louislaugier/sas/server/router"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
	router.Start().Run()
}
