const mongoose = require('mongoose')
const mongoURI = 'mongodb://localhost:27017/mydb';

const connectToMongo = () => {
    mongoose.connect(mongoURI).then(()=>
    console.log("connected")).catch((e)=>{
console.log(e.message);
    })
}


module.exports = connectToMongo;