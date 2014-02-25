# on Ubuntu server 13.10 64-bit

# do a general update
sudo apt-get update

# git
sudo apt-get install git
y

# libssl-dev is required for nodejs
sudo apt-get install libssl-dev
y

# nodejs and npm
sudo apt-get install nodejs npm
y

# symlink it to nodejs
sudo ln -s /usr/bin/nodejs /usr/bin/node

# forever
sudo npm install forever -g

git clone https://github.com/developmentseed/twitter-server.git
cd twitter-server
npm install
# make a directory for our api credentials
mkdir credentials


# in another session, we scp our credential files onto the server
scp -i YOUR_EC2_KEY.pem YOUR_TWITTER_CREDENTIAL USER@DOMAIN:~/twitter-server/credentials/
scp -i YOUR_EC2_KEY.pem YOUR_AMAZONS3_CREDENTIAL USER@DOMAIN:~/twitter-server/credentials/


# back in ssh, ~/twitter-server/
forever start app.js
