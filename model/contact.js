const mongoose=require('mongoose');

//creating the schema

const contactSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
},{
    timestamps:true
})

const contact=mongoose.model('contact',contactSchema);

module.exports=contact;