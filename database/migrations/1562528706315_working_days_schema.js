'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkingDaysSchema extends Schema {
  up () {
    this.create('working_days', (table) => {
      table.increments()
      table.bigInteger('start').notNullable()
      table.bigInteger('end')
      table.integer('retributed_hours').default(0)
      table.integer('category_id').unsigned().references('id').inTable('categories')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('working_days')
  }
}

module.exports = WorkingDaysSchema
