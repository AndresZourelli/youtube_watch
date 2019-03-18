const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const knex = require('knex');
const server = app.listen(8000);
require('dotenv').load();
const io = require('socket.io').listen(server);
const cors = require('cors');
io.origins('*:*');
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const db = knex({
	client: 'pg',
	connection: {
	user: process.env.DB_User,
	host: process.env.DB_host,
	database: process.env.DB,
	password: process.env.DB_password,
	port: process.env.DB_Port,
	ssl: true,
  debug: true},
  });

app.post('/upload', (req, res) => {
	console.log(req.body.youtube);
	db('links').insert({youtube: req.body.youtube}).then((err,res) => {
	})
	db.select('youtube').table('links').then((user)=>{ 
		return res.json(user);

	})
})

app.post('/load', (req, res) => {
	
	db.select('youtube').table('links').then((user)=>{ 
		return res.json(user);

	})
})


app.post('/delete', (req,res) => {
	console.log('deleting...')
	console.log(req.body.link)
	db('links').where('youtube',req.body.link.youtube).del().then((err,res)=>{
		console.log(res);
		console.log(err);
		
	})
	.then(
		db.select('youtube').table('links').then((user)=>{ 
			return res.json(user);
			})
		)
})

io.on('connection', function(socket){
	  console.log('a user connected');
	  socket.on('pause/play', function(data){
		  socket.broadcast.emit('recieve',data);
		  console.log(data);
	});
	  socket.on('seek', function(data){
		  socket.broadcast.emit('seekgot',data);
		  console.log(data);
	});
});



//db('links').insert({youtube:'https://www.youtube.com/watch?v=UOxkGD8qRB4'}).then(console.log).catch(console.log);
