<template>
  <div v-if="selected_comments_id" class="commentbase-comments" style="">
    <div class="commentbase-comments-header" style="text-align: right; clear: both;">
      <button v-on:click.prevent="close($event)" type="button" aria-label="Close" class="close" style=""><span aria-hidden="true">×</span></button>
    </div>
    <div class="commentbase-comments-body" style="">
      <div v-for="(c, k) in comments[selected_comments_id]" v-bind:key="k" v-bind:style="{'border': editingComment==k?'1px solid orange':'1px solid #f1f1f1'}" class="commentbase-comment" style="border: 0; border: 1px solid #f1f1f1; padding: 15px; margin-bottom: 0;">
        <div style="line-height: 0.8; position: relative;">
          <div v-if="c.user_id==author.uuid" class="c-pop-menu-btn" style="position: absolute; top: 0; right: 5px; border: 0 solid #c0c0c0;" v-on:click.prevent="showCommentActions=showCommentActions==k?null:k">
              <div style="text-align: right; padding: 0; font-weight: bold; cursor: pointer;">
                  <i class="fa fa-ellipsis-h"></i>
                  <div class="c-pop-menu" v-show="showCommentActions==k" style="">
                      <div v-on:click="editComment(k, $event)" class="c-pop-menu-item" style="">Edit</div>
                      <div v-on:click="deleteComment(k, $event)" class="c-pop-menu-item" style="">Delete</div>
                  </div>
              </div>
          </div>
          <span style="font-size: 11px; font-weight: bold;"> {{ c.user_name }}</span>
          <br/>
          <span style="font-size: 11px;"> {{ displayTime(c.created_at) }}</span>
        </div>
        <div style="margin-top: 8px; color: #c0c0c0;">
          {{ c.message }}
        </div>
      </div>
    </div>
    <div class="commentbase-comments-form" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px;">
      <textarea v-model="comment_message_new" class="commentbase-comment-new" style="width: 100%; border: 1px solid #ced4da; border-radius: 0.25rem;"></textarea>
      <div style="text-align: right;">
        <button v-on:click="pushComment($event)" class="es-button-white">Submit</button>
        <button v-on:click="cancelCommentEdit($event)" v-if="editingComment" class="es-button-white">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'

