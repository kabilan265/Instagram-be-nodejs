const mongoose =  require('mongoose');
async function connect(){
    const con =await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser:true,
       /*  useCreateIndex:true, */
      /*   useFindAndModify:false, */
        useUnifiedTopology:true
    })
    console.log(`db connected: ${con.connection.host}`)
}

module.exports = connect;