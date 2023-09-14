## 微信小程序用户隐私保护指引弹窗组件[uniapp]
```html

<template>
	<view v-if="showPrivacy" :class="privacyClass">
		<view :class="contentClass">
			<view class="title">用户隐私保护指引</view>
			<view class="des">
				感谢您选择使用我们的小程序，我们非常重视您的个人信息安全和隐私保护。使用我们的产品前，请您仔细阅读“
				<text class="link" @tap="openPrivacyContract">{{privacyContractName}} </text>”，
				如您同意此隐私保护指引,请点击同意按钮,开始使用此小程序,我们将尽全力保护您的个人信息及合法权益，感谢您的信任！<br />
			</view>
			<view class="btns">
				<button class="item reject" @tap="exitMiniProgram">拒绝</button>
				<button id="agree-btn" class="item agree" open-type="agreePrivacyAuthorization"
					@agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'PrivacyPopup',
		data() {
			return {
				isRead: false,
				showPrivacy: false,
				privacyContractName: '',
				resolvePrivacyAuthorization: null,
			};
		},
		props: {
			position: {
				type: String,
				default: 'center'
			}
		},
		computed: {
			privacyClass() {
				return this.position === 'bottom' ? 'privacy privacy-bottom' : 'privacy';
			},
			contentClass() {
				return this.position === 'bottom' ? 'content2 content-bottom' : 'content2';
			}
		},
		mounted() {
			if (wx.onNeedPrivacyAuthorization) {
				wx.onNeedPrivacyAuthorization((resolve) => {
					this.resolvePrivacyAuthorization = resolve;
				});
			}

			if (wx.getPrivacySetting) {
				wx.getPrivacySetting({
					success: (res) => {
						console.log(res, 'getPrivacySetting');
						if (res.needAuthorization) {
							this.privacyContractName = res.privacyContractName;
							this.showPrivacy = true;
						}
					},
				});
			}
		},

		methods: {
			openPrivacyContract() {
				wx.openPrivacyContract({
					success: () => {
						this.isRead = true;
					},
					fail: () => {
						uni.showToast({
							title: '遇到错误',
							icon: 'error',
						});
					},
				});
			},
			exitMiniProgram() {

				wx.exitMiniProgram();

			},
			handleAgreePrivacyAuthorization() {
				this.showPrivacy = false;
				if (typeof this.resolvePrivacyAuthorization === 'function') {
					this.resolvePrivacyAuthorization({
						buttonId: 'agree-btn',
						event: 'agree',
					});
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.privacy {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, .5);
		z-index: 9999999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.privacy-bottom {
		align-items: flex-end;
	}

	.content2 {
		width: 632rpx;
		padding: 48rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 16rpx;
	}

	.content-bottom {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 36rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		border-radius: 16rpx 16rpx 0 0;
	}

	.content2 .title {
		text-align: center;
		color: #333;
		font-weight: bold;
		font-size: 32rpx;
	}

	.content2 .des {
		font-size: 26rpx;
		color: #666;
		margin-top: 40rpx;
		text-align: justify;
		line-height: 1.6;
	}

	.content2 .des .link {
		color: #07c160;
		text-decoration: underline;
	}

	.btns {
		margin-top: 48rpx;
		margin-bottom: 12rpx;
		display: flex;
	}

	.btns .item {
		width: 200rpx;
		height: 72rpx;
		overflow: visible;
		display: flex;
		align-items: center;

		justify-content: center;
		/* border-radius: 16rpx; */
		box-sizing: border-box;
		border: none !important;
	}

	.btns .reject {
		background: #f4f4f5;
		color: #666;
		font-size: 14px;
		font-weight: 300;
		margin-right: 16rpx;
		width: 240rpx;
		&::after{
			border: none;
		}
	}

	.btns .agree {
		width: 240rpx;
		background: #07c160;
		color: #fff;
		font-size: 16px;
		&::after{
			border: none;
		}
	}

	.privacy-bottom .btns .agree {
		width: 240rpx;

	}
</style>

```
然后在用到的页面进行引入
```html
<template>
	<popup ref="privacyComponent" position="bottom"  />
</template>
 
<script setup>
	import popup from '/components/privacy-popup.vue'
</script>
```
## 微信小程序文件上传进度监听[微信小程序]
直接上代码
```js
const uploadTask = wx.uploadFile({
  url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
  filePath: tempFilePaths[0],
  name: 'file',
  formData:{
    'user': 'test'
  },
  success (res){
    const data = res.data
    //do something
  }
})
 
uploadTask.onProgressUpdate((res) => {
  console.log('上传进度', res.progress)
  console.log('已经上传的数据长度', res.totalBytesSent)
  console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
})
 
uploadTask.abort() // 取消上传任务
```
## 小程序富文本字符串处理方法[微信小程序/uni-app]
封装方法：
```js
parseRich:function(content) {
  const singalList = [
    ['&quot;', '"'],
    ['&amp;', '&'],
    ['&lt;', '<'],
    ['&gt;', '>'],
    ['&nbsp;', ' ']
  ];
  const tagList = ['p', 'span', 'img', 'a', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'font', 'b', 'i', 'u', 'code', 'table', 'tr', 'td', 'th']
  singalList.forEach(i => {
    content = content.replace(new RegExp(i[0], 'g'), i[1])
  })
  tagList.forEach(i => {
    content = content.replace(new RegExp(`<${i} `, 'gi'), `<${i} class="rich_${i}" `)
  })
  return content;
}
```
## 微信小程序仿高德地图首页面板上下滑动效果[微信小程序]

