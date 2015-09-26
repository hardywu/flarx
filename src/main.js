var app = require('app');  // Module to control application life.
var Menu = require('menu');
var MenuItem = require('menu-item');
var dialog = require('dialog');
var Tray = require('tray');
var path = require('path');
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var globalShortcut = require('global-shortcut');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var appIcon = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('open-file', function(e, path) {
  mainWindow.webContents.send('open-file', path)
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/../static/index.html');

  // Open the DevTools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  appIcon = new Tray(path.normalize(__dirname + '/../resources/icon.png'))
  var contextMenu = Menu.buildFromTemplate([
    { label: 'quit', type: 'normal', click: function() { app.quit(); } },
    {
      label: 'hide', type: 'checkbox',
      click: function(menuItem) {
        if (menuItem.checked) {
          mainWindow.hide();
          app.dock.hide();
        }
        else {
          mainWindow.show();
          app.dock.show();
        }
      }
    }
  ]);
  appIcon.setToolTip('This is my application.');
  appIcon.setContextMenu(contextMenu);


  // Create the Application's main menu
  var template = [{
    label: "Application",
    submenu: [
      { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
      { type: "separator" },
      { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
    label: "File",
    submenu: [
      { label: "Open File", accelerator: "Command+O", click: function() {
          filenames = dialog.showOpenDialog({
            properties: [ 'openFile'],
            filters: [
              { name: 'JS Charts', extensions: ['jshs', 'jsd3'] },
              { name: 'All Files', extensions: ['*'] }
            ]
          });
          if (filenames != undefined) {
            mainWindow.webContents.send('open-file', filenames[0]);
          }
        }
      },
      { label: "Reload File", accelerator: "Command+R", click: function() {
          mainWindow.webContents.send('reload-file');
        }
      }
    ]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

});
