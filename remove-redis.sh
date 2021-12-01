#! /bin/sh

if ! [ $(id -u) = 0 ]; then
    echo "Please run as root"
    exit 1
fi

echo "Removing redis-stable.tar.gz"
rm -rf redis-stable.tar.gz
echo "Removing redis-stable"
rm -rf redis-stable
echo "Removing /usr/local/bin/redis-server"
rm -rf /usr/local/bin/redis-server
echo "Removing /usr/local/bin/redis-cli"
rm -rf /usr/local/bin/redis-cli
echo "Removing /etc/redis"
rm -rf /etc/redis
echo "Removing /var/redis"
rm -rf /var/redis
echo "Removing /etc/init.d/redis_6379"
rm -rf /etc/init.d/redis_6379
