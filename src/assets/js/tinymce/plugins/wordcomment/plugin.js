/* eslint-disable no-undef */
/* eslint-disable camelcase */
tinymce.PluginManager.add('wordcomment', function (editor, url) {
  editor.on('init', function () {
    //
    $wrapper = $(editor.editorContainer)
	/*
    editor.dom.doc.addEventListener('mouseup', function (e) {
      if (e.target && e.target.matches('.commentbase-comment-highlight')) {
        console.log('e= ', e)
        console.log('editor= ', editor)
        parent.commentBaseInstance.setCommentId(e.target.dataset.commentsId)
      }
	})
	*/
  })

  return {
    getMetadata: function () {
      return {
        name: 'Word Comment'
      }
    }
  }
})
