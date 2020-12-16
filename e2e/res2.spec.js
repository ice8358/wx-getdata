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

    urlArr.map(async (item)=>{
        rize.goto(item['href']);
            let divStr = await rize.find('div',rize.text);
            console.log('---------',item['href'])
            // let shortTitle = item['title'].substring(0,5);
            // let shortTime = `${item['time'].substring(0,4)}-${item['time'].substring(5,7)}-${item['time'].substring(8,10)}`
            //     .saveScreenshot('screenshots/'+shortTime+' '+shortTitle+'.png');
            // const isVisible = await rize.isPresent('div.weui-msg__title');
            if (divStr.indexOf('该内容已被发布者删除') != -1) {
                let temp = {
                    '时间' : item['time'],
                    '标题' : item['title'],
                    '阅读量' : item['read'],
                    '喜欢看' : item['like'],
                    '位置' : item['area'],
                    '超链接' : item['href'],
                    '来源' : '/',
                    '备注' : '该内容已被发布者删除'
                }
                jsonArray.push(temp);
                return;
            }
            if (divStr.indexOf('此内容发送失败无法查看') != -1) {
                let temp = {
                    '时间' : item['time'],
                    '标题' : item['title'],
                    '阅读量' : item['read'],
                    '喜欢看' : item['like'],
                    '位置' : item['area'],
                    '超链接' : item['href'],
                    '来源' : '/',
                    '备注' : '此内容发送失败无法查看'
                }
                jsonArray.push(temp);
                return;
            }
            let reg = new RegExp(/(来源)[^\x00-\xff]{1,20}/,"g");
            let str = divStr.match(reg) ? divStr.match(reg)[divStr.match(reg).length - 1] : '';
            let temp = {
                '时间' : item['time'],
                '标题' : item['title'],
                '阅读量' : item['read'],
                '喜欢看' : item['like'],
                '位置' : item['area'],
                '超链接' : item['href'],
                '来源' : str,
                '备注' : ''
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
            fs.writeFileSync('微信公众号数据-来源2.xlsx', xls, 'binary');
            console.log('表格生成成功啦！！！！')
            var path = 'videodata.json';

                let new_data=JSON.stringify(jsonArray);	//将json对象转化为字符处才能存储进去
                fs.writeFile(path,new_data,function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("videodata.json数据添加成功！");
                    }
                })
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