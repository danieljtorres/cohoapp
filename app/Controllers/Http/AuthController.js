'use strict'

const User = use('App/Models/User')
const WorkingDay = use('App/Models/WorkingDay')
const Hash = use('Hash')

class AuthController {
  async adminLogin({ request, auth, response }) {
    const { username, password } = request.all()
    try {
      const user = await User.query().where({'username': username, role: 1}).firstOrFail()
      if (await Hash.verify(password, user.password)) {
        const token = await auth.withRefreshToken().generate(user, { role: user.role })
        return response.json({
          token: token,
          user: user
        })
      }

      return response.status(401).json({})
    } catch (error) {
      return response.status(error.status).json({
        error: error.message
      })
    }
  }

  async login({ request, auth, response }) {
    const { username, password, category_id } = request.all()
    try {
      const user = await User.query().where({'username': username, role: 0}).first()
      
      if (user) {
        if (await Hash.verify(password, user.password)) {
          const token = await auth.withRefreshToken().generate(user, { role: user.role })

          const workDay = await WorkingDay.create({ user_id: user.id, category_id: category_id })

          return response.json({
            token: token,
            user: user,
            work_day: workDay
          })
        }
      }
    } catch (error) {
      return response.status(error.status).json({
        error: error.message
      })
    }
  }  
}

module.exports = AuthController
