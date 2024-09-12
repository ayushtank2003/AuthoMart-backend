const mongoose =require("mongoose") ;
const app=require("./app");

const port=8080;
const server = app.listen(port,()=>{
    console.log(`server is running at port${port}`);
});

const DB_URL=process.env.DB_URL.replace (
    "<password>",
    process.env.DB_PASSWORD
);

const DB=mongoose.connect(DB_URL)
.then(async () => {
    console.log("Connected to MongoDB");

    // Access the 'users' collection through the default connection
    // const db = mongoose.connection;


    // try {
    //     // Drop the specific index if it exists
    //     await db.collection('users').dropIndex('ussername_1');
        
    // } catch (error) {
    //     if (error.codeName === 'IndexNotFound') {
           
    //     } else {
    //         console.error("Error dropping index:", error);
    //     }
    // }
    // Close the connection
    // mongoose.connection.close();
})
.catch(error => {
    console.error("Error connecting to MongoDB:", error);
});