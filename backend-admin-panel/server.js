import express from 'express'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'

import fs from 'fs'

const FILEPATH = '../goods.json'

const app = express()

app.set('view engine', 'ejs')

function readFile(filePath) {
  const data = fs.readFileSync(filePath).toString()

  let jsonData
  try {
    jsonData = JSON.parse(data)
  } catch (err) {
    console.error(err)
    return
  }

  return jsonData
}

function writeFile(filePath, jsonData) {
  fs.writeFileSync(filePath, JSON.stringify(jsonData))
}

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['openapi.yaml'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json())
app.use(cors())

app.get('/goods', (req, res) => {
  res.status(200).json(readFile(FILEPATH))
})

app.post('/goods', (req, res) => {
  const newGood = req.body

  const goods = readFile(FILEPATH)
  if (goods.length === 0) {
    goods.push({ ...newGood, id: 1 })
  } else {
    goods.push({ ...newGood, id: goods.at(-1).id + 1 })
  }

  writeFile(FILEPATH, goods)
  res.status(201).send();
})

app.get('/goods/:id', (req, res) => {
  const id = parseInt(req.params.id)

  const goods = readFile(FILEPATH)
  const good = goods.find(good => good.id === id)

  if (good) {
    res.status(200).json(good)
  } else {
    res.status(404).json({ message: 'Good not found' })
  }
})

app.put('/goods/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const changeGood = req.body

  const goods = readFile(FILEPATH)
  const goodIndex = goods.findIndex(good => good.id === id)

  if (goodIndex !== -1) {
    goods[goodIndex].name = changeGood.name
    goods[goodIndex].price = changeGood.price
    goods[goodIndex].description = changeGood.description
    goods[goodIndex].categories = changeGood.categories

    writeFile(FILEPATH, goods)
    res.status(200).send()
  } else {
    res.status(404).json({ message: 'Good not found' })
  }
})

app.delete('/goods/:id', (req, res) => {
  const id = parseInt(req.params.id)

  const goods = readFile(FILEPATH)
  const goodIndex = goods.findIndex(good => good.id === id)

  if (goodIndex !== -1) {
    goods.splice(goodIndex, 1)
    writeFile(FILEPATH, goods)

    res.status(204).send()
  } else {
    res.status(404).json({ message: 'Good not found' })
  }

})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})