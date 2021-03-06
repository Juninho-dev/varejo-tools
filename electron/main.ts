import {
  app,
  BrowserWindow,
  nativeImage,
  Menu,
  shell,
  MenuItemConstructorOptions,
  dialog,
  MenuItem
} from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'

import i18n from '../i18n'
import {
  getWindowBounds,
  setWindowBounds
} from '../src/utils/windowBoundsController'
import TrayGenerator from './TrayGenerator'
import checkForUpdates from './updater'

let mainWindow: Electron.BrowserWindow | null

let tray = null
autoUpdater.autoInstallOnAppQuit = false
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
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, 'renderer/index.html')}`)
  }

  mainWindow.on('close', event => {
    setWindowBounds(mainWindow?.getBounds())
    event.preventDefault()
    mainWindow?.hide()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit()
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
        },
        {
          type: 'separator'
        },
        {
          label: 'Verificar se h?? atualiza????es',
          click: (item: MenuItem) => {
            checkForUpdates(item)
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

function sendStatusToWindow(text: string) {
  console.log(text)
  mainWindow?.webContents.send('message', text)
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: 'Instalar atualiza????es',
    message:
      'Atualiza????es baixadas, o aplicativo ser?? encerrado para atualiza????o ...'
  })
  setImmediate(() => {
    autoUpdater.quitAndInstall()
    setTimeout(() => mainWindow?.destroy(), 4000)
  })
})

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
