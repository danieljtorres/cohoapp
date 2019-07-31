'use strict'

const User = use('App/Models/User')
const WorkingDay = use('App/Models/WorkingDay')

const WorkingRecord = use('App/Models/WorkingRecord')
const Hash = use('Hash')
const moment = require('moment')

class AuthController {
  async adminLogin({ request, auth, response }) {
    const { username, password } = request.all()
    try {
      const user = await User.query().where({ 'username': username, role: 1 }).firstOrFail()
      if (await Hash.verify(password, user.password)) {
        const token = await auth.withRefreshToken().generate(user, { role: user.role })

        response.json({
          token: token,
          user: user
        })
      } else {
        response.status(401).json({})
      }
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async login({ request, auth, response }) {
    const { username, password, category_id } = request.all()
    try {
      const user = await User.query().where({ 'username': username, role: 0 }).first()
      
      if (user) {
        console.log(user)
        if (await Hash.verify(password, user.password)) {
          const workDay = await WorkingDay.create({ user_id: user.id, category_id: category_id })

          const token = await auth.withRefreshToken().generate(user, { role: user.role, working_day: workDay })
          
          response.json({
            token: token,
            user: user,
            work_day: workDay
          })
        }
      }
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }  

  async logout({ request, response }) {
    const { working_day_id } = request.all()
    try {

      const mNow = moment().unix()

      const workDay = await WorkingDay.findOrFail(working_day_id)
      workDay.end = mNow
      await workDay.save()

      const workRecord = await WorkingRecord.query().where({ working_day_id: working_day_id, end: null }).first()
      if (workRecord) {
        workRecord.end = mNow
        await workRecord.save()
        console.log(workRecord)
      }

      response.json(true)
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }  
}

module.exports = AuthController
