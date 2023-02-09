// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { ipcRenderer } = require('electron')
window.ipcRenderer = ipcRenderer

const { remote } = require('electron')
const { Menu, MenuItem } = remote

const path = require('path')
const url = require('url')

const menuTemplate = require('./menu')

// Documentation: https://github.com/AlexTorresSk/custom-electron-titlebar
const customTitlebar = require('custom-electron-titlebar')
let titlebar = null

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

// This is the listener that will change the menu title
ipcRenderer.on('SET_MAIN_MENU_TITLE', function (event, title) {
  titlebar.updateTitle(title)
})

// This is the listener that will setup the menu of a frameless electron window
// data.page: is use to determine what menu should be display for specific page
// data.lang: is use to determine what will be the default language to be use/selected
ipcRenderer.on('SET_MAIN_MENU', function (event, data) {
  let menu = new Menu()
  let maximizable = true

  if (titlebar) titlebar.dispose()

  switch (data.page) {
    case 'dashboard':
      menuTemplate.getMenuTemplate().forEach(function (item, index) {
        if(item.label === 'Translations') {
          item.submenu[0].checked = false
          item.submenu[data.lang].checked = true
        }

        menu.append(new MenuItem(item));
      })
      break;
    case 'login':
      menuTemplate.getMenuTemplate().forEach(function (item, index) {
        if(item.label === 'Translations') {
          item.submenu[0].checked = false
          item.submenu[data.lang].checked = true

          menu.append(new MenuItem(item));
        }
        if(item.label === 'Help') {
          menu.append(new MenuItem(item));
        }
      })
      maximizable = false
      break;
    default:
      menu = null
      break;
  }

  // Icon cannot be seen in development but it can be seen in production
  titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#324553'),
    icon: url.format(path.join(__dirname, '/assets', '/images', '/easywrite-new.ico')),
    menu: menu,
    maximizable: maximizable
  })

  Menu.setApplicationMenu(menu)

  /*
  * Custom-title-bar is not using the MAC behavior as it should be
  * this will fix the issue for menu behavior
  * */
  if( process.platform == 'darwin') {
    const menuRegion = document.getElementsByClassName('titlebar')
    console.log(menuRegion)
    for (let i = 0; i < menuRegion.length; i++) {
      menuRegion[i].addEventListener('dblclick', function () {
        ipcRenderer.send('MAC_MENU_BEHAVIOR')
      })
    }
  }
})