.wxml部分代码
```vue
<view class="container">
    <map class="map"
          longitude="120.22096505715056"
          latitude="30.257772854411684"
          markers="{{markers}}"
          enable-zoom="{{false}}"
          bindtap="tapMap" 
          style="height: {{100 - height}}vh;"/>
    <view class="panel" style="height: {{height}}vh;" 
        capture-bind:touchstart="touchStart" 
        capture-bind:touchend="touchEnd" 
        capture-bind:touchcancel="touchCancel">
        <view class="searchBox" style="padding: 32rpx;">
          <view class="search flex-row">
              <van-icon name="search" size="20" />
              <input type="text" placeholder="搜索医院"/>
          </view>
        </view>
        <scroll-view class="hospitals flex-column-centerAll" scroll-y="true">
            <view class="hospital flex-row" wx:for="{{10}}" wx:key="item">
                <view class="info flex-column-bothAlign">
                    <view class="name"><van-icon name="hotel-o" color="#2A82E4" /> 浙江医院（三墩院区）</view>
                    <view class="flex-row-bothAlign">
                        <text class="type">三甲医院</text>
                        <text class="classify">综合医院</text>
                    </view>
                    <text class="address">西湖区古墩路1229号</text>
                </view>
                <view class="lookDetail flex-column-centerAll" bindtap="lookHospitalDetail">
                    <text>医院详情</text>
                </view>
            </view>
        </scroll-view>
    </view>
</view>
```
然后是.js部分
```js
// index.js
var minOffset = 30;//最小偏移量，低于这个值不响应滑动处理
var minTime = 60;// 最小时间，单位：毫秒，低于这个值不响应滑动处理
var startX = 0;//开始时的X坐标
var startY = 0;//开始时的Y坐标
var startTime = 0;//开始时的毫秒数
 
Page({
  data:{
    markers:[
        {
          id:1,
          longitude:120.22096505715056,
          latitude:30.257772854411684,
          width:48,
          height:48,
          iconPath:'../../static/index/location_fill.png'
        }
    ],
    height:50
  },
  onLoad(e){
    const res = wx.getSystemInfoSync()
    this.setData({
      panelTop:parseInt(res.windowHeight / 3) * 2,
      windowHeight:res.windowHeight
    })
  },
  tapMap(e){
    let h = parseInt(this.data.windowHeight / 3)*2
    this.setData({
      panelTop:h
    })
  },
  touchStart: function (e) {
    startX = e.touches[0].pageX; // 获取触摸时的x坐标  
    startY = e.touches[0].pageY; // 获取触摸时的x坐标
    startTime = new Date().getTime();//获取毫秒数
  },
  touchCancel: function (e) {
    startX = 0;//开始时的X坐标
    startY = 0;//开始时的Y坐标
    startTime = 0;//开始时的毫秒数
  },
  touchEnd: function (e) {
    var endX = e.changedTouches[0].pageX;
    var endY = e.changedTouches[0].pageY;
    var touchTime = new Date().getTime() - startTime;
    if (touchTime >= minTime) {
      var xOffset = endX - startX;
      var yOffset = endY - startY;
      if (Math.abs(xOffset) < Math.abs(yOffset) && Math.abs(yOffset) >= minOffset) {
        if (yOffset < 0 || (e.target.offsetTop>400)) {
          this.setData({
            height:80
          })
        } else {
          this.setData({
            height:50
          })
        }
      }
    }
  },
  lookHospitalDetail(){
    wx.navigateTo({
      url: '/pages/hospitalInfo/hospitalInfo',
    })
  }
})
```
最后是.wxss部分
```css
.map{
  width: 100vw;
  transition: all .5s ease;
}
.panel{
  width: 100vw;
  background: white;
  z-index: 99999;
  box-shadow: 0 0 16rpx #b8b8b8, none, none, none;
  transition: all .5s ease;
  overflow: hidden; 
  left:0;
  bottom:0;
  position:absolute;
}
.search{
  box-shadow: 0 0 16rpx #b8b8b8;
  height: 88rpx;
  align-items: center;
  padding: 32rpx;
  border-radius: 50rpx;
}
.search input{
  margin-left: 16rpx;
  width: 100%;
}
.hospitals{
  padding: 64rpx 32rpx 160rpx 32rpx;
  margin-bottom: 64rpx;
  height: 100%;
  width: 100vw;
}
.hospitals .hospital{
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  height: 218rpx;
  margin-bottom: 64rpx;
  border-radius: 25rpx;
  border: 1rpx solid #b8b8b8;
}
.hospitals .hospital:last-child{
  margin-bottom: 0;
}
.hospital .info{
  width: 70%;
}
.hospital .info,.hospital .lookDetail{
  height: 100%;
}
.name{
  font-size: 36rpx;
  font-weight: bolder;
}
.type{
  color: #D43030;
}
.lookDetail{
  color: #2A82E4;
}
```
## 小程序踩坑记录【图片宽高数值问题----不能有小数】
今天在用 picsum 进行瀑布流布局时踩坑了

因为需要根据机型去算每列的宽度   然后计算出来的图片宽度为   小数 

模拟器调试是没有任何问题

到了发布后在手机上看时怎么也看不到图片  后来一步步排除

才发现  图片宽度不能为  小数   

经过处理后能顺利加载出来了
## 微信小程序瀑布流组件
1.创建文件夹    /components/waterfall/

如图
```js
https://img-blog.csdnimg.cn/69d087d77e794e54ac4d76e4029759f3.png
```

```html
.wxml
 
<view class="waterfallView">
  <view wx:for="{{resultData}}" wx:for-item="i" wx:for-index="iIndex" wx:key="iIndex" class="waterfallColumn">
    <view class="waterfallItem" wx:for="{{i}}" wx:for-item="j" wx:for-index="jIndex" wx:key="jIndex" >
      <image class="img" src="{{j}}" mode="widthFix"/>
		</view>
	</view>
</view>
```
```css
.wxss
 
.waterfallView{
  width: 100vw;
  height: 100vh;
  padding: 2%;
  display: flex;
  justify-content: space-around;
}
.waterfallColumn{
  display: flex;
  flex-direction: column;
  width: calc(50vw - 5%);
}
.waterfallItem{
  background: white;
  border-radius: 15rpx;
  margin-bottom: 16rpx;
}
.img{
  border-radius: 15rpx;
  width: 100%;
  height: 100%;
}
```
```js
.js
 
Component({
  properties:{
    dataArr:{
      type:Array,
      value:[]
    }
  },
  observers:{
    dataArr(val){
      this.setData({
        dataArray:val
      })
      this.formatData(val)
    }
  },
  data:{
    dataArray:[],
    resultData:[],
    column:2,
    curWidthOfModel:0
  },
  lifetimes:{
    created(){
      let width = wx.getSystemInfoSync().windowWidth
      this.setData({
        curWidthOfModel:width
      })
    }
  },
  methods:{
    formatData(arr){
      if(arr === []){
        return
      }
      const resultData = arr.reduce(
        (acc, cur, index) => {
          const targetIndex = index % this.data.column;
          acc[targetIndex].push(cur);
          return acc;
        },
        Array.from(Array(this.data.column), () => [])
      )
      this.setData({
        resultData
      })
    }
  }
})
```
```json
.json
 
{
  "component": true
}
```

我这里直接就是写死了两列排列

然后在用到该组件的页面文件夹下  .json 文件夹中引入

注意：文件路径不要写错了！！！这里只是一个参考

引入截图：
```js
https://img-blog.csdnimg.cn/6142c6d50112451bac8facd78686c92a.png
```
使用组件截图：
```js
https://img-blog.csdnimg.cn/793c0ebeba524bcab16f9f3468d7e35c.png
```
然后使用该组件  对其dataArr【注意：我这里定义的是dataArr!!!】属性进行赋值

