使用须知：
================

准备安装环境：node、npm


操作步骤：

1. 解压打开文件夹【wx-getdata】，在根目录下右击选择在此处打开命令行，输入`npm install`，这个时候会慢些，请耐心等候（不要中途关闭命令行），如果当前文件夹下有一个node_modules文件夹，说明安装成功了

3. 获取微信后台数据: 

    > 找到custom.js

    > 修改网址、身份、cookie、开始页、结束页，修改完成之后一定要 【保存！保存！保存！保存！】

    > 在命令行中输入`npm run link`，等待程序执行完毕之后，如果文件夹下出现正确格式的“微信数据.xlsx”文件，说明已经获取成功

4. 获取每篇文章中来源：

    > 确保刚才获取的微信数据是成功的。

    > 在命令行中输入`npm run res`，等待程序执行完毕之后，如果文件夹下出现正确格式的“微信公众号数据-来源.xlsx”文件，说明已经获取成功