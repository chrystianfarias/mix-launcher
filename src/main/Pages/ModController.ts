import Mod from "../../Models/Mod";
import { ipcMain } from 'electron';
var request = require('request');
var fs = require('fs');

function downloadFile(file_url:any , targetPath:any, onProgress:any){
  // Save variable to know progress
  var received_bytes = 0;
  var total_bytes = 0;

  var req = request({
      method: 'GET',
      uri: file_url
  });

  var out = fs.createWriteStream(targetPath);
  req.pipe(out);

  req.on('response', function ( data:any ) {
      // Change the total bytes value to get progress later.
      total_bytes = parseInt(data.headers['content-length' ]);
  });

  req.on('data', function(chunk:any) {
      // Update the received bytes
      received_bytes += chunk.length;

      onProgress(total_bytes/received_bytes);
  });

  req.on('end', function() {
      onProgress(100);
  });
}

const ModController = () => {
  const installMod = (event:any,data: any) => {
    let mod:Mod = data;

    downloadFile("https://lh3.googleusercontent.com/-dN8JIrRF-6E/YZGDw4JHAiI/AAAAAAAAc5Y/vONDyM0uE20wd0FdAqBu9tmNdEPyb9AlwCLcBGAsYHQ/w495-h279/gta-trilogy-definitive-edition-mod-improved-rain-fix.jpg", "C:/test/t.zip", (progress:number) => {
      event.sender.send("ModDownload." + mod?.languages["en_us"].name, progress);
    });
  }
  ipcMain.on("ModController.installMod", installMod);
}

export default ModController;
