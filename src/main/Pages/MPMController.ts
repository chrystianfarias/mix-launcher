import { ipcMain } from 'electron';
const { dialog } = require('electron')
const regedit = require('regedit')
const key = 'HKCU\\SOFTWARE\\MIXMODS';

const fs = require('fs');
const https = require('https');
const extract = require('extract-zip')

const MPMController = () => {
  const getMPMFolder = (event:any,_: any) => {
      regedit.list(key, function(_:any, result:any) {
        if (result[key].exists == false)
        {
          regedit.createKey([key], function(err:any) {
            console.error(err);
          })
        }
        if ("mpm_dir" in result[key].values)
        {
          event.sender.send("MPMController.receiveFolder", result[key].values["mpm_dir"].value);
        }
      })
  }
  const setMPMFolder = async (event:any,_: any) => {
    let dir = await dialog.showOpenDialog({ properties: ['openFile'], filters: [ {name: "Mix Package Manager", extensions: ['exe']} ] });
    regedit.putValue({[key]: {
      'mpm_dir': {
        value: dir.filePaths[0],
        type: 'REG_SZ'
      }
    }}, function(err:any) {
      console.error(err);
    });
    getMPMFolder(event, null);
  }
  const installMpm = async (event:any,_: any) => {
    const options = {
      headers: {
        'user-agent': 'node.js',
        "Accept": 'application/vnd.github.v3+json'
      }
    }
    https.get('https://api.github.com/repos/chrystianfarias/mpm/zipball/Alpha', options,(res:any) => {
      console.log(res);
      const path = `${__dirname}/mpm.zip`;
      const filePath = fs.createWriteStream(path);
      res.pipe(filePath);
      filePath.on('finish',async () => {
          filePath.close();
          await extract(path, {dir: `${__dirname}/mpm`});
      })
    })

    await new Promise(f => setTimeout(f, 2000));
    event.sender.send("MPMController.receiveInstall", "complete");
  }
  ipcMain.on("MPMController.getFolder", getMPMFolder);
  ipcMain.on("MPMController.setFolder", setMPMFolder);
  ipcMain.on("MPMController.install", installMpm);
}

export default MPMController;
