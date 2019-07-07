'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkingDaysSchema extends Schema {
  up () {
    this.create('working_days', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('working_days')
  }
}

module.exports = WorkingDaysSchema
