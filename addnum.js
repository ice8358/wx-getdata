const fs = require('fs');
const json2xls = require('json2xls');

fs.readFile('excel.json','utf8',(err,data)=>{
    if (err) {
        console.log('出错了',err)
        throw err
    };
    const arr = JSON.parse(data);
    // 去重部门名称，增加
    var dataArr = [];
    var currentPart = '';
    var partCount = 0;
    var currentSiju = '';
    var sijuCount = 0;
    var allCount = 0;
    var currentIndex = -1;
    var currentSc = -1;
    // aaaaa = arr.slice(8, 18);
    arr.map((item, index)=>{
        // console.log(item['部门名称'] != currentPart)
        if (item['部门名称'] != currentPart) {
            currentPart = item['部门名称'];
            currentSiju = item['用人司局'];
            partCount = item['招考人数'];
            sijuCount = item['招考人数'];
            dataArr.push({
                name: currentPart,
                count: partCount,
                child: [{
                    name: currentSiju,
                    count: sijuCount
                }]
            })
            ++currentIndex;
            currentSc = 0;
            
        } else {
            partCount += Number(item['招考人数']);
            let currChild = dataArr[currentIndex];
            dataArr[currentIndex].count = partCount;
            if (item['用人司局'] != currentSiju) {
                currentSiju = item['用人司局'];
                sijuCount = item['招考人数'];
                currChild.child.push({
                    name: currentSiju,
                    count: sijuCount
                })
                ++ currentSc;
            } else {
                sijuCount += Number(item['招考人数']);
                currChild.child[currentSc].count = sijuCount;
            }
        }
        allCount += Number(item['招考人数']);
    })
    dataArr = [{'一共招考人数':allCount}].concat(dataArr)
    fs.writeFileSync('统计招考人数.js', JSON.stringify(dataArr));
})
