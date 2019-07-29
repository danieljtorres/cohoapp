import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/layouts/Layout'
import LayoutAdmin from '@/layouts/LayoutAdmin'
import pages from '@/pages'
import guards from './guards';

Vue.use(VueRouter)

export const Router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/login',
    component: pages.employee.Login,
    beforeEnter: guards.isLoggedIn
  }, {
    path: '/admin/login',
    component: pages.admin.Login,
    beforeEnter: guards.isLoggedIn
  }, {
    path: '/',
    component: Layout,
    beforeEnter: guards.isEmployee,
    children: [{
      path: '/',
      component: pages.employee.Index
    }]
  }, {
    path: '/admin',
    component: LayoutAdmin,
    beforeEnter: guards.isAdmin,
    children: [{
      path: '/',
      component: pages.admin.Index
    }, {
      path: 'administradores',
      component: pages.admin.Admins
    }, {
      path: 'empleados',
      component: pages.admin.Employees,
    }, {
      path: 'empleados/:id',
      component: pages.admin.EmployeeReport
    }, {
      path: 'categorias-laborales',
      component: pages.admin.WorkingCategories
    }, {
      path: 'actividades',
      component: pages.admin.Activities
    }]
  }, {
    path: '/404',
    component: pages.NotFound
  }, {
    path: '*',
    name: 'NotFound',
    redirect: '/404'
  }]
})

Router.beforeEach(guards.global.isNotLoggedIn)