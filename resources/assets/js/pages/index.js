import IndexEmployee from './employee/Index'
import LoginEmployee from './employee/Login'

import IndexAdmin from './admin/Index'
import LoginAdmin from './admin/Login'
import Activities from './admin/Activities'
import WorkingCategories from './admin/WorkingCategories'
import Admins from './admin/Admins'
import Employees from './admin/Employees'
import EmployeeReport from './admin/EmployeeReport'

import NotFound from './NotFound'

export default {
  employee: {
    Index: IndexEmployee,
    Login: LoginEmployee
  },
  
  admin: {
    Index: IndexAdmin,
    Login: LoginAdmin,
    Activities,
    WorkingCategories,
    Admins,
    Employees,
    EmployeeReport
  },
  NotFound
}