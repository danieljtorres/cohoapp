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
      const admins = await User.query().where('role', 2).fetch()

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
      const employees = await User.query().where('role', 0).fetch()

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

      console.log(user)
      /*await Mail.send('emails.new_employee', user.toJSON(), (message) => {
        console.log(user)
        message
          .to(user.email)
          .from('danieljtorres94@gmail.com')
          .subject(`Mensaje de registro en plataforma ${user.firstname + ' ' + user.lastname}`)
      })*/

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

      console.log(workingDays)

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

      sheet.columns = [
        { header: 'Id', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'D.O.B.', key: 'DOB' }
      ];

      response.implicitEnd = false

      response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      response.header("Content-Disposition", "attachment; filename=" + fileName);

      wb.xlsx.write(response.response)
      .then(function(data) {
        response.send(data)
      }).catch(err => {
        console.log(err)
      });

    } catch (error) {
      console.log(error)
      response.status(error.status).json({
        error: error.message 
      })
    }
  }

  async delete({ request, response }) {
    const { user_id } = request.all()
    try {
      const user = await User.find(user_id)
    } catch (error) {
      
    }
  }
}

module.exports = UserController