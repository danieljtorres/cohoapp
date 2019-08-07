'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.post('admin/login', 'AuthController.adminLogin')
  Route.post('login', 'AuthController.login')
  Route.post('start-work', 'AuthController.startWork').middleware('auth')
  Route.post('stop-work', 'AuthController.stopWork')

  Route.post('logout', 'AuthController.logout')

  Route.get('categories', 'CategoryController.index')
  Route.post('categories', 'CategoryController.save')
  Route.put('categories', 'CategoryController.update')
  
  Route.get('working-activities', 'WorkingActivityController.index')
  Route.post('working-activities', 'WorkingActivityController.save')
  Route.put('working-activities', 'WorkingActivityController.update')
  Route.post('working-activities/icon', 'WorkingActivityController.icon')

  Route.post('working-record', 'WorkingRecordController.start')
  Route.get('working-record/active', 'WorkingRecordController.active').middleware('auth')
  Route.post('working-record/end', 'WorkingRecordController.end').middleware('auth')
  Route.post('working-record/save', 'WorkingRecordController.save').middleware('auth')
  Route.delete('working-record/delete/:record_id', 'WorkingRecordController.delete').middleware('auth')

  Route.post('working-day/save', 'WorkingDayController.save').middleware('auth')
  Route.put('working-day/:working_day_id', 'WorkingDayController.update').middleware('auth')

  Route.get('users/admins', 'UserController.getAdmins').middleware('auth')
  Route.get('users/employees', 'UserController.getEmployees').middleware('auth')
  Route.post('users/employees', 'UserController.saveEmployee').middleware('auth')
  Route.post('users/admins', 'UserController.saveAdmin').middleware('auth')
  Route.put('users', 'UserController.update').middleware('auth')
  Route.delete('users/:user_id', 'UserController.delete').middleware('auth')

  Route.get('users/employees/report', 'UserController.getEmployeesReport').middleware('auth')
  Route.get('users/employees/report/excel', 'UserController.getEmployeesReportToExcel')//.middleware('auth')
}).prefix("api/v1")

Route.any('*', ({view}) =>  view.render('app'))
