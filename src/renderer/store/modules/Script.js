import FileUtil from '../../util/FileUtil'
import ElectronUril from '../../util/ElectronUtil'

const state = {
    rootPath: '',
    fileList: [],
    fileGroup: {}
}

const mutations = {
    SET_ROOT_PATH(state, path) {
        state.rootPath = path;
        FileUtil.has(`${path}/.face`).then((res) => {
            console.log('读取成功 %o', res);
        }).catch((err) => {
            FileUtil.create(`${path}/.face`).then((data) => {
                console.log('文件不存在%o \r\n创建成功 %o', err, data);
            });
        })
    },
    SET_FILE_LIST(state, dirs) {
        let iamges = dirs.filter((name)=>{
            return name != '.face'
        })
        state.fileList = iamges.map((name)=> {
            let path = `${state.rootPath}\\${name}`;
            return {name,path}
        })
        console.log(state.fileList)
    },
}

const getters = {
    rootPath: state => {
        return state.rootPath;
    },
    fileList: state => {
        return state.fileList;
    },
    fileGroup: state => {
        return state.fileGroup;
    }
}


const actions = {
    chooseWorkSpace({ commit }) {
        ElectronUril.chooseSpace().then((path => {
            commit('SET_ROOT_PATH', path);
        }))
    },
    readFile({ commit }, path) {
        FileUtil.has(path).then((res) => {
            console.log(res)
        })
    },
    getDir({ commit,state }) {
        FileUtil.list(state.rootPath).then((res) => {
            commit('SET_FILE_LIST', res);
        })
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
