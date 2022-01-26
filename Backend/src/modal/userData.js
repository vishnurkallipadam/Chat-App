// assesing mongoose package
const mongoose = require('mongoose');
// database connection
mongoose.connect('mongodb://localhost:27017/mychatapp');


// schema definition
const schema = mongoose.Schema;
const userSchema= new schema({   
    name: String,
    email:String,
    password:String,
    status:String
});

// model
var userdata = mongoose.model('userdata',userSchema);
module.exports = userdata;