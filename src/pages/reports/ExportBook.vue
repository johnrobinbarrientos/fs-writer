<template>
  <div v-if="page.is_ready == true && book" class="es-page-content" style="height: auto">
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

        <div class="inner">
          <div class="book-title">
            <center><h1>{{ book.title }}</h1></center>
          </div>
        </div>

        <div class="break"></div>

          <div class ="title">© </div>
          <div class ="title"></div>
          <br/>
          <div class ="title">Trykk og innbinding: </div>
          <div class ="title">Sats: </div>
          <div class ="title">Coverdesign: </div>
          <br/>
          <div class ="title">ISBN </div>
          <div class ="title">1. opplag</div>
          <br/>
          <div class ="title">Det er ikke tillatt å kopiere, videreformidle eller mangfoldiggjøresider eller utdrag fra boken uten etter skriftlig avtale med forlaget.</div>
           <div class="break"></div>

          <div v-if="chapters" class="rows-print-as-pages">
            <div v-bind:key="chapter.id" v-for="chapter in chapters">
                <div class="break"></div>
                <div class ="title"><h2>{{chapter.title}}</h2></div>
                <br>
                <br>
                <br>
                <div v-html="removeCommentChapter((chapter.chapter_version[chapter.chapter_version.length-1]) ? chapter.chapter_version[chapter.chapter_version.length-1].content : null)"></div>

              <div v-bind:key="scene.id" v-for="scene in chapter.scene">
                    <div class="break"></div>
                    <div class ="title"><h2>{{scene.title}}</h2></div>
                    <br>
                    <br>
                    <br>
                    <div v-html="removeCommentScene((scene.scene_version[scene.scene_version.length-1]) ? scene.scene_version[scene.scene_version.length-1].content : null)"></div>
              </div>

            </div>
          </div>

  </div>
</template>

<script>
const electron = window.require('electron')
// const log = window.require('electron-log')
const {ipcRenderer} = electron

export default {
  name: 'ExportBook',
  data: function () {
    return {
      book: null,
      chapters: [],
      page: {
        is_ready: false
      },
      chapter_content: '',
      scene_content: ''
    }
  },
  methods: {
    exportBook: function () {
      var scope = this
      scope.injectCSSBeforeExport()
      setTimeout(function () {
        var outerhtml = document.documentElement.outerHTML
        outerhtml = outerhtml.toString().split('<div class="break"></div>').join('<br style="page-break-before: always; clear: both" />')
        // log.info(outerhtml)
        ipcRenderer.send('EXPORT-WORD-BOOK', {html: outerhtml, book: scope.book})
      }, 2000)
    },
    removeCommentChapter: function (content) { // TODO : refactor this to one method if there is no other unique process
      return (content) ? content.replace(/<\/?span class="commentbase-comment-highlight".[^>]*>/g, '') : ''
    },
    removeCommentScene: function (content) {
      return (content) ? content.replace(/<\/?span class="commentbase-comment-highlight".[^>]*>/g, '') : ''
    },
    injectCSSBeforeExport: function () {
      // this will get the external from this window and inject it as internal css before exporting
      let css = []
      let head = document.head || document.getElementsByTagName('head')[0]
      let style = document.createElement('style')
      for (let sheeti = 0; sheeti < document.styleSheets.length; sheeti++) {
        let sheet = document.styleSheets[sheeti]
        let rules = ('cssRules' in sheet) ? sheet.cssRules : sheet.rules
        for (let rulei = 0; rulei < rules.length; rulei++) {
          let rule = rules[rulei]
          if ('cssText' in rule) { css.push(rule.cssText) } else { css.push(rule.selectorText + ' {\n' + rule.style.cssText + '\n}\n') }
        }
      }
      head.appendChild(style)
      style.type = 'text/css'
      if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css.join('\n')
      } else {
        style.appendChild(document.createTextNode(css.join('\n')))
      }
      return css.join('\n')
    }
  },
  mounted () {
    var scope = this
    ipcRenderer.on('EXPORT-DOCX-GET-BOOK', async function (event, data) {
      try {
        scope.book = data
        await scope.$store.dispatch('loadChaptersWithScenesByBook', scope.book.uuid)
      } finally {
        scope.chapters = scope.$store.getters.getChaptersByBook(scope.book.uuid)
        scope.page.is_ready = true
        scope.exportBook()
      }
    })
  }
}

</script>

<style>
.title {text-align:center;}
.inner .book-title { text-align:center; width:100%; font-size:80px;}
.genre {padding:20px 20px;}

.es-export-settings { text-align:left; background:#fff; border-bottom:1px solid #ccc; height:40px; line-height:40px; padding:0px 10px; }
.es-export-settings .btn-option { background:#dfe5ea; margin-right:5px; padding:5px 12px; color:#293742; font-size:12px; cursor:pointer; }
.es-export-settings .btn-option.active { padding-left:8px;  background:#293742; color:#fff; }

.export-button { border-radius:10px; background:#a6d2f5; margin-right:5px; padding:5px 12px; color:#293742; font-size:12px; cursor:pointer;}

/* @media {
  .book-title{
    page-break-after: always !important;
  }
  .book-title:last-child {
    page-break-after: avoid;
  }
} */

</style>
<style type="text/css">
@media print {
  .rows-print-as-pages .es-panel{
    page-break-after: always;
  }
  /* include this style if you want the first row to be on the same page as whatever precedes it */
  .rows-print-as-pages:last-child {
    page-break-after: avoid;
  }
  .rows-print-as-pages:first-child {
    page-break-before: avoid;
  }
}

  .book-title{
    page-break-after: always !important;
    page-break-inside:avoid;
  }
  .book-title {
    page-break-before: always;
    clear: both
  }
</style>
