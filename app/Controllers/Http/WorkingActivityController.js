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

  async save({ request, response }) {
    try {
      const activity = await WorkingActivity.create({ ...request.all() })

      response.json({
        data: activity
      })
    } catch (error) {
      console.log(error)
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async update({ request, response }) {
    const data = request.all()

    if (data.compute < 0 && data.compute > 1) delete data.compute

    try {
      const activity = await WorkingActivity.find(data.activity_id)
      activity.merge(request.except(['activity_id']))
      await activity.save()
      response.json({
        data: activity
      })
    } catch (error) {
      console.log(error)
      response.status(error.status).json({
        error: error.message
      })
    }
  }
}

module.exports = WorkingActivityController
