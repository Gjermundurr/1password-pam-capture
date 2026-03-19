#!/usr/bin/env bash

#apt install -y npm nodejs
#
#npm init -y
#
#npm install express
#npm install cors

# node server.js
#
#
# copy service file to systemd user dir
cp -f 1p-pam-capture.service ~/.config/systemd/user/

# reload, enable and restart service file
systemctl --user daemon-reload
systemctl --user enable 1p-pam-capture.service
systemctl --user restart 1p-pam-capture.service
