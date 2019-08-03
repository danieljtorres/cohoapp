'use strict'

const User = use('App/Models/User')
const WorkingDay = use('App/Models/WorkingDay')
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

      await Mail.send('emails.new_employee', { ...request.except(['role']) }, (message) => {
        console.log(user)
        message
          .to(user.email)
          .from('no-responder@grupotriton.idnapps.com')
          .subject(`Mensaje de registro en plataforma ${user.firstname + ' ' + user.lastname}`)
      })

      response.json({
        data: user
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

      const fileName = 'start-'+start_filter+'-end-'+end_filter+'-'+moment().unix()+'.xlsx'

      const wb = new Excel.Workbook();
      const sheet = wb.addWorksheet('Reporte');

      for (let index = 1; index < 9; index++) {
        let column = sheet.getColumn(index)
        column.width = 15
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
        'Hrs compensables',
      ])

      const workingDaysArr = workingDays.toJSON()

      const roundTo = this.roundTo

      for (const day of workingDaysArr) {
        for (const record of day.records) {
          sheet.addRow([
            moment.unix(day.start).format('MM/DD/YYYY'),
            day.category.name,
            record.activity.name,
            record.schedule == 'day' ? roundTo(this.getHours(record.start, record.end), 2) : '',
            record.schedule == 'night' ? roundTo(this.getHours(record.start, record.end), 2) : '',
            roundTo(this.getHours(record.start, record.end, day.category.compute), 2),
            roundTo(this.getHours(record.start, record.end, day.category.id, record.activity.id), 2),
            day.retributed_hours
          ])
        }
      }

      sheet.addRow([
        'TOTAL',
        '',
        '',
        roundTo(this.getTotals(workingDaysArr,'day'), 2),
        roundTo(this.getTotals(workingDaysArr,'night'), 2),
        roundTo(this.getTotals(workingDaysArr), 2),
        roundTo(this.getTotals(workingDaysArr, 'compute'), 2),
        roundTo(this.getTotals(workingDaysArr, 'retributed'), 2)
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

  getHours(start, end, category = null, activity = null) {
    const startMoment = moment.unix(start)
    const endMoment = moment.unix(end)

    let total = endMoment.diff(startMoment, 'hours', true)

    if (category && activity) {
      if (category != 3/*Chofer*/ && activity == 1/*Conduccion*/) total = 0
      if (activity == 5/*Interrupcion*/) total = total * 0.70
    }

    return total
  }

  getTotals(report, type = null) {
    let total = 0
    for (const day of report) {
      if (type == 'retributed') total += day.retributed_hours
      for (const record of day.records) {
        if (type == record.schedule) total += this.getHours(record.start, record.end)
        if (type == 'compute') {
          total += this.getHours(record.start, record.end, day.category.id, record.activity.id)
        }
        if (type == null) total += this.getHours(record.start, record.end)
      }
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