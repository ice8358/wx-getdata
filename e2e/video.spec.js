const Rize = require('rize');
const fs = require('fs');
const cheerio = require('cheerio');
const json2xls = require('json2xls');
const rize = new Rize({ 
    headless: false,
    width: 1200,
    height: 10000
 });


fs.readFile('videodata.json','utf8',(err,data)=>{
    if (err) {
        console.log('出错了',err)
        throw err
    };
    const urlArr = JSON.parse(data);
    var jsonArray = [];
    urlArr.map(async (item)=>{
        if (item['备注']) {
            let temp = {
                '时间' : item['时间'],
                '标题' : item['标题'],
                '阅读量' : item['阅读量'],
                '喜欢看' : item['喜欢看'],
                '位置' : item['位置'],
                '超链接' : item['超链接'],
                '视频' : '/',
                '来源' : item['来源'],
                '备注' : item['备注']
            }
            jsonArray.push(temp);
            return;
        }
        rize.goto(item['超链接']);
        let bodyHtml = await rize.find('.rich_media_area_primary_inner',rize.html)
        let $ = cheerio.load(bodyHtml);
        console.log('---------',item['超链接'])
        let videoStr = '';
        $("iframe").each(function(imgindex,imgitem) {
            console.log($(imgitem).attr('data-src'),$(imgitem).attr('src'))
            let datasrc = $(imgitem).attr('data-src');
            let src = 'https:'+$(imgitem).attr('src');
            let curr = datasrc || src || '视频';
            videoStr += ((imgindex+1) + '：' + curr + '        ');
        })
        // console.log(item['href']);
        // console.log('---------------',videoStr)
        let temp = {
            '时间' : item['时间'],
            '标题' : item['标题'],
            '阅读量' : item['阅读量'],
            '喜欢看' : item['喜欢看'],
            '位置' : item['位置'],
            '超链接' : item['超链接'],
            '视频' : videoStr,
            '来源' : item['来源'],
            '备注' : item['备注']
        }
        jsonArray.push(temp);
    })
    var dataTimer;
    function isGetdata() {
        
        if (jsonArray.length == urlArr.length) {
            rize.end();
            clearInterval(dataTimer);
            dataTimer = null;
            let xls = json2xls(jsonArray);
            fs.writeFileSync('微信公众号数据-视频.xlsx', xls, 'binary');
            console.log('表格生成成功啦！！！！')
            return true;
        } else {
            return false;
        }
    }
    if (!isGetdata()) {
        dataTimer = setInterval(()=>{
            isGetdata();
        },2000)
    }
  })