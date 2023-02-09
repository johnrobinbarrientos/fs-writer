// Mixins are a flexible way to distribute reusable functionalities for Vue components.
export default {
  name: 'cookie',
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    COOKIE_SET: function (key, value, expiryDate) {
      var d = new Date()
      d.setTime(d.getTime() + (expiryDate * 24 * 60 * 60 * 1000))
      var expires = 'expires=' + d.toUTCString()
      document.cookie = key + '=' + value + ';' + expires + ';path=/'
    },
    COOKIE_GET: function (key) {
      var name = key + '='
      var ca = document.cookie.split(';')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) === ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    }
  }
}
