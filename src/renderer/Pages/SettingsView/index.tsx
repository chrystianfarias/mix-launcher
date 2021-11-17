import { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const SettingsView = () => {
  const [gameDir, setGameDir] = useState("/");
  const [mpmDir, setMPMDir] = useState("/");

  useEffect(() => {
    window.api.send("ModController.getGameFolder", {});
    window.api.receive("ModController.receiveGameFolder", (folder:any) => {
      setGameDir(folder);
    });
    window.api.send("ModController.getMPMFolder", {});
    window.api.receive("ModController.receiveMPMFolder", (folder:any) => {
      setMPMDir(folder);
    });
  }, []);

  const setGameFolder = () => {
    window.api.send("ModController.setGameFolder", {});
  };

  const setMPMFolder = () => {
    window.api.send("ModController.setMPMFolder", {});
  };

  return <div>
    <TextField
      label="Game Directory"
      value={gameDir}
      InputProps={{
        readOnly: true,
      }}
    />
    <Button onClick={setGameFolder} variant="outlined">
        Set Folder
    </Button>
    <br></br>
    <TextField
      label="MPM Directory"
      value={mpmDir}
      InputProps={{
        readOnly: true,
      }}
    />
    <Button onClick={setMPMFolder} variant="outlined">
        Set Folder
    </Button>
  </div>;
}
export default SettingsView;
