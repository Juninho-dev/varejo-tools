/* eslint-disable no-useless-escape */
import chokidar from 'chokidar'
import { remote } from 'electron'
import log from 'electron-log'
import { createReadStream } from 'fs'
import convert from 'xml-js'

import { deployFile } from '../services/UserService'
import { config } from '../store/config'

export const openDialogDirectory = () => {
  remote.dialog
    .showOpenDialog({
      properties: ['openDirectory']
    })
    .then(path => {
      if (!path.canceled) {
        setWatcherDirectory(path.filePaths[0])
        config.set('rootDirectory', path.filePaths[0])
        log.info(`The current directory has added: ${path.filePaths[0]}`)
      } else {
        return 'not directory selected'
      }
    })
}

export const setWatcherDirectory = (path: string) => {
  const watch = chokidar.watch(path, {
    ignored: /[\/\\]\./,
    persistent: true,
    ignoreInitial: true,
    followSymlinks: false
  })

  function onWatcherReady() {
    log.info(
      'A partir daqui, você pode verificar se há mudanças reais, a varredura inicial foi concluída.'
    )
  }

  // Declare the listeners of the watcher
  watch
    .on('add', async function (path) {
      log.info('File', path, 'has been added')
      const teste = createReadStream(path)
      // const jsonData = JSON.parse(
      //   convert.xml2json(teste, { compact: true, spaces: 2 })
      // )
      await deployFile(teste)
    })
    .on('addDir', function (path) {
      log.info('Directory', path, 'has been added')
    })
    .on('change', function (path) {
      log.info('File', path, 'has been changed')
    })
    .on('unlink', function (path) {
      log.info('File', path, 'has been removed')
    })
    .on('unlinkDir', function (path) {
      log.info('Directory', path, 'has been removed')
    })
    .on('error', function (error) {
      log.info('Error happened', error)
    })
    .on('ready', onWatcherReady)
    .on('raw', function (event, path, details) {
      // This event should be triggered everytime something happens.
      log.info('Raw event info:', event, path, details)
    })
}
