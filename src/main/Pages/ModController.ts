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
  const modIgnore = (_:any, data:any) => {
    const mod:string = data.mod;
    const ignore:boolean = data.ignore;

    console.log("modignore");
    const spawn = require("child_process").spawn;
    const base64 = new Buffer(JSON.stringify(mod)).toString("base64");
    spawn(store.get("mpm_dir"),
    ["mod", base64, ignore?"-ignore":"-notignore"],{
      cwd: store.get("game_dir")
    });
  }
  const reorderList = (_:any,data: any) => {
    const json:any = data;
    console.log("reorder");
    const spawn = require("child_process").spawn;
    const base64 = new Buffer(JSON.stringify(json)).toString("base64");
    spawn(store.get("mpm_dir"),
    ["reorder", base64],{
      cwd: store.get("game_dir")
    });
  };

  const getMods = (event:any,_: any) => {
    console.log("getMods");
    const spawn = require("child_process").spawnSync;

    const mpm = spawn(store.get("mpm_dir"),
    ["get-mods", "-modloader"],{
      cwd: store.get("game_dir")
    });
    let outp = mpm.stdout.toString();
    if (outp.includes("mod#"))
    {
      const modsList = [] as any[];
      const mods = outp.split('\n');
      mods.map((mod:string) => {
        const split = mod.split('#');
        modsList.push({"name": split[1], "type": split[2]});
      });
      event.sender.send("ModController.receiveModList", modsList);
      console.log("sendMods");
    }
  }
  const openModFolder = (_:any, data:any) => {
    const path:string = data;
    const spawn = require("child_process").spawn;
    spawn("explorer", [store.get("game_dir") + "\\modloader\\" + path]);
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
  ipcMain.on("ModController.getMods", getMods);
  ipcMain.on("ModController.openModFolder", openModFolder);
  ipcMain.on("ModController.reorderList", reorderList);
  ipcMain.on("ModController.setIgnore", modIgnore);
}

export default ModController;
