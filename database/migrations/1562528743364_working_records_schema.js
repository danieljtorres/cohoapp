'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkingRecordsSchema extends Schema {
  up () {
    this.create('working_records', (table) => {
      table.increments()
      table.bigInteger('end')
      table.enu('schedule', ['day', 'night']).default('day')
      table.string('answer', 255)
      table.integer('activity_id').unsigned().references('id').inTable('working_activities')
      table.integer('working_day_id').unsigned().references('id').inTable('working_days')
      table.timestamps()
    })
  }
  down () {
    this.drop('working_records')
  }
}

module.exports = WorkingRecordsSchema
