#! /bin/sh

# Prerequites:
# - this script file should be in the same directory as the project folder
#   - e.g. ~/jeeves-bot, ~/deploy-jeeves-bot.sh
# - secrets directory and file in the same directory as this script,
#   - e.g. ~/secrets/.env

if ! [ $(id -u) = 0 ]; then
    echo "Please run as root"
    exit 1
fi

echo "Stopping application"
systemctl stop jeeves-bot

echo "Getting latest code"
[ -d "jeeves-bot" ] && rm -rf jeeves-bot
# only run systemd commands as root
sudo -u ubuntu git clone https://github.com/miljinx/jeeves-bot.git

echo "Copying secrets into project directory"
sudo -u ubuntu cp secrets/.env jeeves-bot/.env

echo "Setting up node"
cd jeeves-bot
# disable husky setup
sudo -u ubuntu npm set-script prepare ""
sudo -u ubuntu npm install

echo "Deploying commands"
sudo -u ubuntu npm run deploy-commands

echo "Updating database"
sudo -u ubuntu npm run update-database

echo "Starting application"
systemctl start jeeves-bot
systemctl status jeeves-bot