效果图：
```js
https://img-blog.csdnimg.cn/cf78371dd4b440b287ea6139b7470cc5.png
```
## uniapp微信小程序视频全屏播放 退出全屏暂停播放[uni-app]
```html
<video 
	:src="url" 
	controls 
	id="video" 
	@play="play"
	@fullscreenchange="fullscreenchange">
</video>
```

```js
// 播放时进入全屏
play() {
	let videoContext = uni.createVideoContext('video', this)
	videoContext.requestFullScreen()
},
 
//退出全屏时暂停
fullscreenchange(e) {
	if (!e.detail.fullScreen) {
		uni.createVideoContext('video', this).pause();
	} 
},
//退出全屏时停止
fullscreenchange (e){
	if(!e.detail.fullScreen){
		this.videoContext.stop()
	}
}
```

注意：微信小程序模拟器下调试无效，必须真机调试有用！！！！

注意：微信小程序模拟器下调试无效，必须真机调试有用！！！！

注意：微信小程序模拟器下调试无效，必须真机调试有用！！！！
## uniapp 微信小程序 隐藏滚动条[uni-app]
```css
.css/.wxss/.scss
 
::-webkit-scrollbar {
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
	color: transparent;
}
```
## uniapp开发微信小程序 input组件v-model真机调试问题解决方案[uni-app]
最近在项目中用到uniapp框架，在使用input组件时发现：

正常使用v-model绑定input的值，在模拟器中可以实现数据双向绑定，真机调试却不行（1.0），后来查了相关文档，真机调试版本为2.0时不会出现问题

算是一个小波折吧
## uniapp graceChecker.js 表单验证[uni-app/graceChecker.js]
1.新建文件 graceChecker.js
```js
export default {
	error:'',
	check : function (data, rule){
		for(var i = 0; i < rule.length; i++){
			if (!rule[i].checkType){return true;}
			if (!rule[i].name) {return true;}
			if (!rule[i].errorMsg) {return true;}
			if (!data[rule[i].name]) {this.error = rule[i].errorMsg; return false;}
			switch (rule[i].checkType){
				case 'string':
					var reg = new RegExp('^.{' + rule[i].checkRule + '}$');
					if(!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg; return false;}
				break;
				case 'int':
					var reg = new RegExp('^(-[1-9]|[1-9])[0-9]{' + rule[i].checkRule + '}$');
					if(!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg; return false;}
					break;
				break;
				case 'between':
					if (!this.isNumber(data[rule[i].name])){
						this.error = rule[i].errorMsg;
						return false;
					}
					var minMax = rule[i].checkRule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.error = rule[i].errorMsg;
						return false;
					}
				break;
				case 'betweenD':
					var reg = /^-?[1-9][0-9]?$/;
					if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
					var minMax = rule[i].checkRule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.error = rule[i].errorMsg;
						return false;
					}
				break;
				case 'betweenF': 
					var reg = /^-?[0-9][0-9]?.+[0-9]+$/;
					if (!reg.test(data[rule[i].name])){this.error = rule[i].errorMsg; return false;}
					var minMax = rule[i].checkRule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.error = rule[i].errorMsg;
						return false;
					}
				break;
				case 'same':
					if (data[rule[i].name] != rule[i].checkRule) { this.error = rule[i].errorMsg; return false;}
				break;
				case 'notsame':
					if (data[rule[i].name] == rule[i].checkRule) { this.error = rule[i].errorMsg; return false; }
				break;
				case 'email':
					var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
					if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
				break;
				case 'phoneno':
					var reg = /^1[0-9]{10,10}$/;
					if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
				break;
				case 'zipcode':
					var reg = /^[0-9]{6}$/;
					if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
				break;
				case 'reg':
					var reg = new RegExp(rule[i].checkRule);
					if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
				break;
				case 'in':
					if(rule[i].checkRule.indexOf(data[rule[i].name]) == -1){
						this.error = rule[i].errorMsg; return false;
					}
				break;
				case 'notnull':
					if(data[rule[i].name] == null || data[rule[i].name].length < 1){this.error = rule[i].errorMsg; return false;}
				break;
				case 'idcard':
					if(data[rule[i].name].length < 15 || data[rule[i].name].length > 15 && data[rule[i].name].length < 18){this.error = rule[i].errorMsg; return false;}
					if (data[rule[i].name].length == 15 && !(/^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/.test(data[rule[i].name]))) {
						this.error = rule[i].errorMsg; return false;
					}else if(data[rule[i].name].length == 18 && !(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(data[rule[i].name]))){
						this.error = rule[i].errorMsg; return false;
					}
				break;
				case 'address':
					var reg = /^[\u4e00-\u9fa5]/;
					if(!reg.test(data[rule[i].name])){
						this.error = rule[i].errorMsg; return false;
					}
				break;
			}
		}
		return true;
	},
	isNumber : function (checkVal){
		var reg = /^-?[1-9][0-9]?.?[0-9]*$/;
		return reg.test(checkVal);
	}
}
```
在原作者的基础上由加上了 idcard验证和address验证（实地地址的验证）

自定义定义rules：
```js
let rules=[
	{
		name:'title',
		checkType: "string",
		checkRule: "1,30",
		errorMsg: "标题应为1-30个字符"
	}
]
```
然后引入graceChecker.js
```js
<script>
	import graceChecker from "../../../common/graceChecker.js"
	export default{
		data(){
			return{}
		},
		methods:{
			formSubmit(e){
				let type = this.declareJson.type
				let rules = [
	              {
		            name:'title',
		            checkType: "string",
		            checkRule: "1,30",
		            errorMsg: "项目标题应为1-30个字符"
	              }
                ]
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rules);
				if (checkRes) {
					uni.showToast({
						title: "验证通过!",
						icon: "none"
					});
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			}
		}
	}
</script>
```
## uniapp 封装 navbar tabbar[uni-app]
1、封装navbar：

首先需要在pages.json中将对应页面的原生navbar给取消

