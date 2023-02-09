const path = require('path')
const fs = require('fs-extra')

/*
const { BookGenreController } = require(path.join(__dirname, 'controller/BookGenreController'))
const { RelationController } = require(path.join(__dirname, 'controller/RelationController'))
const { ItemController } = require(path.join(__dirname, 'controller/ItemController'))
const { ChapterController } = require(path.join(__dirname, 'controller/ChapterController'))
const { ChapterVersionController } = require(path.join(__dirname, 'controller/ChapterVersionController'))
const { FeedbackController } = require(path.join(__dirname, 'controller/FeedbackController'))
const { FeedbackResponseController } = require(path.join(__dirname, 'controller/FeedbackResponseController'))
const { NoteController } = require(path.join(__dirname, 'controller/NoteController'))
const { CharacterController } = require(path.join(__dirname, 'controller/CharacterController'))
const { LocationController } = require(path.join(__dirname, 'controller/LocationController'))
const { ReaderController } = require(path.join(__dirname, 'controller/ReaderController'))
const { SceneController } = require(path.join(__dirname, 'controller/SceneController'))
const { SceneVersionController } = require(path.join(__dirname, 'controller/SceneVersionController'))
const { SceneItemController } = require(path.join(__dirname, 'controller/SceneItemController'))
const { SceneLocationController } = require(path.join(__dirname, 'controller/SceneLocationController'))
const { SceneCharacterController } = require(path.join(__dirname, 'controller/SceneCharacterController'))
const { UserController } = require(path.join(__dirname, 'controller/UserController'))
const { BookController } = require(path.join(__dirname, 'controller/BookController'))
const { BookGenreCollectionController } = require(path.join(__dirname, 'controller/BookGenreCollectionController'))
const { RelationDetailController } = require(path.join(__dirname, 'controller/RelationDetailController'))
const { AuthorPersonalProgressController } = require(path.join(__dirname, 'controller/AuthorPersonalProgressController'))
const { BookChapterHistoryController } = require(path.join(__dirname, 'controller/BookChapterHistoryController'))
const { BookSceneHistoryController } = require(path.join(__dirname, 'controller/BookSceneHistoryController'))
const { CourseController } = require(path.join(__dirname, 'controller/CourseController'))
const { CourseTakenController } = require(path.join(__dirname, 'controller/CourseTakenController'))
const { PackageController } = require(path.join(__dirname, 'controller/PackageController'))
const { PackageCourseController } = require(path.join(__dirname, 'controller/PackageCourseController'))
const { LessonController } = require(path.join(__dirname, 'controller/LessonController'))
const { NotificationController } = require(path.join(__dirname, 'controller/NotificationController'))
const { LessonDocumentController } = require(path.join(__dirname, 'controller/LessonDocumentController'))
const { AssignmentController } = require(path.join(__dirname, 'controller/AssignmentController'))
const { AssignmentManuscriptController } = require(path.join(__dirname, 'controller/AssignmentManuscriptController'))

module.exports = {
  UserController,
  BookGenreController,
  RelationController,
  BookController,
  ItemController,
  LocationController,
  ReaderController,
  ChapterController,
  ChapterVersionController,
  FeedbackController,
  FeedbackResponseController,
  NoteController,
  CharacterController,
  SceneController,
  SceneVersionController,
  SceneItemController,
  SceneLocationController,
  SceneCharacterController,
  RelationDetailController,
  BookGenreCollectionController,
  AuthorPersonalProgressController,
  BookChapterHistoryController,
  BookSceneHistoryController,
  CourseController,
  NotificationController,
  CourseTakenController,
  PackageController,
  PackageCourseController,
  LessonController,
  LessonDocumentController,
  AssignmentController,
  AssignmentManuscriptController

}
*/

// load controllers dynamically
var controllers = {}
var controllerFiles = fs.readdirSync(path.join(__dirname, '/controller'), {})
for (var i = 0; i < controllerFiles.length; i++) {
  if (!/\.js$/.test(controllerFiles[i])) {
    continue
  }
  var controllerName = controllerFiles[i].replace('.js', '')
  var controllerFile = require.resolve('./controller/' + controllerName)
  // console.log('controllerFile ', controllerFile)
  controllers[controllerName] = require(controllerFile)[controllerName]
}

module.exports = controllers

// console.log(module.exports)
