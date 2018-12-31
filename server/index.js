const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const knex = require('knex');
const server = app.listen(8000);

const io = require('socket.io').listen(server);
const cors = require('cors');
io.origins('*:*');
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const db = knex({
  client: 'pg',
  connection: {
  user: "ptgramgfdpdlfs",
  host: 'ec2-54-235-178-189.compute-1.amazonaws.com',
  database: "db5s4t7l89tbf6",
  password: "7c601c7f3316b1b985e19f5133f8bcfc3539fab951b200f14445f976ae453eaf",
  port: "5432",
  ssl: true,
debug: true},
});

app.post('/upload', (req, res) => {
	console.log(req.body.youtube);
	db('links').insert({youtube: req.body.youtube}).then((err,res) => {
	})
	db.select('youtube').table('links').then((user)=>{ res.json(user)

	})
})

app.post('/delete', (req,res) => {
	console.log('deleting...')
	console.log(req.body.link)
	db('links').where('youtube',req.body.link).del().then((err,res)=>{
		console.log(res);
	})
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
