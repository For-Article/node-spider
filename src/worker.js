const spider = require('./spider');

process.on('message', (params) => {
    let num = 0;
    const pageNum = 20;
    const maxPageStart = params[2] * 20 -1;

    while (pageNum * (num + params[0]) <= maxPageStart) {
        let pageStart = pageNum * (num + params[0]);

        (async () => {
            const data = await spider(pageStart);
            
            const index = (pageStart + 20) / 20;
            console.log(`子进程 ${process.pid} 成功爬取日本动画第${index}页数据`);

            // 通知主线程抓取到的数据，以及当前抓取的页数
            process.send(JSON.stringify({ data, index }));
        })();

        num += params[1];
    }
});