export default {
  name: 'CommentBasePanel',
  props: ['params', 'dom'],
  data: function () {
    var scope = this
    var data = {
      selected_comments_id: null,
      comments: {},
      comment_message_new: '',
      author: {},
      showCommentActions: null,
      editingComment: null,
      window: window,
      lastComment: null
    }
    if (scope.params && scope.params.tinymce) {
      data.window = scope.params.tinymce.getWin()
    }
    return data
  },
  computed: {
    selected_comments: function () {
      return this.comments[this.selected_comments_id]
    }
  },
  watch: {
    selected_comments_id: function () {
      var scope = this
      this.comment_message_new = ''
      this.editingComment = null
      this.showCommentActions = null
      setTimeout(function () {
        scope.focusMessage()
      }, 10)
    }
  },
  methods: {
    setCommentId: function (v) {
      this.selected_comments_id = v
    },
    close: function (e) {
      this.checkSelectedComments(true)
      this.selected_comments_id = null
    },
    displayTime: function (t) {
      var txt = moment(t).fromNow()
      // console.log(t)
      txt = txt.replace('a few seconds ago', 'just now')
      return txt
    },
    focusMessage: function () {
      var scope = this
      var elm = scope.window.document.querySelector('.commentbase-comment-new')
      if (elm) {
        elm.focus()
      }
    },
    checkSelectedComments: function (removeIfEmpty) {
      var scope = this
      var highlightedItems = scope.window.document.querySelectorAll('[data-comments-id]')
      highlightedItems.forEach(function (item) {
        var id = item.dataset.commentsId
        var selectedComments = scope.comments[id]
        var c = 0
        // eslint-disable-next-line no-unused-vars
        for (var x in selectedComments) {
          c++
        }
        if (c > 0) {
          item.style.color = '#fff'
          item.style.background = 'orange'
        } else {
          // if (removeIfEmpty === true) {
          item.style.color = 'inherit'
          item.style.background = 'transparent'
          // } else {
          //    item.style.color = '#000'
          //    item.style.background = 'yellow'
          // }
        }
      })
    },
    cancelCommentEdit: function () {
      this.editingComment = null
      this.comment_message_new = ''
    },
    editComment: function (k, e) {
      e.preventDefault()
      this.editingComment = k
      this.comment_message_new = this.selected_comments[k].message
      Vue.nextTick(this.focusMessage)
    },
    deleteComment: function (k, e) {
      e.preventDefault()
      var scope = this
      delete this.comments[this.selected_comments_id][k]
      this.editingComment = null
      this.comment_message_new = ''
      this.checkSelectedComments()
      scope.params.onAddComment()
    },
    setAuthor: function (author) {
      this.author = author
    },
    setCommentsJSON: function (commentsJson) {
      var c = JSON.parse(commentsJson || '{}')
      this.comments = c
    },
    getCommentsJSON: function () {
      return JSON.stringify(this.comments)
    },
    getLastComment: function () {
      return this.lastComment
    },
    pushComment: function (e) {
      e.preventDefault()
      var scope = this

      var message = scope.comment_message_new

      //
      if (message === '') {
        return
      }

      // initialize comment array
      if (!scope.comments[scope.selected_comments_id]) {
        scope.comments[scope.selected_comments_id] = {}
      }

      if (scope.editingComment) {
        // update comment
        var c = scope.comments[scope.selected_comments_id][scope.editingComment]
        c.message = message
        c.updated_at = new Date().getTime()
      } else {
        // push comment object
        var k = 'c-' + new Date().getTime() + '-' + (Math.random() + '').replace('0.', '')
        scope.comments[scope.selected_comments_id][k] = {
          user_id: scope.author.uuid,
          user_name: scope.author.alias,
          created_at: new Date().getTime(),
          message: message
        }
        scope.lastComment = scope.comments[scope.selected_comments_id][k]
      }

      //
      this.checkSelectedComments(true)

      //
      scope.comment_message_new = ''
      this.editingComment = null

      if (scope.params.onAddComment) {
        scope.params.onAddComment()
        scope.focusMessage()
      }
    },
    attachCommentor: function (el) {
      var scope = this

      if (el.classList) {
        el.classList.add('commentbase-container')
      }

      //
      var selectionStarted = false
      el.addEventListener('mousedown', function (e) {
        selectionStarted = true
      })

      // add highlight to the selected texts and/or open the comments sidebar
      el.addEventListener('mouseup', function (e) {
        scope.selected_comments_id = null

        // cancel if not selected from within the container
        if (!scope.params.tinymce && !selectionStarted) {
          // console.log('From outside select zone')
          return
        }
        selectionStarted = false

        // cancel if selected outside the container
        if (!scope.params.tinymce && !e.target.closest('.commentbase-container')) {
          // console.log('To outside select zone')
          return
        }

        if (e.target && e.target.matches('.commentbase-comment-highlight')) {
          var selectedComments = scope.comments[e.target.dataset.commentsId]
          var c = 0
          // eslint-disable-next-line no-unused-vars
          for (var x in selectedComments) {
            c++
          }
          if (c > 0) {
            scope.selected_comments_id = e.target.dataset.commentsId
            scope.selected_comments_target = e.target
            scope.checkSelectedComments()
            return
          }
        }

        var sel, range
        var id = ('comments-' + Math.random()).replace('.', '')

        scope.checkSelectedComments(true)

        if (!scope.params.tinymce && scope.window.getSelection) {
          sel = scope.window.getSelection()
          if (sel.getRangeAt && sel.rangeCount) {
            range = scope.window.getSelection().getRangeAt(0)

            if (range.toString().trim() === '') {
              return
            }

            scope.selected_comments_id = id

            var html = '<span class="commentbase-comment-highlight" style="font-weight: inherit; color: #000; background: yellow;" id="' + id + '" data-comments-id="' + id + '">' + range + '</span>'
            range.deleteContents()

            var el = scope.window.document.createElement('div')
            el.innerHTML = html
            var frag = scope.window.document.createDocumentFragment()
            var node
            while ((node = el.firstChild)) {
              frag.appendChild(node)
            }
            range.insertNode(frag)

            scope.selected_comments_target = scope.window.document.querySelector('[data-comments-id="' + id + '"]')[0]
          }
        }
      })
    }
  },
  mounted: function () {
    var scope = this

    //
    if (scope.params && scope.params.onMounted) {
      scope.params.onMounted(this)
    }

    scope.attachCommentor(scope.dom)

    scope.checkSelectedComments(true)
  },
  beforeDestroy: function () {

  }
}
</script>

<style>
.commentbase-comments {position: fixed;z-index: 5000;bottom: 0px;right: 0px;width: 300px;height: calc(100% - 315px);background: rgb(245, 248, 250);border: 1px solid rgb(227, 230, 240);padding: 5px 15px;margin: 0px;border-radius: 3px;box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;}
.commentbase-comments-body {height: calc(100% - 127px);background: rgb(255, 255, 255);overflow-y: auto;width: 100%;border: 1px solid rgb(241, 241, 241);}
.commentbase-comment-highlight {font-weight: inherit; background: orange; color: #fff;}
.commentbase-comment {border: 1px solid rgb(241, 241, 241); padding: 15px; margin-bottom: 0px;}
.c-pop-menu {background: #293742; border: 1px solid #293742; padding: 3px; border-radius: 3px; margin-top: -1px; line-height: 1.2; font-size: 12px;}
.c-pop-menu-item {text-align: center; color: #fff; font-weight: normal; cursor: pointer;}
</style>
