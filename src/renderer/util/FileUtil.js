import fs from 'fs'
const _promise = (path, call) => {
    return new Promise(function (resolve, reject) {
        fs.access(path, (err) => {
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


const fileDisplay = function (filePath) {
    var result = Array();
    //根据文件路径读取文件，返回文件列表
    const files = fs.readdirSync(filePath);
    files.forEach((filename) => {
        //获取当前文件的绝对路径
        var filedir = `${filePath}\\${filename}`
        //根据文件路径获取文件信息，返回一个fs.Stats对象

        const stat = fs.lstatSync(filedir);
        if (stat.isDirectory()) {
            result.push.apply(result, fileDisplay(filedir));//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        } else {
            result.push({
                path: filedir,
                name: filename
            })
        }
    });
    return result
}

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
                fs.writeFileSync(path, JSON.stringify(data));
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
            fs.writeFileSync(path, data);
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
    list: (rootPath) => {
        return _promise(rootPath, (s, e) => {
            const files = fileDisplay(rootPath);
            const result = files.filter(({path,name}) => {
                const suffix = name.split('.')[1] || 'dir';
                const suffixEnum = ["bmp", "jpg", "png", "tif", "gif", "pcx", "tga", "exif", 'fpx', 'svg', 'psd',
                    'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', "raw", "WMF", "webp", "avif"]
                return suffixEnum.indexOf(suffix) > -1;
            }).map(({path,name})=>{
                const paths = path.replace(rootPath).split('\\')
                paths.shift();
                var group = paths[paths.length-2]||'未分组';
                return {group,name,path};
            })
            var resultGroup = {}
            result.forEach(({group,name,path}) => {
                if(!resultGroup[group]){
                    resultGroup[group] = [];
                }
                resultGroup[group].push({name,path})
            });
            s( resultGroup)
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
                        if (typeof accumulator == 'object') {
                            return accumulator.pics.length + currentValue.pics.length;
                        } else {
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