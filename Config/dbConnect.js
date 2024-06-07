const mongoose = require('mongoose')

const dbConnect = async()=>{
    try {
         const connector = process.env.CONNECTION_STRING
         const connecter = await mongoose.connect(connector)
         if (!connecter) {
            console.log("Databse isn't connected successfuly");
         } else {
            console.log('Database connected successfully');
         }
    } catch (error) {
        console.log('Error connecting to database');
    }
}

module.exports = dbConnect