'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { ChapterController, ItemController, CharacterController, LocationController, SceneController, BookController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:bookId/chapters', async function (req, res) {
  const param = {
    bookId: req.params.bookId,
    search: ''
  }

  if (req.query.search) {
    param.search = req.query.search
  }

  const chapters = await ChapterController.getAllByBookId(param)

  res
    .status(200)
    .json(chapters)
})

router.get('/:bookId/items', async function (req, res) {
  const param = {
    bookId: req.params.bookId,
    search: ''
  }

  if (req.query.search) {
    param.search = req.query.search
  }

  const items = await ItemController.getAllByBookId(param)

  items.forEach(function (item, index) {
    items[index].picture_src = ''
    if (item.pictures) {
      items[index].picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'items', item.pictures)
    }
  })

  res
    .status(200)
    .json(items)
})

router.get('/:bookId/characters', async function (req, res) {
  const param = {
    bookId: req.params.bookId,
    search: ''
  }

  if (req.query.search) {
    param.search = req.query.search
  }

  const characters = await CharacterController.getAllByBookId(param)

  characters.forEach(function (item, index) {
    characters[index].picture_src = ''
    if (item.picture) {
      characters[index].picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'characters', item.picture)
    }
  })

  res
    .status(200)
    .json(characters)
})

router.get('/:bookId/locations', async function (req, res) {
  const param = {
    bookId: req.params.bookId,
    search: ''
  }

  if (req.query.search) {
    param.search = req.query.search
  }

  const locations = await LocationController.getAllByBookId(param)

  locations.forEach(function (item, index) {
    locations[index].picture_src = ''
    if (item.pictures) {
      locations[index].picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'locations', item.pictures)
    }
  })

  res
    .status(200)
    .json(locations)
})

router.get('/:bookId/scenes/other', async function (req, res) {
  const param = {
    bookId: req.params.bookId,
    search: ''
  }

  if (req.query.search) {
    param.search = req.query.search
  }

  const scenes = await SceneController.getOtherScene(param)

  res
    .status(200)
    .json(scenes)
})

router.get('/genres', async function (req, res) {
  const genres = await BookController.getAllBookGenres()

  res
    .status(200)
    .json(genres)
})

router.post('/', async function (req, res) {
  const book = await BookController.save(req.body)

  res
    .status(200)
    .json(book)
})

router.get('/syncable', async function (req, res) {
  const rows = await BookController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const book = await BookController.sync(req.body)

  res
    .status(200)
    .json(book)
})

router.get('/:bookId', async function (req, res) {
  const book = await BookController.getBookById(req.params.bookId)

  res
    .status(200)
    .json(book)
})

router.delete('/:bookId', async function (req, res) {
  const book = await BookController.delete(req.params.bookId)

  res
    .status(200)
    .json(book)
})

module.exports = router
