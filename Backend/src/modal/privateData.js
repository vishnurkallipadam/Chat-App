// assesing mongoose package
const mongoose = require('mongoose');
// database connection
mongoose.connect('mongodb://localhost:27017/mychatapp');


// schema definition
const schema = mongoose.Schema;
const privatemsgSchema= new schema({   
    user:String,
    message:String,
    room:String,
    created:{type:Date,default:Date.now},
    imgfile:String
});

// model
var privatedata = mongoose.model('privatemsg',privatemsgSchema);
module.exports = privatedata;