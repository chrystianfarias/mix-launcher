import { ipcMain } from 'electron';
const { dialog, app } = require('electron')
const key = 'HKCU\\SOFTWARE\\MIXMODS';

const https = require('https');
const unzipper = require('unzipper');
const path = require('path');
const fs = require('fs');

const regedit = require('regedit')
regedit.setExternalVBSLocation('resources/regedit/vbs');

const MPMController = () => {
  const getMPMFolder = (event:any,_: any) => {
      regedit.list(key, function(err:any, result:any) {
        if (err)
          dialog.showMessageBoxSync( {title: "Error", message: JSON.stringify(err), type: "error"});
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
        else
        {
          event.sender.send("MPMController.receiveFolder", "...");
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
        'user-agent': 'Mix Launcher',
      }
    }
    const dir = path.join(app.getAppPath(), '..\\', '\\mpm');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    https.get('https://raw.githubusercontent.com/chrystianfarias/mpm/main/mpm.zip', options,async (res:any) => {
      try{
        res.pipe(unzipper.Extract({path: dir}));

        regedit.putValue({[key]: {
          'mpm_dir': {
            value: `${dir}\\mpm.exe`,
            type: 'REG_SZ'
          }
        }}, function(err:any) {
          console.error(err);
        });

        await new Promise(f => setTimeout(f, 2000));
        event.sender.send("MPMController.receiveInstall", "complete");
        getMPMFolder(event, null);
      }catch{
        dialog.showMessageBox({message: "Error installing MPM, please try again later or manually.", title:"Erro", type:"error"})
      }
    })
  }
  ipcMain.on("MPMController.getFolder", getMPMFolder);
  ipcMain.on("MPMController.setFolder", setMPMFolder);
  ipcMain.on("MPMController.install", installMpm);
}

export default MPMController;
