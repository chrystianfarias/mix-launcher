const { dialog } = require('electron')

export const test = (_: any, __: any) => {
  console.log(dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }))
}
