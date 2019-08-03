import authService from "@/_services/auth.service";


export default {
  isAdmin(to, from, next) {
    const tokenData = authService.getDecodedToken()
    if (tokenData.data.role < 1) return next('/')
    next()
  },
  isEmployee(to, from, next) {
    const tokenData = authService.getDecodedToken()
    if (tokenData.data.role > 0) return next('/admin')
    next()
  },
  isWorking(to, from, next) {
    const w = authService.getWork()
    if (w) return next('/work')
    next()
  },
  isNoWorking(to, from, next) {
    const w = authService.getWork()
    if (!w) return next('/')
    next()
  },
  isLoggedIn(to, from, next) {
    const isAuthenticaded = authService.isAuthenticaded()
    const toAdminUrl = to.path.split('/')
    const newTo = toAdminUrl[1] === 'admin' ? '/admin' : '/'
    if (isAuthenticaded) return next(newTo)
    next()
  },
  global: {
    isNotLoggedIn(to, from, next) {
      if (to.name === 'NotFound') return next()
      const publicPages = ['/login', '/admin/login', '/404']
      const authRequired = !publicPages.includes(to.path)
      const isAuthenticaded = authService.isAuthenticaded()
    
      const toAdminUrl = to.path.split('/')
      const newTo = toAdminUrl[1] === 'admin' ? `/admin/login${to.path !== '/admin' && to.path !== '/admin/' ? '?redirectTo=' + to.path : ''}` : `/login${to.path !== '/' ?  '?redirectTo=' + to.path : ''}`
    
      if (authRequired && !isAuthenticaded) return next(newTo)
    
      next();
    }
  }
}