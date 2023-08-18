import { defineConfig } from "vitepress";
const sidebar = {
    '/experience/': [
        {
            text: 'Experience',
            items: [
                {
                    text: '分类',
                    link: '/experience/',
                    items: [
                        {
                            text: '前端',
                            link: '/experience/frontEnd/frontEnd'
                        },
                        {
                            text: '后端',
                            link: '/experience/backEnd/backEnd'
                        },
                        {
                            text: '小程序',
                            link: '/experience/miniapp/miniapp'
                        },
                        {
                            text: 'git',
                            link: '/experience/git/git'
                        }
                    ]
                },
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
            appId: 'BIYTGOKM5C', // 需要替换
            apiKey: '30771f89d8c8d2ef8bffcaa26c1d921e', // 需要替换
            indexName: 'MyApplication', // 需要替换
            placeholder: '请输入关键词',
            buttonText: '搜索'
        },
        aside:true,
        outline:'deep',
        outlineTitle:"In This Page"
    }
})
