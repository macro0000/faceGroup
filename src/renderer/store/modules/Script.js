import FileUtil from '../../util/FileUtil'
import ElectronUril from '../../util/ElectronUtil'
import FaceUtil from '../../util/FaceUtil'
import { stat } from 'fs';

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
    CHOOSE_TO(state, index) {
        const local = index.split('-');
        var toFlag = false;
        for (let g = local[0]; g > -1; g--) {
            const group = state.fileGroup[g];
            for (let p = group.pics.length - 1; p > -1; p--) {
                if (`${g}-${p}` === index) {
                    toFlag = true;
                }
                if (toFlag) {
                    if (state.fileGroup[g].pics[p]['status'] === 'choose') {
                        toFlag = false;
                        return;
                    }
                    state.fileGroup[g].pics[p]['status'] = 'choose'
                }
            }
        }
    },
    REVOKE_CHOOSE(state) {
        state.fileGroup.forEach(group => {
            group.pics.forEach(pic => {
                pic['status'] = 'normal'
            })
        })
    },
    REVERSAL_CHOOSE(state, id) {
        state.fileGroup[id].pics.forEach(pic => {
            switch (pic['status']) {
                case 'normal':
                    pic['status'] = 'choose';
                    break;
                case 'choose':
                    pic['status'] = 'normal';
                    break;
            }
        })
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
    DELETE_EMPTY_GROUP(state) {
        state.fileGroup = state.fileGroup.filter((e) => e.pics.length != 0)
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
    },
    count: state => { var count = 0;
        state.fileGroup.forEach(element => {
            element.pics.forEach(el => {
                count++;
            })
        });
        return count;
    },
    GroupCount: state => {
        return state.fileGroup.length;
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
                            for (let n in res) {
                                const groupNames = res[n].map(({ path, name }) => {
                                    return name;
                                })
                                for (let x in grouphistroy) {
                                    const group = grouphistroy[x];
                                    for (let p in group.pics) {
                                        let inx = groupNames.indexOf(group.pics[p].name);

                                        if (inx >= 0) {
                                            res[n][inx] = '.del'
                                        }
                                    }
                                }
                            }
                            for (let n in res) {
                                res[n] = res[n].filter(del => {
                                    return del != '.del'
                                })
                                if (res[n].length > 0) {
                                    grouphistroy.push({ name: n, pics: res[n] })
                                }
                            }
                            commit('SET_ROOT_PATH', rootPathHostroy);
                            commit('SET_FILE_GROUP', grouphistroy);
                            resolve(rootPathHostroy);
                        })
                    }).catch((err) => {
                        FileUtil.create(`${path}\\.face`).then((data) => {
                            console.log('文件不存在%o \r\n创建成功 %o', err, data);
                            dispatch('getDir', path).then((res) => {
                                var group = []
                                for (let x in res) {
                                    const pics = res[x].map(e => {
                                        return { ...e, ...{ status: 'normal' } }
                                    })
                                    group.push({ name: x, pics });

                                }
                                commit('CLEAR');
                                commit('SET_ROOT_PATH', path);
                                commit('SET_FILE_GROUP', group)
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
            try {
                FileUtil.list(path).then((res) => {
                    for (let x in res) {
                        const group = res[x];
                        var mapped = group.map(function ({ name, path }, i) {
                            try {
                                return { index: i, value: Number(name.match(/[0-9]+/g).reverse().join('.')) };
                            } catch (error) {
                                return { index: i, value: 0 };
                            }
                            
                        })
                        mapped.sort(function (a, b) {
                            return +(a.value > b.value) || +(a.value === b.value) - 1;
                        });
                        var result = mapped.map(function (el) {
                            return group[el.index];
                        });
                        res[x] = result
                    }
                 
                    resolve(res)
                })
            } catch (error) {
                reject(error)
            }
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
    chooseto({ commit }, index) {
        commit('CHOOSE_TO', index);
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
    },
    deleteEmptyGroup({ commit }) {
        commit('DELETE_EMPTY_GROUP');
    },
    revokeChoose({ commit }) {
        commit('REVOKE_CHOOSE')
    },
    reversalChoose({ commit }, id) {
        commit('REVERSAL_CHOOSE', id)
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
