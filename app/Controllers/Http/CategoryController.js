'use strict'

const Category = use('App/Models/Category')

class CategoryController {
  async index({ response }) {
    try {
      const categories = await Category.all() 
      
      response.json({
        data: categories
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async save({ request, response }) {
    try {
      const category = await Category.create({ ...request.all() })

      response.json({
        data: category
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async update({ request, response }) {
    const data = request.all()

    try {
      const category = await User.find(data.category_id)
      category.merge(request.except(['category_id']))
      await category.save()
      response.json({
        data: user
      })
    } catch (error) {
      response.status(error.status).json({
        error: error.message
      })
    }
  }
}

module.exports = CategoryController