举例：
```json
{
	"pages": [
		{
		  "path" : "pages/home/index/index",
			"style" :
			{
			    "navigationBarTitleText": "",
				"navigationBarBackgroundColor": "#2EC461",
				"navigationBarTextStyle": "white",
				"navigationStyle": "custom" //取消原生的navbar，即自定义navbar
			}
		}
    ]
}
```
然后新建一个vue页面文件，进行编写
```vue
<template>
	<uni-nav-bar shadow fixed status-bar background-color="#2EC461" color="#FFF" leftWidth="180rpx" right-width="180rpx">
		<template #left>
			<view>
				<location></location> <!--封装的另一个组件不用管它-->
			</view>
		</template>
		<template #default>
			<view class="navTitle flex-row-centerAll PingFangFont">
				<slot name="title"></slot>
			</view>
		</template>
	</uni-nav-bar>
</template>
 
<script setup>
	import location from "../location/location"
</script>
 
<style lang="scss" scoped>
	.navTitle{
		width: 100%;
		height: 100%;
		font-size: 36rpx;
		text-align: center;
		font-weight: bolder;
	}
</style>
```
然后在需要用到的页面中进行引入：
```vue
<template>
	<view>
		<navbar>
            <!--对应封装的navbar组件中的title slot插槽-->
			<template slot="title">
				<view>
					页面标题
				</view>
			</template>
		</navbar>
	</view>
</template>
 
<script setup>
	import navbar from "../../../components/navbar/navbar"
</script>
 
<style>
</style>
```
效果如图：
```js
https://img-blog.csdnimg.cn/80205ba475c744509f37ec03aeeb9c71.png
```
## 微信小程序吸顶效果
```html
.wxml
 
<scroll-view class="tab stickyClass" scroll-x scroll-left="{{tabScroll}}" scroll-with-animation="true">
  <block wx:for="{{menuList}}" wx:key="index">
    <view class="tab-item {{currentTab == index ? 'active' : ''}}" data-current="{{index}}" bindtap='clickMenu' data-typeid='{{item.id}}'>{{item.field}}</view>
  </block>
</scroll-view>
```

```js
.js
 
Page({
  //测试数据
  data:{
    tabScroll: 0, //使得导航位置居中
    currentTab: 0,  //当前的分类tab
    currentTypeid: 0, //当前的分类的id
    menuList: [{id: 0, field: "所有"},
          {id: 1, field: "官方商品"},
          {id: 2, field: "手机电脑"},
          {id: 3, field: "游戏交易"}] //导航栏菜单列表
  },
  //单击导航栏
  clickMenu: function(e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var tabWidth = this.data.windowWidth / 5 // 导航tab共5个，获取一个的宽度
    var typeid = e.currentTarget.dataset.typeid; //获取当前的类型id
 
    this.setData({
      tabScroll: (current - 2) * tabWidth, //使点击的tab始终在居中位置
      currentTypeid: typeid,
      currentTab: current
    })
  }
})
```

```css
.wxss
 
/* 核心 */
.stickyClass{
    position: sticky;
    top: 70rpx; /*距离顶部还有多少时候产生吸顶效果*/
    z-index: 9999;
}
.tab {
  width: 100%;
  margin-top: 10rpx;
  top: 0;
  left: 0;
  z-index: 100;
  white-space: nowrap;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 70rpx;
  background: white;
  border-bottom: 2rpx solid #f5f5f5;
  padding-left: 3%;
  padding-right: 3%;
}
 
.tab-item {
  display: inline-block;
  text-align: center;
  font-size: 30rpx;
  padding-left: 25rpx;
  padding-right: 25rpx;
  z-index: 999;
}
 
.active {
  border-bottom: 5rpx solid #ef696c;
  color: #ef696c;
}
 
.active1 {
  background: #ef696c;
}
```
## 微信小程序组件间方法传递、值
首先定义父组件：
```html
<!-- .wxml -->
<view bind:parent="func">父组件</view>
```
```js
//.js
 
Page({
  data:{},
  func(e){
    console.log(666);
  }
})
```
定义子组件：
```html
<!-- .wxml -->
<view bindtap='funcccc'>
```
```js
//.js
 
Component({
  properties: {},
  data: {},
  observers: {},
  methods: {
    funcccc: function (e) {
      var item = e.currentTarget.dataset.item;
      this.triggerEvent('tapitem', { item: item }, { bubbles: true, composed: true });
    }
  }
})
```
于是在父组件调用方法时，就可以通过e.detail来获取子组件传递的数据
## 微信小程序页面跳转方法及功能整理

| 方法 | 功能描述 |
|----------|----------|
|wx.switchTab|跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面|
|wx.reLaunch|关闭所有页面，打开到应用内的某个页面 |
|wx.redirectTo|关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面|
|wx.navigateTo|保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层。|
|wx.navigateBack|关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。|

## 微信小程序tabbar页面跳转关闭原页面方法（含有tabbar的也能关闭）
使用tabbar插件重写tabbar方法需用wx.reLaunch

即可实现tabbar页面切换时无法关闭原页面，回到原页面页面没有刷新的问题

注意：wx.switchtab只会关闭非tabbar页面！！！
## 微信小程序生成二维码插件weapp-qrcode.js[weapp-qrcode.js]
首先创建weapp-qrcode.js文件

