import { ipcMain } from 'electron';
const { dialog } = require('electron')
const Store = require('electron-store');

const MPMController = () => {
  const store = new Store();

  const getMPMFolder = (event:any,_: any) => {
    event.sender.send("MPMController.receiveFolder", store.get("mpm_dir"));
  }
  const setMPMFolder = async (event:any,_: any) => {
    let dir = await dialog.showOpenDialog({ properties: ['openFile'], filters: [ {name: "Mix Package Manager", extensions: ['exe']} ] });
    store.set("mpm_dir", dir.filePaths[0]);
    event.sender.send("MPMController.receiveFolder", store.get("mpm_dir"));
  }
  const installMpm = async (event:any,_: any) => {
    await new Promise(f => setTimeout(f, 2000));
    event.sender.send("MPMController.receiveInstall", "complete");
  }
  ipcMain.on("MPMController.getFolder", getMPMFolder);
  ipcMain.on("MPMController.setFolder", setMPMFolder);
  ipcMain.on("MPMController.install", installMpm);
}

export default MPMController;
