const express = require('express'); 
const cors = require('cors');  
const dotenv = require('dotenv'); 
const routes = require('./Routes/user.js'); 

dotenv.config();

const app = express(); 

app.use(express.json({limit:"16mb"})); 

app.use(express.urlencoded({extended:true,limit:"16mb"})); 

app.use(cors()); 

app.use('/user',routes);



const PORT = process.env.PORT;


app.get('/',(req,res)=>{
    res.send("Welcome to Recommendation Engine");
})


app.listen(PORT,()=>{
    console.log(`App running on http://localhost:${PORT}`);
}); 



