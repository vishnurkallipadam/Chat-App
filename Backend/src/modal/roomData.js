// assesing mongoose package
const mongoose = require('mongoose');
// database connection
mongoose.connect('mongodb://localhost:27017/mychatapp');


// schema definition
const schema = mongoose.Schema;
const roomSchema= new schema({   
    name: String,
    members:Array

});

// model
var roomdata = mongoose.model('roomdata',roomSchema);
module.exports = roomdata;