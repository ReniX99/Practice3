import express from 'express'
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

app.use(express.json())
app.use(cors())

app.get('/goods', (req, res) => {
    const goods = readFile(FILEPATH)

    res.status(200).json(goods)
})

app.listen(8800, () => {
    console.log("Server is running on http://localhost:8800")
})