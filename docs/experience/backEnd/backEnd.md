## Python Flask flasgger api文档[python/flask/flasgger]
首先需要安装依赖：
```python
pip install flasgger
```
封装swagger.py文件，代码如下：
```python
from flasgger import Swagger
swagger = Swagger()
```
然后在主应用中（项目入口文件）加入以下代码：
```python
from flask import Flask 
from swagger import Swagger #导入封装好的swagger.py文件中的Swagger对象
# 创建 Flask 实例
app = Flask(__name__)
Swagger(app) 
```
然后在user.py文件中加入以下代码：
```python
#举例
@user_bp.route('/info', methods=['GET'])
def user_info():
    """获取用户信息
        ---
        parameters:
          - name: Authorization
            in: header
            required: true
            description: 用户token
            type: string
        responses:
          200:
            description: 成功
            schema:
              properties:
                code:
                  type: integer
                msg:
                  type: string
                data:
                  type: object
          401:
            description: 失败
        """
    userInfo = get_jwt_identity()
    if not userInfo:
        return r(msg='暂未登录')
    else:
        return r(msg='',data=userInfo)
```
## Python Flask swagger自动生成文档（插件存在版本兼容问题，部署会出问题！不推荐）[python/flask/flask_siwadoc/pydantic]
首先安装依赖：
```python
pip install flask_siwadoc pydantic
```
封装swagger.py文件，代码如下：
```
from flask_siwadoc import SiwaDoc
siwa = SiwaDoc()
```
然后在主应用中（项目入口文件）加入以下代码：
```python
from flask import Flask
from swagger import siwa #导入它
app = Flask(__name__)
siwa.init_app(app)
```
在user.py中加入以下代码：
```python
from flask import Blueprint,request, session
from swagger import siwa #导入它
from pydantic import BaseModel, Field
user_bp = Blueprint('user', __name__, url_prefix='/user')
class loginModel(BaseModel):
    username:str=Field(...)
    password:str=Field(...)
@user_bp.route('/login', methods=['POST'])
@siwa.doc(body=loginModel,tags=["user"])
def user_login(body:loginModel):
    reqJSONData = request.get_json(silent=True)
    print(reqJSONData)
    if not reqJSONData: return r(code=401, msg='登录失败, 请求参数为空')
    username = reqJSONData.get('username')
    password = reqJSONData.get('password')

    if not all([username, password]):
        return r(code=401, msg='登录, 缺少请求参数')

    user = supabase.table('sys_user').select('id,username,name').eq('username',username).eq('password',password).execute().data
    # 4. 用户不存在, 直接返回
    if not user:
        return r(code=404, msg='用户名或密码错误')
    else:
        access_token = create_access_token(identity=user[0])
        session['user_info'] = user
        return r(msg='登录成功', data={"token":access_token})
```
启动服务，默认在5000端口，访问http://127.0.0.1:5000/docs
## Python Flask token身份认证[python/flask/flask_jwt_extended]
首先安装依赖：
```python
pip install flask-jwt-extended
```
然后在主应用中（项目入口文件）加入以下代码：
```python
from flask import Flask
from flask_jwt_extended import JWTManager #引入依赖
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'focusInYou' #jwt密钥 可自定义
jwt = JWTManager(app) #实例化
```
user接口
```python
from flask import Blueprint,request, session
from flask_jwt_extended import create_access_token, jwt_required ,get_jwt_identity #引入依赖
user_bp = Blueprint('user', __name__, url_prefix='/user') #注册蓝图
@user_bp.route('/login', methods=['POST'])
def user_login():
    reqJSONData = request.get_json(silent=True) #获取参数

    if not reqJSONData: return r(code=401, msg='注册失败, 请求参数为空')
    username = reqJSONData.get('username')
    password = reqJSONData.get('password')

    if not all([username, password]):
        return r(code=401, msg='登录, 缺少请求参数')

    #user = 去你的数据库里查出对应账号密码的用户信息赋值给user
    # 4. 用户不存在, 直接返回
    if not user:
        return r(code=404, msg='用户名或密码错误')
    else:
        access_token = create_access_token(identity=user[0]) #创建token
        session['user_info'] = user
        return r(msg='登录成功', data={"token":access_token})
@user_bp.route('/info', methods=['get'])
@jwt_required() #修饰器，表示请求接口需要在请求头内加入 Authorization: Bearer xxxx
def user_info():
    userInfo = get_jwt_identity()
    return r(msg='',data=userInfo)
```
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