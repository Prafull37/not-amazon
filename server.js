import express from 'express';
import data from "./data.js";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routers/userRouter.js';
// import fs from 'fs';
import dotenv from 'dotenv';
import productRouter from './routers/productRouter.js';
import axios from 'axios';
dotenv.config();

// console.log(process.env.SECRET_KEY)

const app=express();
// const app=express();

// console.log(process.env.MFLIX_DB_URI)
mongoose.connect(process.env.DB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const port=5000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/v1/users',userRouter);
app.use('/api/v1/products',productRouter);

app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).send({message:err.message})
    next()
})
let cart=[];


// app.get('/api/v1/product/:id',(req,res)=>{
//     const {id}= req.params;
//     const product=data.products.find(x=>x._id===id);
//     if(product){
//         res.send(product)
//     }else{
//         res.status(404).send({message:"Product not found"})
//     }
// })

// app.get('/api/v1/products',(req,res)=>{
//     //console.log("Working....")
//     res.send(data)
// })

app.get('/',(req,res)=>{
    res.send("Server is Running");
})

app.post('/api/v1/cart',(req,res)=>{
    console.log(req.body)
    let item= req.body;
    try{
    if (Array.isArray(item)){
        cart=item;
        res.status(201).send(cart);
    }
    else if(item ){
        console.log("item",item)
        let itemIndex= cart.findIndex((cartItem)=> cartItem.id === item.id);
        console.log("itemIndex",itemIndex)
        if(itemIndex >-1){
            // //console.log("item",itemIndex);
            cart[itemIndex].qty = item.qty;
        }else{
            // //console.log("else")
            cart.push(item);
        }
        console.log("cart",cart);
        
        res.status(201).send(cart);
        // res.redirect(301,'/cart');
    }
    else{
        res.send(400).write("Wrong data");
    }
}catch(e){

}
})

app.get('/api/v1/cart', async (req,res)=>{
    try{
    if(cart){
        let productItems=[]
        console.log(cart)
        for(let i=0;i<cart.length;i++){
            console.log("iterating ")
            let {data} = await axios.get(`http://localhost:5000/api/v1/products/${cart[i].id}`)
            // console.log("data",data);
            if(data.product){
                productItems.push( {...data.product,qty:cart[i].qty});
            }
            
        }
        // consoleog("prod",productItems)
        res.status(200).send(productItems.filter((prod)=>prod));
    }else{

            res.status(200).send([]);
    }
}catch(e){

}
})

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})