然后复制一下内容到weapp-qrcode.js文件
```js
var QRCode;
 
(function () {
 
  function _getTypeNumber(sText, nCorrectLevel) {
    var nType = 1;
    var length = _getUTF8Length(sText);
 
    for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
      var nLimit = 0;
 
      switch (nCorrectLevel) {
        case QRErrorCorrectLevel.L:
          nLimit = QRCodeLimitLength[i][0];
          break;
        case QRErrorCorrectLevel.M:
          nLimit = QRCodeLimitLength[i][1];
          break;
        case QRErrorCorrectLevel.Q:
          nLimit = QRCodeLimitLength[i][2];
          break;
        case QRErrorCorrectLevel.H:
          nLimit = QRCodeLimitLength[i][3];
          break;
      }
 
      if (length <= nLimit) {
        break;
      } else {
        nType++;
      }
    }
 
    if (nType > QRCodeLimitLength.length) {
      throw new Error("Too long data");
    }
 
    return nType;
  }
 
  function _getUTF8Length(sText) {
    var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
    return replacedText.length + (replacedText.length != sText ? 3 : 0);
  }
 
  function QR8bitByte(data) {
    this.mode = QRMode.MODE_8BIT_BYTE;
    this.data = data;
    this.parsedData = [];
 
    for (var i = 0, l = this.data.length; i < l; i++) {
      var byteArray = [];
      var code = this.data.charCodeAt(i);
 
      if (code > 0x10000) {
        byteArray[0] = 0xF0 | ((code & 0x1C0000) >>> 18);
        byteArray[1] = 0x80 | ((code & 0x3F000) >>> 12);
        byteArray[2] = 0x80 | ((code & 0xFC0) >>> 6);
        byteArray[3] = 0x80 | (code & 0x3F);
      } else if (code > 0x800) {
        byteArray[0] = 0xE0 | ((code & 0xF000) >>> 12);
        byteArray[1] = 0x80 | ((code & 0xFC0) >>> 6);
        byteArray[2] = 0x80 | (code & 0x3F);
      } else if (code > 0x80) {
        byteArray[0] = 0xC0 | ((code & 0x7C0) >>> 6);
        byteArray[1] = 0x80 | (code & 0x3F);
      } else {
        byteArray[0] = code;
      }
 
      this.parsedData.push(byteArray);
    }
 
    this.parsedData = Array.prototype.concat.apply([], this.parsedData);
 
    if (this.parsedData.length != this.data.length) {
      this.parsedData.unshift(191);
      this.parsedData.unshift(187);
      this.parsedData.unshift(239);
    }
  }
 
  QR8bitByte.prototype = {
    getLength: function (buffer) {
      return this.parsedData.length;
    },
    write: function (buffer) {
      for (var i = 0, l = this.parsedData.length; i < l; i++) {
        buffer.put(this.parsedData[i], 8);
      }
    }
  };
 
  function QRCodeModel(typeNumber, errorCorrectLevel) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
    this.modules = null;
    this.moduleCount = 0;
    this.dataCache = null;
    this.dataList = [];
  }
  QRCodeModel.prototype = {
    addData: function (data) { var newData = new QR8bitByte(data); this.dataList.push(newData); this.dataCache = null; }, isDark: function (row, col) {
      if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) { throw new Error(row + "," + col); }
      return this.modules[row][col];
    }, getModuleCount: function () { return this.moduleCount; }, make: function () { this.makeImpl(false, this.getBestMaskPattern()); }, makeImpl: function (test, maskPattern) {
      this.moduleCount = this.typeNumber * 4 + 17; this.modules = new Array(this.moduleCount); for (var row = 0; row < this.moduleCount; row++) { this.modules[row] = new Array(this.moduleCount); for (var col = 0; col < this.moduleCount; col++) { this.modules[row][col] = null; } }
      this.setupPositionProbePattern(0, 0); this.setupPositionProbePattern(this.moduleCount - 7, 0); this.setupPositionProbePattern(0, this.moduleCount - 7); this.setupPositionAdjustPattern(); this.setupTimingPattern(); this.setupTypeInfo(test, maskPattern); if (this.typeNumber >= 7) { this.setupTypeNumber(test); }
      if (this.dataCache == null) { this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList); }
      this.mapData(this.dataCache, maskPattern);
    }, setupPositionProbePattern: function (row, col) { for (var r = -1; r <= 7; r++) { if (row + r <= -1 || this.moduleCount <= row + r) continue; for (var c = -1; c <= 7; c++) { if (col + c <= -1 || this.moduleCount <= col + c) continue; if ((0 <= r && r <= 6 && (c == 0 || c == 6)) || (0 <= c && c <= 6 && (r == 0 || r == 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) { this.modules[row + r][col + c] = true; } else { this.modules[row + r][col + c] = false; } } } }, getBestMaskPattern: function () {
      var minLostPoint = 0; var pattern = 0; for (var i = 0; i < 8; i++) { this.makeImpl(true, i); var lostPoint = QRUtil.getLostPoint(this); if (i == 0 || minLostPoint > lostPoint) { minLostPoint = lostPoint; pattern = i; } }
      return pattern;
    }, createMovieClip: function (target_mc, instance_name, depth) {
      var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth); var cs = 1; this.make(); for (var row = 0; row < this.modules.length; row++) { var y = row * cs; for (var col = 0; col < this.modules[row].length; col++) { var x = col * cs; var dark = this.modules[row][col]; if (dark) { qr_mc.beginFill(0, 100); qr_mc.moveTo(x, y); qr_mc.lineTo(x + cs, y); qr_mc.lineTo(x + cs, y + cs); qr_mc.lineTo(x, y + cs); qr_mc.endFill(); } } }
      return qr_mc;
    }, setupTimingPattern: function () {
      for (var r = 8; r < this.moduleCount - 8; r++) {
        if (this.modules[r][6] != null) { continue; }
        this.modules[r][6] = (r % 2 == 0);
      }
      for (var c = 8; c < this.moduleCount - 8; c++) {
        if (this.modules[6][c] != null) { continue; }
        this.modules[6][c] = (c % 2 == 0);
      }
    }, setupPositionAdjustPattern: function () {
      var pos = QRUtil.getPatternPosition(this.typeNumber); for (var i = 0; i < pos.length; i++) {
        for (var j = 0; j < pos.length; j++) {
          var row = pos[i]; var col = pos[j]; if (this.modules[row][col] != null) { continue; }
          for (var r = -2; r <= 2; r++) { for (var c = -2; c <= 2; c++) { if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) { this.modules[row + r][col + c] = true; } else { this.modules[row + r][col + c] = false; } } }
        }
      }
    }, setupTypeNumber: function (test) {
      var bits = QRUtil.getBCHTypeNumber(this.typeNumber); for (var i = 0; i < 18; i++) { var mod = (!test && ((bits >> i) & 1) == 1); this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod; }
      for (var i = 0; i < 18; i++) { var mod = (!test && ((bits >> i) & 1) == 1); this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod; }
    }, setupTypeInfo: function (test, maskPattern) {
      var data = (this.errorCorrectLevel << 3) | maskPattern; var bits = QRUtil.getBCHTypeInfo(data); for (var i = 0; i < 15; i++) { var mod = (!test && ((bits >> i) & 1) == 1); if (i < 6) { this.modules[i][8] = mod; } else if (i < 8) { this.modules[i + 1][8] = mod; } else { this.modules[this.moduleCount - 15 + i][8] = mod; } }
      for (var i = 0; i < 15; i++) { var mod = (!test && ((bits >> i) & 1) == 1); if (i < 8) { this.modules[8][this.moduleCount - i - 1] = mod; } else if (i < 9) { this.modules[8][15 - i - 1 + 1] = mod; } else { this.modules[8][15 - i - 1] = mod; } }
      this.modules[this.moduleCount - 8][8] = (!test);
    }, mapData: function (data, maskPattern) {
      var inc = -1; var row = this.moduleCount - 1; var bitIndex = 7; var byteIndex = 0; for (var col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col == 6) col--; while (true) {
          for (var c = 0; c < 2; c++) {
            if (this.modules[row][col - c] == null) {
              var dark = false; if (byteIndex < data.length) { dark = (((data[byteIndex] >>> bitIndex) & 1) == 1); }
              var mask = QRUtil.getMask(maskPattern, row, col - c); if (mask) { dark = !dark; }
              this.modules[row][col - c] = dark; bitIndex--; if (bitIndex == -1) { byteIndex++; bitIndex = 7; }
            }
          }
          row += inc; if (row < 0 || this.moduleCount <= row) { row -= inc; inc = -inc; break; }
        }
      }
    }
  };
  QRCodeModel.PAD0 = 0xEC;
  QRCodeModel.PAD1 = 0x11;
  QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
    var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel); var buffer = new QRBitBuffer(); for (var i = 0; i < dataList.length; i++) { var data = dataList[i]; buffer.put(data.mode, 4); buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber)); data.write(buffer); }
    var totalDataCount = 0; for (var i = 0; i < rsBlocks.length; i++) { totalDataCount += rsBlocks[i].dataCount; }
    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new Error("code length overflow. ("
        + buffer.getLengthInBits()
        + ">"
        + totalDataCount * 8
        + ")");
    }
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) { buffer.put(0, 4); }
    while (buffer.getLengthInBits() % 8 != 0) { buffer.putBit(false); }
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) { break; }
      buffer.put(QRCodeModel.PAD0, 8); if (buffer.getLengthInBits() >= totalDataCount * 8) { break; }
      buffer.put(QRCodeModel.PAD1, 8);
    }
    return QRCodeModel.createBytes(buffer, rsBlocks);
  };
  QRCodeModel.createBytes = function (buffer, rsBlocks) {
    var offset = 0; var maxDcCount = 0; var maxEcCount = 0; var dcdata = new Array(rsBlocks.length); var ecdata = new Array(rsBlocks.length); for (var r = 0; r < rsBlocks.length; r++) {
      var dcCount = rsBlocks[r].dataCount; var ecCount = rsBlocks[r].totalCount - dcCount; maxDcCount = Math.max(maxDcCount, dcCount); maxEcCount = Math.max(maxEcCount, ecCount); dcdata[r] = new Array(dcCount); for (var i = 0; i < dcdata[r].length; i++) { dcdata[r][i] = 0xff & buffer.buffer[i + offset]; }
      offset += dcCount; var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount); var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1); var modPoly = rawPoly.mod(rsPoly); ecdata[r] = new Array(rsPoly.getLength() - 1); for (var i = 0; i < ecdata[r].length; i++) { var modIndex = i + modPoly.getLength() - ecdata[r].length; ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0; }
    }
    var totalCodeCount = 0; for (var i = 0; i < rsBlocks.length; i++) { totalCodeCount += rsBlocks[i].totalCount; }
    var data = new Array(totalCodeCount); var index = 0; for (var i = 0; i < maxDcCount; i++) { for (var r = 0; r < rsBlocks.length; r++) { if (i < dcdata[r].length) { data[index++] = dcdata[r][i]; } } }
    for (var i = 0; i < maxEcCount; i++) { for (var r = 0; r < rsBlocks.length; r++) { if (i < ecdata[r].length) { data[index++] = ecdata[r][i]; } } }
    return data;
  };
  var QRMode = { MODE_NUMBER: 1 << 0, MODE_ALPHA_NUM: 1 << 1, MODE_8BIT_BYTE: 1 << 2, MODE_KANJI: 1 << 3 };
  var QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
  var QRMaskPattern = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 };
  var QRUtil = {
    PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]], G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0), G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0), G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1), getBCHTypeInfo: function (data) {
      var d = data << 10; while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) { d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15))); }
      return ((data << 10) | d) ^ QRUtil.G15_MASK;
    }, getBCHTypeNumber: function (data) {
      var d = data << 12; while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) { d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18))); }
      return (data << 12) | d;
    }, getBCHDigit: function (data) {
      var digit = 0; while (data != 0) { digit++; data >>>= 1; }
      return digit;
    }, getPatternPosition: function (typeNumber) { return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1]; }, getMask: function (maskPattern, i, j) { switch (maskPattern) { case QRMaskPattern.PATTERN000: return (i + j) % 2 == 0; case QRMaskPattern.PATTERN001: return i % 2 == 0; case QRMaskPattern.PATTERN010: return j % 3 == 0; case QRMaskPattern.PATTERN011: return (i + j) % 3 == 0; case QRMaskPattern.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0; case QRMaskPattern.PATTERN101: return (i * j) % 2 + (i * j) % 3 == 0; case QRMaskPattern.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 == 0; case QRMaskPattern.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 == 0; default: throw new Error("bad maskPattern:" + maskPattern); } }, getErrorCorrectPolynomial: function (errorCorrectLength) {
      var a = new QRPolynomial([1], 0); for (var i = 0; i < errorCorrectLength; i++) { a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0)); }
      return a;
    }, getLengthInBits: function (mode, type) { if (1 <= type && type < 10) { switch (mode) { case QRMode.MODE_NUMBER: return 10; case QRMode.MODE_ALPHA_NUM: return 9; case QRMode.MODE_8BIT_BYTE: return 8; case QRMode.MODE_KANJI: return 8; default: throw new Error("mode:" + mode); } } else if (type < 27) { switch (mode) { case QRMode.MODE_NUMBER: return 12; case QRMode.MODE_ALPHA_NUM: return 11; case QRMode.MODE_8BIT_BYTE: return 16; case QRMode.MODE_KANJI: return 10; default: throw new Error("mode:" + mode); } } else if (type < 41) { switch (mode) { case QRMode.MODE_NUMBER: return 14; case QRMode.MODE_ALPHA_NUM: return 13; case QRMode.MODE_8BIT_BYTE: return 16; case QRMode.MODE_KANJI: return 12; default: throw new Error("mode:" + mode); } } else { throw new Error("type:" + type); } }, getLostPoint: function (qrCode) {
      var moduleCount = qrCode.getModuleCount(); var lostPoint = 0; for (var row = 0; row < moduleCount; row++) {
        for (var col = 0; col < moduleCount; col++) {
          var sameCount = 0; var dark = qrCode.isDark(row, col); for (var r = -1; r <= 1; r++) {
            if (row + r < 0 || moduleCount <= row + r) { continue; }
            for (var c = -1; c <= 1; c++) {
              if (col + c < 0 || moduleCount <= col + c) { continue; }
              if (r == 0 && c == 0) { continue; }
              if (dark == qrCode.isDark(row + r, col + c)) { sameCount++; }
            }
          }
          if (sameCount > 5) { lostPoint += (3 + sameCount - 5); }
        }
      }
      for (var row = 0; row < moduleCount - 1; row++) { for (var col = 0; col < moduleCount - 1; col++) { var count = 0; if (qrCode.isDark(row, col)) count++; if (qrCode.isDark(row + 1, col)) count++; if (qrCode.isDark(row, col + 1)) count++; if (qrCode.isDark(row + 1, col + 1)) count++; if (count == 0 || count == 4) { lostPoint += 3; } } }
      for (var row = 0; row < moduleCount; row++) { for (var col = 0; col < moduleCount - 6; col++) { if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) { lostPoint += 40; } } }
      for (var col = 0; col < moduleCount; col++) { for (var row = 0; row < moduleCount - 6; row++) { if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) { lostPoint += 40; } } }
      var darkCount = 0; for (var col = 0; col < moduleCount; col++) { for (var row = 0; row < moduleCount; row++) { if (qrCode.isDark(row, col)) { darkCount++; } } }
      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5; lostPoint += ratio * 10; return lostPoint;
    }
  };
  var QRMath = {
    glog: function (n) {
      if (n < 1) { throw new Error("glog(" + n + ")"); }
      return QRMath.LOG_TABLE[n];
    }, gexp: function (n) {
      while (n < 0) { n += 255; }
      while (n >= 256) { n -= 255; }
      return QRMath.EXP_TABLE[n];
    }, EXP_TABLE: new Array(256), LOG_TABLE: new Array(256)
  }; for (var i = 0; i < 8; i++) { QRMath.EXP_TABLE[i] = 1 << i; }
  for (var i = 8; i < 256; i++) { QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8]; }
  for (var i = 0; i < 255; i++) { QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i; }
  function QRPolynomial(num, shift) {
    if (num.length == undefined) { throw new Error(num.length + "/" + shift); }
    var offset = 0; while (offset < num.length && num[offset] == 0) { offset++; }
    this.num = new Array(num.length - offset + shift); for (var i = 0; i < num.length - offset; i++) { this.num[i] = num[i + offset]; }
  }
  QRPolynomial.prototype = {
    get: function (index) { return this.num[index]; }, getLength: function () { return this.num.length; }, multiply: function (e) {
      var num = new Array(this.getLength() + e.getLength() - 1); for (var i = 0; i < this.getLength(); i++) { for (var j = 0; j < e.getLength(); j++) { num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j))); } }
      return new QRPolynomial(num, 0);
    }, mod: function (e) {
      if (this.getLength() - e.getLength() < 0) { return this; }
      var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0)); var num = new Array(this.getLength()); for (var i = 0; i < this.getLength(); i++) { num[i] = this.get(i); }
      for (var i = 0; i < e.getLength(); i++) { num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio); }
      return new QRPolynomial(num, 0).mod(e);
    }
  };
  function QRRSBlock(totalCount, dataCount) { this.totalCount = totalCount; this.dataCount = dataCount; }
  QRRSBlock.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];
  QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
    var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel); if (rsBlock == undefined) { throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel); }
    var length = rsBlock.length / 3; var list = []; for (var i = 0; i < length; i++) { var count = rsBlock[i * 3 + 0]; var totalCount = rsBlock[i * 3 + 1]; var dataCount = rsBlock[i * 3 + 2]; for (var j = 0; j < count; j++) { list.push(new QRRSBlock(totalCount, dataCount)); } }
    return list;
  };
  QRRSBlock.getRsBlockTable = function (typeNumber, errorCorrectLevel) { switch (errorCorrectLevel) { case QRErrorCorrectLevel.L: return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0]; case QRErrorCorrectLevel.M: return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1]; case QRErrorCorrectLevel.Q: return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2]; case QRErrorCorrectLevel.H: return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3]; default: return undefined; } };
  function QRBitBuffer() { this.buffer = []; this.length = 0; }
  QRBitBuffer.prototype = {
    get: function (index) { var bufIndex = Math.floor(index / 8); return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1; }, put: function (num, length) { for (var i = 0; i < length; i++) { this.putBit(((num >>> (length - i - 1)) & 1) == 1); } }, getLengthInBits: function () { return this.length; }, putBit: function (bit) {
      var bufIndex = Math.floor(this.length / 8); if (this.buffer.length <= bufIndex) { this.buffer.push(0); }
      if (bit) { this.buffer[bufIndex] |= (0x80 >>> (this.length % 8)); }
      this.length++;
    }
  };
  var QRCodeLimitLength = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]];
 
  QRCode = function (canvasId, vOption) {
    this._htOption = {
      width: 256,
      height: 256,
      typeNumber: 4,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRErrorCorrectLevel.H
    };
 
    if (typeof vOption === 'string') {
      vOption = {
        text: vOption
      };
    }
 
    if (vOption) {
      for (var i in vOption) {
        this._htOption[i] = vOption[i];
      }
    }
 
    this._oQRCode = null;
    this.canvasId = canvasId
 
    if (this._htOption.text && this.canvasId) {
      this.makeCode(this._htOption.text);
    }
  };
 
  QRCode.prototype.makeCode = function (sText) {
    this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
    this._oQRCode.addData(sText);
    this._oQRCode.make();
    this.makeImage();
  };
 
  QRCode.prototype.makeImage = function () {
    var _oContext
    if (this._htOption.usingIn) {
      _oContext = wx.createCanvasContext(this.canvasId, this._htOption.usingIn)
    }
    else {
      _oContext = wx.createCanvasContext(this.canvasId)
    }
    var _htOption = this._htOption;
    var oQRCode = this._oQRCode
 
    var nCount = oQRCode.getModuleCount();
    var nWidth = _htOption.padding ? (_htOption.width - 2 * _htOption.padding) / nCount : _htOption.width / nCount;
    var nHeight = _htOption.padding ? (_htOption.height - 2 * _htOption.padding) / nCount : _htOption.height / nCount;
    var nRoundedHeight = Math.round(nHeight);
    var nRoundedWidth = Math.round(nWidth);
 
    if (_htOption.image && _htOption.image != '') {
      _oContext.drawImage(_htOption.image, 0, 0, _htOption.width, _htOption.height)
    }
    _oContext.setFillStyle('#fff')
    _oContext.fillRect(0, 0, _htOption.width, _htOption.height)
    _oContext.save()
    for (var row = 0; row < nCount; row++) {
      for (var col = 0; col < nCount; col++) {
        var bIsDark = oQRCode.isDark(row, col);
        var nLeft = _htOption.padding ? col * nWidth + _htOption.padding : col * nWidth;
        var nTop = _htOption.padding ? row * nHeight + _htOption.padding : row * nHeight;
        _oContext.setStrokeStyle(bIsDark ? _htOption.colorDark : _htOption.colorLight)
 
        _oContext.setLineWidth(1)
        _oContext.setFillStyle(bIsDark ? _htOption.colorDark : _htOption.colorLight)
 
        _oContext.fillRect(nLeft, nTop, nWidth, nHeight);
 
        _oContext.strokeRect(
          Math.floor(nLeft) + 0.5,
          Math.floor(nTop) + 0.5,
          nRoundedHeight
        );
 
        _oContext.strokeRect(
          Math.ceil(nLeft) - 0.5,
          Math.ceil(nTop) - 0.5,
          nRoundedWidth,
          nRoundedHeight
        );
      }
    }
 
    _oContext.draw(false, () => {
      setTimeout(() => {
        this.exportImage()
      }, 800)
    })
  };
 
  QRCode.prototype.exportImage = function (callback) {
    if (this._htOption.callback && typeof this._htOption.callback === 'function') {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: this._htOption.width,
        height: this._htOption.height,
        destWidth: this._htOption.width,
        destHeight: this._htOption.height,
        canvasId: this.canvasId,
        success: (res) => {
          this._htOption.callback({ path: res.tempFilePath })
        }
      })
    }
  }
 
  QRCode.CorrectLevel = QRErrorCorrectLevel;
})();
 
module.exports = QRCode
```
然后在index.wxml文件写入
```html
<!--index.wxml-->
<view class="container">
  Weixin
  <canvas class="code" canvas-id="myQrcode" style="width: 400rpx;height:400rpx;margin: 200rpx 0;"/>
  <view class="down" bindtap="saveQrcode">保存到手机相册</view>
</view>
```
在index.js文件写入
```js
import QRCode from "../../utils/weapp-qrcode.js" //引入生成二维码的插件
Page({
  data:{
 
  },
  onLoad(){
    this.reateQrcode()
  },
  reateQrcode() {
    var that = this;
    new QRCode('myQrcode', {
      text:'测试内容',
      width: that.createRpx2px(400),
      height: that.createRpx2px(400),
      padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
        that.data.qrcodePath = res.path;
      }
    })
  },
   //用户二维码保存到本地相册
   saveQrcode: function () {
    var that = this;
    wx.getImageInfo({
      src: that.data.qrcodePath,
      success: function (ret) {
        var path = ret.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(result) {
            if (result.errMsg === 'saveImageToPhotosAlbum:ok') {
              wx.showToast({
                title: '保存成功',
              })
            }
          }
        })
      }
    })
  },
  createRpx2px(rpx) {
    return wx.getSystemInfoSync().windowWidth / 750 * rpx
  },
})
```
## vue-cli创建uni-app引入uni-ui[uni-app/vue-cli]
1.全局安装脚手架
```js
npm install -g @vue/cli
```
2.创建uni-app项目
```js
vue create -p dcloudio/uni-preset-vue my-project
```
3.引入uni-ui框架
```js
// 安装node-sass
npm i node-sass -D
 
// 安装sass-loader
npm i sass-loader -D
 
安装方式：npm安装
npm install uview-ui
```
4.在pages.json文件中加入以下代码
```js
"easycom": {
	"autoscan": true,
	"custom": {
		// uni-ui 规则如下配置
		"^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
	}
},
```
## vue-cli创建uni-app项目 exports is not defined 解决方法[uni-app/vue-cli]
错误描述：exports is not defined

