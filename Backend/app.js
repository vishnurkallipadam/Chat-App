var express = require('express');
const app = express();
var cors = require('cors')
var path = require('path');
var userdata=require('./src/modal/userData')
var bcrypt=require('bcrypt')
var privateData = require('./src/modal/privateData')
var blockData=require('./src/modal/blockData')
var roomData=require('./src/modal/roomData')
var roomChatData=require('./src/modal/roomChatData')

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 5200;



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
          res.status(401).send('User Already Exist')
        }else{
            item.password=await bcrypt.hash(item.password,10)
            let user = new userdata(item)
            user.save(
                err=>{
                    console.log(err);
                    res.send(err)
                },
                data=>{
                    console.log("Registration Successfull");
                    res.send()
                }  
            )
        }
    })
})

app.get('/getUsers',(req,res)=>{
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD"); 
    userdata.find().then((data)=>{
        res.send(data)
    }) 
})

app.get('/getUser/:id',(req,res)=>{
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD"); 
    let id=req.params.id

    userdata.findOne({_id:id}).then((data)=>{
        res.send(data)
    }) 
})

app.get('/chatHistory/:item', (req, res) => {
    const room = req.params.item;
    privateData.find({ room:room  })
      // Userdata.findOne({"email":email})
      .then((otheruserdetail)=>{
          res.send(otheruserdetail);
       // console.log(otheruserdetail)
      });
  })

  app.get('/groupChatHistory/:item', (req, res) => {
    const room = req.params.item;
    roomChatData.find({ room:room  })
      // Userdata.findOne({"email":email})
      .then((otheruserdetail)=>{
          res.send(otheruserdetail);
       // console.log(otheruserdetail)
      });
  })

  app.get('/getGroups',(req,res)=>{
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD"); 
    roomData.find().then((data)=>{
        res.send(data)
    }) 
})

app.post('/createGroup',(req,res)=>{

    roomData.findOne({"name":req.body.name})
    .then((data)=>{
        if(data){
            res.status(401).send('Group Already Exist')
        }else{
            let group={
                name:req.body.name
            }
            console.log(group);
            var groupchat=new roomData(group);
            groupchat.save();
            return res.status(200).send(); 
        }
    })
})

app.get('/getGroup/:id',(req,res)=>{
    res.header("Acces-Control-Allow-Origin","*");
    res.header("Acces-Control-Allow-Methods: GET, POST, PATH, PUT, DELETE, HEAD"); 
    let id=req.params.id

    roomData.findOne({_id:id},(err,data)=>{
        res.send(data)
    }) 
})

app.post('/blockUser',(req,res)=>{
    console.log("block");
    console.log(req.body);
    var blockchat={
        from:req.body.from,
         to:req.body.to,
       }
       var blockchat=new blockData(blockchat);
       blockchat.save();
       return res.status(200).send(); 
})

app.post('/unBlockUser',(req,res)=>{
    console.log("block");
    console.log(req.body);
    blockData.findOneAndDelete({"from":req.body.from,"to":req.body.to})
    .then(()=>{
        res.send()
    })
})

app.get('/blockList',(req,res)=>{
    blockData.find().then((data)=>{res.send(data)})
})

app.post('/joinGroup',(req,res)=>{
    console.log(req.body);
    roomData.findOneAndUpdate({_id:req.body.room}, 
        {$push:{members:req.body.mail}
    }).then((data)=>{
        console.log(data);
        res.send()
    })

})

app.post('/login',(req,res)=>{
    console.log("login");
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
                    
                    console.log("success");
                    userdata.findOneAndUpdate({email:user.email}, 
                        {$set:{status:"online"}
                    }).then(()=>{
                        res.send(user)

                    })
                   
                }else{
                    console.log("failed");
                    res.status(401).send('Invalid user Password')
                }
            })   
        }else{
            console.log("failed");
            res.status(401).send('Invalid credential')
        }
    })
})

console.log("b4 connection");

io.on('connection', (socket) => {
    console.log("a user connected");
    socket.on('join', (data) => {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('user joined');
    });

    socket.on('sendindvmsg',function(data){
            console.log(data);
            let date_ob = new Date();
            var chatdata={
              user:data.user,
              message:data.message,
              room:data.room,
              date:new Date().toLocaleDateString(),
              time:formatAMPM(new Date)
            }
            console.log(chatdata);
            var chatdata=new privateData(chatdata);
        chatdata.save().then(()=>{
        })
        io.in(data.room).emit('new_indvmessage', {message:data.message,user:data.user});
          
     
      })

      socket.on('sendgrpmsg',function(data){
        console.log(data);
        let date_ob = new Date();
        var chatdata={
          user:data.user,
          message:data.message,
          room:data.room,
          date:new Date().toLocaleDateString(),
          time:formatAMPM(new Date)
        }
        console.log(chatdata);
        var chatdata=new roomChatData(chatdata);
    chatdata.save().then(()=>{
    })
    io.in(data.room).emit('new_groupmessage', {message:data.message,user:data.user});
      
 
  })

      socket.on('sendimage',function(data){
        let date_ob = new Date();
        var chatdata={
          user:data.user,
          imgfile:data.image,
          room:data.room,
          date:new Date().toLocaleDateString(),
          time:formatAMPM(new Date)
        }
        var chatdata=new privateData(chatdata);
       chatdata.save();
       io.in(data.room).emit('new_image', {image:data.image,user:data.user});
      
      })

      socket.on('sendgrpimage',function(data){
        let date_ob = new Date();
        var chatdata={
          user:data.user,
          imgfile:data.image,
          room:data.room,
          date:new Date().toLocaleDateString(),
          time:formatAMPM(new Date)
        }
        var chatdata=new roomChatData(chatdata);
       chatdata.save();
       io.in(data.room).emit('new_image', {image:data.image,user:data.user});
      
      })

    socket.on('message', (data) => {

        var chatdata={
            user:data.user,
            message:data.message,
            // room:data.room
          }

        var chatdata = new privateData(chatdata);
        chatdata.save();
        // console.log(data);
        io.emit('new message', {user:data.user, message:data.message});
    });
});

app.get('/logout/:mail',function(req, res){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS")
   // const id = req.body._id;
   console.log("logout"+req.params.mail);
  const email=req.params.mail;
     userdata.findOneAndUpdate({"email":email}, {$set:{status:"offline"}})
     .then(()=>{
         console.log("logout");
         res.send();
     });
 })
 function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
server.listen(port, () => {
    console.log(`started on port: ${port}`);
});

module.exports = app;