

### 网站文档



* [DEMO](https://liuq.org)

* 部署方式
  * [自建](#自建)





---





#### 自建



一、克隆代码

```shell
git clone "https://github.com/2020qiang/docs-web.git" /opt/www
```



二、修改项目配置文件

```shell
vi /opt/www/webapp/config.json
```



三、nginx配置

```nginx
server {
    listen 80;
    root   /opt/www;
    index  webapp/index.html;
    location / {
        if (!-e $request_filename) {
            rewrite ^(.*)$ /webapp/index.html last;
            break;
        }
    }
}
```

