const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/ContactDB");

const db=mongoose.connection;

db.on('error',console.error.bind(console,'Error in connecting database'));

db.once('open',function(){
    console.log("Database connected successfully");
})