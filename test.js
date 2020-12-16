const Rize = require('rize');
const fs = require('fs');
const cheerio = require('cheerio');
const json2xls = require('json2xls');
const rize = new Rize({ 
    headless: false,
    width: 1200,
    height: 10000
 });

var urlArr = [
    {
        "time": "2019年10月11日",
        "title": "纳税人提供建筑服务适用简易计税是否还需要备案？",
        "read": "366",
        "like": "0",
        "area": 5,
        "href": "http://mp.weixin.qq.com/s?__biz=MzA3MDQ0OTMzOQ==&mid=2649386451&idx=5&sn=4c1e49184c83af704e7207a9b3b328cd&chksm=87226c07b055e511652306f045ed8c0f9e549162db03ce8399caa0d8d5c4ad3685d955b37272#rd"
    },
    {
        "time": "2019年10月10日",
        "title": "发票系统系列学习四丨如何登录该平台、操作抵扣勾选呢？视频辅导来了~",
        "read": "1669",
        "like": "4",
        "area": 1,
        "href": "http://mp.weixin.qq.com/s?__biz=MzA3MDQ0OTMzOQ==&mid=2649386438&idx=1&sn=27ede4aea67a47f335e2cb63cded1128&chksm=87226c12b055e504433a068c9b1cf3f260bc51b26988c17e9f2541da44061e8724c77cf1d4ee#rd"
    },
    {
        "time": "2019年10月10日",
        "title": "发票系统系列学习四丨如何登录该平台、操作抵扣勾选呢？视频辅导来了~",
        "read": "1669",
        "like": "4",
        "area": 1,
        "href": "https://mp.weixin.qq.com/s?__biz=MzA3MDQ0OTMzOQ==&mid=2649387572&idx=1&sn=422ecdb13da7491246db9f36a9bd717d&chksm=872273e0b055faf6b42ccd24e7be38e4c17c1d2535cde9099b6e92de04cf5e92dfc3d84e57a8#rd"
    },
    {
        "time": "2019年10月10日",
        "title": "发票系统系列学习五丨敲黑板！进项发票查询及发票下载详细操作来啦~",
        "read": "730",
        "like": "2",
        "area": 2,
        "href": "https://mp.weixin.qq.com/s?__biz=MzA3MDQ0OTMzOQ==&mid=2649383640&idx=4&sn=533258e93f17deb0415e0299fcc60495&chksm=8722630cb055ea1a959091335e6095b3bb62fc03d8dd08e83c2a6f03fad312e42c61f89041a1#rd"
    },
    {
        "time": "2019年10月10日",
        "title": "发票系统系列学习五丨敲黑板！进项发票查询及发票下载详细操作来啦~",
        "read": "730",
        "like": "2",
        "area": 2,
        "href": "http://mp.weixin.qq.com/s?__biz=MzA3MDQ0OTMzOQ==&mid=2649386438&idx=2&sn=9b01600f34a2e82e5a2fa27f087710a9&chksm=87226c12b055e504bf6f13f87026e6bc07ea2b4caf3b7308f5818defebeb54e28d79b75b2afd#rd"
    },
    
]
var jsonArray = [];
var curHtml = '';

urlArr.map(async (item,index)=>{
        rize.goto(item['href']);
        // let bodyHtml = await rize.find('.rich_media_area_primary_inner',rize.html);
        // let divStr = await rize.find('div',rize.text);
        
        // let videoStr = '';
        // let $ = cheerio.load(bodyHtml);
        
        // $("iframe").each(function(imgindex,imgitem) {
        //     videoStr += $(imgitem).attr('data-src') ? ((imgindex+1) + '：' + $(imgitem).attr('data-src') + '        ') : '';
        // })
    
        // let reg = new RegExp(/(来源)[^\x00-\xff]{1,20}/,"g");
        // let str = divStr.match(reg) ? divStr.match(reg)[divStr.match(reg).length - 1] : '';
        // jsonArray.push({
        //     'res': str,
        //     'video': videoStr
        // })
        const isVisible = await rize.isPresent('div.weui-msg__title')
        if (isVisible) {
            let temp = {
                '时间' : item['time'],
                '标题' : item['title'],
                '阅读量' : item['read'],
                '喜欢看' : item['like'],
                '位置' : item['area'],
                '超链接' : item['href'],
                '视频' : '/',
                '来源' : '/',
                '备注' : '该内容已被发布者删除'
            }
            jsonArray.push(temp);
            console.log(jsonArray)
        }
        console.log(isVisible)

})
setTimeout(() => {
    rize.end()
}, 2000);
// var dataTimer;
// function isGetdata() {
    
//     if (jsonArray.length == urlArr.length) {
//         // console.log('true');
//         // console.log('相等: ', 'urlArr:',urlArr.length, 'jsonArray:',jsonArray.length)
//         // console.log(jsonArray)
//         rize.end();
//         clearInterval(dataTimer);
//         dataTimer = null;
//         console.log('成功啦！！！！')
//         console.log(jsonArray)
//         return true;
//     } else {
//         // console.log('false');
//         // console.log('不等: ', 'urlArr:',urlArr.length, 'jsonArray:',jsonArray.length)
//         return false;
//     }
// }
// if (!isGetdata()) {
//     dataTimer = setInterval(()=>{
//         isGetdata();
//     },2000)
// }

  