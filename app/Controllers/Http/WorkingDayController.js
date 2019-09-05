'use strict'

const WorkingDay = use('App/Models/WorkingDay')
const WorkingRecord = use('App/Models/WorkingRecord')
const moment = require('moment')

class WorkingDayController {
  async save({ request, response }) {
    let day = request.all()

    try {
      day.start = moment(day.start).unix()
      day.end = moment(day.end).unix()

      day = await WorkingDay.create(day)

      response.json({
        data: day
      })
    } catch(error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async update({ request, response, params }) {
    const { working_day_id } = params
    const { retributed_hours, others } = request.all()

    try {
      const wd = await WorkingDay.find(working_day_id)

      wd.retributed_hours = retributed_hours
      wd.others = others
      
      await wd.save()

      response.json({
        data: wd
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }
}

module.exports = WorkingDayController
