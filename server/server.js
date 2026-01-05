import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoutes.js'
import userRouter from './routes/userRoutes.js'
import quizRouter from './routes/quizRoutes.js';
import geminiRouter from './routes/geminiRoutes.js';


// initialise express
const app = express()

// connect to database
await connectDB()
await connectCloudinary()

// middleware
app.use(cors())

// Routes
app.get('/',(req,res)=>{res.send("API working")})
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks); // Webhook must come first
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

app.use(express.json());
app.use(clerkMiddleware());

app.use('/api/educator',educatorRouter);
app.use('/api/course',courseRouter);
app.use('/api/user',userRouter);

app.use('/api/quiz', quizRouter);

app.use('/api/gemini', geminiRouter);

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>
{
    console.log(`server is running on port ${PORT}`)
})