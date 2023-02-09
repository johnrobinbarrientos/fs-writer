const path = require('path')
const fs = require('fs-extra')

const Knex = require('knex')
const { Model } = require('objection')

const connection = require(path.join(__dirname, 'knexfile'))[process.env.NODE_ENV]
const knexConnection = Knex(connection)
global.knexConnection = knexConnection // to be use in starter.js(main.js) for update versions

/*
const { Author } = require(path.join(__dirname, 'models/Author'))
const { AuthorName } = require(path.join(__dirname, 'models/AuthorName'))
const { User } = require(path.join(__dirname, 'models/User'))
const { BookGenre } = require(path.join(__dirname, 'models/BookGenre'))
const { Relation } = require(path.join(__dirname, 'models/Relation'))
const { Book } = require(path.join(__dirname, 'models/Book'))
const { Chapter } = require(path.join(__dirname, 'models/Chapter'))
const { Feedback } = require(path.join(__dirname, 'models/Feedback'))
const { FeedbackResponse } = require(path.join(__dirname, 'models/FeedbackResponse'))
const { Note } = require(path.join(__dirname, 'models/Note'))
const { Scene } = require(path.join(__dirname, 'models/Scene'))
const { Character } = require(path.join(__dirname, 'models/Character'))
const { Item } = require(path.join(__dirname, 'models/Item'))
const { Location } = require(path.join(__dirname, 'models/Location'))
const { Reader } = require(path.join(__dirname, 'models/Reader'))
const { BookGenreCollection } = require(path.join(__dirname, 'models/BookGenreCollection'))
const { ChapterVersion } = require(path.join(__dirname, 'models/ChapterVersion'))
const { SceneVersion } = require(path.join(__dirname, 'models/SceneVersion'))
const { RelationDetail } = require(path.join(__dirname, 'models/RelationDetail'))
const { SceneCharacter } = require(path.join(__dirname, 'models/SceneCharacter'))
const { SceneItem } = require(path.join(__dirname, 'models/SceneItem'))
const { SceneLocation } = require(path.join(__dirname, 'models/SceneLocation'))
const { AuthorPersonalProgress } = require(path.join(__dirname, 'models/AuthorPersonalProgress'))
const { BookChapterHistory } = require(path.join(__dirname, 'models/BookChapterHistory'))
const { BookSceneHistory } = require(path.join(__dirname, 'models/BookSceneHistory'))
const { SoftDeleteQueryBuilder } = require(path.join(__dirname, 'models/SoftDeleteQueryBuilder'))
const { CoursesTaken } = require(path.join(__dirname, 'models/CoursesTaken'))
const { Course } = require(path.join(__dirname, 'models/Course'))
const { Package } = require(path.join(__dirname, 'models/Package'))
const { PackageCourse } = require(path.join(__dirname, 'models/PackageCourse'))
const { Lesson } = require(path.join(__dirname, 'models/Lesson'))
const { LessonDocument } = require(path.join(__dirname, 'models/LessonDocument'))
const { Notification } = require(path.join(__dirname, 'models/Notification'))
const { Assignment } = require(path.join(__dirname, 'models/Assignment'))
const { AssignmentManuscript } = require(path.join(__dirname, 'models/AssignmentManuscript'))
*/
Model.knex(knexConnection)

/*
module.exports = {
  Author,
  AuthorName,
  User,
  BookGenre,
  Relation,
  Book,
  Item,
  Location,
  Reader,
  BookGenreCollection,
  Chapter,
  ChapterVersion,
  Feedback,
  FeedbackResponse,
  Note,
  Scene,
  Character,
  SceneVersion,
  RelationDetail,
  SceneCharacter,
  SceneItem,
  SceneLocation,
  AuthorPersonalProgress,
  BookChapterHistory,
  BookSceneHistory,
  SoftDeleteQueryBuilder,
  CoursesTaken,
  Course,
  Package,
  PackageCourse,
  Lesson,
  LessonDocument,
  Notification,
  Assignment,
  AssignmentManuscript
}
*/

// load models dynamically
var models = {}
var modelFiles = fs.readdirSync(path.join(__dirname, '/models'), {})
for (var i = 0; i < modelFiles.length; i++) {
  if (!/\.js$/.test(modelFiles[i])) {
    continue
  }
  var modelName = modelFiles[i].replace('.js', '')
  var modelFile = require.resolve('./models/' + modelName)
  // console.log('modelFile ', modelFile)
  models[modelName] = require(modelFile)[modelName]
}

module.exports = models

// console.log(module.exports)
