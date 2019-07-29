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
}

module.exports = CategoryController
