const express = require('express');
const path = require('path');
const PORT = 5000;
const app = express();
const database = require('./config/mongoose');
const Contact = require('./model/contact');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./assets'));

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
                    return res.redirect('back');
                }
            })
        }
        else{
            return res.redirect('back');
        }
    })
    
})


app.get('/', function (req, res) {
    Contact.find({}, function (err, contact) {
        if (err) {
            console.log(err);
            return;
        }
        return res.render('contacts', { contacts: contact });
    })
})


app.get('/addContact', function (req, res) {
    return res.render('addContact');
})


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


app.get("/update",function(req,res){
    var obj={
        _id:req.query.id,
        name:req.query.name,
        phone:req.query.phone,
        email:req.query.email
    }
    return res.render('update',{contact:obj});
})

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
                            return res.redirect('back');
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
                return res.redirect('back');
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
                    return res.redirect('back');
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

app.listen(PORT, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Server is running at", PORT);
})