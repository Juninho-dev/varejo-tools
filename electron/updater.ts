/**
 * updater.js
 *
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
import { dialog, MenuItem } from 'electron'
import { autoUpdater } from 'electron-updater'

let updater: MenuItem | null

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

autoUpdater.on('error', (error: any) => {
  dialog.showErrorBox(
    'Error: ',
    error == null ? 'unknown' : (error.stack || error).toString()
  )
})

autoUpdater.on('download-progress', progressObj => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message =
    log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  dialog.showMessageBox({
    type: 'info',
    title: 'Fazendo Download',
    message: log_message
  })
})

autoUpdater.on('update-available', () => {
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Atualizações encontradas',
      message: 'Atualizações encontradas, você quer atualizar agora?',
      buttons: ['Sim', 'Não']
    })
    .then(buttonIndex => {
      if (buttonIndex.response === 0) {
        autoUpdater.downloadUpdate()
      } else {
        updater.enabled = true
        updater = null
      }
    })
})

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: 'Sem atualizações',
    message: 'A versão atual está atualizada.'
  })
  updater.enabled = true
  updater = null
})

// export this to MenuItem click callback
function checkForUpdates(menuItem: MenuItem) {
  updater = menuItem
  updater.enabled = false
  autoUpdater.checkForUpdates()
}

export default checkForUpdates