报错信息如图：
```js
https://img-blog.csdnimg.cn/60d7687687ad4ab7b18ce2f059d0fb27.png
```
错误原因：更新uni-app 的时候一并更新了@babel/runtime ，@babel/runtime 更新到了 7.13.x，有较大改动，引起兼容问题。
解决办法：

1.删除 node_modules 目录和 package-lock.json 文件，在 package.json 文件中增加开发依赖 “@babel/runtime”: “~7.12.0”，执行 npm install 重新安装依赖即可 

2.注释掉babel.config.js 文件中modules: 'commonjs', 语句，代码如下
```js
//babel.config.js
const plugins = []
 
if (process.env.UNI_OPT_TREESHAKINGNG) {
  plugins.push(require('@dcloudio/vue-cli-plugin-uni-optimize/packages/babel-plugin-uni-api/index.js'))
}
 
if (
  (
    process.env.UNI_PLATFORM === 'app-plus' &&
    process.env.UNI_USING_V8
  ) ||
  (
    process.env.UNI_PLATFORM === 'h5' &&
    process.env.UNI_H5_BROWSER === 'builtin'
  )
) {
  const path = require('path')
 
  const isWin = /^win/.test(process.platform)
 
  const normalizePath = path => (isWin ? path.replace(/\\/g, '/') : path)
 
  const input = normalizePath(process.env.UNI_INPUT_DIR)
  try {
    plugins.push([
      require('@dcloudio/vue-cli-plugin-hbuilderx/packages/babel-plugin-console'),
      {
        file (file) {
          file = normalizePath(file)
          if (file.indexOf(input) === 0) {
            return path.relative(input, file)
          }
          return false
        }
      }
    ])
  } catch (e) {}
}
 
process.UNI_LIBRARIES = process.UNI_LIBRARIES || ['@dcloudio/uni-ui']
process.UNI_LIBRARIES.forEach(libraryName => {
  plugins.push([
    'import',
    {
      'libraryName': libraryName,
      'customName': (name) => {
        return `${libraryName}/lib/${name}/${name}`
      }
    }
  ])
})
 
const config = {
  presets: [
    [
      '@vue/app',
      {
        //modules: 'commonjs',
        useBuiltIns: process.env.UNI_PLATFORM === 'h5' ? 'usage' : 'entry'
      }
    ]
  ],
  plugins
}
 
const UNI_H5_TEST = '**/@dcloudio/uni-h5/dist/index.umd.min.js'
if (process.env.NODE_ENV === 'production') {
  config.overrides = [{
    test: UNI_H5_TEST,
    compact: true,
  }]
} else {
  config.ignore = [UNI_H5_TEST]
}
 
module.exports = config
```
## 微信小程序 vant 日历组件动态定义日历格式[Vant]
应项目要求要做打卡小程序
日历日期下方下面要动态显示打卡未打卡
在构建好npm包的情况下
首先在app.json中引入它
```json
//app.json 或 对应页面的json文件
"usingComponents": {
      "van-calendar": "@vant/weapp/calendar/index",
},
```

