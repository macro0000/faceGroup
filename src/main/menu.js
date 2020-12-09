const { Menu } = require('electron');
//订单菜单
var template = [
    {

        label: '首选项',
        submenu: [
            {

                label: '选择工作空间',
                accelerator: 'ctrl+n',
                click:  (item,mainWindow,event) => {
                    mainWindow.webContents.send('preferences', 'chooseWrokSpace');
                }
            },
            {

                label: '导出',
                click:  (item,mainWindow,event) => {
                    mainWindow.webContents.send('preferences', "output");
                }
            }
        ]
    },
    {

        label: '关于我',
        submenu: [
            {
                label: 'About',
                click:  (item,mainWindow,event) => {
                    mainWindow.webContents.send('about', "about");
                }
            }
        ]
    }


]
var m = Menu.buildFromTemplate(template);

function sendMessage(messageid, message) {
    mainWindow.webContents.send(messageid, message);
}


Menu.setApplicationMenu(m);