import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {AllProducts} from '../client/components/AllProducts'
import {AddCategory} from '../client/components/AddCategory'
import store from '../client/store'
import {Product, Category} from '../server/db/models'
const app = require('../server')
const agent = require('supertest')(app)
import AllProductsList from '../client/components/AllProductsList'

const adapter = new Adapter()
enzyme.configure({adapter})
describe('All products', () => {
  let storedProducts
  let storedCategories

  const products = [
    {
      name: 'Air Jordans',
      description: "From what I've heard, a really expensive shoe",
      price: 1500,
      imageUrl: 'defaultShoe.png'
    },
    {
      name: 'Christian Louboutin',
      description: 'Also a very expensive shoe',
      price: 800,
      imageUrl: 'defaultShoe.png'
    },
    {
      name: 'Nike',
      description: 'A more moderate shoe',
      price: 70,
      imageUrl: 'defaultShoe.png'
    }
  ]

  const users = [
    {
      email: 'cody@email.com',
      isAdmin: true
    },
    {
      email: 'murphy@email.com',
      isAdmin: false
    }
  ]

  const categories = [{name: 'womens'}, {name: 'mens'}, {name: 'dress'}]

  beforeEach(async () => {
    const createdProducts = await Product.bulkCreate(products)
    const createdCategories = await Category.bulkCreate(categories)
    storedProducts = createdProducts.map(product => product.dataValues)
    storedCategories = createdCategories.map(
      category => category.dataValues.name
    )
  })

  describe('All products routes', () => {
    describe('POST `/api/products`', () => {
      it('adds a new Product by its id', async () => {
        const response = await agent
          .post('/api/products')
          .send({
            name: 'Prada',
            description: 'another pair or heels',
            price: 500,
            photoUrl: 'defaultShoe.png'
          })
          .expect(200)
        expect(response.body.name).to.equal('Prada')
      })
      describe('GET `/api/products`', () => {
        it('serves up all products', async () => {
          const response = await agent.get('/api/products').expect(200)
          expect(response.body).to.have.length(7)
          expect(response.body[0].name).to.equal(storedProducts[0].name)
        })
      })

      describe('DELETE `/api/products/:id', () => {
        it('deletes a product by its id', async () => {
          await agent.delete('/api/products/16').expect(200)
          const response = await agent.get('/api/products/16')
          expect(response.body).to.equal(null)
        })
      })

      describe('GET /api/categories', () => {
        it('serves up all categories', async () => {
          const response = await agent.get('/api/categories').expect(200)
          expect(response.body[0].name).to.equal(storedCategories[0])
        })
      })
    })
  })

  describe('Front-end', () => {
    describe('<AllProductsList /> component', () => {
      it('renders an unordered list', () => {
        const wrapper = shallow(
          <AllProductsList
            products={products}
            handleDelete={products}
            user={users[0]}
          />
        )
        expect(wrapper.find('ul')).to.have.length(1)
      })

      it('renders list items for the products passed in as props', () => {
        const wrapper = shallow(
          <AllProductsList
            products={products}
            handleDelete={storedCategories}
            user={users[0]}
          />
        )
        const listItems = wrapper.find('li')
        expect(listItems).to.have.length(3)
        expect(listItems.at(2).text()).to.contain('A more moderate shoe')
      })

      it('displays an add product button for admin users', () => {
        const wrapper = shallow(
          <AllProducts
            products={products}
            categories={storedCategories}
            user={users[0]}
          />
        )
        const buttons = wrapper.find('button')
        expect(buttons).to.have.length(1)
      })

      it('does not display an add product button for non-admin users', () => {
        const wrapper = shallow(
          <AllProductsList
            products={products}
            handleDelete={storedCategories}
            user={users[1]}
          />
        )
        const buttons = wrapper.find('button')
        expect(buttons).to.have.length(0)
      })

      it('displays delete product buttons for admin users', () => {
        const wrapper = shallow(
          <AllProductsList
            products={products}
            handleDelete={storedCategories}
            user={users[0]}
          />
        )
        const buttons = wrapper.find('button')
        expect(buttons.at(2).text()).to.contain('Delete')
        expect(buttons).to.have.length(3)
      })

      it('does not display delete product buttons for non-admin users', () => {
        const wrapper = shallow(
          <AllProductsList
            products={products}
            handleDelete={storedCategories}
            user={users[1]}
          />
        )
        const buttons = wrapper.find('button')
        expect(buttons).to.have.length(0)
      })
    })

    it('allows for searching for particular items', () => {
      const wrapper = shallow(
        <AllProductsList
          products={products}
          handleDelete={storedCategories}
          user={users[1]}
        />
      )
    })
  })

  describe('Product routes', () => {
    let storedProducts
    let storedCategories

    const products = [
      {
        name: 'Air Jordans',
        description: "From what I've heard, a really expensive shoe",
        price: 1500,
        imageUrl: 'defaultShoe.png'
      },
      {
        name: 'Christian Louboutin',
        description: 'Also a very expensive shoe',
        price: 800,
        imageUrl: 'defaultShoe.png'
      },
      {
        name: 'Nike',
        description: 'A more moderate shoe',
        price: 70,
        imageUrl: 'defaultShoe.png'
      }
    ]

    const users = [
      {
        email: 'cody@email.com',
        isAdmin: true
      },
      {
        email: 'murphy@email.com',
        isAdmin: false
      }
    ]

    const categories = [{name: 'womens'}, {name: 'mens'}, {name: 'dress'}]

    beforeEach(async () => {
      const createdProducts = await Product.bulkCreate(products)
      const createdCategories = await Category.bulkCreate(categories)
      storedProducts = createdProducts.map(product => product.dataValues)
      storedCategories = createdCategories.map(
        category => category.dataValues.name
      )
    })

    describe('All products routes', () => {
      describe('GET `/api/products`', () => {
        it('serves up all products', async () => {
          const response = await agent.get('/api/products').expect(200)
          expect(response.body).to.have.length(3)
          expect(response.body[0].name).to.equal(storedProducts[0].name)
        })
      })

      describe('POST `/api/products`', () => {
        it('adds a new product by its id', async () => {
          const response = await agent
            .post('/api/products')
            .send({
              name: 'Prada',
              description: 'another pair or heels',
              price: 500,
              photoUrl: 'defaultShoe.png'
            })
            .expect(200)
          expect(response.body.name).to.equal('Prada')
        })
      })
    })

    describe('DELETE `/api/products/:id', () => {
      it('deletes a product by its id', async () => {
        await agent.delete('/api/products/16').expect(200)
        const response = await agent.get('/api/products/16')
        expect(response.body).to.equal(null)
      })
    })

    describe('GET /api/categories', () => {
      it('serves up all categories', async () => {
        const response = await agent.get('/api/categories').expect(200)
        expect(response.body[0].name).to.equal(storedCategories[0])
      })
    })
  })

  describe('Categories routes', () => {
    let storedProducts
    let storedCategories

    const products = [
      {
        name: 'Air Jordans',
        description: "From what I've heard, a really expensive shoe",
        price: 1500,
        imageUrl: 'defaultShoe.png'
      },
      {
        name: 'Christian Louboutin',
        description: 'Also a very expensive shoe',
        price: 800,
        imageUrl: 'defaultShoe.png'
      },
      {
        name: 'Nike',
        description: 'A more moderate shoe',
        price: 70,
        imageUrl: 'defaultShoe.png'
      }
    ]

    const users = [
      {
        email: 'cody@email.com',
        isAdmin: true
      },
      {
        email: 'murphy@email.com',
        isAdmin: false
      }
    ]

    const categories = [{name: 'womens'}, {name: 'mens'}, {name: 'dress'}]

    beforeEach(async () => {
      const createdProducts = await Product.bulkCreate(products)
      const createdCategories = await Category.bulkCreate(categories)
      storedProducts = createdProducts.map(product => product.dataValues)
      storedCategories = createdCategories.map(
        category => category.dataValues.name
      )
    })

    describe('GET `/api/categories`', () => {
      it('serves up all categories', async () => {
        const response = await agent.get('/api/categories').expect(200)
        expect(response.body).to.have.length(24)
        expect(response.body[0].name).to.equal(storedCategories[0])
      })
    })

    describe('POST `/api/categories`', () => {
      it('adds a new Category by its id', async () => {
        const response = await agent
          .post('/api/categories')
          .send({
            name: 'Basketball Shoes'
          })
          .expect(200)
        expect(response.body.name).to.equal('Basketball Shoes')
      })
    })

    describe('PUT `/api/categories/:id`', () => {
      it('updates a given category', async () => {
        const response = await agent
          .put(`/api/categories/2`)
          .send({
            name: 'Running Shoes'
          })
          .expect(200)
        expect(response.body[1][0].name).to.equal('Running Shoes')
      })
    })
  })
})
