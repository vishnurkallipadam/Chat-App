// assesing mongoose package
const mongoose = require('mongoose');
// database connection
mongoose.connect('mongodb://localhost:27017/mychatapp');


// schema definition
const Schema=mongoose.Schema;
const BlockchatSchema = new Schema({
   
    from:String,
    to:String
    
    
});

//Model creation
var Blockchatdata=mongoose.model('Blockchatdata',BlockchatSchema);
module.exports=Blockchatdata;