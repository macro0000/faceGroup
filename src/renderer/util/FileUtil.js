import fs from 'fs'
const _fs = require("fs");

const _promise = (path, call) => {
    return new Promise(function (resolve, reject) {
        _fs.access(path, (err) => {
            if (err) {
                reject(err)
            } else {
                call(resolve, reject)
            }

        })
    })
}

const copy = function (src, dst) {
    src = src.replace(/\\/g, '//')
    let srcsplit = src.split("//")
    dst += `//${srcsplit[srcsplit.length - 1]}`
    console.log(src, dst)

    let readable, writable;
    readable = fs.createReadStream(src);
    // 创建写入流
    writable = fs.createWriteStream(dst);
    // 通过管道来传输流
    readable.pipe(writable);
};

const file = {
    /**
     * 创建，记录需要创建文件夹和文件内容
     */
    create: (path) => {
        return new Promise(function (resolve, reject) {
            try {
                let data = {
                    createTime: new Date().getTime(),
                }
                _fs.writeFileSync(path, JSON.stringify(data));
                resolve(data);
            } catch (error) {
                reject(error);
            }

        })

    },
    /**
     * 保存
     */
    save: (path, data) => {
        return _promise(path, (s, e) => {
            _fs.writeFileSync(path, data);
            s()
        })
    },
    /**
     * 读取，返回空间内容
     */
    has: (path) => {
        return _promise(path, (s, e) => {
            var fileReadStream = fs.createReadStream(path);
            var str = '';
            fileReadStream.on('data', (data) => {
                console.log("接收到" + data.length);
                str += data;
            })
            fileReadStream.on('end', () => {
                console.log(" --- 结束 ---");
                console.log(str);
                s(str)
            })
            fileReadStream.on('error', (error) => {
                console.log(error)
                e(error)
            })
        })
    },
    /**
     * 读取列表
     */
    list: (path) => {
        return _promise(path, (s, e) => {
            s(_fs.readdirSync(path))
        })
    },
    outPut(fileGroup, path) {
        return new Promise(function (resolve, reject) {
            try {
                const date = new Date()
                let rootpath = `${path}//${date.format('yyyy-MM-dd hhmmss')}`.replace(/\\+/g, '//')
                fs.mkdir(`${rootpath}`, () => {
                    for (let x in fileGroup) {
                        let item = fileGroup[x];
                        fs.mkdir(`${rootpath}//${item.name}`, () => {
                            for (let y in item.pics) {
                                let pic = item.pics[y];
                                copy(pic.path, `${rootpath}//${item.name}`)
                            }
                        });
                    }
                })

                resolve({
                    path: rootpath, groupl: fileGroup.length, filel: fileGroup.reduce((accumulator, currentValue) => {
                        if( typeof accumulator  == 'object'){
                           return accumulator.pics.length + currentValue.pics.length;
                        }else{
                            return accumulator + currentValue.pics.length;
                        }
                    })
                })
            } catch (error) {
                reject(error)
            }
        })

    }
};

/**
* 时间对象的格式化;
*/
Date.prototype.format = function (format) {
    /*
     * eg:format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S+": this.getMilliseconds()
        // millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
            - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            var formatStr = "";
            for (var i = 1; i <= RegExp.$1.length; i++) {
                formatStr += "0";
            }

            var replaceStr = "";
            if (RegExp.$1.length == 1) {
                replaceStr = o[k];
            } else {
                formatStr = formatStr + o[k];
                var index = ("" + o[k]).length;
                formatStr = formatStr.substr(index);
                replaceStr = formatStr;
            }
            format = format.replace(RegExp.$1, replaceStr);
        }
    }
    return format;
}

export default file;