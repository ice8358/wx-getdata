const Rize = require('rize');
const fs = require('fs');
const cheerio = require('cheerio');
const json2xls = require('json2xls');
const rize = new Rize({ 
    headless: false,
    width: 1200,
    height: 10000
 });


fs.readFile('data.json','utf8',(err,data)=>{
    if (err) {
        console.log('出错了',err)
        throw err
    };
    const urlArr = JSON.parse(data);
    var jsonArray = [];

    urlArr.map((item,index)=>{

        rize.goto(item['href']);
        (async () => {
            // let shortTitle = item['title'].substring(0,5);
            // let shortTime = `${item['time'].substring(0,4)}-${item['time'].substring(5,7)}-${item['time'].substring(8,10)}`
            //     .saveScreenshot('screenshots/'+shortTime+' '+shortTitle+'.png');
            // rize.waitForNavigation(500)
            var bodyHtml = await rize.find('.rich_media_area_primary_inner',rize.html);
            var $ = cheerio.load(bodyHtml);
            // $("img").each(function(imgindex,imgitem) {
                //     console.log($(imgitem).attr('src'))
                // })
            var videoStr = '';
            $(".video_iframe").each(function(imgindex,imgitem) {
                videoStr += (imgindex+1) + '：' + $(imgitem).attr('data-src') + '        ';
            })
            const divText = $('div').text();
            var reg = new RegExp(/(来源)[^\x00-\xff]{1,20}/,"g");
            var str = divText.match(reg) ? divText.match(reg)[divText.match(reg).length - 1] : '';
            let temp = {
                '时间' : item['time'],
                '标题' : item['title'],
                '阅读量' : item['read'],
                '喜欢看' : item['like'],
                '位置' : item['area'],
                '超链接' : item['href'],
                '视频' : videoStr,
                '来源' : str
            }
            jsonArray.push(temp);

        })()
    })
        
    rize.end();

    var dataTimer;
    function isGetdata() {
        
        if (jsonArray.length == urlArr.length) {
            // console.log('true');
            // console.log('相等: ', 'urlArr:',urlArr.length, 'jsonArray:',jsonArray.length)
            // console.log(jsonArray)
            clearInterval(dataTimer);
            dataTimer = null;
            let xls = json2xls(jsonArray);
            fs.writeFileSync('微信公众号数据-来源.xlsx', xls, 'binary');
            return true;
        } else {
            // console.log('false');
            // console.log('不等: ', 'urlArr:',urlArr.length, 'jsonArray:',jsonArray.length)
            return false;
        }
    }
    if (!isGetdata()) {
        dataTimer = setInterval(()=>{
            isGetdata();
        },2000)
    }
  })