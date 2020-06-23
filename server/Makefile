dev:
	cd .. && docker-compose up -d
	air .

stop:
	docker-compose stop

recompose:
	cd .. && make stop && docker-compose down && docker-compose build --no-cache &&	docker-compose up -d --force-recreate

build:
	rm -r app && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o app . && docker build . -t louisl98/sas

publish:
	docker push louisl98/sas

test-prod:
	docker run -it louisl98/sas

# if c not defined, default commit is 'update'
c ?= update
git:
	cd .. && git add . && git commit -m '$c' && git push origin master