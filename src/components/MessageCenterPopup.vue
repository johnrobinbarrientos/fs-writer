<template>
  <div>
    <div class="card shadow mb-4">
      <div class="card-header p-15px">
        <h6 class="m-0 font-weight-bold">Message Center</h6>
      </div>
      <div class="p-15px">
        <a href="#" v-on:click.prevent="type = 'All'">{{$t('ALL')}} ({{ itemsCounts['Message'] + itemsCounts['Notification']}})</a> |
        <a href="#" v-on:click="openMessage(null, $event)">{{$t('MESSAGES')}} ({{itemsCounts['Message']}})</a> |
        <a href="#" v-on:click.prevent="type = 'Notification'">{{$t('NOTIFICATIONS')}} ({{itemsCounts['Notification']}})</a>

        <div style="float: right;">
          <button v-on:click="openMessage(null, $event)" class="btn btn-default" style="height: 24px; line-height: 24px; text-transform: none;">{{$t('NEW_MESSAGE')}}</button>
        </div>
      </div>
      <div class="card-body" style="padding: 0;">
        <div style="overflow-y: auto; max-height: calc(100vh - 266px);">
          <div v-if="rows.length < 1" style="text-align: center; padding: 30px 0; opacity: 0.5;">
            {{$t('EMPTY')}}
          </div>
          <div v-for="(row, i) in rows" v-bind:key="'mcp-key-'+i" style="padding: 10px; border-top: 1px solid #e3e6f0; clear: both;" v-bind:style="{backgroundColor: row.is_seen?'#fff':'rgb(245, 248, 250)'}">
            <div v-bind:style="{'background-image': 'url(@/assets/img/blank-profile-picture.png)'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0; float: left;"></div>
            <div style="float: left; margin-left: 10px;">
              <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{ row.data.user_name || 'Null'}}</div>
              <div v-if="row.type=='Message'" style="cursor: pointer;">
                <div v-html="row.data.message" v-on:click="openMessage(3)"></div>
              </div>
              <div v-if="row.type === 'SceneComment'">
                {{$t('COMMENTED_ON_SCENE')}} <a v-bind:href="'#'" @click.prevent="openLink(row)">{{ row.data.scene_title }}</a>
              </div>
              <div v-if="row.type === 'ChapterComment'">
                {{$t('COMMENTED_ON_CHAPTER')}} <a v-bind:href="'#'" @click.prevent="openLink(row)">{{ row.data.chapter_title }}</a>
              </div>
              <div v-if="row.type === 'FeedbackBook'">
                {{$t('LEFT_A_FEEDBACK_ON_BOOK')}} <a v-bind:href="'#'" @click.prevent="openLink(row)">{{ row.data.book.title }}</a>
              </div>
              <div v-if="row.type === 'FeedbackChapter'">
                 {{$t('LEFT_A_FEEDBACK_ON_CHAPTER')}} <a v-bind:href="'#'" @click.prevent="openLink(row)">{{ row.data.chapter.title }}</a>
              </div>
              <div v-if="row.type === 'FeedbackScene'">
                {{$t('LEFT_A_FEEDBACK_ON_SCENE')}} <a v-bind:href="'#'" @click.prevent="openLink(row)">{{ row.data.scene.title }}</a>
              </div>
              <div style="font-size: 80%; line-height: 100%; opacity: 0.5;">{{displayTime(row.created_at)}}</div>
            </div>
            <div style="clear: both;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'

