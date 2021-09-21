import {
  app,
  BrowserWindow,
  nativeImage,
  Menu,
  shell,
  MenuItemConstructorOptions
} from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import * as url from 'url'

import i18n from '../i18n'
import {
  getWindowBounds,
  setWindowBounds
} from '../src/utils/windowBoundsController'
import TrayGenerator from './TrayGenerator'

let mainWindow: Electron.BrowserWindow | null

let tray = null

function createWindow() {
  const icon = nativeImage.createFromPath(`${app.getAppPath()}/build/icon.png`)

  if (app.dock) {
    app.dock.setIcon(icon)
  }

  mainWindow = new BrowserWindow({
    ...getWindowBounds(),
    icon,
    minWidth: 1000,
    minHeight: 600,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  mainWindow.on('close', event => {
    setWindowBounds(mainWindow?.getBounds())
    event.preventDefault()
    mainWindow?.hide()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

const createTray = () => {
  tray = new TrayGenerator(mainWindow)
  tray.createTray()
}

async function createMenu() {
  await i18n.loadNamespaces('applicationMenu')

  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Rocketredis',
      submenu: [
        {
          label: i18n.t('applicationMenu:newConnection'),
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('newConnection')
          }
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('applicationMenu:exit'),
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            mainWindow?.destroy()
            app.quit()
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () => {
            shell.openExternal('https://github.com/Juninho-dev/varejo-tools/')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.on('ready', () => {
  createWindow()
  autoUpdater.checkForUpdatesAndNotify()
  createMenu()
  createTray()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length) {
    mainWindow?.setVisibleOnAllWorkspaces(true)
    mainWindow?.show()
    mainWindow?.setVisibleOnAllWorkspaces(false)
    mainWindow?.focus()
  }
})

app.allowRendererProcessReuse = true
