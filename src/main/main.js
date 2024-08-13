const { app, BrowserWindow, ipcMain, screen, desktopCapturer, Menu } = require('electron');

const path = require('path');
const axios = require('axios');
const os = require("os");
var psList = require('ps-list');
const fs = require('fs');
const { exec } = require('child_process');

// const isDev = require('electron-is-dev')

// #### URLs #### //
const API_URL = "https://5b9d91df-5241-4ae0-ab7d-6256341b374e.mock.pstmn.io"
const INFO_URL = "https://ba504831-2a9f-4e6d-90e4-42e752be7d95.mock.pstmn.io"
const EXAM_URL = "https://udearroba.udea.edu.co/home/"

// #### Global main window variables #### //
var mainWindow;
var username, password;
var userToken;
var isLogin = true;
const platform = process.platform;
console.log("\nRunning platform:", platform);

// #### Global warning variables #### //
var warningWindow;
var isClosing = false;
var isMoreThan2Displays;
var isRestrictedApps;
var warningInfo;
var processList = [];
var isWarningWindow = false;
var isDisplayChecking = true;


// #### Timers #### //
const timerDisplayCheckingMinutes = 60 * 1000;
const timerAppsCheckingMinutes = 60 * 1000;
const timerCaptureKill = 2 * 1000



// #### Menu configuration #### //
const menuItems = [
  {
    label: "File",
    submenu: [
      {
        type: "separator",
      },
      {
        label: "Exit",
        click: () => app.quit(),
      },
      {
        role: "close",
      },
    ]
  },
];

const menu = Menu.buildFromTemplate(menuItems);
Menu.setApplicationMenu(menu);


function createMainWindow() {
  const displayBounds = screen.getPrimaryDisplay().bounds;
  console.log("Display bounds:", displayBounds);

  const actionTimer = 100;
  var isMoving = false;
  var isResizing = false;


  if (platform === "linux") {

    console.log("\nConfiguring linux system...")

    mainWindow = new BrowserWindow({
      // Window properties //
      // width: displayBounds.width/2,
      // height: displayBounds.height/2,
      x: displayBounds.x,
      y: displayBounds.y,
      maximizable: true,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        enableRemoteModule: true
      },
    });

    mainWindow.once('ready-to-show', () => {
      console.log("Ready to show...");
      mainWindow.maximize();
      mainWindow.show();
      // #### Configuring warning checking #### //
      setTimeout( () => {
        isLogin = true;
        checkDisplays();
        const timerIntervalDisplay = setInterval(checkDisplays, timerDisplayCheckingMinutes);
      }, 5000);

    });

    mainWindow.on('minimize', () => {
      if (!isWarningWindow) {
        console.log("Minimized...");
        mainWindow.maximize();
        // mainWindow.setFullScreen(true);
      }
    });

    mainWindow.on("move", () => {
      if (!isMoving && !isWarningWindow) {
        console.log("\nMoved...");
        isMoving = true;
        console.log("1 Move Bounds:", mainWindow.getBounds());
        setTimeout(() => {
          mainWindow.maximize();
          // mainWindow.setFullScreen(true);
          isMoving = false;
        }, actionTimer);
      };
    });


    mainWindow.on("resize", () => {
      if (!isResizing && !isWarningWindow) {
        console.log("\nResized...");
        isResizing = true;
        console.log("1 Resize Bounds:", mainWindow.getBounds());
        setTimeout(() => {
          mainWindow.maximize();
          // mainWindow.setFullScreen(true);
          isResizing = false;
        }, actionTimer);
      };
    });

  } else {

    console.log("\nConfiguring Windows system...")
    mainWindow = new BrowserWindow({
      // Window properties //
      width: displayBounds.width / 2,
      height: displayBounds.height / 2,
      x: displayBounds.x,
      y: displayBounds.y,
      show: false,

      // fullscreen: true,
      // fullScreenable: true,
      // minimizable: false,
      // movable: false,
      // resizable: false,
      // maximizable: false,
      // alwaysOnTop: true,

      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        enableRemoteModule: true
      },
    });


    // mainWindow.on('leave-full-screen', () => {
    //   console.log("leave-full-screen."); 
    //   if(!isWarningWindow){
    //     mainWindow.setFullScreen(true);
    //   };

    // });

    // mainWindow.on("blur", () => {
    //   console.log("Blur...");
    //   if(!isWarningWindow){
    //     mainWindow.setAlwaysOnTop(true);
    //     mainWindow.setFullScreen(true);
    //     mainWindow.show();
    //   };
    // });

    mainWindow.once('ready-to-show', () => {
      console.log("Ready to show...");
      // mainWindow.setFullScreen(true);
      // mainWindow.setAlwaysOnTop(true);
      mainWindow.show();

      // #### Configuring warning checking #### //
      setTimeout(() => {
        checkDisplays();
        const timerIntervalDisplay = setInterval(checkDisplays, timerDisplayCheckingMinutes);
      }, 5000);
    });
  };


  //   win.loadURL(
  //     isDev
  //       ? 'http://localhost:3000'
  //       : `file://${path.join(__dirname, '../build/index.html')}`
  //   )
  mainWindow.loadURL("http://localhost:3000");
  // Open the DevTools.
  mainWindow.webContents.openDevTools()


  // #### Matching credentials #### //
  ipcMain.on('login', (event, credentials) => {
    ({ username, password } = credentials);
    console.log(`\nSent Credentials:\nUsername:${username}\nPassword:${password}`)

    // Display info //
    var displays = screen.getAllDisplays();
    isMoreThan2Displays = displays.length >= 2;

    if (isMoreThan2Displays && isDisplayChecking) {
      const message = "2 displays connected, please use just one."
      event.reply('login_error', message);
      
    } else {
      getUser(event, username, password);
    };

  });

  ipcMain.on("start_exam", (event, message) => {
    console.log("\nStart Exam:", message);
    mainWindow.loadURL(EXAM_URL);
  });
}

