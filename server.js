import express, { json } from 'express'
import cors from 'cors'
const corsOptions = {
  origin: ['http://localhost:5173']
}
import userRoutes from './routes/users.routes.js'
const app = express()

app.use(cors(corsOptions))
app.use(express.json())

app.use(userRoutes);




const PORT = process.env.PORT ?? 8080
app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`)
})