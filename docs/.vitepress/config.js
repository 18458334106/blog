import { defineConfig } from "vitepress";

const sidebar = {
    '/experience/': [
        {
            text: 'Experience',
            items: [
                { text: 'One', link: '/experience/' },
            ]
        }
    ]
}

export default defineConfig({
    title: '某公司摸鱼前端的Blog',
    description: '某公司摸鱼前端的Blog',
    themeConfig:{
        nav:[
            {text:'Home',link:'/'},
            {text:'Experience',link:'/experience/'},
            {text:'About',link:'/about'},
            {text:'Gitee',link:'https://gitee.com/zhaojc-077399'},
            {text:'GitHub',link:'https://github.com/19857191790/blog'},
            {text:'CSDN',link:'https://blog.csdn.net/weixin_59685936?type=blog'}
        ],
        sidebar:sidebar,
        footer: {
            message: '某公司摸鱼前端'
        },
        algolia: {
            appId: 'GBAS9WWDFX', // 需要替换
            apiKey: 'f007d55319778299b77c21f422fbb4e8', // 需要替换
            indexName: 'MyBlogWebSite', // 需要替换
            placeholder: '请输入关键词',
            buttonText: '搜索'
        }
    }
})
