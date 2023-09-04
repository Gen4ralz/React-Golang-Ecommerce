SHELL=cmd.exe
ฺBACKEND_BINARY=backendApp

## up_build: stops docker-compose (if running), builds all projects and starts docker compose
up_build: build_backend
	@echo Stopping docker images (if running...)
	docker-compose down
	@echo Building (when required) and starting docker images...
	docker-compose up --build -d
	@echo Docker images built and started!

## build_backend: builds the broker binary as a linux executable
build_backend:
	@echo Building backend binary...
	chdir .\backend && set GOOS=linux&& set GOARCH=amd64&& set CGO_ENABLED=0 && go build -o ${ฺBACKEND_BINARY} .
	@echo Done!

migrateup:
	migrate -path backend/db/migration -database "postgresql://postgres:password@localhost:5432/booking_app?sslmode=disable" -verbose up

migratedown:
	migrate -path backend/db/migration -database "postgresql://postgres:password@localhost:5432/booking_app?sslmode=disable" -verbose down

migratecreate:
	migrate create -ext sql -dir backend/db/migration -seq init_schema

.PHONY: migrateup migratedown server