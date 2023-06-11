gen: gen-openapi

gen-openapi:
	docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
		-i /local/docs/swagger.yaml \
		-g go \
		-o /local/gen/api \
		--additional-properties=generateInterfaces=true \
		--additional-properties=isGoSubmodule=true \
		--additional-properties=packageName=api