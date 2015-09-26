var fs = require('fs');
var ipc = require('ipc');
var remote = require('remote')
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var dialog = remote.require('dialog');
var chart;
var loadHighStockChart;
var currentPath;
var loadFile = function (filePath) {
  currentPath = filePath
  switch (filePath.split('.').slice(-1)[0]) {
    case 'jshs':
      loadHighStockChart(filePath);
      break;
    default:
      loadHighStockChart(filePath);
  }
}

var reloadFile = function () {
  loadFile(currentPath);
};

document.ondragover = function () {
  return false;
};
document.ondragleave = document.ondragend = function () {
  return false;
};

document.ondrop = function (e) {
  e.preventDefault();
  return false;
};

window.addEventListener("load",  function() {
  loadHighStockChart = function (filePath) {
    fs.readFile(filePath, 'utf8', function (err, data) {
      try {
        if (err) throw err;
        obj = JSON.parse(data);
        obj["chart"] = obj["chart"] || {};
        obj["chart"]["renderTo"] = "container";
        chart = new Highcharts.Chart(obj)
        console.log('Open file ', filePath);
      }
      catch (err) {
        console.log('error ', err);
        dialog.showErrorBox("File Open Error", 'cannot read file');
      }
    });
  }

  document.addEventListener("drop", function (e) {
    loadFile(e.dataTransfer.files[0].path);
    return false;
  });
});

ipc.on('open-file', function(path) {
  loadFile(path);
});

ipc.on('reload-file', function() {
  reloadFile();
});
