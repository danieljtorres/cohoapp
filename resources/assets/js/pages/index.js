import IndexEmployee from './employee/Index'
import LoginEmployee from './employee/Login'

import IndexAdmin from './admin/Index'
import LoginAdmin from './admin/Login'

import NotFound from './NotFound'

export default {
  employee: {
    Index: IndexEmployee,
    Login: LoginEmployee
  },
  
  admin: {
    Index: IndexAdmin,
    Login: LoginAdmin
  },
  NotFound
}