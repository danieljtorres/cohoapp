'use strict'

const WorkingRecord = use('App/Models/WorkingRecord')
const WorkingDay = use('App/Models/WorkingDay')
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
      const mNow = moment()

      const record = await WorkingRecord.query().where({ end: null, working_day_id: working_day_id }).firstOrFail()
      const workDay = await WorkingDay.find(record.working_day_id)

      let end = mNow.unix()

      let nextWorkDay = null

      if (moment.unix(record.start).date() < mNow.date()) {
        end = moment.unix(record.start).endOf('day').unix()

        nextWorkDay = await WorkingDay.create({ user_id: workDay.user_id, category_id: workDay.category_id, start: mNow.startOf('day').unix() })
        nextWorkDay.end = mNow.unix()
        nextWorkDay.save()

        const nextRecord = await WorkingRecord.create({ activity_id: record.activity_id, working_day_id: nextWorkDay.id, start: mNow.startOf('day').unix() })
        nextRecord.end = mNow.unix()
        nextRecord.save()
      }
      
      record.end = end
      record.save()

      const activity = await WorkingActivity.findOrFail(record.activity_id)

      response.json({
        data: activity,
        nextWorkDay: nextWorkDay
      })
    } catch (error) {
      console.log(error)
      response.status(error.status || 500).json({
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
