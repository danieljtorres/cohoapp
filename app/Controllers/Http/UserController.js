'use strict'

const User = use('App/Models/User')
const WorkingDay = use('App/Models/WorkingDay')
const Mail = use('Mail')
const Helpers = use('Helpers')
const Excel = require('exceljs');

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

      await Mail.send('emails.new_employee', user.toJSON(), (message) => {
        message
          .to(user.email)
          .from('danieljtorres94@gmail.com')
          .subject(`Mensaje de registro en plataforma ${user.firstname + ' ' + user.lastname}`)
      })

      response.json({
        data: user
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async update({ request, response }) {
    const { user_id } = request.all()
    
    try {
      const user = await User.find(user_id)
      await user.merge(request.except(['role', 'user_id']))

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

  async exportToExcel({ request, response }) {
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

      const wb = new Excel.Workbook();
      const sheet = wb.addWorksheet('Reporte');

      sheet.columns = [
        { header: 'Id', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'D.O.B.', key: 'DOB' }
      ];

      sheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
      sheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});

      wb.xlsx.write(response.response)
      .then(function() {
        response.send(200)
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
