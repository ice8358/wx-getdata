const Rize = require('rize');
const cheerio = require('cheerio');
const rize = new Rize({ headless: false });
const fs = require('fs')
const json2xls = require('json2xls');
var query = require('../custom');
var arr = [];
rize.goto(query.url)
    .withAuth(query.username, query.password)
    .withHeaders({'cookie': query.cookie});
// 获取页面详情信息
async function getPageDetail(startPage) {
    rize.waitForNavigation(300);
    console.log('开始查找',startPage)
    const htmlStr1 = await rize.find('ul#list',rize.html);
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
    let start = query.start; // 开始页
    let end = query.end > allPage ? allPage : query.end; // 结束页

    let endPage = end ? end : allPage; // 结束页
    if (start < 1) {
        rize.end();
        return;
    };
    if (end < start) {
        rize.end();
        return;
    };
    if (start != 1) {
        rize.type('input.weui-desktop-pagination__input', String(start))
            .press('Enter')
            .waitForNavigation(300);
    }
    let timer = setInterval(async ()=>{
        if (start > endPage) {
            console.log('最后一页了！！！')
            clearInterval(timer);
            timer = null;
            rize.end();
            toJson();
            toEcel();
        } else {
            getPageDetail(start);
            rize.waitForNavigation(300);
            rize.clickLink('下一页');
            start ++;
        }
    },1000)
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

    console.log('写成excel表格格式咯！！！');
}

