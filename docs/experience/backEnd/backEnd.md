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