## macOS 上如何安装python包管理器pip[python/pip]
打开终端，输入以下命令：
```
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
```
等待安装完毕，然后输入以下命令：
```
python3 get-pip.py
```
等待下载完毕即可

可以用下面的命令在项目中来安装依赖
```
pip install -r requirements.txt
```
## Python Flask 如何开启跨域[python/flask]
首先安装依赖
```js
pip install flask-cors
```
```js
from flask_cors import CORS
from flask import Flask
app = Flask(__name__)
CORS(app, supports_credentials=True,resources=r'/*')

if __name__ == '__main__':
    app.run()
```