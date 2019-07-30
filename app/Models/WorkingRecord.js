'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('moment')

class WorkingRecord extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async (instance) => {
      const nowDate = moment()
      if (!instance.dirty.schedule) instance.schedule = (nowDate.hour() >= 6 && nowDate.hour()) <= 22 ? 'day' : 'night'
      if (!instance.dirty.start) instance.start = nowDate.unix()
    })
  }

  static get table() {
    return 'working_records'
  }

  activity () {
    return this.belongsTo('App/Models/WorkingActivity', 'activity_id', 'id')
  }

  workingDay() {
    return this.belongsTo('App/Models/WorkingDay')
  }
}

module.exports = WorkingRecord
