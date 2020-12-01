const { dialog } = require("electron").remote;

const _promise = (data, call) => {
    return new Promise(function (resolve, reject) {
        call(resolve, reject)
    })
}

const electronUtil = {

    chooseSpace: () => {
        return _promise({}, (s, e) => {
            try {
                dialog.showOpenDialog({ properties: ['openDirectory'] }, (res) => {
                    let path = res[0];
                    s(path)
                })
            } catch (error) {
                e(error)
            }
        })
    },

};

export default electronUtil;