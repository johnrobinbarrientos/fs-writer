'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { NoteController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const feedback = await NoteController.save(req.body)

  res
    .status(200)
    .json(feedback)
})

router.delete('/:ID', async function (req, res) {
  const note = await NoteController.delete(req.params.ID)

  res
    .status(200)
    .json(note)
})

router.get('/syncable', async function (req, res) {
  const rows = await NoteController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.get('/:authorID', async function (req, res) {
  const rows = await NoteController.getAllNotesByAuthor(req.params.authorID)

  res
    .status(200)
    .json(rows)
})

router.get('/:authorID/book/:parentID', async function (req, res) {
  const rows = await NoteController.getAllNotesByBookId(req.params.authorID, req.params.parentID)

  res
    .status(200)
    .json(rows)
})

router.get('/:authorID/chapter/:parentID', async function (req, res) {
  const rows = await NoteController.getAllNotesByChapterId(req.params.authorID, req.params.parentID)

  res
    .status(200)
    .json(rows)
})

router.get('/:authorID/scene/:parentID', async function (req, res) {
  const rows = await NoteController.getAllNotesBySceneId(req.params.authorID, req.params.parentID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await NoteController.sync(req.body)

  res
    .status(200)
    .json(row)
})
/*
router.get('/:readerID', async function (req, res) {
  const reader = await ReaderController.getByReader(req.params.readerID)

  res
    .status(200)
    .json(reader)
})
*/
module.exports = router
