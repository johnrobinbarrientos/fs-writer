'use strict'
const path = require('path')
const electronFs = require('fs')
const express = require('express')
const router = express.Router()
const { app } = require('electron')
const { UserController, BookController, ReaderController, CourseTakenController, WebinarController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/login', async function (req, res) {
  const user = await UserController.authenticate(req.query.username, req.query.password)

  if (user) {
    res
      .status(200)
      .json({
        user: user,
        author: user.author
      })
  } else {
    res
      .status(401)
      .json({
        message: 'Invalid username or password...'
      })
  }
})

router.post('/', async function (req, res) {
  const user = await UserController.save(req.body)

  res
    .status(200)
    .json(user)
})

router.post('/synced', async function (req, res) {
  const user = await UserController.saveSyncedDate(req.body)

  res
    .status(200)
    .json(user)
})

router.post('/connections', async function (req, res) {
  const user = await UserController.saveAuthorDetails(req.body)

  res
    .status(200)
    .json(user)
})

router.get('/:userId/books-i-read', async function (req, res) {
  const books = await ReaderController.getAllBooksIReadByUserId(req.params.userId)
  res
    .status(200)
    .json(books)
})

router.get('/:userId/books', async function (req, res) {
  const books = await BookController.getAllBooksByUserId(req.params.userId)

  const genres = await BookController.getAllBookGenres()

  books.forEach(function (item, index) {
    if (item.book_genre_collection) {
      const genre = []
      item.book_genre_collection.forEach(function (collection, indx) {
        if (genres.find(x => (x.uuid === collection.genre_id)) !== undefined) {
          var selectedGenre = genres.find(x => (x.uuid === collection.genre_id))
          genre.push({
            uuid: selectedGenre.uuid,
            name: selectedGenre.name
          })
        }
      })
      books[index].genre = genre
    }
  })

  res
    .status(200)
    .json(books)
})

router.get('/:userID/courses', async function (req, res) {
  const param = {
    userID: req.params.userID,
    search: ''
  }

  if (req.query.search) {
    param.search = req.query.search
  }

  const courses = await CourseTakenController.getAllByUserId(param)
  courses.forEach(function (course, index) {
    var file = path.join(resourcePath, 'resources', 'images', 'courses', course.package.course.image.replace('/uploads/course-images/', ''))

    courses[index].package.course.picture_src = 'file://' + path.resolve(app.getAppPath(), '../', 'src', 'assets', 'img', 'default-image.jpg')
    if (electronFs.existsSync(file)) {
      courses[index].package.course.picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'courses', course.package.course.image.replace('/uploads/course-images/', ''))
    }

    course.package.course.webinars.forEach(function (webinar, indx) {
      var web_file = path.join(resourcePath, 'resources', 'images', 'webinars', webinar.image.replace('/uploads/webinars/', ''))

      courses[index].package.course.webinars[indx].image_src = 'file://' + path.resolve(app.getAppPath(), '../', 'src', 'assets', 'img', 'default-image.jpg')
      if (electronFs.existsSync(web_file)) {
        courses[index].package.course.webinars[indx].image_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'webinars', webinar.image.replace('/uploads/webinars/', ''))
      }
    })
  })

  res
    .status(200)
    .json(courses)
})

router.get('/:userID/webinars', async function (req, res) {
  const param = {
    userID: req.params.userID,
    search: ''
  }

  if (req.query.search) {
    param.search = req.query.search
  }

  const webinars = await WebinarController.getAllByUserId(param)
  webinars.forEach(function (webinar, indx) {
    var web_file = path.join(resourcePath, 'resources', 'images', 'webinars', webinar.image.replace('/uploads/webinars/', ''))

    webinars[indx].image_src = 'file://' + path.resolve(app.getAppPath(), '../', 'src', 'assets', 'img', 'default-image.jpg')
    if (electronFs.existsSync(web_file)) {
      webinars[indx].image_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'webinars', webinar.image.replace('/uploads/webinars/', ''))
    }
  })

  res
    .status(200)
    .json(webinars)
})

module.exports = router
