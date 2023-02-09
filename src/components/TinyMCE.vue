<template>
  <input v-model="initValue" type="text" class="tiny-area" v-on:click="emitToParent" />
</template>

<script>
import tinymce from 'tinymce'
const path = window.require('path')
export default {
  name: 'TinyMCE',
  props: ['initValue', 'disabled', 'params'],
  data: function () {
    var scope = this
    console.log('params........', scope.params)
    return {
      initConfig: {
        selector: 'input.tiny-area',
        language: 'custom_lang',
        min_height: 400,
        resize: false,
        hidden_input: false,
        plugins: [
          'autolink lists charmap hr anchor',
          'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime nonbreaking',
          'table contextmenu directionality template paste textcolor print'// remove autoresize
        ],
        external_plugins: {
          'wordcomment': 'file:///' + path.resolve('src/assets/js/tinymce/plugins/wordcomment/plugin.js')
        },
        toolbar: [
          'undo | redo | fontselect | fontsizeselect | copy | cut | paste | bold | italic | underline | strikethrough | forecolor | backcolor | leftChev | rightChev | enDash | numlist | bullist | alignleft | aligncenter | alignright | alignjustify | removeformat | wordcomment | print | fullscreen | searchreplace'
        ],

        browser_spellcheck: true,
        menubar: false,
        branding: false,
        autoresize_on_init: false,
        forced_root_block: false,
        init_instance_callback: function (editor) {
          editor.shortcuts.add('ctrl+l', 'A New Way To leftChev', function () {
            editor.insertContent('&#171;')
          })
          editor.shortcuts.add('ctrl+r', 'A New Way To rightChev', function () {
            editor.insertContent('&#187;')
          })
          editor.shortcuts.add('ctrl+e', 'A New Way To endash', function () {
            editor.insertContent('&#8211;')
          })
          editor.shortcuts.add('ctrl+s', 'A New Way To Strikethrough', 'Strikethrough')
        },

        setup: function (editor) {
          if (scope.params && scope.params.onEditorSetup) {
            scope.params.onEditorSetup(editor)
          }

          editor.on('init', function (e) {
            if (scope.params && scope.params.onEditorInit) {
              scope.params.onEditorInit(editor)
            }
          })

          editor.editorManager.addI18n('custom_lang', {
            'Copy': 'Kopier (ctrl+c)',
            'Cut': 'Klipp ut (ctrl+x)',
            'Paste': 'Lim inn (ctrl+v)',
            'Bold': 'Fet (ctrl+b)',
            'Italic': 'Kursiv (ctrl+i)',
            'Underline': 'Understreking (ctrl+u)',
            'Strikethrough': 'Gjennomstreking (ctrl+s)',
            'Align left': 'Venstrejuster',
            'Align center': 'Midtstill',
            'Align right': 'H\u00f8yrejuster',
            'Justify': 'Blokkjuster',
            'Clear formatting': 'Fjern formateringer',
            'Print': 'Print (ctrl+p)'
          })

          editor.ui.registry.addButton('leftChev', {
            text: '<<',
            tooltip: 'leftChev (ctrl+l)',
            onAction: function (_) {
              editor.insertContent('&#171;')
            }
          })

          editor.ui.registry.addButton('rightChev', {
            text: '>>',
            tooltip: 'rightChev (ctrl+r)',
            onAction: function (_) {
              editor.insertContent('&#187;')
            }
          })

          editor.ui.registry.addButton('enDash', {
            text: '-',
            tooltip: 'en dash (ctrl+e)',
            onAction: function (_) {
              editor.insertContent('&#8211;')
            }
          })

          editor.on('keydown', function (ed) {
            if (ed.keyCode === 9) { // tab pressed
              editor.insertContent('&emsp;') // tab code
              ed.preventDefault()
              ed.stopPropagation()
              return false
            }
          })

          editor.on('change', function (e) {
            window.jQuery('#' + this.id).val(editor.getContent()).click()
          })
        }
      }
    }
  },
  computed: {
    darkmode () {
      return this.$store.getters.darkmode
    }
  },
  watch: {
    darkmode: function () {
      var vm = this
      if (this.darkmode) {
        tinymce.get(vm.$el.id).getBody().style.color = '#fff'
      } else {
        tinymce.get(vm.$el.id).getBody().style.color = '#000'
      }
    }
  },
  methods: {
    initEditor: function () {
      var vm = this

      tinymce.init(vm.initConfig)

      if (vm.$attrs.value) {
        var editor = tinymce.get(vm.$attrs.id)
        editor.setContent(vm.$attrs.value)
      }
    },
    emitToParent (event) {
      this.$emit('getEditorContent', this.$el.value)
    }
  },
  updated: function () {
    // Since we're using Ajax to load data, hence we have to use this hook because when parent's data got loaded, it will fire this hook.
    // Depends on your use case, you might not need this
    var vm = this

    if (vm.initValue) {
      var editor = tinymce.get(vm.$el.id)
      editor.setContent(vm.initValue)
    }
  },
  mounted () {
    var vm = this
    vm.initEditor()
  }
}
</script>

<style scoped>
</style>
