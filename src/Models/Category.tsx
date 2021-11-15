interface Category {
  languages: {
    [Key: string]: {
      name: string
    }
  },
  icon: string,
  full_install: boolean,
  mods: string[]
}
export default Category;