function setWindowProperties() {

  if (process.platform === "linux") {
    console.log("\nSetting browser window properties Linux...")
    mainWindow.setAlwaysOnTop(true);
    mainWindow.maximize();
  } else {
    console.log("\nSetting browser window properties Win32...")
    mainWindow.fullScreenable = true;
    mainWindow.setFullScreen(true);
    mainWindow.setAlwaysOnTop(true);
    mainWindow.minimizable = false;
    mainWindow.resizable = false;
    mainWindow.movable = false;
    mainWindow.maximizable = false;

  };
};

async function getUser(event, imputUsername, inputPassword) {
  try {

    // const response = await axios.get(`${API_URL}/users?username=jeff&password=0821`);
    const response = await axios.get(`${API_URL}/users`, {
      params: {
        username: imputUsername,
        password: inputPassword,
      }
    });
    // Capturing token //
    userToken = response.data.token;
    console.log("\nCorrect Login:")
    console.log(`User Token: ${userToken}\n`);
    // Change to main window //
    mainWindow.webContents.send("correct_login", "correct login...");
    // changing loging state //
    isLogin = false;

    // Send PC Information //
    sendPCInfo();

    // timer to star checking restricted apps //
    setTimeout(() => {
      checkRestrictedApps();
      const timerIntervalApps = setInterval(checkRestrictedApps, timerAppsCheckingMinutes);
    }, 5000);

  } catch (error) {

    event.reply('login_error', error.response.data.message);

    if (error.response && error.response.status === 400) {
      console.log('\nInvalid credentials');
    } else {
      console.log('\nAn error occurred during login');
    };
  };

};


app.on('ready', createMainWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})


function checkDisplays() {
  // Display info //
  var displays = screen.getAllDisplays();
  isMoreThan2Displays = displays.length >= 2;
  console.log("\nChecking warnings:");
  console.log("isMoreThan2Displays:", isMoreThan2Displays);

  if (isMoreThan2Displays && isDisplayChecking) {
    console.log("\nSending displays warning");
    const informationType = "displays_warning";
    const informationBody = {
      "nDisplays": displays.length,
      "displayObjects": displays,
    };

    // Sending information  //
    sendInfo(userToken, informationType, informationBody);
    const message = `Using ${displays.length} displays, please use just one.`
    createWarningWindow(message);
  };

};



function defaultCallback() {
  return new Promise((resolve, reject) => {
    console.log("Default callback executed");
    resolve("default");
  });
};

