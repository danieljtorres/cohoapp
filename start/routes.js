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

  Route.post('logout', 'AuthController.logout')

  Route.get('categories', 'CategoryController.index')
  
  Route.get('working-activities', 'WorkingActivityController.index')

  Route.post('working-record', 'WorkingRecordController.start')
  Route.get('working-record/active', 'WorkingRecordController.active').middleware('auth')
  Route.post('working-record/end', 'WorkingRecordController.end').middleware('auth')

  Route.get('users/admins', 'UserController.getAdmins').middleware('auth')
  Route.get('users/employees', 'UserController.getEmployees').middleware('auth')
  Route.post('users/employees', 'UserController.saveEmployee').middleware('auth')
  Route.put('users', 'UserController.update').middleware('auth')
  Route.delete('users', 'UserController.delete').middleware('auth')

  Route.get('users/employees/report', 'UserController.getEmployeesReport').middleware('auth')
  Route.get('users/employees/report', 'UserController.getEmployeesReport').middleware('auth')
}).prefix("api/v1")

Route.any('*', ({view}) =>  view.render('app'))
