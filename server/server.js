import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

// initialise express
const app = express()

// connect to database
await connectDB()

// middleware
app.use(cors())

// Routes
app.get('/',(req,res)=>{res.send("API working")})
app.post('/clerk',express.json(),clerkWebhooks)

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>
{
    console.log(`server is running on port ${PORT}`)
})