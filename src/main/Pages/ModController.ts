import Mod from "../../Models/Mod";
import { ipcMain } from 'electron';
const { dialog } = require('electron')
const regedit = require('regedit')
const key = 'HKCU\\SOFTWARE\\MIXMODS';

const ModController = () => {
  let gameDir:string;
  let mpmDir:string;

  const refreshPaths = () => {
    regedit.list(key, function(_:any, result:any) {
      if (result[key].exists == false)
      {
        regedit.createKey([key], function(err:any) {
          console.error(err);
        })
      }
      if ("mpm_dir" in result[key].values)
      {
        mpmDir = result[key].values["mpm_dir"].value;
      }
      if ("game_dir" in result[key].values)
      {
        gameDir = result[key].values["game_dir"].value;
      }
    })
  }
  const getGameFolder = (event:any,_: any) => {
    refreshPaths();
    event.sender.send("ModController.receiveFolder", gameDir);
  }
  const setGameFolder = async (event:any,_: any) => {
    refreshPaths();
    let dir = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    regedit.putValue({[key]: {
      'game_dir': {
        value: dir.filePaths[0],
        type: 'REG_SZ'
      }
    }}, function(err:any) {
      console.error(err);
    });
    getGameFolder(event, null);
  }
  const modIgnore = (_:any, data:any) => {
    refreshPaths();
    const mod:string = data.mod;
    const ignore:boolean = data.ignore;

    console.log("modignore");
    const spawn = require("child_process").spawn;
    const base64 = new Buffer(JSON.stringify(mod)).toString("base64");
    spawn(mpmDir,
    ["mod", base64, ignore?"-ignore":"-notignore"],{
      cwd: gameDir
    });
  }
  const reorderList = (_:any,data: any) => {
    refreshPaths();
    const json:any = data;
    console.log("reorder");
    const spawn = require("child_process").spawn;
    const base64 = new Buffer(JSON.stringify(json)).toString("base64");
    spawn(mpmDir,
    ["reorder", base64],{
      cwd: gameDir
    });
  };

  const getMods = (event:any,_: any) => {
    refreshPaths();
    console.log("getMods");
    const spawn = require("child_process").spawnSync;

    const mpm = spawn(mpmDir,
    ["get-mods", "-modloader"],{
      cwd: gameDir
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
    refreshPaths();
    const path:string = data;
    const spawn = require("child_process").spawn;
    spawn("explorer", [gameDir + "\\modloader\\" + path]);
  }

  const installMod = (event:any,data: any) => {
    refreshPaths();
    let mod:Mod = data;

    const spawn = require("child_process").spawn;

    const mpm = spawn(mpmDir,
    ["install", mod.name, "-gui"],{
      cwd: gameDir
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
