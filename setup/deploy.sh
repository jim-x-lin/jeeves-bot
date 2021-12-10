#! /bin/bash

BASEDIR=$(dirname "$(realpath $0)")

if ! [ ${BASEDIR} ==  ]; then
    echo "Missing secrets file /home/ubuntu/secrets/.env"
    exit 1
fi
if ! [ $(id -u) = 0 ]; then
    echo "Please run as root"
    exit 1
fi
if ! [ -f "/home/ubuntu/secrets/.env" ]; then
    echo "Missing secrets file /home/ubuntu/secrets/.env"
    exit 1
fi

export NODE_ENV=production

echo "Stopping application"
systemctl stop jeeves-bot

echo "Getting latest code"
[ -d "/home/ubuntu/jeeves-bot" ] && rm -rf "/home/ubuntu/jeeves-bot"
# do not run git as root
sudo -u ubuntu git clone https://github.com/miljinx/jeeves-bot.git

echo "Copying secrets into project directory"
sudo -u ubuntu cp "/home/ubuntu/secrets/.env" "/home/ubuntu/jeeves-bot/.env"

echo "Setting up node"
cd jeeves-bot
# do not run npm as root
sudo -u ubuntu npm set-script prepare "" # disable dev script
sudo -u ubuntu npm install

echo "Deploying commands"
sudo -u ubuntu npm run deploy-commands

echo "Updating database"
sudo -u ubuntu npm run update-database

echo "Starting application"
systemctl start jeeves-bot
systemctl status jeeves-bot