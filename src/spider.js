const superagent = require('superagent');
const api = 'https://movie.douban.com/j/search_subjects';

module.exports = (pageStart) => {
    return new Promise((resolve, reject) => {
        superagent
            .get(api)
            .query({
                pageStart,
                'type': 'tv',
                'tag': '日本动画',
                'sort': 'recommend',
                'page_limit': 20,
            })
            .type('form')
            .accept('application/json')
            .end((err, res) => {
                if (err) reject(err);

                // 加唯一id，保证多线程爬取数据的先后顺序可以确定
                let resObj = JSON.parse(res.text);
                resObj.subjects.forEach((item, index) => {
                    resObj.subjects[index].movieIndex = pageStart + index;
                });

                // 结果输出
                // console.log(resObj);

                resolve();
            })
    });
};
