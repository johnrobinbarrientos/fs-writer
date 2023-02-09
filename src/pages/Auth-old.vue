<template>
  <div id="auth" class="page-auth">
      <!--
    <div class="login-form text-center">
      <form v-on:submit.prevent="authenticate()">
        <h1 class="no-margin">Easy Write</h1>
        <h6 class="version no-margin" style="color: white;font-size: small" v-html="'Version ' + version"></h6>
        <p><small>Welcome Back! Please login to continue.</small></p><br>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text"  id="basic-addon1"><i class="fa fa-envelope"></i></span>
          </div>
          <input required type="text" class="form-control" placeholder="Username" aria-describedby="basic-addon1" v-model="username" >
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-adon1"><i class="fa fa-lock"></i></span>
          </div>
          <input required type="password" class="form-control" placeholder="Password" aria-describedby="basic-addon1" v-model="password">
        </div>
        <button @click="closeForm()" type="button" class="btn btn-light">Cancel</button>
        <button type="submit" class="btn btn-light">Login</button>
      </form>
    </div>
    -->
   <div class="es-login-wrapper">
       <div class="es-login">
           <div class="inner">
               <div class="heading">
                   <img src="@/assets/img/es-logo-white.png">
               </div>
               <div class="content">
                   <form v-on:submit.prevent="authenticate()">
                     <h6 class="version no-margin" style="color: white;font-size: small" v-html="'Version ' + version"></h6>
                       <p class="welcome">Welcome to EasyWrite, please login to your account to continue.</p>
                       <div class="input-group line">
                           <label>Username</label>
                           <input v-model="username" type="text" placeholder="Enter your username here...">
                       </div>
                       <div class="input-group line">
                           <label>Password</label>
                           <input v-model="password" type="password" placeholder="Enter your password here...">
                       </div>
                       <div class="input-group">
                           <button type="submit">Login</button>
                       </div>
                   </form>
               </div>
           </div>
       </div>
   </div>
  </div>
</template>

<script>
// In renderer process (web page).
const electron = window.require('electron')

const {ipcRenderer} = electron

const remote = electron.remote

export default {
  name: 'Auth',
  data () {
    return {
      username: 'Support',
      password: '123QazQaz',
      window: remote.getCurrentWindow(),
      version: remote.app.getVersion()
    }
  },
  methods: {
    closeForm () {
      this.window.close()
    },
    authenticate: function (event) {
      var scope = this
      scope.axios
        .get('http://localhost:3000/users/login?username=' + scope.username + '&password=' + scope.password)
        .then(response => {
          scope.$store.commit('authenticate', {
            user: response.data.user,
            author: response.data.author
          })
          ipcRenderer.send('RESIZE_MAIN_WINDOW', response)
          scope.$router.push({name: 'Main'})
          // this.window.close()
        })
        .catch(error => {
          if (error.response.status === 401) {
            scope.authenticateAPI()
          }
        })
    },
    authenticateAPI: function () {
      var scope = this
      scope.axios.post('https://api-pilot.orosage.com/dev/login', {
        username: scope.username,
        password: scope.password
      })
        .then(function (response) {
          delete response.data.user.id
          delete response.data.author.id

          scope.$set(response.data.user, 'password', scope.password)
          scope.$set(response.data.user, 'token', response.data.success.token)
          scope.$set(response.data.user, 'author', response.data.author)
          scope.saveUser(response.data.user)
        })
        .catch(function (error) {
          scope.$notify({
            group: 'notification',
            type: 'error',
            title: 'Authentication Failed',
            text: error.response.data.message
          })
        })
    },
    saveUser: function (data) {
      var scope = this
      scope.axios
        .post('http://localhost:3000/users', data)
        .then(response => {
          if (response.data) {
            // console.log(response.data)
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'User successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.$store.commit('authenticate', {
                user: response.data,
                author: response.data.author
              })
              ipcRenderer.send('RESIZE_MAIN_WINDOW', response)
              scope.$router.push({name: 'Main'})
            })
          }
        })
    }
  },
  mounted () {
    // this.IPCSendSync('/books/get', { id: 1, title: 'The Book' })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body { background:#293742 !important; }
.es-login-wrapper {background:#293742 !important; display: table; position: absolute;  top: 0; left: 0; height: 100%; width: 100%; }
.es-login-wrapper .es-login { display: table-cell; vertical-align: middle; }
.es-login-wrapper .es-login  .inner { margin-left: auto; margin-right: auto; width: 350px; min-height:90vh;  }
.es-login-wrapper .es-login  .inner .heading { text-align:center; margin-bottom:30px;  }
.es-login-wrapper .es-login  .inner .heading img { width:150px;  }
.es-login-wrapper .es-login  .inner .welcome { text-align:left; color:#fff; }

.input-group { margin-bottom:20px;  text-align:left; width:100%; }
.input-group label { color:#293742; font-size:12px; font-family:'Gotham Bold';  }
.input-group.line input { width:100%; height:35px; line-height:35px; border:none; color:#fff; background:#324553; border:1px solid #8e3848; padding:0px 10px; border-radius:12px; }
.input-group.line input::placeholder { color:#496684; }
.input-group.line input:active, .input-group.line input:focus { border:1px solid #8e3848;  }

.input-group button { background:#742f3c; color:#fff; width:100%; height:40px; line-height:40px; border:none; border-radius:4px; }
.input-group button:hover { background:#8e3848;  }

/*
.page-auth {
  background: url("../assets/img/login-bg.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
.login-form {
  color: #fff;
  padding-top: 50px;
  width: 100%;
  height: 380px;
}
.login-form .input-group {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}
.login-form .input-group-text {
  min-width: 42px;
}
.login-form .input-group-text i {
  margin-left: auto;
  margin-right: auto;
}
.login-form button {
  width: 154px;
}
<<<<<<< HEAD
*/
.version{
  color: white;
  font-size: x-small;
  bottom: 0;
  right: 0;
  position: absolute;
  padding: 5px;
}
</style>
