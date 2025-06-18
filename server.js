const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
app.use(bodyParser.json());

const db = require('./db'); // Assuming db.js is in the same directory
const Person = require('./models/person'); // Import the Person model
// const Menu = require('./models/Menu'); // Import the Menu model 
// Import the database connection
const personRoutes = require('./routes/PersonRoutes'); // Import the Person routes
const menuRoutes = require('./routes/menuRoutes'); // Import the Menu routes

app.get('/', passport.authenticate('local' , {session:false}) ,  (req, res) => {
    res.send('Welcome to my hotel ... How can i help you? , we have list  of menues and rooms');
});


// middleware to log requests -- logging 
const logRequest =  (req ,res , next)=>{
    console.log(`[${new Date().toLocaleString()}] - ${req.method} request made to ${req.url}`); 
    next(); // Call the next middleware or route handler
}

app.use(logRequest); // Use the logging middleware


// authentication middleware
passport.use(new LocalStrategy( async (USER , PASSKEY , done) => {
    try {
        console.log('Authenticating user with username:', USER);
        console.log('Authenticating user with password:', PASSKEY);
        // const user = await Person.findOne({username : USER});
        // if(!user){
        //     console.log(`data comes from database` , user);
        //     return done(null, false, {message : 'User not found'});  
        // }
        // //done is a callback function that takes three arguments: error, user, and info
        // console.log('actual Username :', user.username);
        // console.log('actual User password:', user.password);
        // if(user.password === PASSKEY)  
        //     return done(null, user); // If the user is found and password matches, return the user object
        // else 
        //     return done(null, false, {message : 'Incorrect password'});
            
    } catch (error) {
        return done(error); // If an error occurs, pass it to the done callback
    }  
}));


app.use(passport.initialize()); // Initialize passport middleware


app.use('/person' , personRoutes); // Use the Person routes

app.use('/menu', menuRoutes); // Use the Menu routes


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});