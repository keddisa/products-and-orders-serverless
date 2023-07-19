build:
	cd ./layers/dbUtil && tsc \
	&& cd ../mainHelpersUtil && tsc \
	&& cd ../.. && sam build

deploy:
	sam deploy --resolve-s3