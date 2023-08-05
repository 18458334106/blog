## js防抖与节流[javascript]
直接上代码

防抖：
```js
export function onDeb(fn, delay = 300) {
    let timer;
    return function () {
        clearTimeout(timer);
        let context = this;
        let args = arguments; 
        timer = setTimeout(function () {
            fn.call(context, args);
        }, delay);
    };
}
```
节流：
```js
export function onThro(fn, delay = 300) {
    let enterTime = 0;//触发的时间
    return function () {
        let context = this;
        let backTime = new Date();//第一次函数return即触发的时间
        if (backTime - enterTime > delay) {
            fn.call(context, arguments);
            enterTime = backTime; 
        }
    };
}
```
## CSS 内凹圆角[css]
```html
<div class="infos">
	<div class="rediusTL"></div>
	<div class="rediusTR"></div>
	<div class="rediusBL"></div>
	<div class="rediusBR"></div>
</div>
```
```css
<style lang="scss" scoped>
    .infos{
		margin: 32rpx 0;
		height: 880rpx;
		display: flex;
		flex-wrap: wrap;
		position: relative;
		
        .rediusTL,.rediusTR,.rediusBL,.rediusBR{
			width: 50%;
			height: 50%;
		}
		.rediusTL{
			background-image: radial-gradient(50rpx at top left,#fff 50rpx,#eee);
		}
		.rediusTR{
			background-image: radial-gradient(50rpx at top right,#fff 50rpx,#eee);
		}
		.rediusBL{
			background-image: radial-gradient(50rpx at bottom left,#fff 50rpx,#eee);
		}
		.rediusBR{
			background-image: radial-gradient(50rpx at bottom right,#fff 50rpx,#eee);
		}
</style>
```
上效果图： 
```js
https://img-blog.csdnimg.cn/5599a7cca32a4144b49a736bd51954a4.png
```
## 时间处理函数 返回 今天、昨天、前天时间节点[javascript]
首先新建一个js文件，我这里命名为 handleDay.js  放在vue项目common/utils文件夹下
```js
handleDay.js
 
//返回显示时间
function cutYear(date){
  return parseInt(date.split(' ')[0].split('-')[0])
}
function cutMonth(date){
  return parseInt(date.split(' ')[0].split('-')[1])
}
function cutDay(date){
  return parseInt(date.split(' ')[0].split('-')[2])
}
function cutSecond(data){
  return data.split(' ')[1].split(':')[0]+":"+data.split(' ')[1].split(':')[1]
}
export function timer(faultDate, completeTime) {
	const startYear = cutYear(faultDate)
	const startMonth = cutMonth(faultDate)
	const startDay = cutDay(faultDate)
	const endYear = cutYear(completeTime)
	const endMonth =   cutMonth(completeTime)
	const endDay = cutDay(completeTime)
	const yearFlag = endYear - startYear  //相差年份
	const monthFlag = endMonth - startMonth //相差月份
	const dayFlag = endDay - startDay //相差天数
	if(yearFlag>=1){ // eg:2022/12/31 XX:XX
	  return startYear + '年' + startMonth + '月' + startDay + '日 '+ cutSecond(faultDate)
	} 
	else{  //同一年
	  if(monthFlag>=1) 
	  {
		return startMonth +'月' +startDay +'日 ' + cutSecond(faultDate)
	  }
	  else{ //同一月 
		  if(dayFlag==0) { //同一天
			return "今天 "+cutSecond(faultDate)
		  }
		  if(dayFlag ==1) { //昨天
			return "昨天 "+cutSecond(faultDate)
		  }
		  if(dayFlag==2){  //前天
			return "前天 " +cutSecond(faultDate)
		  }
		  if(dayFlag>=3){
			return startMonth +'月' +startDay + '日 ' + cutSecond(faultDate)
		  }
	  }
	}
}
```
在用到的页面文件里面进行引入：
```vue
<template>
    <div> {{ timer(new Date()) }} </div>
</template>
 
<script setup>
	import { timer } from "/common/utils/handleDay.js";
</script>
 
<style lang="scss" scoped>
</style>
```
## 一行css代码重置所有样式[css]
```css
.content{
    all:unset;
}
```
效果图如下：
```js
https://img-blog.csdnimg.cn/cf4d2c91a0d344f9bdbb6409697c5e03.png
```
## js 扁平化数组转树形结构[javascript]
```js
let data=[
    {id:1,parentId:0,name:"一级菜单A",rank:1},
    {id:2,parentId:0,name:"一级菜单B",rank:1},
    {id:3,parentId:0,name:"一级菜单C",rank:1},
    {id:4,parentId:1,name:"二级菜单A-A",rank:2},
    {id:5,parentId:1,name:"二级菜单A-B",rank:2},
    {id:6,parentId:2,name:"二级菜单B-A",rank:2},
    {id:7,parentId:4,name:"三级菜单A-A-A",rank:3},
    {id:8,parentId:7,name:"四级菜单A-A-A-A",rank:4},
    {id:9,parentId:8,name:"五级菜单A-A-A-A-A",rank:5},
    {id:10,parentId:9,name:"六级菜单A-A-A-A-A-A",rank:6},
    {id:11,parentId:10,name:"七级菜单A-A-A-A-A-A-A",rank:7},
    {id:12,parentId:11,name:"八级菜单A-A-A-A-A-A-A-A",rank:8},
    {id:13,parentId:12,name:"九级菜单A-A-A-A-A-A-A-A-A",rank:9},
    {id:14,parentId:13,name:"十级菜单A-A-A-A-A-A-A-A-A-A",rank:10},
  ];
 
  function treeData(arr){
    let cloneData = JSON.parse(JSON.stringify(arr))  // 对源数据深度克隆
    return cloneData.filter(father=>{        
      let branchArr = cloneData.filter(child=>father.id == child.parentId)  //返回每一项的子级数组
      branchArr.length>0 ? father.children = branchArr : ''  //如果存在子级，则给父级添加一个children属性，并赋值
      return father.parentId==0;   //返回第一层
    });
  }
  
  console.log(treeData(data));
```
## el-upload 同名图片替换上传浏览器缓存问题详解[element-ui]
因项目需求需要将学生人脸图片名称设置为  身份证号+图片后缀名

