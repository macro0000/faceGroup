import FileUtil from '../../util/FileUtil'

const FacePlugin = store => {
    store.subscribe((mutation, state) => {
        switch (mutation.type) {
            case "SET_FILE_GROUP":
            case "SET_ROOT_PATH":
            case "SET_FILE_LIST":
            case "SET_FILE_GROUP":
            case "MOVE_PIC":
            case "CREATE_GROUP":
            case "CHANGE_GROUP_NAME":
            case "DELETE_GROUP":
                const saveVa = state.Script;
                console.log(saveVa.rootPath)
                if (saveVa.rootPath && saveVa.rootPath != '') {
                    console.log(mutation.type, `${saveVa.rootPath}\\.face`)
                    FileUtil.save(`${saveVa.rootPath}\\.face`, JSON.stringify({ ...{ LastTime: new Date().format('yyyy-MM-dd hhmmss') }, ...saveVa }))
                }

        }
    })
}
export default FacePlugin;
