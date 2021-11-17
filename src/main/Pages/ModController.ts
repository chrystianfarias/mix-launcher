import Mod from "../../Models/Mod";
import { ipcMain } from 'electron';
const { dialog } = require('electron')
const Store = require('electron-store');

const ModController = () => {
  const store = new Store();

  const getGameFolder = (event:any,_: any) => {
    event.sender.send("ModController.receiveFolder", store.get("game_dir"));
  }
  const setGameFolder = async (event:any,_: any) => {
    let dir = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    store.set("game_dir", dir.filePaths[0]);
    event.sender.send("ModController.receiveFolder", store.get("game_dir"));
  }
  const installMod = (event:any,data: any) => {
    let mod:Mod = data;

    const spawn = require("child_process").spawn;

    const mpm = spawn(store.get("mpm_dir"),
    ["install", mod.name, "-gui"],{
      cwd: store.get("game_dir")
    });

    mpm.stdout.on("data", (mpmData:string) => {
        let data = mpmData.toString();
        let status = "...";
        let message = "";
        let progress = 0;

        if (data.includes("download#"))
        {
          status = "Download";
          progress = Number(data.split('#')[1]);
        }
        if (data.includes("extract#"))
        {
          status = "Extracting";
        }
        if (data.includes("install#"))
        {
          status = "Installing";
        }
        if (data.includes("error#"))
        {
          status = "Error";
          message = data.split('#')[1];
        }
        if (data.includes("complete"))
        {
          status = "Complete";
        }
        if (status != "...")
          event.sender.send("ModDownload." + mod?.name, {status, progress, message});
        console.log(`stdout: ${mpmData}`);
    });

    mpm.stderr.on("data", (mpmData:string) => {
        console.log(`stderr: ${mpmData}`);
    });

    mpm.on('error', (error:any) => {
        console.log(`error: ${error.message}`);
        event.sender.send("ModDownload." + mod?.name, {status: "Error", progress: 0, message: "Erro fatal"});
    });

    mpm.on("close", (code:number) => {
        console.log(`child process exited with code ${code}`);
        if (code != 0)
          event.sender.send("ModDownload." + mod?.name, {status: "Error", progress: 0, message: "Erro fatal"});
    });
  }
  ipcMain.on("ModController.installMod", installMod);
  ipcMain.on("ModController.getFolder", getGameFolder);
  ipcMain.on("ModController.setFolder", setGameFolder);
}

export default ModController;
