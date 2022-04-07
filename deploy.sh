
# 获取主机ip,写入docker-compose配置，在容器中使用
IP_ADDRESS=`ifconfig en0 | grep inet | grep -v inet6 | awk '{print $2}'`

sed -i "" "s/REPLACE_EXTERNAL_IP/${IP_ADDRESS}/g" .env

