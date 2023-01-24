# emby 流媒体管理

## 文件管理

* 文件的大概分层
   1. 首先是 bt 下载器，它容器内部的 config 配置需要挂载到容器外部 docker/qbittors/config 中
   2. nastools 管理工具，它容器内部的 config 配置需要挂载到容器外部 docker/nastools/config
   3. nastools 对于下载内容的整理和分类的设置，这里先介绍文件夹构建。/movies/Store 下存储媒体文件，有 movie、tv、animate 等，这些用于 emby 媒体库（**是 bt 下载过后经过硬连接整理的**）。/movies/Store 下是 bt 的下载文件，未经过任何处理的文件，需要 nastools 整理。
      * 所以 bt 容器的 download 文件夹应该挂载到 /movies/bt
      * 而 nastools 容器的 files 文件夹应该挂载到 /movies 整个文件夹以用于处理下载文件

![media](./emby%20流媒体管理/media.png)

## bt 设置

* 首先打开默认的网页，将语言改为中文（在设置的 webui 中）
* 设置下载的默认保存路径，由于他默认的路径是容器中的 /downloads，所以这里改为 /download
* 修改传入连接的端口，如果修改了下载的端口（默认是 6881），这里需要改为你映射后的端口

其他设置请参考: <https://post.smzdm.com/p/a3gwqd7k/>

## nastools

> nastools 用于对流媒体进行自动分类和管理

### TMDB

* 首先是 TMDB 的设置，这是最重要的。到该网站申请到它的 API：<https://www.themoviedb.org/settings/api>

![TMDB](./emby%20流媒体管理/TMDB.png)

* 如果推荐中有内容出现，就说明设置成功

### 目录设置

1. 媒体库设置
   * ![media_package](./emby%20流媒体管理/media_package.png)
2. 目录同步，bt 中下载的目录都要和媒体库目录硬连接
   * ![sync_file](./emby%20流媒体管理/sync_file.png)
3. 然后是 qb 下载器和 emby 服务器关联的设置，很简单。
   * 其中 emby 服务器有 api key，这在 api 密钥中自己创建

## emby 刮削

> 说是 emby 刮削，其实也是在 nastools 中设置

* emby 的刮削需要网络通畅，如果不通畅可以更改 nas 的 hosts 文件或者域名劫持。
  * 首先要找到 <https://api.themoviedb.org> 的域名对应的 ip，在这个网站 <https://dnschecker.org>，找到之后修改对应 hosts 的 dns
    * 18.164.124.98 api.themoviedb.org
    * 18.164.124.120 api.themoviedb.org
    * 18.164.124.75 api.themoviedb.org
    * 18.164.124.55 api.themoviedb.org
  * 然后就可以开启**刮削元数据及图片**
