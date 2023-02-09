'use strict'
const path = require('path')

const { Book, Feedback, Chapter, Notification, Scene, Reader, User } = require(path.join(__dirname, '..', 'models'))

class FeedbackController {
  static getAllFeedbacksByBookId (bookId) {
    var feedbacks = Feedback.query()
      .where('parent', 'book')
      .where('parent_id', bookId)
      .whereNull('feedbacks.deleted_at')
      .withGraphJoined('[feedback_responses.author]', {maxBatchSize: 1})
      .modifyGraph('[feedback_responses]', builder => {
        builder.whereNull('feedback_responses.deleted_at')
        builder.orderBy('feedback_responses.id', 'asc')
      })
      .withGraphJoined('author', {maxBatchSize: 1})
      .orderBy('id', 'DESC')

    return feedbacks
  }

  static getAllFeedbacksByChapterId (chapterId) {
    var feedbacks = Feedback.query()
      .where('parent', 'chapter')
      .where('parent_id', chapterId)
      .whereNull('feedbacks.deleted_at')
      .withGraphJoined('[feedback_responses.author]', {maxBatchSize: 1})
      .modifyGraph('[feedback_responses]', builder => {
        builder.whereNull('feedback_responses.deleted_at')
        builder.orderBy('feedback_responses.id', 'asc')
      })
      .withGraphJoined('author', {maxBatchSize: 1})
      .orderBy('id', 'asc')

    return feedbacks
  }

  static getAllFeedbacksBySceneId (sceneId) {
    var feedbacks = Feedback.query()
      .where('parent', 'scene')
      .where('parent_id', sceneId)
      .whereNull('feedbacks.deleted_at')
      .withGraphJoined('[feedback_responses.author]', {maxBatchSize: 1})
      .modifyGraph('[feedback_responses]', builder => {
        builder.whereNull('feedback_responses.deleted_at')
        builder.orderBy('feedback_responses.id', 'asc')
      })
      .withGraphJoined('author', {maxBatchSize: 1})
      .orderBy('id', 'asc')

    return feedbacks
  }

  static async save (data) {
    const feedback = await Feedback.query().upsertGraphAndFetch([data]).first()

    var row
    var book

    if (feedback.parent === 'book') {
      row = await Feedback.query()
        .where('feedbacks.uuid', feedback.uuid)
        .withGraphJoined('feedback_responses', {maxBatchSize: 1})
        .withGraphJoined('author', {maxBatchSize: 1})
        .withGraphJoined('book', {maxBatchSize: 1})
        .first()

      book = await Book.query().where('uuid', row.book.uuid).first()
    } else if (feedback.parent === 'chapter') {
      row = await Feedback.query()
        .where('feedbacks.uuid', feedback.uuid)
        .withGraphJoined('feedback_responses', {maxBatchSize: 1})
        .withGraphJoined('author', {maxBatchSize: 1})
        .withGraphJoined('chapter', {maxBatchSize: 1})
        .first()

      book = await Book.query().where('uuid', row.chapter.book_id).first()
      row.book = book
    } else if (feedback.parent === 'scene') {
      row = await Feedback.query()
        .where('feedbacks.uuid', feedback.uuid)
        .withGraphJoined('feedback_responses', {maxBatchSize: 1})
        .withGraphJoined('author', {maxBatchSize: 1})
        .withGraphJoined('scene', {maxBatchSize: 1})
        .first()

      book = await Book.query().where('uuid', row.scene.book_id).first()
      row.book = book
    }

    if (row.author_id !== book.author_id) {
      var parent = data.parent.replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase()
      })

      // append alias
      row['author_alias'] = row.author.alias

      const notification = await Notification.query().upsertGraphAndFetch([{
        type: 'Feedback' + parent,
        name: 'feeback-' + row.uuid,
        data: JSON.stringify(row),
        user_id: book.uuid
      }]).first()

      // console.log(notification)
    }

    return row
  }

  static async delete (feedbackId) {
    const feedback = await Feedback.query().softDeleteById(feedbackId)

    return feedback
  }

  static async updateStatus (row) {
    var data = await Feedback.query()
      .patch({ is_done: !row.is_done })
      .where('uuid', '=', row.uuid)

    return data
  }

  static async markSeen (row) {
    var data = await Feedback.query()
      .patch({ is_seen: !row.is_seen })
      .where('uuid', '=', row.uuid)

    return data
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
      parentIDs.push(books[i].uuid)
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

    // const test = await Feedback.query().whereIn('parent_id', parentIDs)
    // console.log(test)

    const rows = await Feedback.query()
      .whereIn('parent_id', parentIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      author_id: row.author_id,
      parent_id: row.parent_id,
      parent: row.parent,
      message: row.message,
      is_done: row.is_done,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at
    }

    var data = await Feedback.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Feedback.query().insert(columns)

      // update uuid to match web
      data = await Feedback.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  FeedbackController
}
