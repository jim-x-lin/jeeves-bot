Discord bot using the [discord.js](https://github.com/discordjs/discord.js) library.

# TODO

- [ ] (M) set up log rotation
- [ ] (M) write tests
- [ ] (L) use typescript
- [ ] (?) do something with the currency system

# Deployment on EC2

This is a minimal guide to deploy to an EC2 instance. Autmated deployments may come, one day...

## Prerequisites

- an EC2 instance running Ubuntu 20.04
- [SSH capability](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html#AccessingInstancesLinuxSSHClient)

## Get source code

1. SSH into instance
2. run `git clone https://github.com/miljinx/jeeves-bot.git` to download the code
3. Create the secrets file `.env` in the project root directory
   - see `.env.sample` for the required secrets
   - copy a secrets file from your local machine [with scp](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html#AccessingInstancesLinuxSCP)

## Install one-time dependencies

1. SSH into instance
2. `cd` into the project root directory
3. run `sudo bash node-install.sh` to install node
4. run `sudo cp jeeves-bot.service /etc/systemd/system/jeeves-bot.service` to copy the service file
   - run `sudo systemctl daemon-reload` to load the service file
5. run `sudo bash redis-install.sh` to install redis
   - it may take a while to build the binaries from source
   - if you need to retry the installation, clean up with `sudo bash redis-remove.sh`
6. run `sudo /etc/init.d/redis_6379 start` to start the redis server

## Prepare and run the bot

1. SSH into instance
2. `cd` into the project root directory
3. run `npm install --production --ignore-scripts` to install node packages
4. `cd` into the `src/scripts` directory
5. run `node deploy-commands.js` to [register commands](https://discord.com/developers/docs/interactions/application-commands#authorizing-your-application)
6. run `node update-users.js` to populate the database with member data
7. run `sudo systemctl start jeeves-bot` to run the bot as a service
8. run `systemctl status jeeves-bot` to check the status of the service

## Redeployments

1. SSH into instance
2. `cd` into the parent directory of the project root
3. run `cp jeeves-bot/deploy-jeeves-bot.sh jeeves-bot/deploy-jeeves-bot.sh` to copy the deploy script
4. run `sudo bash deploy-jeeves-bot.sh` to get the latest code, and restart the service
