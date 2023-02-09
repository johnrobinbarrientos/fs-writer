const {ipcRenderer} = window.require('electron')
export default {
  strict: true,
  data: {
    clock: ''
  },
  state: {

    timer: {
      hr: 0,
      min: 0,
      sec: 0
    },

    pmdTimer: {
      pmd_min: 25,
      pmd_sec: 0,
      pmd_selected: '25'
    },
    togglePMD: {
      pmd_toggle: 'Start'
    }
  },

  getters: {
    getDefaultTimer: state => {
      return state.timer
    },
    getPmdTimer: state => {
      return state.pmdTimer
    },
    getTestObject: state => {
      return state.pmdTest
    },
    getToggle: state => {
      return state.togglePMD
    }
  },

  mutations: {

    mutateDefaultTimer: state => {
      setInterval(() => {
        state.timer.sec += 1

        if (state.timer.sec > 59) {
          state.timer.sec = 0

          if (state.timer.min >= 59) {
            state.timer.min = 0
            state.timer.hr += 1
          } else {
            state.timer.min += 1
          }
        }
      }, 1000)
    },

    mutatePmdTimer (state, payload) {
      if (payload === 'start') {
        this.clock = setInterval(() => {
          if (state.pmdTimer.pmd_min === 0 && state.pmdTimer.pmd_sec === 0) {
            clearInterval(this.clock)

            ipcRenderer.send('SHOW_SWAL_TIMESUP_STARTER')

            state.togglePMD.pmd_toggle = 'Start'
          } else {
            state.pmdTimer.pmd_sec -= 1
          }

          if (state.pmdTimer.pmd_sec < 0) {
            state.pmdTimer.pmd_sec = 59
            state.pmdTimer.pmd_min -= 1
          }
        }, 1000)
      } else if (payload === 'pause') {
        clearInterval(this.clock)
      } else {
        clearInterval(this.clock)
        state.pmdTimer.pmd_min = 25
        state.pmdTimer.pmd_sec = 0
      }
    },

    mutateToggle (state, payload) {
      state.togglePMD.pmd_toggle = payload
    },

    setPmdTimer (state, payload) {
      state.pmdTimer.pmd_min = payload
      state.pmdTimer.pmd_sec = 0
      clearInterval(this.clock)
      state.togglePMD.pmd_toggle = 'Start'
    },
    setSelectedPmdTimer (state, payload) {
      state.pmdTimer.pmd_selected = payload
    }

  },

  actions: {
    mutateDefaultTimer: context => {
      context.commit('mutateDefaultTimer')
    },

    mutatePmdTimer (context, status) {
      context.commit('mutatePmdTimer', status)
    }
  }
}
