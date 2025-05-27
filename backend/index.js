import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import connectCloudinary from './config/cloudinary.js';
const app = express()
const port = process.env.PORT
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));


app.use("/api/user", userRouter);

app.get('/', (req, res) => {
    res.send("heelow")
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})
