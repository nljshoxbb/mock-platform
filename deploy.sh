
# 获取主机ip,写入docker-compose配置，在容器中使用
IP_ADDRESS=`ip route get 1 | awk '{print $NF;exit}'`

sed -i  "s/REPLACE_EXTERNAL_IP/${IP_ADDRESS}/g" docker-compose.yml

