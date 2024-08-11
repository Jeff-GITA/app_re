// preload.js

const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {

  // Render to Main //
  login: (credentials) => ipcRenderer.send('login', credentials),
  openWarinig: (message) => ipcRenderer.send('open_warning', message),
  closeWarinig: (message) => ipcRenderer.send('close_warning', message),
  // detectDisplays: (data) => ipcRenderer.send('detect_displays', data),
  // detectSystem: (data) => ipcRenderer.send('detect_system', data),
  // detectApps: (data) => ipcRenderer.send('detect_apps', data),
  // checkWarnings: (data) => ipcRenderer.send('check_warnings', data),
  // closeWarning: (data) => ipcRenderer.send('close_warning', data),
  
  // Main to Render //
  onLoginError: (callback) => ipcRenderer.on('login_error', callback),
  correctLogin: (callback) => ipcRenderer.on('correct_login', callback),
  getWarningMsg: (callback) => ipcRenderer.on('send_warning', callback),
  // sendDisplayInfo: (callback) => ipcRenderer.on('send_displays_info', callback),
  // sendSystemInfo: (callback) => ipcRenderer.on('send_system_info', callback),
  // sendAppsInfo: (callback) => ipcRenderer.on('send_apps_info', callback),
  
  });