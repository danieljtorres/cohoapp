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
    const { username, password } = request.all()
    try {
      const user = await User.query().where({ 'username': username, role: 0 }).first()
      
      if (user) {
        if (await Hash.verify(password, user.password)) {
          const token = await auth.withRefreshToken().generate(user, { role: user.role })
          
          return response.json({
            token: token,
            user: user
          })
        }
      }

      response.status(401).json({
        error: 'Datos incorrectos'
      })
    } catch (error) {
      response.status(error.status || 500).json({
        error: error.message
      })
    }
  }  

  async startWork({ request, auth, response }) {
    const { category_id } = request.all()
    try {
      const user = await auth.getUser()
      
      if (user) {
        const workDay = await WorkingDay.create({ user_id: user.id, category_id: category_id })
          
        return response.json({
          data: workDay
        })
      }
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }  

  async stopWork({ request, response }) {
    const { working_day_id, comments } = request.all()
    try {

      const mNow = moment()

      const workDay = await WorkingDay.findOrFail(working_day_id)
      const workRecord = await WorkingRecord.query().where({ working_day_id: working_day_id, end: null }).first()
      
      let workDayEnd = mNow.unix()
      let workRecordEnd = mNow.unix()

      if (moment.unix(workDay.start).date() < mNow.date()) {
        workDayEnd = moment.unix(workDay.start).endOf('day').unix()
        workRecordEnd = moment.unix(workDay.start).endOf('day').unix()

        if (workRecord) {
          const nextWorkDay = await WorkingDay.create({ user_id: workDay.user_id, category_id: workDay.category_id, start: mNow.startOf('day').unix() })
          nextWorkDay.end = mNow.unix()
          nextWorkDay.save()

          const nextWorkRecord = await WorkingRecord.create({ activity_id: workRecord.activity_id, working_day_id: nextWorkDay.id, start: mNow.startOf('day').unix() })
          nextWorkRecord.end = mNow.unix()
          nextWorkRecord.save()
        }
      }

      workDay.end = workDayEnd
      if (comments) workDay.comments = comments
      await workDay.save()

      if (workRecord) {
        workRecord.end = workRecordEnd
        await workRecord.save()
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