在wxml中使用它
```html
 <van-calendar
        color="#4988FD"
        show="{{show}}"
        type="single"
        row-height='50'
        formatter="{{formatter}}"
        min-date="{{ minDate }}"
        max-date="{{ maxDate }}"
        poppable="{{false}}"
        show-title="{{false}}"
        show-mark="{{false}}"
        show-confirm="{{false}}"
        bind:confirm="submit"/>
```
然后再js文件中的data中定义formatter
```js
Page({
  data:{
    minDate: new Date(2022, 7, 1).getTime(),
    maxDate: new Date(2022, 7, 31).getTime(),
    formatter(day){
      const date=day.date.getDate()
      day.text=date
      return day
    },
  },
  methods:{
    //获取打卡数据
    getMonthListDetail(){
    var month=this.FormatAll(this.data.minDate).split(' ')
    var that=this
    wx.request({
      url: '',
      method:'POST',
      success(res){
        that.setData({
          dkjlList:res.data.PAGE.list,
          formatter:function(e){
            const date=e.date.getDate()
            e.text=date
            console.log(e+'=========');
            var aa=that.FormatAll(e.date).split(' ')
            that.data.dkjlList.forEach(item=>{
              if(aa[0]===item.stDay){
                e.bottomInfo=item.isSign===1?'已打卡':'未打卡'
              }
            })
            return e
          }
        })
      }
    })
  },
  }
})
```
效果图地址：
```js
https://img-blog.csdnimg.cn/673bd2bc7b804982b48f1ba99bde56a2.png
```