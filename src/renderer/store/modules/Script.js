import FileUtil from '../../util/FileUtil'
import ElectronUril from '../../util/ElectronUtil'
import FaceUtil from '../../util/FaceUtil'

const groupName = '未分组';

const state = {
    rootPath: '',
    fileGroup: new Array(),
}

const mutations = {

    SET_ROOT_PATH(state, path) {
        state.rootPath = path;
    },
    CHOOSE(state, index) {
        const local = index.split('-');
        switch (state['fileGroup'][local[0]]['pics'][local[1]]['status']) {
            case 'normal':
                state['fileGroup'][local[0]]['pics'][local[1]]['status'] = 'choose';
                break;
            case 'choose':
                state['fileGroup'][local[0]]['pics'][local[1]]['status'] = 'normal';
                break;
        }
    },
    SET_FILE_LIST({ rootPath, fileGroup }, dirs) {
        let iamges = dirs.filter((name) => {
            return name != '.face'
        })
        var fileList = iamges.map((name) => {
            let path = `${rootPath}\\${name}`;
            return { name, path, status: 'normal' }
        })
        fileGroup.push({ name: groupName, pics: fileList })
    },
    SET_FILE_GROUP(state, value) {
        state.fileGroup = value
    },
    MOVE_PIC(state, groupid) {
        let pics = [];
        state.fileGroup.forEach((group) => {
            group['pics'] = group['pics'].filter((file) => {
                if (file.status === 'choose') {
                    pics.push(file);
                    return false;
                } else {
                    return true;
                }
            })
        })
        state.fileGroup[groupid].pics.push.apply(state.fileGroup[groupid].pics, (pics.map((pic) => {
            pic.status = 'normal'
            return pic;
        })));
    },
    CREATE_GROUP(state) {
        let pics = [];
        state.fileGroup.forEach((group) => {
            group['pics'] = group['pics'].filter((file) => {
                if (file.status === 'choose') {
                    pics.push(file);
                    return false;
                } else {
                    return true;
                }
            })
        })
        const lastone = state.fileGroup.pop();
        state.fileGroup.push({
            name: `分组${state.fileGroup.length + 1}`, pics: pics.map((pic) => {
                pic.status = 'normal'
                return pic;
            })
        });
        state.fileGroup.push(lastone)
    },
    CHANGE_GROUP_NAME(state, { index, name }) {
        state.fileGroup[index].name = name;
    },
    DELETE_GROUP(state, index) {
        const deleteGroup = state.fileGroup.splice(index, 1)[0];
        if (deleteGroup.name === groupName && deleteGroup.pics.length == 0) {

            return;
        }
        if (state.fileGroup[state.fileGroup.length - 1].name === groupName) {
            state.fileGroup[state.fileGroup.length - 1].pics.push.apply(
                state.fileGroup[state.fileGroup.length - 1].pics,
                deleteGroup.pics.map((pic) => {
                    pic.status = 'normal'
                    return pic;
                }));
        } else {
            state.fileGroup.push({
                name: groupName,
                pics: deleteGroup.pics.map((pic) => {
                    pic.status = 'normal'
                    return pic;
                })
            });
        }
    },
    CLEAR(state) {
        state.rootPath = ''
        state.fileGroup = []
    },

}

const getters = {
    rootPath: state => {
        return state.rootPath;
    },

    fileGroup: state => {
        return state.fileGroup;
    },
    fileChooseCount: state => {
        var count = 0;
        state.fileGroup.forEach(element => {
            element.pics.forEach(el => {
                if (el.status === 'choose') {
                    count++;
                }
            })
        });
        return count;
    }
}

const actions = {
    chooseWorkSpace({ commit, dispatch, state }) {
        return new Promise((resolve, reject) => {
            try {
                ElectronUril.chooseDirectory({ title: '选择工作空间', defaultPath: '' }).then((path => {
                    FileUtil.has(`${path}\\.face`).then((content) => {
                        const histroy = JSON.parse(content);
                        const rootPathHostroy = histroy.rootPath || '';
                        const grouphistroy = histroy.fileGroup || [];
                        dispatch('getDir', path).then((res) => {
                            for (let x in grouphistroy) {
                                const group = grouphistroy[x];
                                for (let p in group.pics) {
                                    let inx = res.indexOf(group.pics[p].name);
                                    if (inx >= 0) {
                                        res.splice(inx, 1);
                                    }
                                }
                            }
                            if (res.length > 0) {
                                grouphistroy.push({ name: groupName, pics: res })
                            }
                            commit('SET_ROOT_PATH', rootPathHostroy);
                            commit('SET_FILE_GROUP', grouphistroy)
                            resolve(rootPathHostroy);
                        })
                    }).catch((err) => {
                        FileUtil.create(`${path}\\.face`).then((data) => {
                            console.log('文件不存在%o \r\n创建成功 %o', err, data);
                            dispatch('getDir', path).then((res) => {
                                commit('CLEAR');
                                commit('SET_ROOT_PATH', path);
                                commit('SET_FILE_LIST', res)
                                resolve(path);
                            })
                        });
                    })
                })).catch((error) => {
                    console.error(error)
                    resolve(state.rootPath);
                })
            } catch (error) {
                reject(error);
            }
        })
    },
    getDir({ commit }, path) {
        return new Promise((resolve, reject) => {
            FileUtil.list(path).then((res) => {
                try {
                    res = res.filter(r => r != '.face')
                    var mapped = res.map(function (el, i) {
                        return { index: i, value: Number(el.match(/[0-9]+/g).reverse().join('.')) };
                    })

                    mapped.sort(function (a, b) {
                        return +(a.value > b.value) || +(a.value === b.value) - 1;
                    });

                    var result = mapped.map(function (el) {
                        return res[el.index];
                    });
                    resolve(result)
                } catch (error) {
                    reject(error)
                }
            })
        })
    },
    getCNN({ commit, state }) {
        FaceUtil.getCNN(state.rootPath)
    },
    outputFile({ commit, state }) {
        return new Promise((resolve, reject) => {
            ElectronUril.chooseDirectory({ title: '导出', defaultPath: '' }).then((path => {
                FileUtil.outPut(state.fileGroup, path).then((path) => {
                    resolve(path)
                })
            })).catch((error) => {
                reject(error)
            })
        })

    },
    choose({ commit, state }, index) {
        commit('CHOOSE', index);
    },
    cleanGroup({ commit, state }) {
        return new Promise((resolve, reject) => {
            try {
                commit('SET_FILE_GROUP', []);
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    createGroup({ commit }) {
        commit('CREATE_GROUP')
    },
    moveTo({ commit }, index) {
        commit('MOVE_PIC', index)
    },
    changeGroupName({ commit }, res) {
        commit('CHANGE_GROUP_NAME', res)
    },
    deleteGroup({ commit }, index) {
        commit('DELETE_GROUP', index);
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
