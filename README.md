Discord bot using the [discord.js](https://github.com/discordjs/discord.js) library.

# TODO

- [ ] (M) set up log rotation
- [ ] (M) write tests
- [ ] (S) use pm2 to run the application
- [ ] (M) extract business logic from event listener files
- [ ] (S) prune command to remove inactive members
- [ ] (L) use typescript
- [ ] (?) do something with the currency system

# Deployment on EC2

This is a minimal guide to deploy to an EC2 instance. Autmated deployments may come, one day...

## Prerequisites

- an EC2 instance running Ubuntu 20.04
- [SSH capability](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html#AccessingInstancesLinuxSSHClient)

## Get source code

Necessary between deployments.

1. SSH into instance
2. run `git clone https://github.com/miljinx/jeeves-bot.git` to download the code
3. Create the secrets file `.env` in the project root directory
   - see `.env.sample` for the required secrets
   - copy a secrets file from your local machine [with scp](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html#AccessingInstancesLinuxSCP)

## Install one-time dependencies

Not necessary between deployments.

1. SSH into instance
2. run `export NODE_ENV=production` to let the bot know it is in production
3. `cd` into the project root directory
4. run `sudo bash node-install.sh` to install node
5. run `sudo bash redis-install.sh` to install redis
   - it may take a while to build the binaries from source
   - if you need to retry the installation, clean up with `sudo bash redis-remove.sh`
6. run `sudo /etc/init.d/redis_6379 start` to start the redis server

## Prepare and run the bot

Necessary between deployments.

1. SSH into instance
2. run `npm install --production --ignore-scripts` to install node packages
3. `cd` into the `src/scripts` directory
4. run `node deploy-commands.js` to [register commands](https://discord.com/developers/docs/interactions/application-commands#authorizing-your-application)
5. run `node update-users.js` to populate the database with member data
6. `cd` into the `src` directory
7. run `node index.js` to run the bot

- when re-deploying, stop the bot with `ctrl-c` and delete the old code with `rm -rf jeeves-bot`
