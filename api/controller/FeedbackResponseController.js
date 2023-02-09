'use strict'
const path = require('path')

const { Book, Chapter, Feedback, FeedbackResponse, Scene, Reader, User } = require(path.join(__dirname, '..', 'models'))

class FeedbackResponseController {
  static getAllFeedbackByChapterFeedbackId (bookId) {
    var feedbacks = Feedback.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')
      .orderBy('id', 'asc')

    return feedbacks
  }

  static async save (data) {
    const response = await FeedbackResponse.query().upsertGraphAndFetch([data]).first()

    var row = FeedbackResponse.query()
      .where('feedback_responses.uuid', response.uuid)
      .withGraphJoined('author', {maxBatchSize: 1})
      .first()

    return row
  }

  static async delete (feedbackresponseId) {
    const feedbackResponse = await FeedbackResponse.query().softDeleteById(feedbackresponseId)

    return feedbackResponse
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    var parentIDs = []
    var bookUUIDs = []

    // get all "my books" IDs
    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }

    // get all "books i read" IDs
    const booksIRead = await Reader.query()
      .where('author_id', user.author.uuid)

    for (let i = 0; i < booksIRead.length; i++) {
      bookUUIDs.push(booksIRead[i].book_id)
      parentIDs.push(booksIRead[i].book_id)
    }

    // get all "chapters" IDs
    const chapters = await Chapter.query()
      .whereIn('book_id', bookUUIDs)

    var chapterUUIDs = []

    for (let i = 0; i < chapters.length; i++) {
      chapterUUIDs.push(chapters[i].uuid)
      parentIDs.push(chapters[i].uuid)
    }

    // get all "scenes" IDs
    const scenes = await Scene.query()
      .whereIn('book_id', bookUUIDs)

    var sceneUUIDs = []

    for (let i = 0; i < scenes.length; i++) {
      sceneUUIDs.push(scenes[i].uuid)
      parentIDs.push(scenes[i].uuid)
    }

    const feedbacks = await Feedback.query()
      .whereIn('parent_id', parentIDs)

    var feedbackUUIDs = []

    for (let i = 0; i < feedbacks.length; i++) {
      feedbackUUIDs.push(feedbacks[i].uuid)
    }

    const rows = await FeedbackResponse.query()
      .withGraphJoined('author', {maxBatchSize: 1})
      .whereIn('feedback_id', feedbackUUIDs)
      .where('feedback_responses.updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      feedback_id: row.feedback_id,
      author_id: row.author_id,
      message: row.message,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at
    }

    var data = await FeedbackResponse.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await FeedbackResponse.query().insert(columns)

      // update uuid to match web
      data = await FeedbackResponse.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  FeedbackResponseController
}
