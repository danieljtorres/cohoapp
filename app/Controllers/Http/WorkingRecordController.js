'use strict'

const WorkingRecord = use('App/Models/WorkingRecord')
const WorkingActivity = use('App/Models/WorkingActivity')
const moment = require('moment')

class WorkingRecordController {
  async index({ response }) {
    try {
      const workingRecords = await WorkingRecord.all() 

      response.json({
        data: workingRecords
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async active({ request, response }) {
    const { working_day_id } = request.all()

    try {
      const activeRecord = await WorkingRecord.query().where({ end: null, working_day_id: working_day_id }).firstOrFail() 
      const activity = await WorkingActivity.findOrFail(activeRecord.activity_id)

      response.json({
        data: activity
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async start({ request, response }) {
    const { activity_id, working_day_id } = request.all()

    try {
      const isActiveRecord = await WorkingRecord.query().where({ end: null, working_day_id: working_day_id }).first()

      if (isActiveRecord) {
        response.status(400).json({
          error: 'Ya tiene un record sin terminar'
        })
      }

      const activity = await WorkingActivity.findOrFail(activity_id)
      await WorkingRecord.create({ activity_id: activity.id, working_day_id: working_day_id })
      
      response.json({
        data: activity
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async end({ request, response }) {
    const { working_day_id } = request.all()

    try {
      const record = await WorkingRecord.query().where({ end: null, working_day_id: working_day_id }).firstOrFail()
      record.end = moment().unix()
      record.save()

      const activity = await WorkingActivity.findOrFail(record.activity_id)

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

  async save({ request, response }) {
    const record = request.all()

    record.start = moment(record.start).unix()
    record.end = moment(record.end).unix()

    try {
      let recordToSave

      if (record.id) {
        recordToSave = await WorkingRecord.find(record.id)
        delete record.id

        recordToSave.merge(record)
        await recordToSave.save()
      }
      else {
        recordToSave = await WorkingRecord.create(record)
      }

      response.json({
        data: recordToSave
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async update({ request, response }) {
    const { record_id } = request.all()

    try {
      const record = await WorkingRecord.find(record_id)
      await record.merge(request.except(['record_id']))

      await record.save()

      response.json({
        data: record
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async delete({ response, params }) {
    const { record_id } = params

    try {
      const record = await WorkingRecord.find(record_id)
      await record.delete()

      response.json({
        data: record
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }
}

module.exports = WorkingRecordController
