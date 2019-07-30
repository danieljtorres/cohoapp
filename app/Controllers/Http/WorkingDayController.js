'use strict'

const WorkingDay = use('App/Models/WorkingDay')
const WorkingRecord = use('App/Models/WorkingRecord')

class WorkingDayController {
  async save({ request, response }) {
    const { dayData, recordsData } = request.all()

    try {
      day = await WorkingDay.create(dayData)

      promises = []

      for (const record of recordsData) {
        promises.push(WorkingRecord.create({ working_day_id: day.id,...record }))
      }
      
      const records = await Promise.all(promises)

      day.records = records

      response.json({
        data: day
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }
}

module.exports = WorkingDayController
