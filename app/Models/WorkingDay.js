'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('moment')

class WorkingDay extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async (instance) => {
      console.log(instance.dirty.start)
      if (!instance.start) instance.start = moment().unix()
    })
  }

  static get table() {
    return 'working_days'
  }

  records () {
    return this.hasMany('App/Models/WorkingRecord')
  }

  category () {
    return this.belongsTo('App/Models/Category')
  }
}

module.exports = WorkingDay
