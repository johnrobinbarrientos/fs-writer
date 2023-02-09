// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import ExportCharacters from './pages/ExportCharacters'
import ExportScenes from './pages/ExportScenes'
import ExportBook from '@/pages/reports/ExportBook'
import router from './router'
import mixins from './utils/mixins'
import cookie from './utils/cookie'
import Notifications from 'vue-notification'
import Multiselect from 'vue-multiselect'
import { BootstrapVue } from 'bootstrap-vue'
import VueI18n from 'vue-i18n'
import da from '@/lang/danish'
import en from '@/lang/english'
import fi from '@/lang/finnish'
import is from '@/lang/icelandic'
import nb from '@/lang/norwegian'
import es from '@/lang/spanish'
import sv from '@/lang/swedish'

import tab from './stores/tab'
import auth from './stores/auth'
import listing from './stores/listing'
import timer from './stores/timer'
import chapter from './stores/chapter'
import character from './stores/character'
import item from './stores/item'
import location from './stores/location'
import scene from './stores/scene'
import settings from './stores/settings'
import book from './stores/book'
import exportstatus from './stores/export-status'

// import './assets/vendors/bootstrap/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/vendors/lineawesome/css/line-awesome.min.css'
import './assets/vendors/fontawesome/css/all.min.css'
import './assets/css/animate.css'
import './assets/css/fonts.css'
import './assets/css/colors.css'
import './assets/css/style.css'
import './assets/css/darkmode.css'

// import jQuery from 'jquery'
// import 'jquery/dist/jquery.min'

// import 'select2/dist/css/select2.min.css'
// import 'select2-theme-bootstrap4/dist/select2-bootstrap.min.css'
// import 'select2/dist/js/select2.min'

import 'vue-multiselect/dist/vue-multiselect.min.css'

import 'tinymce/tinymce'
import 'tinymce/themes/silver'

import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'
import 'tinymce/skins/content/default/content.min.css'

// plugins
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/table'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/template'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/print'

import TinyMCE from './components/TinyMCE'
import TinyMCEChapter from './components/TinyMCEChapter'

import { ToggleButton } from 'vue-js-toggle-button'

window.$ = window.jQuery = require('jquery')
window.moment = require('moment')
window.swal = require('sweetalert2')
window.he = require('he')

let APP = {
  SE_PROD: {
    API: {
      URL: 'https://api.pilotleser.no/se',
      UPLOAD_URL: 'https://www.easywrite.se/uploads'
    }
  },
  SE_DEV: {
    API: {
      URL: 'https://api.pilotleser.no/se-dev',
      UPLOAD_URL: 'https://dev.easywrite.se/uploads'
    }
  },
  NO_PROD: {
    API: {
      URL: 'https://api.pilotleser.no/live',
      UPLOAD_URL: 'https://www.pilotleser.no/uploads'
    }
  }
}

window.APP = APP.SE_DEV // DEVELOPEMENT APP
if (process.env.NODE_ENV === 'production') {
  window.APP = APP.SE_PROD // PRODUCTION APP
}

// window.$.fn.select2.defaults.set('theme', 'bootstrap')

// import electron from 'electron'
// Vue.use(electron)
Vue.use(Vuex)
Vue.use(Notifications)
Vue.use(VueAxios, axios)
Vue.component('multiselect', Multiselect)
Vue.component('tiny-editor', TinyMCE)
Vue.component('tiny-editor-chapter', TinyMCEChapter)
Vue.component('ToggleButton', ToggleButton)

// Install BootstrapVue
Vue.use(BootstrapVue)
// Vue.use(jQuery)

Vue.use(VueI18n)

const messages = {
  da, en, fi, is, nb, es, sv
}

const i18n = new VueI18n({
  fallbackLocale: 'en',
  messages
})

const store = new Vuex.Store({
  modules: {
    tab: tab,
    auth: auth,
    listing: listing,
    timer: timer,
    chapter: chapter,
    character: character,
    item: item,
    location: location,
    scene: scene,
    settings: settings,
    book: book,
    exportstatus: exportstatus
  }
})
// Vue.component('editor', tinymce)

// all global functions goes here...
Vue.mixin(mixins)
Vue.mixin(cookie)

// eslint-disable-next-line no-new
window.vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})

/*
* Vues below here is for MPA
* declare here the vues , put the html ins "src/html"
* */
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-new
  new Vue({
    el: '#export-characters',
    store,
    router,
    i18n,
    components: { ExportCharacters },
    template: '<ExportCharacters/>'
  })
  // eslint-disable-next-line no-new
  new Vue({
    el: '#export-scenes',
    store,
    router,
    i18n,
    components: { ExportScenes },
    template: '<ExportScenes/>'
  })
  // eslint-disable-next-line no-new
  new Vue({
    el: '#export-book',
    store,
    router,
    i18n,
    components: { ExportBook },
    template: '<ExportBook/>'
  })
}

const electron = window.require('electron')
const { ipcRenderer } = electron

ipcRenderer.on('TRANSLATE', function (event, data) {
  i18n.locale = data
})

ipcRenderer.on('REFRESH_MENU', function (event, data) {
  ipcRenderer.send('REFRESH_MENUITEMS', data)
})
