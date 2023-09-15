BACKEND_BINARY=backendApp

## up_build: stops docker-compose (if running), builds all projects and starts docker compose
up_build: build_backend
	@echo "Stopping docker images (if running...)"
	docker-compose down
	@echo "Building (when required) and starting docker images..."
	docker-compose up --build -d
	@echo "Docker images built and started!"

## build_backend: builds the backend binary as a macOS executable
build_backend:
	@echo Building backend binary...
	cd backend && env GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o ${BACKEND_BINARY} .
	@echo Done!

mock:
	cd backend && mockgen -package mockdb -destination db/mock/store.go github.com/gen4ralz/react-golang-ecommerce/store Store

.PHONY: mock