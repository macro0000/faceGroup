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
    }
};

export default file;