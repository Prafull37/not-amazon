import express from 'express';
import Products from '../model/productModel.js';
import data from '../data.js';
import expressAsyncHandler from 'express-async-handler';

const productRouter = express.Router();

productRouter.get('/',expressAsyncHandler(async (req,res)=>{
   
    const products = await Products.find({});
    res.send({products})
}))

productRouter.get('/seed',expressAsyncHandler(async (req,res)=>{
    await Products.remove({})
    const createdProduct = await Products.insertMany(data.products);
    res.send({createdProduct})
}))

productRouter.get('/:id',expressAsyncHandler(async (req,res)=>{

    const product = await Products.findById(req.params.id);
    if(product){

        res.send({product})
    }else{
        res.status(404).send({message:"Product Does not Exist"});
    }
}))


export default productRouter;