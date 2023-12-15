#!/bin/bash
sudo amazon-linux-extras install nginx -y
if [ -d /var/www/Bbc ]; then
    rm -rf /var/www/Bbc
fi
