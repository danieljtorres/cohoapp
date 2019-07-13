'use strict'

const Category = use('App/Models/Category')

class CategoryController {
  async index({ response }) {
    try {
      const categories = await Category.all() 
      return response.json({
        data: categories
      })
    } catch (error) {
      return response.status(error.status).json({
        error: error.message
      })
    }
  }
}

module.exports = CategoryController
