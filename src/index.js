import express from 'express'
import routesCategories from './routes/routes.categories.js'
import routesProducts from './routes/routes.products.js'

const app = express()
const port = 3000

app.use(express.json())

app.use('/categories',routesCategories)
app.use('/products',routesProducts)


app.listen(port, () => console.log('Server running on port 3000'))