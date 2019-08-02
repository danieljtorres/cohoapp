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
  async icon({ request, response }) {
    const data = request.all()

    const profilePic = request.file('icon', {
      types: ['image']
    })

    try {
      const activity = await WorkingActivity.find(data.activity_id)
  
      const fileName = this.makeid(10) + profilePic.extname;

      await profilePic.move(Helpers.publicPath('images/icons'), {
        name: fileName,
        overwrite: true
      })
    
      if (!profilePic.moved()) {
        response.status(500).json({
          error: profilePic.error()
        })
      }

      activity.icon = fileName
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

  makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
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
