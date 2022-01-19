NPMRC_CONTENT=`cat .npmrc`

-include ../image.mk

run:
	docker run --rm -d -p 8080:8080 ${SERVICE}:${VERSION}
