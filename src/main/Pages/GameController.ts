import { dialog, ipcMain } from 'electron';
const regedit = require('regedit')
const gtaKey = 'HKCU\\SOFTWARE\\Rockstar Games\\InstallGUID';
const key = 'HKCU\\SOFTWARE\\MIXMODS';
regedit.setExternalVBSLocation('resources/regedit/vbs');

const GameController = () => {
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
        }
        resolve(gameDir);
      })
    })

  }
  const openGame = async (__:any,_: any) => {
    await refreshPaths();
    //event.sender.send("ModController.receiveFolder", gameDir);
    const spawn = require("child_process").spawn;
    let gta = spawn(gameDir + "/gta_sa.exe",[],{});

    gta.on("close", (code:number) => {
        console.log(code)
    });
  }
  const checkGame = async (event:any,_:any) => {
    await refreshPaths();
    const spawn = require("child_process").spawn;
    const mpm = spawn(mpmDir,
    ["check-game", "-gui"],{
      cwd: gameDir
    });
    let errors = [] as any[];

    mpm.stdout.on("data", (mpmData:string) => {
      const res = mpmData.toString();
      const desc = res.split('#');
      if (res.includes("exe#"))
      {
        errors.push({message: "exe", description: desc[1]});
      }
      if (res.includes("modified#"))
      {
        errors.push({message: "modified", description: desc[1]});
      }
      if (res.includes("missing#"))
      {
        errors.push({message: "missing", description: desc[1]});
      }
      if (res.includes("path#"))
      {
        errors.push({message: "path", description: desc[1]});
      }
    });

    mpm.on('error', (error:any) => {
        console.error(`MPM ${error.message}`);
        event.sender.send("GameController.Error", "Erro fatal");
        dialog.showMessageBox({message: error.message, title:"Erro", type:"error"})
    });

    mpm.on("close", (code:number) => {
        if (code != 0)
          event.sender.send("GameController.Error", "Erro fatal");
        else
          event.sender.send("GameController.receiveCheckGame", errors);
    });
  };

  ipcMain.on("GameController.openGame", openGame);
  ipcMain.on("GameController.checkGame", checkGame);
}

export default GameController;