涉及到之前已经上传的图片采取删除操作  

于是就遇到了七牛云存储已经将图片删除，但是页面中图片因浏览器缓存问题没有进行刷新

解决方案如下：

在图片img组件上加上key，在图片上传完后向后端传数据时加上时间戳
```vue
<el-upload
    class="avatar-uploader uploadStuImg"
    action="https://up-cn-east-2.qiniup.com"
    :data="qiniuData"
    v-loading="stuImgLoading"
    :headers="uploadHeaders"
    :show-file-list="false"
    :on-error="onError"
    :on-success="onSuccess"
    :before-upload="beforeUpload"
    name="file">
      <img
       v-if="studentFrom.stuPhotoUrl"
       :src="studentFrom.stuPhotoUrl"
       :key="key"
       class="avatar"/>
           <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
<script>
async beforeUpload(file) {
      let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      this.qiniuData.key = this.studentFrom.stuIdNo+'.'+testmsg; // key为上传后文件名 必填
      const extension =
        testmsg === "jpg" ||
        testmsg === "JPG" ||
        testmsg === "png" ||
        testmsg === "PNG" ||
        testmsg === "bpm" ||
        testmsg === "BPM";
      const isLt50M = file.size / 1024 / 1024 < 10;
      if (!extension) {
        this.$message({
          message: "上传图片只能是jpg / png / bpm格式!",
          type: "error",
        });
        return false; //必须加上return false; 才能阻止
      }
      console.log(file);
      if (!isLt50M) {
        this.$message({
          message: "上传文件大小不能超过 10MB!",
          type: "error",
        });
        return false;
      }
 
      // 删除已上传的图片 await
      let key = this.qiniuData.key
      //删除图片接口
      return extension || isLt50M;
    },
    // 图片上传成功
    onSuccess(res, file) {
      this.stuImgLoading = false;
      console.log(res, "44");
       this.studentFrom.stuPhotoUrl = `域名+${res.key}?t=${new Date().getTime()}`;//向后台传网址时加入t时间戳
       this.key++; //强制让img进行渲染
    },
</script>
```
解决！！
## json-server使用，无后端情况下易于前端访问接口使用[json-server]
今天无意间接触到了json-server，可以创建模拟数据供没有后端基础的前端使用

首先安装依赖
```js
npm install -g json-server
```
确保你的项目安装了axios依赖

设置axios的baseurl
```js
axios.defaults.baseURL = 'http://localhost:8081'
```
创建一个json-server文件夹，文件夹内新创一个data.json
```json
//data.json
{
 
  "list": [
 
    {
 
      "id": 1,
 
      "name": "吃饭",
 
      "flag": false
 
    },
 
    {
 
      "id": 2,
 
      "name": "睡觉",
 
      "flag": true
 
    },
 
    {
 
      "id": 3,
 
      "name": "打豆豆",
 
      "flag": true
 
    }
 
  ]
 
}
```
新建终端定位到data.json文件夹下

运行以下代码：
```js
json-server --watch --port 8081 data.json
```
然后用axios访问下面的地址 即可获得数据
```js
https://localhost:8081/list
```

数据如图：
```js
https://img-blog.csdnimg.cn/cb61aface42542ee99209d29a82db2bf.png
```
## 前端vue读取表格数据[vue/xlsx]
按照依赖
```js
首先安装依赖
npm install xlsx
```
```vue
<template>
  <div class="data">
		<input id="file" type="file" @change="readExcel">
		<br>
		{{outputs}}
	</div>
</template>
 
<script>
import * as XLSX from 'xlsx'
export default {
  data(){
		return{
			outputs:[]
		}
	},
	methods:{
		readExcel (e) {
				let that = this
				const files = e.target.files
				if (files.length < 1) {
					return false
				} else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
					return false
				}
	
				const fileReader = new FileReader()
				fileReader.readAsBinaryString(files[0])
				fileReader.onload = (ev) => {
					try {
						const data = ev.target.result
						const workbook = XLSX.read(data, {
							type: 'binary'
						}) // 读取数据
						const wsname = workbook.SheetNames[0] // 取第一张表
						const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) // 生成json表格内容
	
						that.outputs = [] // 清空接收数据
	
						for (let i = 0; i < ws.length; i++) {
							that.outputs.push(ws[i])
						}
						console.log(that.outputs)
					} catch (e) {
						console.log(e)
						return false
					}
				}
		  }
	}
}
</script>
 
<style>
	*{
		margin: auto auto;
		padding: 0;
	}
	.data{
		width: 800px;
		height: 400px;
	}
</style>
```
输入如图：
```js
https://img-blog.csdnimg.cn/73511ab65eb348cebae90e0ac0b5fa00.png
```
## HTML5+CSS3实现瀑布流布局[html5/css3]
HTML5部分：
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>瀑布流首页</title>
		<link rel="stylesheet" href="css/index.css"/>
	</head>
	<body>
		<div id="main">
			<div class="box">
				<div class="pic">
					<img src="imgs/0.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/1.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/2.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/3.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/4.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/5.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/6.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/7.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/8.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/9.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/10.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/11.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/12.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/13.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/14.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/15.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/16.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/17.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/18.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/19.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/20.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/21.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/22.jpg" />
				</div>
			</div>
			<div class="box">
				<div class="pic">
					<img src="imgs/23.jpg" />
				</div>
			</div>
		</div>
	</body>
