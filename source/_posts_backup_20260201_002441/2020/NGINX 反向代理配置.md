---
title: NGINX 反向代理配置
date: 2020-04-02
---

文/年容

proxy_pass 指令加 URL 会影响到代理到上游服务器的路径，简单讲，URL 会替换匹配到的 location 路径。踩坑日记，简单记录。

```go
server {
    listen       80;
    server_name  localhost;

    location /a {
        proxy_pass http://127.0.0.1:8080;
    }

    location /b {
        proxy_pass http://127.0.0.1:8080/;
    }

    location /c {
        proxy_pass http://127.0.0.1:8080/d;
    }
}
```

```go
curl http://localhost/a/z -> {"path":"/a/z"}

curl http://localhost/b/z -> {"path":"//z"}

curl http://localhost/c/z -> {"path":"/d/z"}
```

## 参考资料

- 极客时间《Nginx核心知识100讲》陶辉