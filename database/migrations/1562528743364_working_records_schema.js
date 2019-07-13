'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkingRecordsSchema extends Schema {
  up () {
    this.create('working_records', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('working_records')
  }
}

module.exports = WorkingRecordsSchema