</html>
```
CSS3：部分
```css
*{
	margin: 0;
	padding: 0;
}
 
#main{
	-webkit-column-width: 202px;
	-moz-column-width: 202px;
	column-width: 202px;
}
 
#main .box{
	padding:15px 0 0 15px;
	float: left;
}
 
#main .box .pic{
	border: 1px solid #DDDDDD;
	border-radius: 5px;
	box-shadow: 0 0 1px #ddd;
	padding: 10px;
}
 
#main .box .pic img {
	width: 165px;
}
```
效果图：
```js
https://img-blog.csdnimg.cn/e9778feb1ff34b69b0b2810c79e7cd91.png
```
## 前端vue百度地图POI搜索及经纬度回显标记[vue-baidu-map]
安装依赖
```js
npm install vue-baidu-map --save
```
然后在 main.js 中引入
```js
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'YOUR_AK'
})
```

使用：
```vue
<template>
  <div>
    <baidu-map
      style="display:flex;flex-direction: column-reverse;"
      id="allmap"
      @ready="mapReady"
      @click="getLocation"
      :scroll-wheel-zoom="false"
    >
      <div style="display:flex;justify-content:center;width:100%;margin-bottom:8px;">
        <bm-auto-complete v-model="searchJingwei" :sugStyle="{zIndex: 999999}" style="width:98%;margin-right:2%;">
          <el-input v-model="searchJingwei" placeholder="输入地址"></el-input>
        </bm-auto-complete>
        <el-button type="primary" @click="getBaiduMapPoint">搜索</el-button>
      </div>
      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
      <bm-marker v-if="infoWindowShow" :position="{lng: longitude, lat: latitude}">
        <bm-label content="" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
      </bm-marker>
      <bm-info-window :position="{lng: longitude, lat: latitude}" :show="infoWindowShow" @clickclose="infoWindowClose">
        <p>纬度:{{this.latitude}}</p>
        <p>经度:{{this.longitude}}</p>
      </bm-info-window>
    </baidu-map>
  </div>
</template>
 
<script>
export default {
  data () {
    return {
      searchJingwei:'',
      infoWindowShow:false,
      longitude:'',
      latitude:'',
      point:''
    }
  },
  methods: {
    //地图初始化
    mapReady({ BMap, map }) {
      // 选择一个经纬度作为中心点
      this.point = new BMap.Point(113.27, 23.13);
      map.centerAndZoom(this.point, 12);
      this.BMap=BMap
      this.map=map
    },
    //点击获取经纬度
    getLocation(e){
      console.log(e);
      this.longitude=e.point.lng
      this.latitude=e.point.lat
      this.infoWindowShow=true
    },
    搜索后点击定位标记
    getBaiduMapPoint(){
      let that=this
      let myGeo = new this.BMap.Geocoder()
      myGeo.getPoint(this.searchJingwei,function(point){
        if(point){
          that.map.centerAndZoom(point,15)
          that.latitude=point.lat
          that.longitude=point.lng
          that.infoWindowShow=true
        }
 
      })
    },
    //信息窗口关闭
    infoWindowClose(){
      this.latitude=''
      this.longitude=''
      this.infoWindowShow=false
    },
    //回显
    setPoint(lat,lng){
      var p = new BMap.Point(lng, lat);
      this.latitude=lat
      this.longitude=lng
      this.infoWindowShow=true
      this.map.centerAndZoom(p,16)
    },
    //地图初始化
    init(){
      var p = new BMap.Point(120.215512, 30.253083);
      this.latitude=""
      this.longitude=""
      this.searchJingwei=""
      this.infoWindowShow=false
      this.map.centerAndZoom(p,12)
    }
  }
}
</script>
 
<style scoped>
  #allmap{
    height: 450px;
    width: 100%;
    margin: 0;
  }
</style>
```
回显后的效果
```js
https://img-blog.csdnimg.cn/bdfeeb1e6a2040028d2fba029e5a3e8f.png
```
## 前端 vue 输入联想插件[v-suggest]
v-suggest

官方文档 https://github.com/wangdahoo/v-suggest

## Vite+Typescript+Vue3项目搭建[vite/typescript/vue3]
地址：
```js
https://blog.csdn.net/weixin_59685936/article/details/128759420?spm=1001.2014.3001.5502
```
## el-upload 批量上传报错 Uncaught TypeError: Cannot set properties of null (setting ‘status‘)[element-ui]
因业务需求需实现图片或视频批量上传的功能 结果发现一个坑

报错信息：
```js
https://img-blog.csdnimg.cn/f537c6d8d80c476c9df88c0edc12da19.png
```
```vue
<template>
   <el-upload
      action="https://up-cn-east-2.qiniup.com"
      multiple
      :data="qiniuOthData"
      :headers="uploadHeaders"
      :before-upload="beforeOthUpload"
      :on-success="onOthSuccess"
      :on-remove="handleRemove"
      :on-error="onError"
      :accept="'image/*,video/*'"
      list-type="picture-card"
      :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">上传视频、图片文件</div>
  </el-upload>     
</template>
 
<script>
  export default {
    data(){
      return{
        fileList:[],
        files:[]
      }
    },
    methods:{
      onError(res){
        console.log(this.uploadHeaders)
        console.log(this.qiniuDataPic)
        console.log(this.qiniuOthData)
      },
      beforeOthUpload(file) {
        console.log(file)
        this.qiniuOthData.key = new Date().getTime(); // key为上传后文件名 必填
      },
      onOthSuccess(res, file,fileList) {
        console.log(res,file,fileList)
        console.log(this.goodsForm.comHeadUrls)
        console.log(this.files)
        let a={
          name:`http://orther.kangruijk.com/` + res.key,
          url:`http://orther.kangruijk.com/` + res.key
        }
        this.files.push(a)
      }
    }
  }
