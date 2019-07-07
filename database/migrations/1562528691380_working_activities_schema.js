'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkingActivitiesSchema extends Schema {
  up () {
    this.create('working_activities', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('working_activities')
  }
}

module.exports = WorkingActivitiesSchema
