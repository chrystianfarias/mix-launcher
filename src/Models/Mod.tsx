interface Mod {
  package: string,
  languages: {
    [Key: string]: {
      name: string,
      description: string
    }
  },
  version: string,
  thumbnail: string,
  url: string,
  incompatible_mods: string[]
  dependency_mods: string[]
}
export default Mod;
