'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkingActivitiesSchema extends Schema {
  up () {
    this.create('working_activities', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('icon', 80).unique()
      table.integer('quest').default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('working_activities')
  }
}

module.exports = WorkingActivitiesSchema
