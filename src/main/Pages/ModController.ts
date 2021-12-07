import Mod from "../../Models/Mod";
import { ipcMain } from 'electron';
const { dialog } = require('electron')
const regedit = require('regedit')
const key = 'HKCU\\SOFTWARE\\MIXMODS';
const gtaKey = 'HKCU\\SOFTWARE\\Rockstar Games\\InstallGUID';
const fs = require('fs');
regedit.setExternalVBSLocation('resources/regedit/vbs');

const ModController = () => {
  let gameDir:string;
  let mpmDir:string;

  const refreshPaths = async () => {
    await new Promise((resolve, reject) => {
      regedit.list([key, gtaKey], function(_:any, result:any) {
        if (result[key].exists == false)
        {
          regedit.createKey([key], function(err:any) {
            console.error(err);
            reject();
          })
        }
        if ("mpm_dir" in result[key].values)
        {
          mpmDir = result[key].values["mpm_dir"].value;
        }
        if ("gtasa" in result[gtaKey].values)
        {
          gameDir = result[gtaKey].values["gtasa"].value;
          if (!fs.existsSync(gameDir + "\\gta_sa.exe"))
            dialog.showMessageBox({message: "Invalid game directory, please select the directory that has the 'gta_sa.exe' executable", title:"Erro", type:"error"})
        }
        resolve(gameDir);
      })
    })

  }
  const getGameFolder = async (event:any,_: any) => {
    await refreshPaths();
    event.sender.send("ModController.receiveFolder", gameDir);
  }
  const setGameFolder = async (event:any,_: any) => {
    await refreshPaths();
    let dir = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    regedit.putValue({[gtaKey]: {
      'gtasa': {
        value: dir.filePaths[0],
        type: 'REG_SZ'
      }
    }}, function(err:any) {
      console.error(err);
    });
    getGameFolder(event, null);
  }
  const modIgnore = async(_:any, data:any) => {
    await refreshPaths();
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
  const checkMod = async (event:any,data:Mod) => {
    await refreshPaths();
    const spawn = require("child_process").spawn;
    const mpm = spawn(mpmDir,
    ["check-package", data.package + "@" + data.version, "-gui"],{
      cwd: gameDir
    });

    mpm.stdout.on("data", (mpmData:string) => {
      const res = mpmData.toString();
      event.sender.send("ModController.receiveCheckMod." + data.package, res.includes("package#true"));
    });

    mpm.on('error', (error:any) => {
        console.error(`MPM ${error.message}`);
        event.sender.send("ModDownload." + data, {status: "Error", progress: 0, message: "Erro fatal"});
    });

    mpm.on("close", (code:number) => {
        if (code != 0)
          event.sender.send("ModDownload." + data, {status: "Error", progress: 0, message: "Erro fatal"});
    });
  };
  const reorderList = async (_:any,data: any) => {
    await refreshPaths();
    const json:any = data;
    console.log("reorder");
    const spawn = require("child_process").spawn;
    const base64 = new Buffer(JSON.stringify(json)).toString("base64");
    spawn(mpmDir,
    ["reorder", base64],{
      cwd: gameDir
    });
  };

  const getMods = async(event:any,_: any) => {
    await refreshPaths();
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
  const openModFolder = async(_:any, data:any) => {
    await refreshPaths();
    const path:string = data;
    const spawn = require("child_process").spawn;
    spawn("explorer", [`${gameDir}` + "\\modloader\\" + path]);
    console.log("explorer", [`"${gameDir}` + "\\modloader\\" + path + '"']);
  }

  const installMod = async(event:any,mod:Mod) => {
    await refreshPaths();

    const spawn = require("child_process").spawn;

    console.log(gameDir);

    const mpm = spawn(mpmDir,
    ["install", mod.package + "@" + mod.version, "-gui"],{
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
          event.sender.send("ModDownload." + mod?.package, {status, progress, message});
    });

    mpm.stderr.on("data", (mpmData:string) => {
        console.log(`stderr: ${mpmData}`);
    });

    mpm.on('error', (error:any) => {
        console.error(`MPM ${error.message}`);
        event.sender.send("ModDownload." + mod?.package, {status: "Error", progress: 0, message: "Erro fatal"});
        dialog.showMessageBox({message: error.message, title:"Erro", type:"error"})
    });

    mpm.on("close", (code:number) => {
        console.log(`child process exited with code ${code}`);
        if (code != 0)
          event.sender.send("ModDownload." + mod?.package, {status: "Error", progress: 0, message: "Erro fatal"});
    });
  }
  const init = async() => {
    await refreshPaths();
    const spawn = require("child_process").spawn;
    const mpm = spawn(mpmDir,
    ["init"],{
      cwd: gameDir
    });

    mpm.on('error', () => {
      dialog.showMessageBox({message: "Your MixPackageManager is having problems, the application will not work correctly. Please consider reinstalling MPM.", title:"Erro", type:"error"})
    });
  }
  ipcMain.on("ModController.installMod", installMod);
  ipcMain.on("ModController.getFolder", getGameFolder);
  ipcMain.on("ModController.setFolder", setGameFolder);
  ipcMain.on("ModController.getMods", getMods);
  ipcMain.on("ModController.checkMod", checkMod);
  ipcMain.on("ModController.openModFolder", openModFolder);
  ipcMain.on("ModController.reorderList", reorderList);
  ipcMain.on("ModController.setIgnore", modIgnore);
  init();
}

export default ModController;
