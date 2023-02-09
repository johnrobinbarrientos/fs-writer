export default {
  strict: true, // make sure everything us mutated, no direct editing of state
  state: {
    axios: null,
    tabs: {
      active_index: 0,
      items: [
        { key: 'dashboard', title: 'DASHBOARD', component: 'dashboard', data: { autosync: !true }, refresh: false, modified: false }
      ]
    }
  },
  getters: {
    getTabs: state => {
      return state.tabs
    },
    getModifiedTabs: state => {
      var tabs = []

      for (let i = 0; i < state.tabs.items.length; i++) {
        let current = state.tabs.items[i]
        if (current.modified) {
          tabs.push(current)
        }
      }

      return tabs
    },
    // Ismael: Before it return the id and now i change it to return the tab using the id as the index
    getTabsByID: state => (id) => {
      return state.tabs.items[id]
    },
    getActiveTab: state => {
      return state.tabs.active_index
    },
    getActiveTabKey: state => {
      return state.tabs.active_index
    },
    tabIsModified: state => (index) => {
      return state.tabs.items[index].modified
    }
  },
  mutations: {
    newTab (state, payload) {
      for (let i = 0; i < state.tabs.items.length; i++) {
        var item = state.tabs.items[i]
        if (item.key === payload.key) {
          state.tabs.active_index = i
          state.tabs.active_key = payload.key
          break
        } else if (i === (state.tabs.items.length - 1) && item.key !== payload.key) {
          state.tabs.items.push(payload)
          state.tabs.active_index = (state.tabs.items.length - 1)
          state.tabs.active_key = payload.key
          break
        }
      }
    },
    changeTab (state, payload) {
      state.tabs.active_index = payload
    },
    changeTabContent (state, payload) {
      for (let i = 0; i < state.tabs.items.length; i++) {
        var item = state.tabs.items[i]
        if (payload.index !== 0) {
          state.tabs.active_index = payload.index
          state.tabs.items[payload.index].title = payload.title
          state.tabs.items[payload.index].component = payload.component
          state.tabs.items[payload.index].data = payload.data
          state.tabs.items[payload.index].key = payload.key
        } else if (item.key === payload.key) {
          state.tabs.active_index = i
          break
        } else if (i === (state.tabs.items.length - 1) && item.key !== payload.key) {
          state.tabs.active_index = payload.index
          state.tabs.items[payload.index].title = payload.title
          state.tabs.items[payload.index].component = payload.component
          state.tabs.items[payload.index].data = payload.data
          state.tabs.items[payload.index].key = payload.key
          break
        }
      }
    },
    changeTabTitle (state, payload) {
      for (let i = 0; i < state.tabs.items.length; i++) {
        var item = state.tabs.items[i]
        if (item.key === payload.key) {
          state.tabs.items[i].title = payload.title
        }
      }
    },
    removeTab (state, payload) {
      let next = 0

      // first tab will always be open
      if (payload < 1) {
        return
      }

      next = payload - 1

      if (payload > -1) {
        state.tabs.items.splice(payload, 1)
        state.tabs.active_index = next
      }
    },
    markTabAsModified (state, payload) {
      // payload = tab index only
      state.tabs.items[payload].modified = true
    },
    unmarkTabAsModified (state, payload) {
      // payload = tab index only
      state.tabs.items[payload].modified = false
    }
  },
  actions: {
    changeTabContent ({ commit, state }, payload) {
      commit('changeTabContent', payload)
    },
    changeTabTitle ({ commit, state }, payload) {
      commit('changeTabTitle', payload)
    },
    newTab ({ commit, state }, payload) {
      commit('newTab', payload)
    },
    changeTab ({ commit, state }, payload) {
      commit('changeTab', payload)
    },
    removeTab ({ commit, state }, payload) {
      commit('removeTab', payload)
    },
    markTabAsModified ({ commit, state }, payload) {
      commit('markTabAsModified', payload)
    },
    unmarkTabAsModified ({ commit, state }, payload) {
      commit('unmarkTabAsModified', payload)
    }
  }
}
