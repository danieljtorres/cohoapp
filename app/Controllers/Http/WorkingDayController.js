'use strict'

const WorkingDay = use('App/Models/WorkingDay')
const WorkingRecord = use('App/Models/WorkingRecord')
const moment = require('moment')

class WorkingDayController {
  async save({ request, response }) {
    let day = request.all()

    console.log(day)

    try {
      day.start = moment(day.start).unix()
      day.end = moment(day.end).unix()

      console.log(day)

      day = await WorkingDay.create(day)

      response.json({
        data: day
      })
    } catch(error) {
      console.log(error)
      response.status(error.status).json({
        error: error.message
      })
    }
  }
}

module.exports = WorkingDayController
