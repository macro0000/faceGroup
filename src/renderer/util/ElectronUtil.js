const { dialog } = require("electron").remote;

const _promise = (data, call) => {
    return new Promise(function (resolve, reject) {
        call(resolve, reject)
    })
}

const electronUtil = {

    chooseDirectory: ({ title, defaultPath }) => {
        return _promise({}, (s, e) => {
            try {
                dialog.showOpenDialog({ title, defaultPath, properties: ['openDirectory'] }, (res) => {
                    if (res) {
                        let path = res[0];
                        s(path)
                    } else {
                        e({ message: '已取消选择' })
                    }
                })
            } catch (error) {
                e(error)
            }
        })
    }
};

export default electronUtil;