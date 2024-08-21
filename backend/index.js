const express=require('express')
const connection=require('./config/db')
const userRouter=require('./routes/user.route')
const cors=require('cors');
const taskRouter = require('./routes/task.route');
const auth=require('./middlewares/auth.middlware')
require('dotenv').config();

const PORT=process.env.PORT||5000
const app=express();
app.use(cors({
    origin:'*'
}));
app.use(express.json())
app.use('/auth',userRouter)
app.use('/task',auth,taskRouter)

app.get('/',(req,res)=>{
    res.send("welcome")
})


app.listen(PORT,async()=>{
    try {
        await connection;
        console.log(`Server is running on ${PORT} and connected to db`)
    } catch (error) {
        console.log(`Error while connection ${error}`)
    }
})