'use strict'

/*
|--------------------------------------------------------------------------
| ActivitySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Activity = use('App/Models/WorkingActivity')

class ActivitySeeder {
  async run () {
    await Activity.createMany([{
      name: 'Conducción',
      icon: 'swheel',
      quest: false
    }, {
      name: 'Producción',
      icon: 'screw',
      quest: true
    }, {
      name: 'Mantenimiento',
      icon: 'tools',
      quest: true
    }])
  }
}

module.exports = ActivitySeeder