import { join } from 'path'

const { auth } = require(join(__dirname, 'auth'))
const { tab } = require(join(__dirname, 'tab'))

module.exports = {
  auth: auth,
  tab: tab
}
