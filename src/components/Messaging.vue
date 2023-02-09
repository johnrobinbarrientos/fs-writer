<template>
  <div class="messaging" v-bind:class="{ show : show }">
    <div class="es-panel-2 shadow">
      <div class="es-panel-head d-flex align-items-center justify-content-between">
        <h5 class="mb-0 font-weight-bold">{{ $t('MESSAGES') }}</h5>
        <button v-on:click.prevent="window.AppMessaging.close()" type="button" class="close" aria-label="Close">
          <!-- <span aria-hidden="true">&times;</span> -->
          <i class="las la-times-circle"></i>
        </button>
      </div>
      <div style="padding: 0 20px;">
      </div>
      <div class="card-body" style="background: #fff; padding: 0; margin: 0; height: calc(100vh - 50vh); position: relative;">
        <div v-if="!selectedGroupId">
          <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding-left: 200px; padding-bottom: 40px; background: #fff;">
            <div style="padding: 15px; border-bottom: 1px solid rgb(227, 230, 240);">
                <h6 style="margin: 0;">{{$t('NEW_MESSAGE')}}</h6>
            </div>
            <div style="padding: 15px;">
                <div class="mb-2" style="color: #c0c0c0; font-size: 13px;">{{ $t('YOU_MAY_SELECT_1_USER_FOR_PRIVATE_MESSAGE_OR_MULTIPLE_USERS_FOR_GROUP_CHAT') }}</div>
                <multiselect v-model="userSelect.selected" id="ajax" label="name" track-by="uuid" :placeholder="$t('SEARCH_A_USER') + '...'" open-direction="bottom" :options="userSelect.rows" :multiple="true" :searchable="true" :loading="userSelect.isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="false" :options-limit="300" :limit="3" :limit-text="userSelectLimitText" :max-height="700" :show-no-results="false" :hide-selected="true" @search-change="userSelectFind">
                  <template slot="tag" slot-scope="{ option, remove }">
                    <span class="custom__tag" style="float: left;cursor:default;background: rgb(73, 109, 125);line-height: 24px;padding: 0 8px;margin: 0;margin-left: 5px;border-radius: 5px;color: #fff;">
                      <span>{{ option.name }}</span>
                      <button @click="remove(option)" type="button" aria-label="Close" class="close" style="margin-left: 5px;color: #fff;font-size: 20px;"><span aria-hidden="true">×</span></button>
                    </span>
                  </template>
                  <template slot="clear" slot-scope="props">
                    <div class="multiselect__clear" v-if="userSelect.selected.length" @mousedown.prevent.stop="userSelectClearAll(props.search)"></div>
                  </template><span slot="noResult">{{$t('NO_USERS_FOUND')}}</span>
                </multiselect>
                <div v-if="userSelect.selected.length > 1" style="margin-top: 15px;">
                  <input v-model="userSelect.groupName" type="text" :placeholder="t('GROUP_NAME')" class="form-control" />
                </div>
                <div v-if="userSelect.selected.length > 0" style="margin-top: 15px;">
                  <button v-on:click="createGroupChat($event)" class="btn es-button-white btn-secondary">{{$t('NEXT')}} <i class="fa fa-arrow-right"></i></button>
                </div>
            </div>
          </div>
        </div>
        <div v-if="selectedGroupId">
          <div v-bind:id="chatContentId" style="position: absolute; right: 0; top: 0; width: calc(100% - 200px); height: calc(100% - 40px); padding: 15px; background: #fff; overflow-y: auto;">
            <div v-for="(gm, i) in messagesHistory" v-bind:key="'gmh-'+selectedGroupId+'-'+i" style="position: relative;">
              <div v-if="gm.author_uuid !== getAuthor.uuid" class="messaging-msg">{{gm.message}}
                <div class="messaging-msg-name">{{gm.author_alias}}, {{displayChatTime(gm.created_at)}}</div>
                <div style="clear: both;"></div>
              </div>
              <div v-if="gm.author_uuid === getAuthor.uuid" class="messaging-msg own">{{gm.message}}
                <div class="messaging-msg-name own">{{gm.author_alias}}, {{displayChatTime(gm.created_at)}}</div>
                <div style="clear: both;"></div>
              </div>
              <div style="clear: both;"></div>
              <div v-bind:style="{float: gm.author_uuid !== getAuthor.uuid?'left':'right'}" style="float: right;font-size: 9px;opacity: 0.4;margin-top: -5px;margin-bottom: 5px;">{{ $t('SEEN_BY')}} {{messageSeenBy(gm, i) }}</div>
              <div style="clear: both;"></div>
            </div>
            <div v-for="(gm, i) in groupMessages" v-bind:key="'gm-'+selectedGroupId+'-'+i" style="position: relative">
              <div v-if="gm.author_uuid !== getAuthor.uuid" class="messaging-msg">{{gm.message}}
                <div class="messaging-msg-name">{{gm.author_alias}}, {{displayChatTime(gm.created_at)}}</div>
                <div style="clear: both;"></div>
              </div>
              <div v-if="gm.author_uuid === getAuthor.uuid" class="messaging-msg own">{{gm.message}}
                <div class="messaging-msg-name own">{{gm.author_alias}}, {{displayChatTime(gm.created_at)}}</div>
                <div style="clear: both;"></div>
              </div>
              <div style="clear: both;"></div>
              <div v-bind:style="{float: gm.author_uuid !== getAuthor.uuid?'left':'right'}" style="float: right;font-size: 9px;opacity: 0.4;margin-top: -9px;margin-bottom: 5px;">{{$t('SEEN_BY')}} {{messageSeenBy(gm, i)}}</div>
              <div style="clear: both;"></div>
            </div>
            <div style="clear: both;"></div>
          </div>
          <div style="position: absolute; bottom: 0; padding-left: 200px; padding-bottom: 10px; width: 100%;">
            <div style="padding: 15px; padding-right: 30px;">
              <textarea v-model="chatMessage" @keydown.enter.exact.prevent @keyup.enter.exact="sendChatMessage()" @keydown.enter.shift.exact="newline()" v-bind:id="textareaId" class="form-control" style="float: left; height: 30px; width: calc(100% - 65px); padding: 0 10px;" placeholder="Type a message..."></textarea>
              <button v-on:click="sendChatMessage()" class="btn es-button-white btn-secondary" style="float: left;margin-left: 5px;width: 60px;">{{$t('SEND')}}</button>
            </div>
          </div>
          <div v-show="!showMembers" style="position: absolute; left: 210px; top: 10px; background: #000; color: #fff; width: 16px; height: 16px; border-radius: 50%; text-align: center; line-height: 16px; font-size: 10px;">
            <i v-on:click.prevent="showMembers=true" class="fa fa-users" title="View Members" style="cursor: pointer;"></i>
          </div>
          <div v-show="showMembers" class="p-10px" style="position: absolute; left: 210px; top: 10px; background: rgb(245, 248, 250); color: #000; width: 200px; min-height: 200px; border: 1px solid rgb(227, 230, 240);">
            <ul style="padding: 0; margin: 0;">
              <li v-for="m in currentGroup.members" v-bind:key="'gc-m-'+m.uuid" style="padding: 0; margin: 0; font-size: 12px; cursor: default;">
                {{m.author_alias}}
              </li>
            </ul>
            <button v-on:click.prevent="showMembers=false" type="button" aria-label="Close" class="close" style="position: absolute; top: 5px; right: 10px;"><span aria-hidden="true">×</span></button>
          </div>
        </div>
        <div style="position: absolute; left: 0; top: 0; height: 100%; width: 200px; background: #f5f8fa; border-right: 1px solid rgb(227, 230, 240);">
          <div class="p-10px">
            <input v-model="groupsFilterTxt" type="text" class="form-control es-input" :placeholder="$t('SEARCH_USER_AND_GROUPS') + '...'" />
          </div>
          <ul class="messaging-group-nav-list">
            <li v-for="(group, i) in sortedGroupChats" v-bind:key="'group-index'+i+'-'+group.uuid">
              <div v-bind:class="{active: selectedGroupId==group.uuid}" v-on:click.prevent="selectedGroupId=group.uuid" class="messaging-group-nav" style="">
                {{(group.uuid.indexOf('pm-')!==0?'[Group] ':'') + group.name}} {{group.unreadCount1}}
                <div v-if="group.unreadCount && group.unreadCount>0" style="position: absolute; top: 8px; right: 10px; background: red; width: 16px; height: 16px; line-height: 16px; text-align: center; color: #fff; border-radius: 50%; font-size: 10px;">{{group.unreadCount}}</div>
              </div>
            </li>
          </ul>
          <div class="p-10px" style="position: absolute; bottom: 0; left: 0; width: 100%; text-align: center;">
            <a class="btn-icon-2" v-on:click.prevent="selectedGroupId=null" href="javascript:void(0);"><i class="fa fa-plus"></i> <span>{{ $t('NEW_MESSAGE') }}</span></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import socketIO from 'socket.io-client'

