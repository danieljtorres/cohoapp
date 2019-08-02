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
      console.log(error)
      response.status(error.status).json({
        error: error.message
      })
    }
  }

  async update({ request, response }) {
    const data = request.all()

    if (data.compute) data.compute = parseFloat(data.compute)
    if (data.compute < 0 && data.compute > 1) delete data.compute

    try {
      const category = await Category.find(data.category_id)
      delete data.category_id
      category.merge(data)
      await category.save()
      response.json({
        data: category
      })
    } catch (error) {
      console.log(error)
      response.status(error.status).json({
        error: error.message
      })
    }
  }
}

module.exports = CategoryController
