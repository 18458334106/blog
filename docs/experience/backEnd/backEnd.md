## Python Flask使用蓝图[python/flask/blueprint]
使用示例：

user.py
```python
from utils.sql import supabase
from flask import Blueprint,request, session
from utils.entity import r
user_bp = Blueprint('user', __name__, url_prefix='/user')
 
"""----------------------------------------
                API: 用户登录
-------------------------------------------"""
@user_bp.route('/login', methods=['POST'])
def user_login():
    reqJSONData = request.get_json(silent=True)
 
    if not reqJSONData: return r(code=401, msg='注册失败, 请求参数为空')
    username = reqJSONData.get('username')
    password = reqJSONData.get('password')
 
    if not all([username, password]):
        return r(code=401, msg='登录, 缺少请求参数')
 
    user = supabase.table('sys_user').select('*').eq('username',username).eq('password',password).execute().data
    # 4. 用户不存在, 直接返回
    if not user:
        return r(code=404, msg='用户名或密码错误')
    else:
        session['user_info'] = user
        return r(msg='登录成功', data=user)
 
@user_bp.route('/list', methods=['POST','get'])
def userList():
    user = supabase.table('sys_user').select('*').execute().data
    return user
```
main.py
```python
from flask import Flask
from flask_cors import CORS
from utils.entity import r
 
from api.user.user import user_bp
# 创建 Flask 实例
app = Flask(__name__)
app.register_blueprint(user_bp)
 
CORS(app, supports_credentials=True,resources=r'/*')
 
@app.route('/', methods=['GET'])
def hello():
    return r(code=200, msg='服务器访问成功!')
 
if __name__ == '__main__':
    app.run()
```
总结：
    1.在单文件中创建蓝图：user_bp = Blueprint('user', __name__, url_prefix='/user')
    2.在主文件中注册蓝图：app.register_blueprint(user_bp)

注意：
    1.主文件中需要引入一下创建的蓝图
    2.在app.run之前注册蓝图
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