</script>
```
el-upload组件file-list绑定的数组不可以手动修改它不然会报开头的错误

所以在：on-success方法中使用另一个数组来存放文件
## el-tree手动半选 父子节点不关联实现方案[element-ui]
```vue
<template>
    <el-tree
         ref="tree" 
         :data="list" 
         node-key="name" 
         show-checkbox 
         :props="defaultProps" 
         highlight-current 
         check-strictly 
         @check="handCheck" 
         @check-change="checkChange" 
    />
</template>
<script>
    export default{
        data(){
            return{
                list:[],
                defaultProps: {
					label: "label",
					children: "children"
				},
            }
        },
        method:{
            // 覆盖原有勾选功能，父与子关联，子与父不关联
            handCheck (data, node) {
                  this.hanleCheck(data, node, 'tree')
            },
            hanleCheck (data, node, treeName) {
      
              const _this = this
              // 获取当前节点是否被选中
              const isChecked = _this.$refs[treeName].getNode(data).checked
              // 如果当前节点被选中，则遍历下级子节点并选中，如果当前节点取消选中，则遍历下级节点并取消
              if (isChecked) {
                // 判断该节点是否有下级节点，如果有那么遍历设置下级节点为选中
                data.children && data.children.length > 0 && setChildreChecked(data.children, true)
              } else {
                // 如果节点取消选中，则取消该节点下的子节点选中
                data.children && data.children.length > 0 && setChildreChecked(data.children, false)
             }
      function setChildreChecked (node, isChecked) {
        node.forEach(item => {
          item.children && item.children.length > 0 && setChildreChecked(item.children, isChecked)
          // 修改勾选状态
          _this.$refs[treeName].setChecked(item.name, isChecked)
        })
      }
    },
    checkChange (data, checked, indeterminate) {
      let _this = this;
      // console.log(data, checked, indeterminate);
      // 选中全部子节点，父节点也默认选中，但是子节点再次取消勾选或者全部子节点取消勾选也不会影响父节点勾选状态
      let checkNode = _this.$refs.tree.getNode(data)//获取当前节点
      // 勾选部分子节点，父节点变为半选状态
      if (checkNode.parent && checkNode.parent.childNodes.some(ele => ele.checked)) {
        checkNode.parent.indeterminate = true
      }
      // 勾选全部子节点，父节点变为全选状态
      if (checkNode.parent && checkNode.parent.childNodes.every(ele => ele.checked)) {
        checkNode.parent.checked = true
        checkNode.parent.indeterminate = false
      }
      // 如果取消所有第二节点的勾选状态，则第一层父节点也取消勾选
      if (checkNode.level == 2 && checkNode.parent.childNodes.every(ele => !ele.checked)) {
        checkNode.parent.checked = false
        checkNode.parent.indeterminate = false
      }
    },
 
        }
    }
</script>
```
## 前端日期格式化自写函数[javascript]
```js
FormatAll(detail) {
  var year = new Date(detail).getFullYear()
  var month = (new Date(detail).getMonth() + 1) >= 10 ? (new Date(detail).getMonth() + 1) : '0' + (new Date(detail).getMonth() + 1)
  var date = new Date(detail).getDate() >= 10 ? new Date(detail).getDate() : '0' + new Date(detail).getDate()
  var getHours = new Date(detail).getHours() >= 10 ? new Date(detail).getHours() : '0' + new Date(detail).getHours()
  var getMinutes = new Date(detail).getMinutes() >= 10 ? new Date(detail).getMinutes() : '0' + new Date(detail).getMinutes()
  var getSeconds = new Date(detail).getSeconds() >= 10 ? new Date(detail).getSeconds() : '0' + new Date(detail).getSeconds()
  var data = year + '-' + month + '-' + date + ' ' + getHours + ':' + getMinutes + ':' + getSeconds
  return data
}
 
var a=new Date()
a=this.FormatAll(a)
```
## Viewer.js 图片预览插件参数说明[v-Viewer.js]

| 名称 | 类型 | 默认值 |  说明  |
|----------|----------|----------|----------|
|inline	|布尔值	|false	|启用 inline 模式|
|button	|布尔值	|true	|显示右上角关闭按钮（jQuery 版本无效）|
|navbar	|布尔值/整型	|true	|显示缩略图导航|
|title	|布尔值/整型	|true	|显示当前图片的标题（现实 alt 属性及图片尺寸）|
|toolbar	|布尔值/整型	|true	|显示工具栏|
|tooltip	|布尔值	|true	|显示缩放百分比|
|movable	|布尔值	|true	|图片是否可移动|
|zoomable	|布尔值	|true	|图片是否可缩放|
|rotatable	|布尔值	|true	|图片是否可旋转|
|scalable	|布尔值	|true	|图片是否可翻转|
|transition	|布尔值	|true	|使用 CSS3 过度|
|fullscreen	|布尔值	|true	|播放时是否全屏|
|keyboard	|布尔值	|true	|是否支持键盘|
|interval	|整型	|5000	|播放间隔，单位为毫秒|
|zoomRatio	|浮点型	|0.1	|鼠标滚动时的缩放比例|
|minZoomRatio	|浮点型	|0.01	|最小缩放比例|
|maxZoomRatio	|数字	|100	|最大缩放比例|
|zIndex	|数字	|2015	|设置图片查看器 modal 模式时的 z-index|

## 前端打印避免截断解决方案[v-print]
```vue
<template>
	<div class="main">
		<el-dialog title="666" :visible.sync="show">
			<button v-print="'#print'">666</button>
			<div class="container" id="print">
				<div class="content" v-for="(item,index) in items">
					<img src="../assets/exper-kr-pic-QRCODE380.jpg">
					<span>学校</span>
					<span>年级班级</span>
					<span>学生</span>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
 
