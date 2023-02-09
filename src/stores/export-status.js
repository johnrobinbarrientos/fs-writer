export default {
  strict: true, // make sure everything us mutated, no direct editing of state
  state: {
    exportbook: {
      export_book_status: false
    },
    exportAllScene: { // TODO: if multiple export at a time then,refactor this as array index of uuid,
      status: false
    },
    exportCharacters: { // TODO: if multiple export at a time then,refactor this as array index of uuid,
      status: false
    }
  },
  getters: {
    getExportBookStatus: state => {
      return state.exportbook
    },
    getExportAllSceneStatus: state => {
      return state.exportAllScene
    },
    getExportCharactersStatus: state => {
      return state.exportCharacters
    }
  },
  mutations: {
    exportBookStatusOpen: state => {
      state.exportbook.export_book_status = true
    },
    exportBookStatusClose: state => {
      state.exportbook.export_book_status = false
    },
    exportAllSceneStatusOpen: state => {
      state.exportAllScene.status = true
    },
    exportAllSceneStatusClose: state => {
      state.exportAllScene.status = false
    },
    exportCharactersStatusOpen: state => {
      state.exportCharacters.status = true
    },
    exportCharactersStatusClose: state => {
      state.exportCharacters.status = false
    }
  }
}
