#! /bin/sh

# get environment variables
export $(grep -v '^#' .env | xargs -d '\n')

# https://redis.io/topics/quickstart

if ! $(grep -iq 'ubuntu\|debian' /etc/os-release); then
    echo "Not Ubuntu or Debian"
    exit 1
fi

if ! [ $(id -u) = 0 ]; then
    echo "Please run as root"
    exit 1
fi

wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make

echo "Copying to binaries to /usr/local/bin/"
cp src/redis-server /usr/local/bin/
cp src/redis-cli /usr/local/bin/

echo "Creating configuration directory"
mkdir /etc/redis

echo "Creating log directory"
mkdir /var/redis

echo "Creating working directory"
mkdir /var/redis/${DATA_PORT}

echo "Creating configuration file"
cp redis.conf /etc/redis/${DATA_PORT}.conf
sed -i -e "s|^daemonize .*$|daemonize yes|" \
       -e "s|^pid .*$|pid /var/run/redis_${DATA_PORT}.pid|" \
       -e "s|^port .*$|port ${DATA_PORT}|" \
       -e "s|^loglevel .*$|loglevel notice|" \
       -e "s|^logfile .*$|logfile /var/log/redis_${DATA_PORT}.log|" \
       -e "s|^dir .*$|dir /var/log/redis_${DATA_PORT}.log|" \
       -e "s|^appendonly .*$|appendonly yes|" \
       /etc/redis/${DATA_PORT}.conf

echo "Creating initialization file"
cp utils/redis_init_script /etc/init.d/redis_${DATA_PORT}
sed -i -e "s|^REDISPORT=.*$|REDISPORT=${DATA_PORT}|" /etc/init.d/redis_${DATA_PORT}
update-rc.d redis_${DATA_PORT} defaults

echo "Set up complete, start the redis instance with: sudo /etc/init.d/redis_6379 start"