<script>
	export default{
		data() {
			return{
				show:true,
				items:980
			}
		}
	}
</script>
 
<style>
	.el-dialog__header{
		border-bottom: 1px solid #eee;
	}
	.el-dialog__body{
		height: 600px;
		overflow-y: scroll;
	}
	.container{
		width: 100%;
		position: relative;
		page-break-after: always; //分页
	}
	.content{
		width: 16%;
		display:flex;
		flex-direction: column;
		position: relative;
		float: left;
		page-break-inside:avoid; //防截断
	}
	.content img{
		width: 100%;
	}
	.content span{
		width: 100%;
		text-align: center;
	}
</style>
```
*需注意：page-break-after: always; page-break-inside:avoid;  这两个css样式需在未定义display:flex/flex-box/block/inline-block；的情况下生效，否则无效！！！！！

插件用的是vue-print-nb

安装方法：
```js
npm install vue-print-nb --save   【vue2 版本】

npm install vue3-print-nb --save  【vue3 版本】
```
安装之后在main.js中引入它
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
 
import Print from 'vue-print-nb' //引入vue-print-nb插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Print) //使用vue-print-nb插件
Vue.use(ElementUI);
 
Vue.config.productionTip = false
 
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```
用法：通过v-print=" '#print' "绑定
```vue
<template>
	<div class="main">
		<el-dialog title="666" :visible.sync="show">
			<button v-print="'#print'">666</button>
            <!-- v-print绑定一个元素的ID属性 -->
			<div class="container" id="print">
				
			</div>
		</el-dialog>
	</div>
</template>
```
## el-select嵌套el-tree子节点全选只返回父节点方案[element-ui]
```js
<template>
    <el-select
       v-model="selectList"
       placeholder="请选择"
       multiple
       @change="selectChange">
       <el-option :value="selectValue" style="height: auto" disabled>
          <el-input
             size="mini"
             placeholder="搜索区域"
             v-model="filterText">
          </el-input>
          <el-tree
             :data="regionOptions"
             show-checkbox
             node-key="oid"
             ref="tree1111"
             highlight-current
             :props="defaultProps"
             :filter-node-method="filterNode"
             @check-change="handleCheckChange">
          </el-tree>
       </el-option>
     </el-select>
</template>
<script>
export default {
  data() {
    return {
      defaultProps: {
          label: 'thisName',
          children: 'children',
          key:'oid',
          value:'oid'
      },
      selectList: [],
      selectValue: [],
      filterText: ""
    };
  },
  mounted () {
    this.$on('change', function() {
      this.handleCheckChange()
    })
  },
  watch: {
    filterText(val) {
      this.$refs.tree1111.filter(val);
    }
  },
  methods: {
    // select框值改变时候触发的事件
    selectChange(e) {
      var arrNew = []
      var dataLength = this.selectValue.length
      var eleng = e.length
      for (let i = 0; i < dataLength; i++) {
          for (let j = 0; j < eleng; j++) {
              if (e[j] === this.selectValue[i].thisName) {
                  arrNew.push(this.selectValue[i])
              }
          }
      }
      this.$refs.tree1111.setCheckedNodes(arrNew) //设置勾选的值
    },
    // tree1111选择改变时候触发的事件
    handleCheckChange() {
      let res = this.getSimpleCheckedNodes(this.$refs.tree1111)
      let arrLabel = []
      let arr = []
      res.forEach((item) => {
          arrLabel.push(item.thisName)
          arr.push(item)
      });
      this.selectValue = arr
      this.selectList = arrLabel
    },
    // tree1111搜索
    filterNode(value, data) {
      if (!value) return true
      return data.thisName.indexOf(value) !== -1
    },
    getSimpleCheckedNodes(store) {
      const checkedNodes = [];
      const traverse = function(node) {
        const childNodes = node.root ? node.root.childNodes : node.childNodes;
        childNodes.forEach(child => {
          if (child.checked) {
            checkedNodes.push(child.data);
          }
          if (child.indeterminate) {
            traverse(child);
          }
        });
      };
      traverse(store)
      return checkedNodes;
    },
   }
}
</script>
```
## html导出为pdf[vue/javascript]
```js
  let that = this
  html2Canvas(document.querySelector(`#printMe`), {
      allowTaint: true,
      useCORS:true,
      // backgroundColor: '#FFFFFF'
    }).then(function (canvas) {
        //未生成pdf的html页面高度
        var leftHeight = canvas.height;

        var a4Width = 595.28
        var a4Height = 841.89
        //一页pdf显示html页面生成的canvas高度;
        var a4HeightRef = Math.floor(canvas.width / a4Width * a4Height);

        //pdf页面偏移
        var position = 0;

        var pageData = canvas.toDataURL('image/jpeg', 1.0);

        var pdf = new JsPDF('x', 'pt', 'a4');
        var index = 1,
            canvas1 = document.createElement('canvas'),
            height;
        pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen');

        var pdfName='检测报表';
        function createImpl(canvas) {
            if (leftHeight > 0) {
                index++;

                var checkCount = 0;
                if (leftHeight > a4HeightRef) {
                    var i = position + a4HeightRef;
                    for (i = position + a4HeightRef; i >= position; i--) {
                        var isWrite = true
                        for (var j = 0; j < canvas.width; j++) {
                            var c = canvas.getContext('2d').getImageData(j, i, 1, 1).data

                            if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
                                isWrite = false
                                break
                            }
                        }
                        if (isWrite) {
                            checkCount++
                            if (checkCount >= 10) {
                                break
                            }
                        } else {
                            checkCount = 0
                        }
                    }
                    height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef);
                    if(height<=0){
                        height = a4HeightRef;
                    }
                } else {
                    height = leftHeight;
                }

                canvas1.width = canvas.width;
                canvas1.height = height;

                var ctx = canvas1.getContext('2d');
                ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height);

                var pageHeight = Math.round(a4Width / canvas.width * height);
                // pdf.setPageSize(null, pageHeight)
                if(position != 0){
                    pdf.addPage();
                }
                pdf.addImage(canvas1.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, a4Width, a4Width / canvas1.width * height);
                leftHeight -= height;
                position += height;
                if (leftHeight > 0) {
                    setTimeout(createImpl, 500, canvas);
                } else {
                    pdf.save(pdfName + '.pdf');
                    that.$notify.closeAll()
                }
            }
        }

        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < a4HeightRef) {
            pdf.addImage(pageData, 'JPEG', 0, 0, a4Width, a4Width / canvas.width * leftHeight);
            pdf.save(pdfName + '.pdf')
        } else {
            try {
                pdf.deletePage(0);
                that.$notify.info({
                  title: '提示',
                  message: '正在生成中...',
                  duration: 0
                });
                setTimeout(createImpl, 500, canvas);
            } catch (err) {
                console.log(err);
            }
        }
      }
    )
