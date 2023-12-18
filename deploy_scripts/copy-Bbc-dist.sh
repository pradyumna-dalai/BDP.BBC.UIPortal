#!/bin/bash
BASE_PATH=/var/www/Bbc
sudo mkdir -p ${BASE_PATH}
SOURCE_PATH=/home/ec2-user/Bbc
USER=ec2-user
GROUP=ec2-user
##ENV=$DEPLOYMENT_GROUP_NAME 
ENV=dev
checkStatus() {
  if [ $? -eq 0 ]; then
    echo "[info] '$moduleName' done"
  else
    echo "[warn] '$moduleName' failed" && exit 1
  fi
}
copySource() {
if [ -d "$BASE_PATH" ]; then
        echo "[info] copy dist dir to dist folder"
        sudo cp -avr $SOURCE_PATH/dist/poseidon-ng/* $BASE_PATH/
        sudo chown $USER:$GROUP $BASE_PATH -R
                if [ $? -eq 0 ]; then
                        echo "[info] latest version update succeed"
                else
                        echo "[error] latest version update failed"
                        exit
                fi
else
        sudo cp -avr $SOURCE_PATH/dist/poseidon-ng/* $BASE_PATH/
        sudo chown $USER:$GROUP $BASE_PATH -R
                if [ $? -eq 0 ]; then
                        echo "[info] latest version update succeed"
                else
                        echo "[error] latest version update failed"
                        exit
                fi
fi
}
updateNginxVhosts() {
  moduleName=$1
      echo "[info] '$moduleName' initiated..."
      pwd
      sudo cp -v $SOURCE_PATH/deploy_config/bdp_Bbc_$ENV.conf /etc/nginx/conf.d/bdp_Bbc_$ENV.conf
      #sudo ln -sf /etc/nginx/sites-available/bdp_qlik_$ENV.conf /etc/nginx/sites-enabled/bdp_qlik_$ENV.conf
      checkStatus
}
reloadNginx() {
  moduleName=$1
  sudo chown -R $USER:$GROUP $BASE_PATH
  sudo chmod -R 755 $BASE_PATH
  echo "[info] '$moduleName' initiated..."
  sudo service nginx status
  if [ $? -eq 0 ]; then
    sudo nginx -t
    if [ $? -eq 0 ]; then
      sudo service nginx reload && echo "[info] nginx reload succeed"
    else
      echo "[warn] nginx syntax check failed" && exit 1
    fi
  else
    sudo nginx -t
    if [ $? -eq 0 ]; then
      sudo service nginx restart && echo "[info] nginx restart succeed"
    else
      echo "[warn] nginx service is not running & nginx syntax check failed" && exit 1
    fi
  fi
}
##After install steps
copySource "copy dist file to $BASE_PATH"
updateNginxVhosts "bdp_Bbc_$ENV.conf update"
reloadNginx "restart nginx service"