export default {
  name: 'Messaging',
  props: ['params'],
  data: function () {
    // var scope = this
    var data = {
      show: !false,
      showMembers: false,
      userSelect: {
        groupName: '',
        selected: [],
        rows: [],
        isLoading: false
      },
      groupChats: {},
      selectedGroupId: null,
      window: window,
      socket: null,
      socketConnected: false,
      chatMessage: '',
      chatContentId: ('chat-content-' + Math.random()).replace('.', ''),
      textareaId: ('txt-' + Math.random()).replace('.', ''),
      groupsFilterTxt: ''
    }
    return data
  },
  computed: {
    //
    currentGroup: function () {
      var currentGroup = this.groupChats[this.selectedGroupId]
      return currentGroup
    },
    messagesHistory: function () {
      if (!this.currentGroup) {
        return []
      }
      return this.currentGroup.messagesHistory
    },
    groupMessages: function () {
      if (!this.currentGroup) {
        return []
      }
      return this.currentGroup.messages
    },
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    },
    sortedGroupChats: function () {
      var filtered = []
      for (var x in this.groupChats) {
        var gc = this.groupChats[x]
        if (gc.name.toLowerCase().indexOf(this.groupsFilterTxt.toLowerCase()) > -1) {
          filtered.push(gc)
        }
      }

      filtered.sort(function (a, b) {
        return b.last_activity - a.last_activity
      })

      return filtered
    }
  },
  watch: {
    selectedGroupId: function () {
      this.showMembers = false
      if (!this.selectedGroupId) {
        return
      }
      this.chatScrollBottom()
      if (!this.socketConnected) {
        return
      }
      this.socket.emit('group seen', {chat_group_uuid: this.selectedGroupId})
      if (!this.currentGroup.messagesHistoryLoaded) {
        this.socket.emit('group message history', {chat_group_uuid: this.selectedGroupId})
      }
      if (this.currentGroup.unreadCount > 0) {
        this.currentGroup.unreadCount = 0
      }
      Vue.nextTick(this.recountUnread)
    }
  },
  methods: {
    recountUnread: function () {
      //
      var c = 0
      for (var x in this.groupChats) {
        var gc = this.groupChats[x]
        if (gc.unreadCount) {
          c += gc.unreadCount
        }
      }

      if (window.AppMain && window.AppMain.setItemCount) {
        window.AppMain.setItemCount('Message', c)
      }

      if (window.AppMessageCenterPopup && window.AppMessageCenterPopup.setItemCount) {
        window.AppMessageCenterPopup.setItemCount('Message', c)
      }
    },
    messageSeenBy: function (msg, i) {
      var members = this.currentGroup.members || []
      var seenBy = []
      var messageCreatedAt = moment(msg.created_at).format('x')
      for (var ii = 0; ii < members.length; ii++) {
        var m = members[ii]
        if (messageCreatedAt <= moment(m.last_seen_at)) {
          seenBy.push(m.author_alias)
        }
      }
      if (seenBy.length < 1) {
        return 'nobody'
      }
      return seenBy.join(', ')
    },
    chatScrollBottom: function () {
      var scope = this
      if (!this.selectedGroupId) {
        return
      }
      setTimeout(function () {
        var d = document.getElementById(scope.chatContentId)
        if (d) {
          d.scrollTop = d.scrollHeight
        }
      }, 10)
    },
    sendChatMessage: function () {
      if (!this.socketConnected) {
        return
      }
      if (this.chatMessage === '') {
        return
      }
      this.socket.emit('group message', {chat_group_uuid: this.selectedGroupId, message: this.chatMessage})
      this.chatScrollBottom()
      this.chatMessage = ''
    },
    newline: function () {
      this.chatMessage = this.chatMessage + '\n'
    },
    displayChatTime: function (t) {
      var tm = moment(t)
      var tmNow = moment()
      if (tm.format('MM-DD-YYYY') === tmNow.format('MM-DD-YYYY')) {
        return tm.format('h:mma')
      }
      return tm.format('MM/DD/YYYY h:mma')
    },
    groupChatDisplayName: function (gc) {
      if (gc.uuid.indexOf('pm-') === 0) {
        var data = JSON.parse(gc.data)
        for (var x in data.members_cache) {
          var mc = data.members_cache[x]
          if (mc.author_uuid !== this.getAuthor.uuid) {
            return mc.author_alias
          }
        }
      }
      return gc.name
    },
    createGroupChat: function (e) {
      e.preventDefault()
      if (!this.socketConnected) {
        return
      }
      if (this.userSelect.selected.length < 1) {
        return
      }
      if (this.userSelect.selected.length > 1) {
        if (this.userSelect.groupName === '') {
          return
        }
      } else {
        this.userSelect.groupName = ''
      }
      this.socket.emit('group create', {name: this.userSelect.groupName, members: this.userSelect.selected})
    },
    userSelectLimitText (count) {
      return `and ${count} other users`
    },
    userSelectFind (q) {
      var scope = this
      scope.userSelect.isLoading = true

      var headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + scope.$store.getters.getUserToken
      }

      scope.axios
        .get(window.APP.API.URL + '/search/authors?q=' + escape(q) + '&limit=10',
          {
            'headers': headers
          })
        .then(response => {
          if (response.data && response.data.rows) {
            var rows = []
            for (var i = 0; i < response.data.rows.length; i++) {
              var row = response.data.rows[i]
              rows.push({uuid: row.uuid, name: row.alias})
            }
            scope.userSelect.rows = rows
          }
        }).finally(function () {
          scope.userSelect.isLoading = false
        })
    },
    connect: function () {
      //
      var scope = this

      var port = 3030
      if (window.APP.API.URL === 'http://api.pilotleser.no/se' || window.APP.API.URL === 'https://api.pilotleser.no/se') {
        port = 3031
      }

      var socket = socketIO('https://dev.kunohay.com:' + port)
      socket.on('connect', function () {
        scope.socket = socket
        scope.socketConnected = true
        socket.emit('authenticate', {
          token: scope.$store.getters.getUserToken
        })
      })

      socket.on('authenticate response', function (data) {
        console.log('authenticate response', data)
      })

      socket.on('group seen', function (data) {
        var g = scope.groupChats[data.chat_group_uuid]
        console.log('group seen', data, g)
        if (!g.members) {
          Vue.set(g, 'members', [])
        }
        if (data.members) {
          Vue.set(g, 'members', data.members)
        }
        /*
        for (var i = 0; i < g.members.length; i++) {
          if (g.members[i].author_uuid === data.author_uuid) {
            g.members[i].last_seen_at = data.last_seen_at
          }
        }
        */
        g.members.push()
      })

      socket.on('group message', function (data) {
        console.log('group message: ', data)
        if (data.chat_group_uuid !== scope.selectedGroupId) {
          if (typeof scope.groupChats[data.chat_group_uuid].unreadCount === 'undefined') {
            scope.groupChats[data.chat_group_uuid].unreadCount = 0
          }
          scope.groupChats[data.chat_group_uuid].unreadCount++
        }
        scope.groupChats[data.chat_group_uuid].messages.push(data)
        scope.groupChats[data.chat_group_uuid].last_activity = parseInt(moment(data.last_activity).format('x'))
        if (data.chat_group_uuid === scope.selectedGroupId) {
          scope.chatScrollBottom()
          scope.socket.emit('group seen', {chat_group_uuid: data.chat_group_uuid})
        }
        Vue.nextTick(scope.recountUnread)
      })

      socket.on('group message history', function (data) {
        console.log('group message history ', data)
        if (scope.currentGroup && !scope.currentGroup.messagesHistoryLoaded) {
          scope.currentGroup.messagesHistory = data.messages
          scope.currentGroup.messagesHistoryLoaded = true
        }
        if (data.chat_group_uuid === scope.selectedGroupId) {
          scope.chatScrollBottom()
        }
      })

      socket.on('group chats', function (data) {
        console.log('group chats ', data)
        var list = {}
        for (var i = 0; i < data.length; i++) {
          var g = data[i]
          if (!g.messages) {
            g.messages = []
          }
          if (!g.messagesHistory) {
            g.messagesHistory = []
          }
          if (!g.unreadCount) {
            g.unreadCount = 0
          }
          g.name = scope.groupChatDisplayName(g)
          g.last_activity = parseInt(moment(g.last_activity).format('x'))
          list[g.uuid] = g
        }
        Vue.set(scope, 'groupChats', list)
        Vue.nextTick(scope.recountUnread)
      })

      socket.on('group chats update', function (groups) {
        console.log('group chats update ', groups)
        for (var i = 0; i < groups.length; i++) {
          var g = groups[i]
          if (!g.messages) {
            g.messages = []
          }
          if (!g.messagesHistory) {
            g.messagesHistory = []
          }
          if (!g.unreadCount) {
            g.unreadCount = 0
          }
          g.name = scope.groupChatDisplayName(g)
          g.last_activity = parseInt(moment(g.last_activity).format('x'))
          if (!scope.groupChats[g.uuid]) {
            Vue.set(scope.groupChats, g.uuid, g)
          }
          if (g.select) {
            Vue.set(scope, 'selectedGroupId', g.uuid)
            delete g.select
          }
        }
        Vue.nextTick(scope.recountUnread)
      })

      socket.on('notify', function (notification) {
        //
      })

      socket.on('notification reload', function (notification) {
        //
        window.AppMessageCenterPopup.fetch()
      })

      socket.on('disconnect', function () {
        scope.socketConnected = false
      })
    },
    userSelectClearAll () {
      this.userSelect.rows = []
    },
    //
    open: function (params) {
      this.show = true
      if (!params) {
        this.selectedGroupId = null
      } else {
        this.selectedGroupId = params
      }
    },
    close: function () {
      this.show = false
      this.selectedGroupId = null
    }
  },
  mounted: function () {
    var scope = this
    window.AppMessaging = scope
    this.connect()
  },
  beforeDestroy: function () {
    if (this.socketConnected) {
      this.socket.disconnect()
    }
    delete window.AppMessaging
    console.log('window.AppMessaging destroyed')
  }
}
</script>