export default {
  name: 'MessageCenterPopup',
  props: ['params'],
  data: function () {
    var scope = this
    var data = {
      items: [],
      type: 'All',
      itemsCounts: {
        'All': 0,
        'Message': 0,
        'Notification': 0
      },
      params_: {},
      notificationsCount: 0
    }
    if (scope.params) {
      Vue.nextTick(() => {

      })
    }
    return data
  },
  computed: {
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    },
    rows: function () {
      var scope = this
      var rows = []
      if (scope.type === 'All') {
        rows = scope.items
      } else {
        for (var i = 0; i < scope.items.length; i++) {
          var item = scope.items[i]

          if (scope.type === 'Notification') {
            if (item.type !== 'Message') {
              rows.push(item)
            }
          } else if (item.type === scope.type) {
            rows.push(item)
          }
        }
      }
      return rows
    }
  },
  methods: {
    setItemCount: function (k, n) {
      console.log('setItemCount', n)
      this.itemsCounts[k] = n
    },
    addItemCount: function (k, n) {
      console.log('addItemCount', n)
      this.itemsCounts[k] += n
    },
    openMessage: function (v) {
      window.AppMessaging.open(v)
      window.AppMain.showMessageCenter = false
    },
    openLink: function (row) {
      var type = row.type
      var data = row.data
      var scope = this
      var url = ''

      if (type === 'ChapterComment') {
        url = 'chapters/' + data.chapter_id + '/book'
      } else if (type === 'SceneComment') {
        url = 'scenes/' + data.scene_id + '/book-chapter'
      } else if (type === 'FeedbackChapter') {
        url = 'chapters/' + data.parent_id + '/book'
      } else if (type === 'FeedbackScene') {
        url = 'scenes/' + data.parent_id + '/book-chapter'
      } else if (type === 'FeedbackBook') {
        scope.CHANGE_COMPONENT(
          {
            tabKey: 'book-details-' + data.book.uuid,
            tabComponent: 'books-i-read-book-details',
            tabData: { book: data.book },
            tabTitle: scope.$t('VIEW') + ' - ' + data.book.title,
            newTab: true
          })
        return
      }

      scope.getData(url).then(res => {
        if (type === 'ChapterComment' || type === 'FeedbackChapter') {
          let chapter = res.data
          let book = chapter.book

          scope.CHANGE_COMPONENT(
            {
              tabKey: 'chapter-details-' + chapter.uuid,
              tabComponent: 'books-i-read-chapter-details',
              tabData: { book: book, chapter: chapter },
              tabTitle: scope.$t('VIEW') + ' - ' + chapter.title,
              newTab: true
            })
        } else if (type === 'SceneComment' || type === 'FeedbackScene') {
          let scene = res.data
          let book = scene.book
          let chapter = scene.chapter

          scope.CHANGE_COMPONENT(
            {
              tabKey: 'scene-details-' + scene.uuid,
              tabComponent: 'books-i-read-scene-details',
              tabData: { book: book, chapter: chapter, scene: scene },
              tabTitle: scope.$t('VIEW') + ' - ' + scene.title,
              newTab: true
            })
        }
      })

      row.is_seen = 1
      scope.getData('notifications/read/' + row.uuid).then(res => {
        //
      })
    },
    updateItemsCounts: function () {
      var scope = this
      for (var x in scope.itemsCounts) {
        scope.itemsCounts[x] = 0
      }
      for (var i = 0; i < scope.items.length; i++) {
        var item = scope.items[i]
        scope.itemsCounts[item.type]++
        scope.itemsCounts['All']++
        if (item.type !== 'Message') {
          scope.itemsCounts['Notification']++
        }
      }
    },
    getData: function (url) {
      var scope = this
      // scope.credentials.error = null
      return scope.axios
        .get('http://localhost:3000' + '/' + url)
        .then(response => {
          return response
        })
        .catch(function (error) {
          return error
        })
    },
    fetch: function () {
      var scope = this
      scope.axios
        .get('http://localhost:3000/notifications/' + scope.getAuthor.uuid)
        .then(async function (response) {
          if (response.data) {
            try {
              //

              for (var i = 0; i < response.data.rows.length; i++) {
                try {
                  if (typeof response.data.rows[i].data === 'string') {
                    response.data.rows[i].data = JSON.parse(response.data.rows[i].data)
                  }
                } catch (ex2) {
                  response.data.rows[i].data = {}
                }
                if (!response.data.rows[i].data) {
                  response.data.rows[i].data = {}
                }
                // console.log(JSON.stringify(response.data.rows[i]))
              }

              scope.items = response.data.rows

              Vue.nextTick(function () {
                scope.updateItemsCounts()
              })
            } catch (ex) {
              console.log('Failed to load data')
            } finally {
              //
            }
          }
        })
    },
    displayTime: function (t) {
      var txt = moment(t).fromNow()
      txt = txt.replace('a few seconds ago', 'just now')
      return txt
    }
  },
  mounted: function () {
    var scope = this
    window.AppMessageCenterPopup = scope
    scope.updateItemsCounts()
    scope.fetch()
    if (window.AppMessaging.recountUnread) {
      window.AppMessaging.recountUnread()
    }
  },
  beforeDestroy: function () {
    delete window.AppMessageCenterPopup

    console.log('window.AppMessageCenterPopup destroyed')
  }
}
</script>

<style scoped>

</style>
