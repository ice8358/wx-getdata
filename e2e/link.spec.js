const Rize = require('rize');
const cheerio = require('cheerio');
const rize = new Rize({ headless: false });
const fs = require('fs')
const json2xls = require('json2xls');
var count = 0;
var arr = [];
rize.goto('https://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token=983459744')
    .withAuth('shiguanghuijide5', 'Sssj655888')
    .withHeaders({'cookie': 'appmsglist_action_3092634507=card; appmsglist_action_3585759551=card; pgv_pvi=5769268224; RK=yZz4YsTyfg; ptcz=d728532d357df8c9c80c644c6d67e6067dbc287607e352edff1cdb29dc227c61; pgv_pvid=1603762680; o_cookie=835822143; pac_uid=1_835822143; tvfe_boss_uuid=631712f432f1c5df; ua_id=fndq67IUcDIkVNvHAAAAANTMMCiZHy7c0Sm3toaKN-k=; mm_lang=zh_CN; wxuin=91166257033798; ts_uid=8423594688; iip=0; ptui_loginuin=835822143; _mta_closed_sysmsg=9999; eas_sid=N1Y6M0G0c2y4T5t5V2b6a3M5N1; noticeLoginFlag=1; openid2ticket_oYQthtzUwj5gEyWuG2yFP7eKgnJs=IgjtxRaWZvrg/KX5H5c3HtEYRjnwBy0uXQMjrvFR2CE=; bizuin=3585759551; rewardsn=; wxtokenkey=777; pgv_si=s1103371264; uuid=795a0360c671787347b331021ae01c65; ticket=c1a0c0068d87c8c35d1f849c457e4cb052040b6e; ticket_id=gh_96d8e1743eba; cert=uqNQq6X3ycjzhNwhMhYJvDgVM2nM2OR6; rand_info=CAESIMEcSWKn2m3ICO2qAd+rDXMcxb3D35blwKId74lL+Xk3; slave_bizuin=3585759551; data_bizuin=3585759551; data_ticket=Z2fiXNO2I1ZcOgvmsJ2yN/5/0fZP8IYITysxxgOiRSEULCwZjBzUANn48dGG7Fr9; slave_sid=bWNKaTkzaGpwUjNDWmZYVkpuQmR0TGcxZDR4OWhpUEFpZU1hRWlpSjJfakszcjk0aWFSeTRCOXBaWml0cG1QV3BRRWg1N2pkcGFvdnJrRTFydFVQb25TbGRsd2VTZllaNE8yb011bmpsYUx0dTFXTFdxMnZCWEVPSUZKSGZob1REeGg1bzZvNHJEd1J2V3ll; slave_user=gh_96d8e1743eba; xid=737c7aae933adc21b7d6f09024c7860b; openid2ticket_oP1m61Rzj-WCY9ne7zKxKxuLZ0UY=Xl5WL7OILUwk1hrfBDCGkwSnG+5S2d/9dBCwOeZV9SM='});
// 获取页面详情信息
async function getPageDetail() {
    console.log('开始查找',count)
    const htmlStr1 = await rize.find('ul#list',rize.html)
    var $ = cheerio.load(htmlStr1);

    $("li").each(function(index,item) {
        var timeItem = $(this).find(".weui-desktop-mass__content");

        timeItem.map((liindex,liitem)=>{
            var msgItem = $(liitem).find(".weui-desktop-mass-appmsg");
            msgItem.map((msgindex,msgItem)=>{
          
            var aEle = $(msgItem).find("a.weui-desktop-mass-appmsg__title");
    
              let time = $(item).find(".weui-desktop-mass__time").text();
              let title = $(msgItem).find(".weui-desktop-mass-appmsg__bd .weui-desktop-mass-appmsg__title span").text();
              let read = $(msgItem).find(".appmsg-view .weui-desktop-mass-media__data__inner").text();
              let like = $(msgItem).find(".appmsg-haokan .weui-desktop-mass-media__data__inner").text();
              let area = msgindex+1;
              let href = $(aEle).attr("href");

              arr.push({
                  time,
                  title,
                  read,
                  like,
                  area,
                  href
              })
            })
        })
    });
}

// 为了有充足的时间登陆
setTimeout(async ()=>{
    var currentPage = await rize.findAll(".weui-desktop-pagination__num", 0, rize.text)
    var allPage = await rize.findAll(".weui-desktop-pagination__num", 1, rize.text)
    console.log('当前页：',currentPage,'总页数：',allPage)
    let start = 1;
    let timer = setInterval(async ()=>{
        count ++;
        getPageDetail()
        start ++;
        if (start > allPage) {
            console.log('最后一页了！！！')
            clearInterval(timer);
            timer = null;
            toJson();
            toEcel();
        } else {
            rize.clickLink('下一页')
        }
    },1000)
    setTimeout(()=>{
        rize.end();       
    },15000)  
},10000)

var path = 'data.json';
function toJson() {
    let new_data=JSON.stringify(arr);	//将json对象转化为字符处才能存储进去
    fs.writeFile(path,new_data,function(err){
        if(err){
            console.log(err);
        }else{
            console.log("data.json数据添加成功！");
        }
    })
}

function toEcel() {
    console.log('写成excel表格格式咯！！！');
    
    var jsonArray = [];
    arr.forEach(function(item){
        let temp = {
            '时间' : item.time,
            '标题' : item.title,
            '阅读量' : item.read,
            '喜欢看' : item.like,
            '位置' : item.area,
            '超链接' : item.href
        }
        jsonArray.push(temp);
    });
    let xls = json2xls(jsonArray);
    
    fs.writeFileSync('微信数据.xlsx', xls, 'binary');
}

