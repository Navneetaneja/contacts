const express = require('express');
const path = require('path');
const PORT = 5000;
const app = express();
const database = require('./config/mongoose');
const Contact = require('./model/contact');
var obj="";

//setting the view engine as ejs

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./assets'));

// code for creating contacts with checking if user already exists or not

app.post('/createContact', function (req, res) {

    Contact.findOne({ phone: req.body.phone }, function (err, data) {

        if(err)
        {
            console.log(err);
            return;
        }
        if(!data)
        {
            Contact.findOne({ email: req.body.email }, function (err, data2) {
                if(err)
                {
                    console.log(err);
                    return;
                }
                if(!data2)
                {
                    req.body.phone=req.body.phone.toString();
                    Contact.create(req.body, function (err, contact) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log(contact);
                        return res.redirect('/');
                    })
                }
                else
                {
                    return res.render('addContact',{error:"User Already Exists with these Credentials"});
                }
            })
        }
        else{
            return res.render('addContact',{error:"User Already Exists with these Credentials"});
        }
    })
    
})

//code for the home page

app.get('/', function (req, res) {
    Contact.find({}, function (err, contact) {
        if (err) {
            console.log(err);
            return;
        }
        return res.render('contacts', { contacts: contact });
    })
})

//code to redirect to add contact page

app.get('/addContact', function (req, res) {
    return res.render('addContact',{error:""});
})

//code for deleting the checked contacts

app.get("/deleteContact/",function(req,res){
    // console.log(req.query.arr);

    if(req.query.arr!=='')
    {
    const con=req.query.arr.split(",");
    for(i of con)
    {
        Contact.findByIdAndDelete(i,function(err){
            if(err)
            console.log(err);
        })
    }
    }
    return res.redirect('back');
})

// code for searching contacts with name, phone and email

app.post('/search',function(req,res){

    if(req.body.search!=="")
    {
    Contact.find({"$or":[
        {name:{$regex:req.body.search}},
        {phone:{$regex:req.body.search}},
        {email:{$regex:req.body.search}}
    ]}, function (err, contact) {
        if (err) {
            console.log(err);
            return;
        }
        return res.render('contacts', { contacts: contact });
    })
    }
    else
    return res.redirect("/");
})

//creating the update page

app.get("/update",function(req,res){
    obj={
        _id:req.query.id,
        name:req.query.name,
        phone:req.query.phone,
        email:req.query.email
    }

    return res.render('update',{contact:obj,error:""});
})


//code for updating contact

app.post("/updateContact/",function(req,res){

    req.body.phone=req.body.phone.toString();

    if(req.query.phone!==req.body.phone)
    {
        Contact.findOne({phone:req.body.phone},function(err,data){
            if(err)
            {
                console.log(err);
                return;
            }
            if(!data)
            {
                if(req.query.email!==req.body.email){
                    Contact.findOne({email:req.body.email},function(err,data2){
                        if(err)
                        {
                            console.log(err);
                            return;
                        }
                        if(!data2)
                        {
                            Contact.findByIdAndUpdate(req.query.id,req.body,function(err,data){
                                if(err)
                                {
                                    console.log(err);
                                    return;
                                }
                                console.log(data);
                                return res.redirect('/');
                            })
                        }
                        else{
                            return res.render('update',{error:"User Already Exists with these Credentials",contact:obj});
                        }
                    })
                }else{
                    Contact.findByIdAndUpdate(req.query.id,req.body,function(err,data){
                        if(err)
                        {
                            console.log(err);
                            return;
                        }
                        console.log(data);
                        return res.redirect('/');
                    })
                }

            }else{
                return res.render('update',{error:"User Already Exists with these Credentials",contact:obj});
            }
        })
    }else{
        if(req.query.email!==req.body.email){
            Contact.findOne({email:req.body.email},function(err,data2){
                if(err)
                {
                    console.log(err);
                    return;
                }
                if(!data2)
                {
                    Contact.findByIdAndUpdate(req.query.id,req.body,function(err,data){
                        if(err)
                        {
                            console.log(err);
                            return;
                        }
                        console.log(data);
                        return res.redirect('/');
                    })
                }
                else{
                    return res.render('update',{error:"User Already Exists with these Credentials",contact:obj});
                }
            })
        }else{
            Contact.findByIdAndUpdate(req.query.id,req.body,function(err,data){
                if(err)
                {
                    console.log(err);
                    return;
                }
                console.log(data);
                return res.redirect('/');
            })
        }

    }
})


//code for server to listen on specified port

app.listen(PORT, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Server is running at", PORT);
})