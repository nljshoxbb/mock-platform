FROM nginx:alpine

# 拷贝 nginx 全局配置文
COPY nginx.conf /etc/nginx/

# apk 国内源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/' /etc/apk/repositories

# 安装 nginx
RUN apk update \
    && apk upgrade \
    && apk add --no-cache openssl \
    && apk add --no-cache bash

# 启动 nginx
CMD nginx

# 暴露 80 端口和 443 端口给容器外部
EXPOSE 80 443