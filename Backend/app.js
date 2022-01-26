var express = require('express');
var path = require('path');
var userdata=require('./src/modal/userData')
var bcrypt=require('bcrypt')
var cors = require('cors')
var app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup',async(req,res)=>{
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD"); 
    console.log(req.body);
    var item={
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
        status:'offline'
    }
    userdata.findOne({email:item.email})
    .then(async(data)=>{
        if(data){
          res.status(401).send('user already exist')
        }else{
            item.password=await bcrypt.hash(item.password,10)
            let user = new userdata(item)
            user.save(
                err=>{
                    console.log(err);
                    res.send(err)
                },
                data=>{
                    console.log("success");
                    res.send()
                }  
            )
        }
    })
})

app.post('/login',(req,res)=>{
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD"); 
    console.log(req.body);
    userdata.findOne({email:req.body.email},(err,user)=>{
        console.log(user);
        if(user){
            bcrypt.compare(req.body.password,user.password)
            .then((response)=>{
                if(response){
                    console.log("user");
                    // let payload = {subject: req.body.student.email+req.body.student.password}
                    // let token = jwt.sign(payload, 'studentKey')
                    // res.status(200).send({token,role:'student',id:student._id})
                    res.send()
                   
                }else{
                    res.status(401).send('Invalid user Password')
                }
            })   
        }else{
            res.status(401).send('Invalid credential')
        }
    })
})

app.listen(port,()=>{console.log("server Ready at"+port)});



module.exports = app;
