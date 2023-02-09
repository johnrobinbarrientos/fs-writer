<template>
<div class="component-syncing open">
    <div @click="closeSyncer()" style="position:fixed; top:20px; right:25px; cursor:pointer; font-size:25px;">X</div>
    <div class="steps">
        <div v-if="step == 1" class="item">
            <h2>{{$t('START_SYNCING')}}</h2>
            <p class="subheading">{{$t('UPDATE_YOUR_DATA_BY_PRESSING_START_BUTTON')}}.</p>
            <button class="btn-start" @click="next()">Start</button>
        </div>
        <div v-if="step == 2" class="item fadeIn animated">
            <h2>{{$t('CONNECTING')}}</h2>
            <p class="subheading">{{$t('CHECKING_YOUR_INTERNET_CONNECTION')}}, {{$t('PLEASE_WAIT')}}...</p>
            <img class="ajax-loader" src="@/assets/img/loader.svg">
        </div>
        <div v-if="step == 3" class="item fadeIn animated">
            <h2>{{$t('SYNCING_YOUR_DATA')}}</h2>
            <p class="subheading">{{$t('THIS_MIGHT_TAKE_A_FEW_MINUTES')}}, {{$t('PLEASE_WAIT')}}...</p>
            <img class="ajax-loader" src="@/assets/img/loader.svg">
        </div>
        <div v-if="step == 4" class="item bg-white text-left">
            <h2>{{$t('CHANGE_LOGS')}}</h2>
            <p class="subheading">The following items below are the changes</p>
            <p class="subheading">The following items below are the changes</p>
            <p class="subheading">The following items below are the changes</p>
            <p class="subheading">The following items below are the changes</p>
            <p class="subheading">The following items below are the changes</p>
            <p class="subheading">The following items below are the changes</p>
            <p class="subheading">The following items below are the changes</p>
            <p class="subheading">The following items below are the changes</p>
            <p class="subheading">The following items below are the changes</p>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'Syncer',
  data: function () {
    return {
      step: 1,
      current: 0,
      endpoints: [
        { api: 'book-genres', local: 'book-genres' },
        { api: 'book-relations', local: 'relations' },
        { api: 'books', local: 'books' },
        { api: 'book-items', local: 'items' },
        { api: 'book-locations', local: 'locations' },
        { api: 'book-genre-collections', local: 'book-genre-collections' },
        { api: 'book-chapters', local: 'chapters' },
        { api: 'book-chapter-versions', local: 'chapter-versions' },
        { api: 'book-characters', local: 'characters' },
        { api: 'book-relation-details', local: 'relation-details' },
        { api: 'book-scenes', local: 'scenes' },
        { api: 'book-scene-versions', local: 'scene-versions' },
        { api: 'book-scene-items', local: 'scene-items' },
        { api: 'book-scene-locations', local: 'scene-locations' },
        { api: 'book-scene-characters', local: 'scene-characters' }
      ]
    }
  },
  methods: {
    closeSyncer: function () {
      var scope = this
      scope.$parent.toggleSyncer()
    },
    next: function () {
      var scope = this
      scope.step += 1
      if (scope.step === 2) {
        scope.ping()
      } else if (scope.step === 3) {
        scope.sync()
      }
    },
    ping: function () {
      var scope = this
      this.$http.get(window.APP.API.URL + '/user/connect')
        .then(function (response) {
        // handle success
        //   console.log(response)
          setTimeout(function () {
            scope.next()
          }, 1000)
        })
        .catch(function (error) {
        // handle error
          console.log(error)
        })
        .finally(function () {
        // always executed
        })
    },
    sync: function () {
      var scope = this
      scope.download(scope.endpoints[scope.current])
    },
    download: function (endpoint) {
      var scope = this

      scope.$http.get(window.APP.API.URL + '/' + endpoint.api,
        {
          'headers': {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImE0YmE1NDMxZWM5ZDI0MTgzODMxNzY4ZDg0NWRjNGIxYTBjYTc3YjAwYzEzNzA4YmFhNTA5OTM5MjM5N2YwNjRiOGVmYWJjZmEyODYxMTUwIn0.eyJhdWQiOiIxIiwianRpIjoiYTRiYTU0MzFlYzlkMjQxODM4MzE3NjhkODQ1ZGM0YjFhMGNhNzdiMDBjMTM3MDhiYWE1MDk5MzkyMzk3ZjA2NGI4ZWZhYmNmYTI4NjExNTAiLCJpYXQiOjE1ODMzMDIxNjMsIm5iZiI6MTU4MzMwMjE2MywiZXhwIjoxNjE0ODM4MTYzLCJzdWIiOiI0Iiwic2NvcGVzIjpbXX0.lTqpU7QLcQjjgxiv8dLyIYEcrl2ixlx09DoQhLXWfRFP2rs2goWqIHqBnoL5WEcqfjbNkoTJ868CPNcGTNrcTTlKdspNqC-Cl6NubDFxr_vCku9cLMkRWgqD5s0lC6jUuH-QrXUlaut4_ZVJ6sat0n92oTikuN1FmRewCJ59GYAnCiRPrpMs0-79vRWPH77n0p--fl0mva9T7DUs5sMETkQ_8hCEhJh6JFP2PV2JcIDWFcyNdSTQL3yMBCCvrmFMHjpeL0V7v7QvzajuWzuvrkSUYMKbkBZwTAsQAS5P3wLqf_kOW-LPuC463pSmcUpaYF9SO3ge5_iT1BRvy3BAPWb2o8aXI8Vm80PluMUptMitNOq9Uq9vHLU-OyaVaEDVRiN5-NFkDbt0a8cKTLtiWqSM4_sbbzesoDaoKghBxh37OiZzS431vwE70eUDUf3jb1eVim4qNrzUnQ01HR9Y8OlTPD1zegr-8kETHWvGj2LyRjHr6Za9pZNZjurM15m39YK24WHbdFCaAvbZpcQkncN4su9MiLbfU4SMUNDsORC-QTZWyxboi9na1k8Jh1sdzIKgQ68o7WzhyAtlugxMuDn4YJAnBRZhRHzFNPDhZ4-AnbYB2XNqC2IuTf1C9cOIhbgLsdnbbcNfb1CNrw2iyf51WILSfZOrF6bp0H_5c2k'
          }
        })
        .then(function (response) {
          // eslint-disable-next-line valid-typeof
          var model = scope.endpoints[scope.current].local
          var data = response.data.rows
          scope.save(model, data)
        })
        .catch(function (error) {
        // handle error
          console.log(error)
        })
        .finally(function () {
        // always executed
        })
    },
    save: function (endpoint, rows) {
      var scope = this
      var chunks = scope.arrayChunk(rows, 100)
      for (var i = 0; i < chunks.length; i++) {
        scope.axios
          .post('http://localhost:3000/' + endpoint + '/sync', chunks[i])
          .then(response => {
            console.log(endpoint + ' saved!')
          })

        if (i >= (chunks.length - 1)) {
          scope.nextModel()
        }
      }
    },
    nextModel: function () {
      var scope = this
      scope.current += 1
      if (scope.current < scope.endpoints.length) {
        scope.download(scope.endpoints[scope.current])
      } else {
        scope.step += 1
      }
    },
    arrayChunk: function (haystack, chunkSize = 10) {
      var chunks = haystack.map(function (e, i) {
        return i % chunkSize === 0 ? haystack.slice(i, i + chunkSize) : null
      }).filter(function (e) { return e })

      return chunks
    }
  },
  mounted () {
    // var scope = this
    // console.log(scope)
    // console.log(scope.$attrs.value)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .ajax-loader { width: 100px; height: 100px; margin: 0px; margin-top:-20px; display:inline-block; }
 .component-syncing { font-size:12px; background:rgba(0,0,0,0.5); width:300px; height:50px; padding:15px; position:fixed; bottom:20px; left:10px; color:#fff; }
 .component-syncing.open { top:0px; left:0px; width:100%; height:100vh; background:rgba(41,55,66,0.9); color:#fff;  }

 .component-syncing .loader  { display:none;  }
 .component-syncing .loader .item { width:200px; height:180px; margin:0px auto;  text-align:center;  }
 .component-syncing .loader .item i { font-size:120px; color:#293742;  }
 .component-syncing .loader .item p { color:#293742; font-size:20px;  }

 .component-syncing .steps .item { text-align:center; width:100%; max-width:800px; padding:20px; position: absolute;  top: 20%; transform: translateY(-50%); -webkit-transform: translateY(-50%); left: 50%; transform: translateX(-50%); -webkit-transform: translateX(-50%);  }
 .component-syncing .steps .item.bg-white { background:#fff; color:#000; }
 .component-syncing .steps .item.text-left { text-align:left;  }
 .component-syncing .steps .item h2 {  font-size:35px; margin:0px; }
 .component-syncing .steps .item p.subheading {  font-size:20px; }

 .btn-start { background:#8a2c3a; color:#fff; border:none; border-radius:3px; height:40px; width:180px; font-size:18px; }
 .btn-start:hover { background:#a13142;  }
</style>
