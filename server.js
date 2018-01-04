const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

let app = express();

hbs.registerPartials(__dirname + '/views/partials'); //This allows us to use partials on our pages. (header and footer as example)
app.set('view engine', 'hbs'); //this lets us use handlebars (hbs). similar to ejs
app.use(express.static(__dirname + '/public'));  //this is middleware built into express.  __dirname stores the path to your projects directory so it can always be used, it's a wrapper.

app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;

	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) =>{  //this send the log output to a file rather than the console
		if(err){
			console.log('Unable to connect to server');
		}
	});  
	next(); // when this runs without "next()" then the rest of the app will not work. next() lets the program keep going down the lexical chain
});
// ******* Output from the above middleware function *******
// ⇒  node server.js -e js,hbs                                                  
// Server is up on port 3000                                                    
// Thu Jan 04 2018 12:42:04 GMT-0600 (CST): GET /About                          
// Thu Jan 04 2018 12:42:08 GMT-0600 (CST): GET /                               
// Thu Jan 04 2018 12:42:10 GMT-0600 (CST): GET /About 

app.use((req, res, next) => {
	res.render('maintenance.hbs');   //notice no next so all of the code below will not execute. this will show the maint page no matter which page you navigate to.
});

// app.use(express.static(__dirname + '/public')); //move this file here, below the maint app.use to prevent users from hitting the help.html or any other page in the public folder. app.use run in order.


hbs.registerHelper('getCurrentYear', () => { //this is used to register functions for us to use many times in partials.
	return new Date().getFullYear();
}); 
hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

app.get('/', (req, res) => {
	// res.send('<h1>hello express<h1>');
	// res.send({
	// 	name: 'Randy',
	// 	likes: [
	// 		'diving',
	// 		'coding',
	// 		'kickboxing'
	// 	]
	// });
	res.render('home.hbs', {
		pageTitle: 'Home Page',
		// currentYear: new Date().getFullYear(),  //this is now handled by the hbs.registerHelper
		welcomeMessage: 'Welcome to our page'
	});
});

app.get('/about', (req, res) => {
	//res.send('About Page'); //we are now using HBS so we will render our template.
	res.render('about.hbs', { //to pass in arguments to pass to the page we just specify an object using key value pairs.
		pageTitle: 'About Page',
		// currentYear: new Date().getFullYear()  //this is using get date via javascript constructor. new makes a new instance of the date object then use method
	});
});


app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Unable to fulfil this request'
	});
});




app.listen(3000, () => {
	console.log('Server is up on port 3000');
});