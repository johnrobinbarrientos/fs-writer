'use strict'
const path = require('path')

// eslint-disable-next-line no-unused-vars
const { BookChapterHistory } = require(path.join(__dirname, '..', 'models'))

class BookChapterHistoryController {
  static async getAllChapterHistoryByChapterId (chapterId) {
    const chapterHistory = BookChapterHistory.query()
      .where('chapter_id', chapterId)
      .orderBy('created_at', 'DESC')

    return chapterHistory
  }
  static async save (data) {
    const saveBookChapterHistory = await BookChapterHistory.query().upsertGraph([data]).first()

    return saveBookChapterHistory
  }
}

module.exports = {
  BookChapterHistoryController
}
