'use strict'

const WorkingActivity = use('App/Models/WorkingActivity')

class WorkingActivityController {
  async index({ response }) {
    try {
      const activities = await WorkingActivity.all() 
      
      response.json({
        data: activities
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }
}

module.exports = WorkingActivityController