```

## echarts二次渲染失败解决方法[echarts]
因项目需要  数据变化后需要重新初始化一遍echarts

通过打断点的方法发现

第一遍进入是生效的，数据变化后未生效

于是怀疑是未清空的原因

渲染失败原因:

需求是有一个页面展示数据图表
但是第一次进入该页面是正常渲染的，但是在这个页面跳出来，在进入的话依然是调用的echarts初始化的图标，导致页面渲染不成功，即不渲染图标
原因是：
由于容器上已经有 echarts_instance ，还是上次的，所以Echarts是不会重新初始化的，需要手动将DOM上的 echarts_instance 属性移除， 再次进行初始化， 然后setOptio
即在离开给页面的时候清空一下echarts_instance属性
解决方法：

```js
// 在setoption之前写入一行代码
// 清除echarts_instance属性
document.getElementById('xxx').removeAttribute('_echarts_instance_')
```
完美解决！！！

完美解决！！！
## 处理axios请求400并获取后端返回信息【arraybuffer转json】[javascript]
axios封装完整代码
```js
import axios from 'axios'
import { Message } from 'element-ui'
import { getToken, removeToken } from '@/utils/token'
import router from '@/router'
 
const qs = require('qs')
 
const pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const cancelToken = axios.CancelToken
const removePending = (ever) => {
  // for(let p in pending){
  //   if(pending[p].u === ever.url + '&' + ever.method) { //当当前请求在数组中存在时执行函数体
  //     pending[p].f(); //执行取消操作
  //     pending.splice(p, 1); //把这条记录从数组中移除
  //     break
 
  //   }
  // }
}
const white = [
  'schoolGrade/selectGradeById',
  'schoolClass/selectClassById',
  'studentInfo/selectStuById',
  'regionInfo/selectRegionInfoByUserId',
  'report/aMain/schooleTypeStuCount'
]
 
axios.defaults.baseURL =
//process.env.NODE_ENV === 'dev' ? 'https://webapi.kangruijk.com'
//process.env.NODE_ENV === 'dev' ? 'https://experapi.kangruijk.com'
process.env.NODE_ENV === 'dev' ? 'http://192.168.1.56:8052'
//process.env.NODE_ENV === 'dev' ? 'https://imp-health.leedarson.com/krjk'
//axios.defaults.baseURL = process.env.NODE_ENV === 'dev' ? 'https://experapi.kangruijk.com'
: process.env.NODE_ENV === 'exper' ? 'https://experapi.kangruijk.com'
: process.env.NODE_ENV === 'prod' ? 'https://webapi.kangruijk.com'
: process.env.NODE_ENV === 'ldx' ? 'https://imp-health.leedarson.com/krjk'
: 'https://imp-health.leedarson.com/krjk'
 
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 600000 ,// request timeout
})
 
