'use strict'

const User = use('App/Models/User')
const WorkingDay = use('App/Models/WorkingDay')
const WorkingActivity = use('App/Models/WorkingActivity')
const Mail = use('Mail')
const Helpers = use('Helpers')
const Excel = require('exceljs');
const moment = require('moment')

class UserController {
  async getAdmins({ response }) {
    try {
      const admins = await User.query().where({ role: 1, del: 0 }).orWhere({ role: 2, del: 0 }).fetch()

      response.json({
        data: admins
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async getEmployees({ response }) {
    try {
      const employees = await User.query().where({ role: 0, del: 0 }).fetch()

      response.json({
        data: employees
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async saveAdmin({ request, response }) {
    try {
      const user = await User.create({ role: 2, ...request.except(['role']) })

      response.json({
        data: user
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async saveEmployee({ request, response }) {
    try {
      const user = await User.create({ ...request.except(['role']) })

      /*await Mail.send('emails.new_employee', { ...request.except(['role']) }, (message) => {
        console.log(user)
        message
          .to(user.email)
          .from('no-responder@grupotriton.idnapps.com')
          .subject(`Mensaje de registro en plataforma ${user.firstname + ' ' + user.lastname}`)
      })*/

      response.json({
        data: user
      })
    } catch (error) {
      console.log(error.message)
      response.status(error.status|| 500).json({
        error: error.message
      })
    }
  }

  async update({ request, response }) {
    const data = request.all()

    if (!data.password) delete data.password

    try {
      const user = await User.find(data.user_id)
      user.merge(request.except(['role', 'user_id']))
      await user.save()
      response.json({
        data: user
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async delete({ request, params, response }) {
    const { user_id } = params

    try {
      const user = await User.find(user_id)
      if (!user.role == 0) {
        user.del = 1
      }
      await user.save()
      response.json({
        data: user
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async getEmployeesReport({ request, response }) {
    const { start_filter, end_filter, user_id } = request.all()
    
    try {
      const workingDays = await WorkingDay.query().where(function () {
        this
          .where('start', '>=', start_filter)
          .where('end', '<=', end_filter)
          .where('user_id', user_id)
      }).with('records', (builder) => {
        builder.with('activity')
      }).with('category').fetch()

      response.json({
        data: workingDays.toJSON()
      })
    } catch (error) {
      console.log(error)
      response.status(error.status).json({
        error: error.message 
      })
    }
  }

  async getEmployeesReportToExcel({ request, response }) {
    const { start_filter, end_filter, user_id } = request.all()
    
    try {
      const user = await User.find(user_id)
      const workingDays = await WorkingDay.query().where(function () {
        this
          .where('start', '>=', start_filter)
          .where('end', '<=', end_filter)
          .where('user_id', user_id)
      }).with('records', (builder) => {
        builder.with('activity')
      }).with('category').fetch()

      const activities = await WorkingActivity.all()

      const fileName = 'start-'+start_filter+'-end-'+end_filter+'-'+moment().unix()+'.xlsx'

      const wb = new Excel.Workbook();
      const sheet = wb.addWorksheet('Reporte');

      for (let index = 1; index < 9; index++) {
        let column = sheet.getColumn(index)
        column.width = 19
        column.font = { name: 'Arial', size: 10 }
      }

      sheet.addRow([
        user.firstname + ' ' + user.lastname,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ])

      sheet.addRow([])

      sheet.addRow([
        'Fecha',
        'Categoria',
        'Actividad',
        'Dia',
        'Noche',
        'Total',
        'Totsl OF',
        'A favor empleado',
        'A favor empresa',
        'Hrs compensables',
        'Otros'
      ])

      const workingDaysArr = workingDays.toJSON()
      const activitiesArr = activities.toJSON()

      const roundTo = this.roundTo
      const getHours = this.getHours

      let row = 3

      for (const day of workingDaysArr) {
        for (const activity of activitiesArr) {
          sheet.addRow([
            moment.unix(day.start).format('MM/DD/YYYY'),
            day.category.name,
            activity.name,
            roundTo(getHours(activity.id, day.records, 'day')) || '',
            roundTo(getHours(activity.id, day.records, 'night')) || '',
            roundTo(getHours(activity.id, day.records)),
            activity.id == 1 ? roundTo(getHours(null, day.records, 'of')) : '',
            activity.id == 1 ? roundTo(getHours(null, day.records, 'employee')) : '',
            activity.id == 5 ? roundTo(getHours(null, day.records, 'company')) : '',
            day.retributed_hours,
            day.others,
          ])
        }
        let init = row = row + 1
        let end = row = row + 4

        sheet.mergeCells('A'+init+':A'+end)
        sheet.mergeCells('B'+init+':B'+end)

        sheet.mergeCells('G'+init+':G'+(init+1))
        sheet.getCell('G'+init).alignment = { vertical: 'top' }
        sheet.mergeCells('H'+init+':H'+(init+1))
        sheet.getCell('H'+init).alignment = { vertical: 'top' }

        sheet.mergeCells('J'+init+':J'+end)
        sheet.getCell('J'+init).alignment = { vertical: 'top' }
        sheet.mergeCells('K'+init+':K'+end)
      }

      sheet.addRow([
        'TOTAL',
        '',
        '',
        roundTo(this.getTotals('day', workingDaysArr), 2),
        roundTo(this.getTotals('night', workingDaysArr), 2),
        roundTo(this.getTotals(null, workingDaysArr), 2),
        roundTo(this.getTotals('of', workingDaysArr), 2),
        roundTo(this.getTotals('employee', workingDaysArr), 2),
        roundTo(this.getTotals('company', workingDaysArr), 2),
        roundTo(this.getTotals('retributed', workingDaysArr), 2),
        ''
      ])

      response.implicitEnd = false

      response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      response.header("Content-Disposition", "attachment; filename=" + fileName);

      const data = await wb.xlsx.write(response.response)

      await response.send(data)
    } catch (error) {
      console.log(error)
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  getHours(actId = null, records, type = null) {
    let total = 0
    let totalOf = 0
    let totalCom = 0
    
    for (const record of records) {
      const startMoment = moment.unix(record.start)
      const endMoment = moment.unix(record.end)

      if (actId && record.activity_id && actId == record.activity_id && type == record.schedule) {
        total += endMoment.diff(startMoment, 'hours', true)

      } else if (actId && !type && actId == record.activity_id) {
        total += endMoment.diff(startMoment, 'hours', true)

      } else if (!actId && type && type == 'of') {
        if (record.activity_id == 1 || record.activity_id == 2) {
          total += endMoment.diff(startMoment, 'hours', true)
        }

      } else if (!actId && type && type == 'day' && type == record.schedule) {
          total += endMoment.diff(startMoment, 'hours', true)

      }  else if (!actId && type && type == 'night' && type == record.schedule) {
          total += endMoment.diff(startMoment, 'hours', true)

      } else if (!actId && !type) {
          total += endMoment.diff(startMoment, 'hours', true)

      } else if (!actId && type && type == 'employee') {
        if (record.activity_id == 1 || record.activity_id == 2) {
          totalOf += endMoment.diff(startMoment, 'hours', true)
        }

      } else if (!actId && type && type == 'company') {
        if (record.activity_id == 5) {
          totalCom += endMoment.diff(startMoment, 'hours', true)
        }
      }
    }

    if (!actId && type && type == 'employee') {
      total = totalOf - 8
      if (total <= 0) return 0
    }

    if (!actId && type && type == 'company') {
      total = (totalCom > 0) ? totalCom * 0.3 : 0 
    }

    return total
  }

  getTotals(type = null, report) {
    let total = 0
    for (const day of report) {
      if (type == 'retributed') total += day.retributed_hours
      else total += this.getHours(null, day.records, type)
    }
    return total
  }

  roundTo(n, digits) {
    if (digits === undefined) {
        digits = 0;
    }

    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    return Math.round(n) / multiplicator;
  }
}

module.exports = UserController