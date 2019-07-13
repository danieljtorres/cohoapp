'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('moment')

class WorkingDay extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async (instance) => {
      instance.start = moment().unix()
    })
  }

  static get table() {
    return 'working_days'
  }
}

module.exports = WorkingDay
