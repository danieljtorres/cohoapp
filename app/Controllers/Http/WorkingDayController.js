'use strict'

class WorkingDayController {
  async save({ request, response }) {
    const { dayData, recordsData } = request.all()

    try {
      day = await WorkingDayController.create(dayData)

      
    } catch (error) {
      
    }
  }
}

module.exports = WorkingDayController
