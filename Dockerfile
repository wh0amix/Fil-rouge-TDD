# Create MySQL Image with automatic migrations
FROM mysql:9.2

COPY ./sqlfiles /docker-entrypoint-initdb.d

EXPOSE 3306
