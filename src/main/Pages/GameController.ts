import { ipcMain } from 'electron';
const regedit = require('regedit')
const gtaKey = 'HKCU\\SOFTWARE\\Rockstar Games\\InstallGUID';
regedit.setExternalVBSLocation('resources/regedit/vbs');

const GameController = () => {
  let gameDir:string;
  const refreshPaths = async () => {
    await new Promise((resolve, _) => {
      regedit.list([gtaKey], function(_:any, result:any) {
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

  ipcMain.on("GameController.openGame", openGame);
}

export default GameController;