function createWarningWindow(message, callback=defaultCallback) {

  // Flag true when warning window is open //
  isWarningWindow = true;

  // Getting display info //
  const displayBounds = screen.getPrimaryDisplay().bounds;

  // Control flags //
  const actionTimer = 100;
  var isMoving = false;
  var isResizing = false;

  const platform = process.platform;
  console.log(platform);



  if (platform === "linux") {

    console.log("\nConfiguring linux system...")

    warningWindow = new BrowserWindow({
      // Window properties //
      // width: displayBounds.width/2,
      // height: displayBounds.height/2,
      x: displayBounds.x,
      y: displayBounds.y,
      maximizable: true,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        enableRemoteModule: true
      },
    });

    warningWindow.once('ready-to-show', () => {
      warningWindow.webContents.send("send_warning", message);
      // hide mainwindow //
      warningWindow.maximize();
      warningWindow.show();

    });

    warningWindow.on('minimize', () => {
      console.log("Minimized...");
      warningWindow.maximize();
      // warningWindow.setFullScreen(true);
    });

    warningWindow.on("move", () => {
      if (!isMoving) {
        console.log("\nMoved...");
        isMoving = true;
        console.log("1 Move Bounds:", warningWindow.getBounds());
        setTimeout(() => {
          warningWindow.maximize();
          // warningWindow.setFullScreen(true);
          isMoving = false;
        }, actionTimer);
      };
    });


    warningWindow.on("resize", () => {
      if (!isResizing) {
        console.log("\nResized...");
        isResizing = true;
        console.log("1 Resize Bounds:", warningWindow.getBounds());
        setTimeout(() => {
          warningWindow.maximize();
          // warningWindow.setFullScreen(true);
          isResizing = false;
        }, actionTimer);
      };
    });

  } else {

    warningWindow = new BrowserWindow({
      // Window properties //
      width: displayBounds.width / 2,
      height: displayBounds.height / 2,
      x: displayBounds.x,
      y: displayBounds.y,
      show: false,

      // fullscreen: true,
      // fullScreenable: true,
      // minimizable: false,
      // movable: false,
      // resizable: false,
      // maximizable: false,
      // alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        enableRemoteModule: true
      },
    });

    // warningWindow.on('leave-full-screen', () => {
    //   console.log("leave-full-screen.");
    //   warningWindow.setFullScreen(true);

    // });

    // warningWindow.on("blur", () => {
    //   console.log("Blur...");
    //   warningWindow.setAlwaysOnTop(true);
    //   warningWindow.setFullScreen(true);
    //   warningWindow.show();
    // });

    warningWindow.once('ready-to-show', () => {
      warningWindow.webContents.send("send_warning", message);
      // hide mainwindow //
      // mainWindow.setAlwaysOnTop(false);
      // configure warning window properties //
      // warningWindow.setFullScreen(true);
      // warningWindow.setAlwaysOnTop(true);
      warningWindow.show();
    });

  };


  //   win.loadURL(
  //     isDev
  //       ? 'http://localhost:3000'
  //       : `file://${path.join(__dirname, '../build/index.html')}`
  //   )
  warningWindow.loadURL("http://localhost:3000/warning-page");
  // Open the DevTools.
  // win.webContents.openDevTools()

  ipcMain.on('close_warning', (event, message) => {
    if (!isClosing) {
      isClosing = true;
      console.log("\nClosing warning window..");
      warningWindow.close();
      isWarningWindow = false;
      setTimeout(() => {
        captureScreen(callback);
      }, 2000);
      setWindowProperties();
    };
  });

  warningWindow.on('closed', (e, cmd) => {
    console.log("\nWarning window completely closed.");
    isClosing = false;
  });
}


function sendInfo(sendToken, sendType, sendBody) {
  // sendToken = 123456789;
  if (!isLogin) {

    console.log("\nSending information to API...");
    console.log("Token:", sendToken);
    console.log("Type of request:", sendType);
    console.log("Body:", sendBody);

    axios.post(`${INFO_URL}/information`, sendBody, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        "token": sendToken,
        "type": sendType,
      },
    })
      .then(function (response) {
        console.log("\nInformation sent.");
        console.log(response.data);
      })
      .catch(function (error) {
        console.log("\nError sending information...");
        console.log(error);
      });
  };
};


function captureScreen(callback) {

  const displayBounds = screen.getPrimaryDisplay().bounds;
  W = displayBounds.width;
  H = displayBounds.height;
  console.log("Capturing screen...")

  desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width: W, height: H, }
  })
    .then((sources) => {
      if (sources.length > 0) {

        console.log(`Number of screen to capture: ${sources.length}.`)

        const screenSource = sources[0];

        // console.log("sending screenshot...")
        const sendImage = screenSource.thumbnail.toDataURL();
        const informationType = "screenshot_warning";
        const informationBody = {
          "screenshot": sendImage,
        };
        // Sending information  //
        sendInfo(userToken, informationType, informationBody);

        // new Promise((resolve, reject) => {
        console.log("saving screenshot...")
        const screenshotPath = path.join('screenshots_folder/screenshot.png');
        fs.writeFile(screenshotPath, screenSource.thumbnail.toPNG(), (err) => {
          if (err) {
            console.log(err);
            // reject(err);
          } else {
            // resolve(screenshotPath);
            console.log("\nScreenshot saved.");
            setTimeout(() => {
              callback().then((answer) => {
                if (answer === "apps") {
                  checkActualProcess();
                }
              });
            }, timerCaptureKill);
          }
        })
        // });
      };
    })
    .catch((error) => {
      console.log("Error screenshot...")
      console.error(error); // 'Operation failed!' if success is false
    });
};


