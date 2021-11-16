#!/bin/sh

# get environment variables
export $(grep -v '^#' .env | xargs -d '\n')

# start postgresql service and 
sudo service postgresql start
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "CREATE DATABASE ${DB_DATABASE};"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_DATABASE} TO ${DB_USER};"
