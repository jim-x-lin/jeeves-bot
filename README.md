Discord bot using the [discord.js](https://github.com/discordjs/discord.js) library.

This lightweight bot is designed to work with smaller Discord servers, and be hosted locally or on a small EC2 instance.

# Set up for Production

The installation scripts were tested on an EC2 instance running Ubuntu 20.04, the scripts may not work in other scenarios.

## Setup

1. SSH into instance
2. run `cd /home/ubuntu` to get to the home folder
3. run `git clone https://github.com/miljinx/jeeves-bot.git` to download the code
4. Create the secrets file `/home/ubuntu/secrets/.env`
   - see `.env.sample` for the required secrets
   - copy a secrets file from your local machine [with scp](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html#AccessingInstancesLinuxSCP)
5. run `cp -R jeeves-bot/setup ./setup` to copy setup files
6. run `sudo bash setup/install.sh` to install Node and Redis, and set up the systemd service
   - this script compiles Redis source code, so it may take a while to complete
7. run `sudo bash setup/deploy.sh` to install Node packages, run bot setup scripts, and start the application

## Redeployment

1. SSH into instance
2. Run the deploy script to get the latest code and restart the application
