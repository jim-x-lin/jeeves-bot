#! /bin/bash

BASEDIR=$(dirname "$(realpath $0)")

if ! [ $(id -u) = 0 ]; then
    echo "Please run as root"
    exit 1
fi
if ! $(grep -iq 'ubuntu.*20\.04' /etc/os-release); then
    echo "Not running on Ubuntu 20.04"
    exit 1
fi
if ! [ -f "/home/ubuntu/secrets/.env" ]; then
    echo "Missing secrets file /home/ubuntu/secrets/.env"
    exit 1
fi

echo "Copying secrets file"
cp "/home/ubuntu/secrets/.env" "${BASEDIR}/.env"
export $(grep -v '^#' "${BASEDIR}/.env" | xargs -d '\n') # get environment variables

#################
# INSTALL NODE #
#################

echo "Installing node 16"
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt-get install -y nodejs

#################
# INSTALL REDIS #
#################

echo "Compiling Redis"

apt-get install make
apt-get install gcc

wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make

echo "Copying binaries to /usr/local/bin/"
cp "src/redis-server" "/usr/local/bin/"
cp "src/redis-cli" "/usr/local/bin/"

echo "Creating configuration directory"
mkdir "/etc/redis"

echo "Creating log directory"
mkdir "/var/redis"

echo "Creating working directory"
mkdir "/var/redis/${DATA_PORT}"

echo "Creating configuration file"
cp redis.conf /etc/redis/${DATA_PORT}.conf
sed -i -e "s|^daemonize .*$|daemonize yes|" \
       -e "s|^pidfile .*$|pidfile /var/run/redis_${DATA_PORT}.pid|" \
       -e "s|^port .*$|port ${DATA_PORT}|" \
       -e "s|^loglevel .*$|loglevel notice|" \
       -e "s|^logfile .*$|logfile /var/log/redis_${DATA_PORT}.log|" \
       -e "s|^dir .*$|dir /var/redis/${DATA_PORT}|" \
       -e "s|^appendonly .*$|appendonly yes|" \
       /etc/redis/${DATA_PORT}.conf

echo "Creating initialization file"
cp utils/redis_init_script /etc/init.d/redis_${DATA_PORT}
sed -i -e "s|^REDISPORT=.*$|REDISPORT=${DATA_PORT}|" "/etc/init.d/redis_${DATA_PORT}"
update-rc.d redis_${DATA_PORT} defaults

echo "Starting redis"
sudo "/etc/init.d/redis_${DATA_PORT}" start

echo "Creating systemd service"
cp "${BASEDIR}/jeeves-bot.service" "/etc/systemd/system/jeeves-bot.service"
systemctl daemon-reload