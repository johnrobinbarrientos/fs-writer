'use strict'
let mainWindow
const { Menu } = require('electron');

const shell = require('electron').shell

// const {ipcRenderer} = window.require('electron')
let tray = null
// Create menu templete
const mainMenuTemplate = [
  {
    label:'File',
    submenu:[
      {
        label: "New Book",
        accelerator: "CmdOrCtrl+B",
        click: function (menuItem, currentWindow) {
          currentWindow.webContents.send('NEW_BOOK')
        }
      },
      { type: "separator" },
      {
        label: "Sync Data",
        accelerator: "CmdOrCtrl+Alt+S",
        click: function (menuItem, currentWindow) {
          currentWindow.webContents.send('SYNC_DATA')
        }
      },
      { type: "separator" },
      {
        label: "Logout",
        accelerator: "Alt+L",
        click: function (menuItem, currentWindow) {
          localStorage.setItem('remember_me', '')
          currentWindow.webContents.send('LOGOUT')
        }
      },
      { type: "separator" },
      { label: "Exit", role: 'close'},
    ]
  },
  {
    label:'View',
    submenu:[
      {
        label:'Dashboard',
        accelerator: "CmdOrCtrl+D",
        click: function (menuItem, currentWindow) {
          currentWindow.webContents.send('GO_TO_DASHBOARD')
        }
      }
    ]
  },
  {
    label:'Translations',
    submenu:[
      {label: "English",
       type: 'radio',
       checked: true,
        click: function (menuItem, currentWindow) {
          // currentWindow.webContents.send('REFRESH_MENU', ControlState(0)) // main.js then to starter to refresh menu
          // ControlState2(0)
          
          currentWindow.webContents.send('TRANSLATE','en') //main.js
          currentWindow.webContents.send('SET_TRANSLATION_DOM','en') // Main.vue
        }
      },
      {label: "Danish",
       type: 'radio',
        checked: false,
        click: function (menuItem, currentWindow) {
          currentWindow.webContents.send('TRANSLATE','da')
          currentWindow.webContents.send('SET_TRANSLATION_DOM','da')
          mainMenuTemplate.label= "Fileeeess"
          // ControlState2(1)
        },
      },
      {label: "Finnish",
      type: 'radio',
        checked: false,
        click: function (menuItem, currentWindow) {
          currentWindow.webContents.send('TRANSLATE','fi')
          currentWindow.webContents.send('SET_TRANSLATION_DOM','fi')
          // ControlState2(2)
        }
      },
      {label: "Icelandic",
       type: 'radio',
        checked: false,
        click: function (menuItem, currentWindow) {
          currentWindow.webContents.send('TRANSLATE','is')
          currentWindow.webContents.send('SET_TRANSLATION_DOM','is')
        }
      },
      {label: "Norwegian",
       type: 'radio',
        checked: false,
        click: function (menuItem, currentWindow) {
          currentWindow.webContents.send('TRANSLATE','nb')
          currentWindow.webContents.send('SET_TRANSLATION_DOM','nb')
        }
      },
      {label: "Spanish",
       type: 'radio',
        checked: false,
        click: function (menuItem, currentWindow) {
          currentWindow.webContents.send('TRANSLATE','es')
          currentWindow.webContents.send('SET_TRANSLATION_DOM','es')
        }
      },
      {label: "Swedish",
       type: 'radio',
        checked: false,
        click: function (menuItem, currentWindow) {
          currentWindow.webContents.send('TRANSLATE','sv')
          currentWindow.webContents.send('SET_TRANSLATION_DOM','sv')
        }
      }
    ]
  },
  {
    label:'Help',
    submenu:[
      {
        label:'Register',
        click: function (menuItem, currentWindow) {
          shell.openExternal('https://www.pilotleser.no/auth/signup')
        }
      },
      {
        label:'About',
        click: function (menuItem, currentWindow) {
          currentWindow.webContents.send('DISPLAY_ABOUT')
        }
      }
    ]
  }
];

// function ControlState2(val) {
//   let menuCount = mainMenuTemplate.length - 1
//   mainMenuTemplate[1] = 'Tessst'
//   console.log('asdsadsadsdasad')
//   console.log(mainMenuTemplate)
//   // if(process.env.NODE_ENV!=='production') menuCount -= 1

//   // mainMenuTemplate[menuCount].submenu.forEach(function (item, index) {
//   //   if (index===val) {
//   //     mainMenuTemplate[menuCount].submenu[val].checked = true
//   //   }
//   //   else {
//   //     mainMenuTemplate[menuCount].submenu[index].checked = false
//   //   }
//   // })

//    return Menu.buildFromTemplate(mainMenuTemplate)
// }

// Ismael: i dont think we still need this if were using the custom menu
function ControlState(val) {
  let menuCount = mainMenuTemplate.length - 1
  if(process.env.NODE_ENV!=='production') menuCount -= 1

  mainMenuTemplate[menuCount].submenu.forEach(function (item, index) {
    if (index===val) {
      mainMenuTemplate[menuCount].submenu[val].checked = true
    }
    else {
      mainMenuTemplate[menuCount].submenu[index].checked = false
    }
  })

  return Menu.buildFromTemplate(mainMenuTemplate)
}



// If mac, add empty object on menu
if(process.platform == "darwin") {
  mainMenuTemplate.unshift({label: ''});
  const editMenu = {
    label: "Edit",
      submenu: [
    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
    { type: "separator" },
    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
  ]
  }
  mainMenuTemplate.splice(2,0,editMenu)
}

// Add DevTools if not in production
if(process.env.NODE_ENV!=='production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        role: 'toggleDevTools'
      },
      {
        role: 'reload'
      }
    ]
  });
}

/*remove taskbar top menu*/


// module.exports = (process.env.NODE_ENV == 'production') ? Menu.buildFromTemplate([]) : Menu.buildFromTemplate(mainMenuTemplate);
exports.getMenu = function (window) {
  mainWindow = window
  return Menu.buildFromTemplate(mainMenuTemplate)
}

// This return the menu template
exports.getMenuTemplate = function () {
  return mainMenuTemplate
}

// Ismael: i dont think we still need this if were using the custom menu
exports.setMenu = function (data) {
  ControlState(data)
}
