// eslint-disable-next-line import/no-extraneous-dependencies
import { app, Menu, nativeImage, Tray } from 'electron'
import * as path from 'path'

class TrayGenerator {
  private tray: Electron.Tray | null
  private mainWindow: Electron.BrowserWindow | null

  constructor(mainWindow: Electron.BrowserWindow | null) {
    this.tray = null
    this.mainWindow = mainWindow
  }

  showWindow = () => {
    this.mainWindow?.setVisibleOnAllWorkspaces(true)
    this.mainWindow?.show()
    this.mainWindow?.setVisibleOnAllWorkspaces(false)
  }

  toggleWindow = () => {
    if (this.mainWindow?.isVisible()) {
      this.mainWindow?.hide()
    } else {
      this.showWindow()
      this.mainWindow?.focus()
    }
  }

  createTray = () => {
    this.tray = new Tray(
      nativeImage.createFromPath(`${app.getAppPath()}/build/icon_22.png`)
    )

    this.tray.setIgnoreDoubleClickEvents(true)
    const mainWindow = this.mainWindow
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Abrir App',
        click: function () {
          if (mainWindow?.isVisible()) {
            mainWindow?.hide()
          } else {
            mainWindow?.setVisibleOnAllWorkspaces(true)
            mainWindow?.show()
            mainWindow?.setVisibleOnAllWorkspaces(false)
            mainWindow?.focus()
          }
        }
      },
      {
        label: 'Sair',
        click: function () {
          mainWindow?.destroy()
          app.quit()
        }
      }
    ])

    this.tray.setContextMenu(contextMenu)

    this.tray.on('click', () => {
      this.tray?.popUpContextMenu()
    })
  }
}

export default TrayGenerator
