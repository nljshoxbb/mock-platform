
cd client

yarn && yarn build

# cd ..

cd ..

tar --exclude=./client/node_modules --exclude=./node_modules zcf mock-platform-web.tar.gz *

# docker-compose down

# # 获取主机ip,写入docker-compose配置，在容器中使用
# IP_ADDRESS=`ifconfig en0 | grep inet | grep -v inet6 | awk '{print $2}'`

# echo "s/REPLACE_EXTERNAL_IP/${IP_ADDRESS}/g"

# sed -i "" "s/REPLACE_EXTERNAL_IP/${IP_ADDRESS}/g" .env


# docker-compose up -d --build