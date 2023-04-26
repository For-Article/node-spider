const cluster = require('cluster');
const cpuNums = require('os').cpus().length;

cluster.setupMaster({
    exec: './src/worker.js',
    args: ['--use', 'http']
});

console.log(`一共开启${cpuNums}个子进程来进行爬取`);
console.log('爬取数据是乱序的，因此给爬取的数据增加movieIndex字段\n');

let pageNum = 10;
const startTime = Date.now();
const dataList = [];

for (let i = 0; i < cpuNums; ++i) {
    let work = cluster.fork();

    // 抓取豆瓣前 10 页日本动画数据
    work.send([i , cpuNums, pageNum]);

    work.on('message' , (message) => {
        // 排序, 根据 index 将抓取到的数据放入正确的队列索引位置
        const { data, index } = JSON.parse(message);
        dataList[index-1] = data; 

        pageNum--;

        if (pageNum === 0) {
            console.log(`\n已完成所有爬取， using ${Date.now() - startTime} ms\n`);
            console.log('排序后的数据长度为:', dataList.length);
            console.log('接下来关闭各子进程:\n');
            cluster.disconnect();
        }
    });
}

cluster.on('fork', (worker) => {
    console.log(`[master] : fork worker ${worker.id}\n`);
});

cluster.on('exit', (worker) => {
    console.log(`[master] : 子进程 ${worker.id} 被关闭`);
});