// request interceptor
service.interceptors.request.use(config => {
  if (getToken()) {
    // config.headers.set('token', 'token'); //setting request.headers
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  if (config.method === 'get') {
    // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
    config.paramsSerializer = function(params) {
      return qs.stringify(params, {
        arrayFormat: 'repeat'
      })
    }
  }
 
  removePending(config) // 在一个ajax发送前执行一下取消操作
  config.cancelToken = new cancelToken((c) => {
    if (JSON.stringify(white).includes(config.url.replace(/\/vision\/web\//g, ''))) return
    // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
    pending.push({
      u: config.url + '&' + config.method,
      f: c
    })
  })
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})
 
// 总的调取接口的入口
service.interceptors.response.use(
  response => {
    removePending(response.config)
 
    // 如果登录过期的话，就把cookie里面的token移除
    if (response.data.resultCode === 10010) {
      Message({
        message: response.data.resultMsg,
        type: 'error',
        duration: 5 * 1000
      })
      removeToken()
      location.reload()
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (axios.isCancel(error)) {
      return new Promise(() => {
      })
    } else {
      if (error.message.includes('code 400')) {
        console.log(error.response.data);
        let content = error.response.data;//arraybuffer类型数据
        let resBlob = new Blob([content])
        let reader = new FileReader()
        reader.readAsText(resBlob, "utf-8")
        reader.onload = () => {
          let res = JSON.parse(reader.result)
          console.log(res)
          Message({
            type:'error',
            message:res.resultMsg
          })
        }
      }
      if (error.message.includes('code 401')) {
        Message({
          message: '登录失效，请重新登录',
          type: 'error',
          duration: 5 * 1000
        })
        removeToken()
        router.push('/login')
        return new Promise(() => {
        })
      }
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.message.includes('timeout')) {
        Message({
          message: '请求超时',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(error)
    }
 
    // return Promise.reject(error)
  })
 
export default service
```
核心代码如下：
```js
//判断可自行更改 只是举个例子
if (error.message.includes('code 400')) {
  console.log(error.response.data);
  let content = error.response.data;//arraybuffer类型数据
  let resBlob = new Blob([content])
  let reader = new FileReader()
  reader.readAsText(resBlob, "utf-8")
  reader.onload = () => {
    let res = JSON.parse(reader.result)
    console.log(res)
    Message({
      type:'error',
      message:res.resultMsg
    })
  }
}
```
## el-cascader踩坑[element-ui]
v-model可能会导致选择时子节点双击才能选中

把v-model去掉即可解决问题

那么如何设置选中呢？使用vue的$refs属性设置el-cascader setCheckedNodes(setCheckedKeys)方法即可
## Vue图片预览组件【v-Viewer.js】[vue/javascript]
首先在项目文件夹中安装依赖
```js
npm install v-viewer -S
```
然后在项目文件中的main.js中写入以下代码
```js
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
  // 需要配置的属性 注意属性并没有引号
  title: false,//不显示标题栏
  toolbar: false//不显示工具栏
})
```
然后在页面中写入
```vue
<template>
  <viewer>
    <img v-for="(decImg, index) in descImgs" :key="index" :src="decImg" style="width: 200px;height: 200px">
  </viewer>
</template>
 
<script>
export default {
  data () {
    return {
      descImgs: [         
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      ]
    }
  }
}
</script>
```
效果图地址：
```js
https://img-blog.csdnimg.cn/c4f722a79f2045e18e78234791422c9d.png
```
## 项目合并在头部导航栏做切换页面按钮实现方法[element-ui]
```vue
//在Navbar.vue中写入 
 
<template>
  <div class="navbar">
   ..............
    <el-dropdown trigger="click" style="margin-left: 60px;line-height: 50px;" @command="(command)=>{handleCommand(command)}">
      <span class="el-dropdown-link2">
        {{activeMenu}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="首页">首页</el-dropdown-item>
        <el-dropdown-item command="视力监测">视力监测</el-dropdown-item>
        <el-dropdown-item command="互联网医院">互联网医院</el-dropdown-item>
        <el-dropdown-item command="基础设置">基础设置</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
   ..............
  </div>
</template>
 
<script>
export default {
  data () {
    return {
      
    }
  },
  computed: {
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if(path.includes('info') || path.includes('detection') || path.includes('control') || path.includes('facility')|| path.includes('userManage') || path.includes('healthSchool')){
        return '视力监测'
      }else if(path.includes('registrationList') || path.includes('customerControl') || path.includes('diagnosisManagement') || path.includes('hospitalInfo')){
        return '互联网医院'
      }else{
        return '基础设置'
      }
    }
  }
}
</script>
```
这样你在哪个平台，动态显示当前平台的名称
效果图地址：
```js
https://img-blog.csdnimg.cn/e507549d8064471a896b883e9ce1eb2f.jpeg
```

## el-form中rules表单验证的注意事项[element-ui]

```vue
<el-form :model="form" :rules="rules"> 
    <el-form-item prop="input">
        <el-input v-model="form.input"></el-input>
    </el-form-item>
</el-form>
```

```js
//1、<el-form>标签绑定内容必须通过 :model='form' 绑定，不能使用v-model="form"
//2、<el-form-item prop="input">中prop后面的字符必须和<el-form-item>标签中需要验证的值的参数名一样
//3、需要验证的值必须是包含在<el-form>标签：model绑定的值里面，比如  form.input是form的参数
//否则都会导致rules校验不通过
```

## console 整理[javascript]
```js
const { log }=console
log('hi')
log('1232')
```

```js
const { log:myLog }=console;
myLog('hi')
myLog('1232')
```

```js
console.group('groupName');
consolog.log('hi')
consolog.log('hi')
consolog.groupEnd()
```

```js
let arr=[1,2,3,4,5]
console.table(arr)
```

```js
console.time('test')
for(let i=0;i<=5;i++){
    
}
console.timeEnd('test')
```

```js
console.assert(1===1,'true')
console.assert(1===[],'false')
```

```js
console.count('count 1')
for(let i=0;i<10;i++){
    i%2===0?console.count("count 1"):console.count("count 2")
}
```

## js中字符串转数值的坑[javascript]
```js
var array=['111','222','333']
array=array.map(Number)
//map不对原数组进行修改！！！！
 
 
var a='1657'
a=Number(a)   //如果a="",那么会默认给a赋值为0
```

## el-select嵌套el-tree 封装成组件[elSelectTree组件]
```vue
<template>
    <el-select
        v-model="selectList"
        placeholder="请选择"
        multiple
        @change="selectChange"
    >
        <el-option :value="selectValue" style="height: auto" disabled>
            <el-input
                size="mini"
                placeholder="搜索部门"
                v-model="filterText"
            >
            </el-input>
            <el-tree
                :data="treeList"
                show-checkbox
                node-key="oid"
                ref="tree888"
                highlight-current
                check-strictly
                :props="defaultProps"
                :filter-node-method="filterNode"
                @check-change="handleCheckChange"
            >
            </el-tree>
        </el-option>
    </el-select>
</template>
<script>
export default {
    props: {
        treeList: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            defaultProps: {
                label: 'deptName',
                children: 'children'
            },
            selectList: [],
            selectValue: [],
            filterText: ""
        }
    },
    mounted () {
        this.$on('change', function() {
            this.handleCheckChange()
        })
    },
    watch: {
        filterText(val) {
            this.$refs.tree888.filter(val);
        }
    },
    methods: {
        // select框值改变时候触发的事件
        selectChange(e) {
            var arrNew = []
            var dataLength = this.selectValue.length
            var eleng = e.length
            for (let i = 0; i < dataLength; i++) {
                for (let j = 0; j < eleng; j++) {
                    if (e[j] === this.selectValue[i].deptName) {
                        arrNew.push(this.selectValue[i])
                    }
                }
            }
            this.$refs.tree888.setCheckedNodes(arrNew) //设置勾选的值
        },
        // tree888选择改变时候触发的事件
        handleCheckChange() {
            let res = this.$refs.tree888.getCheckedNodes()
            let arrLabel = []
            let arr = []
            res.forEach((item) => {
                arrLabel.push(item.deptName)
                arr.push(item)
            });
            this.selectValue = arr
            this.selectList = arrLabel
        },
        // tree888搜索
        filterNode(value, data) {
            if (!value) return true
            return data.deptName.indexOf(value) !== -1
        }
    }
}
</script>
```

## element ui table 表格slot插槽整理[element-ui]
1、scope.row.字段名获取指定行中指定字段名的数据

以oid为例  编辑删除操作时需要向后端传oid这个字段
```html
<el-table :data="studyListAll">
  <el-table-column align="center" label="序号" prop="oid"></el-table-column>
  <el-table-column align="center" label="名称" prop="stName"></el-table-column>
  <el-table-column align="center" label="描述" prop="stPlan"></el-table-column>
  <el-table-column align="center" label="推送用户" :formatter="formatterUser">
  </el-table-column>
  <el-table-column align="center" label="打卡频次" prop='stSignFrequency' :formatter="formatterFrequency"></el-table-column>
  <el-table-column align="center" label="开始时间" prop="stStartTime"></el-table-column>
  <el-table-column align="center" label="结束时间" prop="stEndTime"></el-table-column>
  <el-table-column align="center" label="完成情况">
    <template slot-scope="scope">
      <el-button type="text" @click="lookDetail(scope.row.oid)">查看详情</el-button>
    </template>
  </el-table-column>
  <el-table-column align="center" label="是否隐藏" prop="tstatus">
    <template slot-scope="scope">
      <el-switch
        v-model="scope.row.tstatus"
        :active-value="1"
        :inactive-value="0"
        @change="val=>{changeTstatus(val,scope.row.oid)}">
      </el-switch>
    </template>
  </el-table-column>
  <el-table-column align="center" label="创建时间" prop="createdTime"></el-table-column>
  <el-table-column align="center" label="操作">
    <template slot-scope="scope">
      <el-button type="text" @click="edit(scope.row.oid)">编辑</el-button>
      <el-button type="text" class="btn-red" @click="del(scope.row.oid)">删除</el-button>
    </template>
  </el-table-column>
</el-table>
```
2、scope.column.字段名

获取列数据

3、scope.$index 获取当前行的下标

以之前打卡后台管理的项目为例子  后台返回的数据中包含detail这个字段  字段为json字符串

需要根据当前行下标去外层数据取它的detail数据
```html
<el-table :data="detailTable">
  <!-- <el-table-column align="center" label="学校" prop="schoolName"></el-table-column> -->
  <el-table-column align="left" label="年级" prop="gradName" width="100"></el-table-column>
  <el-table-column align="left" label="学生姓名" prop="stuName" width="100"></el-table-column>
  <el-table-column label="打卡数据详情">
    <template slot-scope="scope">
      <el-table :data="JSON.parse(detailTable[scope.$index].detail)" :row-class-name="innerClass">
        <el-table-column
          v-for="(item,index) in JSON.parse(detailTable[scope.$index].detail)"
          :key="index"
          :label="item.day"
          align="center"
          width="100">
          <template>
            <!-- <span>{{scope.$index}}</span> -->
            <span v-bind:style="{color:item.isSign===0?'red':'green'}">{{item.isSign===0?'未打卡':'已打卡'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </el-table-column>
</el-table>
```

## element ui table双层嵌套[element-ui]
应项目要求做后台打卡管理系统遇到的
后来选择el-table双层嵌套来实现它
```html
<el-table :data="detailTable">
  <!-- <el-table-column align="center" label="学校" prop="schoolName"></el-table-column> -->
  <el-table-column align="left" label="年级" prop="gradName" width="100"></el-table-column>
  <el-table-column align="left" label="学生姓名" prop="stuName" width="100"></el-table-column>
  <el-table-column label="打卡数据详情">
    <template slot-scope="scope">
      <el-table :data="JSON.parse(detailTable[scope.$index].detail)" :row-class-name="innerClass">
        <el-table-column
          v-for="(item,index) in JSON.parse(detailTable[scope.$index].detail)"
          :key="index"
          :label="item.day"
          align="center"
          width="100">
          <template>
            <!-- <span>{{scope.$index}}</span> -->
            <span v-bind:style="{color:item.isSign===0?'red':'green'}">{{item.isSign===0?'未打卡':'已打卡'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </el-table-column>
</el-table>
```
后台数据结构图地址:
```js
https://img-blog.csdnimg.cn/ac057ccc9c5a4926997ee992a9e83696.png
```
在span标签中写三元判断打卡与否设置字体颜色

效果图地址：
```js
https://img-blog.csdnimg.cn/6a56946e18724e29a55b1b46fdcc3b37.jpeg
```

## Vue2 富文本编辑器[Vue2-Editor]
```js
//安装依赖
npm install vue2-editor
```
然后在你需要用到它的vue 文件中的script标签中引入它
```js   
import Vue2Editor from 'vue2-editor'
```
再然后在export default中以组件形式引入它

```html
<template> 
  <div class="app-container">
    <vue2-editor v-model="content" :height="300"></vue2-editor>
  </div>
</template>

<script>
export default {
  name: 'app-container',
  data() {
    return {
      content: '',
    };
  },
  components: {
    Vue2Editor,
  },
};
</script>
```
效果图地址：
```js
https://img-blog.csdnimg.cn/2059658c60c8407a9ff973864a8b5058.jpeg
```