function sendPCInfo(){
  
  console.log("\nSending PC information");
  // console.log("\nCPU Info:")
  var cpuObject = os.cpus()[0]; 
  var cpuModel = cpuObject.model;
  var osArch = os.arch();
  var osType = os.type(); // Linux, Darwin or Window_NT
  var osPlatform = os.platform(); // 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
  var bytesAvailable = os.totalmem(); // returns number in bytes
  var bytesFree = os.freemem();
  // 1 mb = 1048576 bytes
  MB = 1048576;
  GB = 1073741824;
  var gbAvailable = (bytesAvailable/GB).toFixed(2);
  var gbFree = (bytesFree/GB).toFixed(2);
  var usagePercentage = ((gbAvailable-gbFree)/gbAvailable*100).toFixed(2);
  var networkInterfaces = Object.keys(os.networkInterfaces());

  // Preparing infor to send //
  const informationType = "pc_information";
  const informationBody = {
    "cpu_model": cpuModel,
    "os_architecture": osArch,
    "os_type": osType,
    "os_platform": osPlatform,
    "available_memory_gb": `${gbAvailable} GB`,
    "memory_usage": `${usagePercentage} %`,
    "network_interfaces": networkInterfaces,    
  };
  // Sending info //
  sendInfo(userToken, informationType, informationBody);

};

async function checkRestrictedApps(){
  
  // Restricted apps //
  // const restrictedAppsList = ["chrome", "opera", "firefox", "msedge"];
  const restrictedAppsList = ["chrome", "firefox", "msedge"];
  // Reading runing processes //
  var processes = await psList();

  // List to store objects with blocked names
  processList = [];
  var appNamesList = [];
  
  // Loop through each object in the object list
  processes.forEach(obj => {
    // Loop through each blocked name
    restrictedAppsList.forEach(appName => {
      // Check if the blocked name is a substring of the object's name
      if (obj.name.toLowerCase().includes(appName.toLowerCase())) {
        // Save objects //
        processList.push(obj);
        
        if (!appNamesList.includes(appName.toLowerCase())){
          appNamesList.push(appName.toLowerCase());
        };
        
      };
    });
  });

  isRestrictedApps = appNamesList.length >= 1;
  console.log("\nChecking warnings:");
  console.log("isRestrictedApps:", isRestrictedApps);
  console.log(appNamesList);
  console.log(processList);

  if(isRestrictedApps){
    console.log("\nSending apps warning");
    const informationType = "apps_warning";
    const informationBody = {
      "nApps": appNamesList.length,
      "restrictedApps": appNamesList,
      // "appObjects": processList,
    };
    // Sending information  //
    sendInfo(userToken, informationType, informationBody);
    const message = `You are using restricted apps: ${appNamesList}.`
    createWarningWindow(message, killingProcesses);
  };
};


function killingProcesses(){
  console.log("\n\nKilling restricted processes...")
  
  return new Promise((resolve, reject) => {
    const platform = process.platform;
    processList.forEach((appObj, index, array) => {
      console.log("Kill: ", appObj.name, " PID: ", appObj.pid);
      killP(appObj.pid, platform);
      if (index === array.length-1) resolve("apps");
    });
  });

};

function killP(pid, platform) {
  if (platform === 'win32') {
    exec(`taskkill /PID ${pid} /F`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error killing process: ${error.message}`);
        return;
      }
      console.log(`Process killed: ${stdout}`);
    });
  } else {
    exec(`kill -9 ${pid}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error killing process: ${error.message}`);
        return;
      }
      console.log(`Process killed: ${stdout}`);
    });
  };
};

async function checkActualProcess(){

  // var processes = await psList();
  psList().then((processes) => {
    // List to store objects with blocked names
    var nameProcessList = [];
    // Loop through each object in the object list
    var processPromise = new Promise((resolve, reject) => {
      processes.forEach((obj, index, array) => {
        nameProcessList.push(obj.name); 
        if (index === array.length -1) resolve();
      });
    });

    processPromise.then(() => {
      console.log("\n\nList of all process:")
      console.log(nameProcessList);

      // send information //
      const informationType = "current_process_after_close_apps";
      const informationBody = {
        "current_process_list": nameProcessList,
      };
      // Sending information  //
      sendInfo(userToken, informationType, informationBody);

    });
    
  });  
};