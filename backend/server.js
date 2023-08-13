const express=require("express")
const cors=require("cors")
const app=express()
const port=5000


app.get("/",(req,res)=>{
    res.send("hello world")
})

app.use(cors())
app.use(express.json())

app.listen(port,()=>{
    console.log(`server started on port ${port}`)
})

app.use("/api",require("./routes/loginUser"))