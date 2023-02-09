'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { RelationController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const relation = await RelationController.save(req.body)

  res
    .status(200)
    .json(relation)
})

router.get('/syncable', async function (req, res) {
  const rows = await RelationController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await RelationController.sync(req.body)

  res
    .status(200)
    .json(row)
})

router.get('/', async function (req, res) {
  const relations = await RelationController.getAll()

  res
    .status(200)
    .json(relations)
})

module.exports = router
