var express = require('express');
var path = require('path');

var app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port,()=>{console.log("server Ready at"+port)});



module.exports = app;
