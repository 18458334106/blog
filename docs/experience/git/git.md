## git因网络问题报错【已失效】
1.Failed to connect to github.com port 443 after 21051 ms: Couldn't connect to server

2.Recv failure: Connection was reset
你是否最近也有遇到这种情况呢？

公司项目目前保存在github上,

在 git pull 和 git push 的时候总是遇到以上情况

也是困扰了我不少时日  查阅了不少资料   终于有了解决方案：

首先，需要在 Windows 网络设置中设置代理

如图：
```js
https://img-blog.csdnimg.cn/849dc6d8127a41159a79cd1431a4cc87.png

https://img-blog.csdnimg.cn/52a83d42057f44a4b62eb30e78220a6e.png
```

点开编辑，把上面的使用代理服务器开关打开点击保存 
```js
https://img-blog.csdnimg.cn/5fd4298d935e4f929609ba701abceac8.png
```

在任意文件夹中右键  选择  git  Bash  here，然后分别执行以下命令：

```js
git config --global http.proxy http://127.0.0.1:7890
git config --global http.proxy https://127.0.0.1:7890
```
完成后，试一下能否  git push  和  git  pull

如果还是不行，再翻个墙，本人就是以上设置 + 翻墙 
## git方法整理[git]
git init  初始化git

git clone 地址  克隆项目

git add . 

git commit -m '这里写内容'

git push -u origin 分支名

git branch 查看分支【包括本地分支】

git branch -D 分支名 删除分支

git checkout 分支名      切换分支，若没有分支会创建直接切换到此分支下