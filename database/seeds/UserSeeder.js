'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')

class UserSeeder {
  async run () {
    Factory.model('App/Models/User').create()
    User.create({
      username: 'employee',
      email: 'employee@coho.com',
      firstname: 'employee',
      lastname: '1',
      password: 'secret'
    })
  }
}

module.exports = UserSeeder
