/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import VideoQueue from '../../components/VideoQueue/VideoQueue';
import PlayerControls from '../../components/PlayerControls/PlayerControls';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';
import "./home.css";
const socket = io.connect('http://localhost:8000');
export default class Home extends Component {

	constructor(props) {
		super(props);
		
		this.state = { 
			controls: false,
			bar:0, 
			width: 0, 
			height: 0, 
			time: 0, 
			percentage: 0 , //being used as formated clock
			seek: 0, 
			currentTime:0, 
			duration:0, 
			isPaused:true,
			playing: false,
			isseeking: 0,
			played: 0,
			clock: 0,
			videoURL: "",
			videoNames:[],
			queue: []
			};
		

			socket.on('recieve', (payload) => {
				console.log("payload delivered",payload);
				this.addEvent(payload);
				
			})

			socket.on('seekgot', (payload) => {
				console.log("payload delivered 2",payload);
				this.player.seekTo(payload.seek);
				
			})

		}

	addEvent = (event) => {
		console.log("hi")
		this.setState({playing: event.playing, seek:event.seek})
		console.log(this.state.playing, event.playing)
	}

	componentDidMount(){
		this.onLoad()
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
		}

	componentWillUnmount(){
		window.removeEventListener('resize',this.updateWindowDimensions);
		}

	updateWindowDimensions = () => {
		this.setState({width: window.innerWidth, height: window.innerHeight});
		}
	
	componentDidUpdate(prevProps, prevState){
		if(prevState.playing !== this.state.playing){
			socket.emit('pause/play', {playing: this.state.playing, seek:this.state.seek});
			
		}
	}

	timeformat = (seconds) => {
		var seconds = Math.floor(seconds);
		const minutes = Math.floor(seconds/60) ;
		const sseconds = seconds%60 < 10 ? '0'+seconds%60 : seconds%60 ;
		this.setState({percentage: minutes + ':' +sseconds});
		return minutes + ':' +sseconds
	}

	seekChange = (event) => {

		this.setState({seek: event.target.value});
	}
	
	onTogglePlay = () => {
		this.setState({playing: !this.state.playing});
		
	}
	onProgress = (event) => {
		
		if (!this.state.isseeking){

			const time = this.timeformat(event.playedSeconds);
			this.setState({percentage: time, seek: event.playedSeconds})
		}
	}

	onDuration = (event) => {
		this.setState({duration: event})
	}
	
	onSeekSearch = (event) => {
		this.setState({isseeking: true})
	}
	onSeekChange = (event) => {
		this.setState({seek: event.target.value, played:event.target.value, clock:this.timeformat(event.target.value) })
	}

	onSeekDone = (event) => {
		this.setState({isseeking: false})
		socket.emit('seek', {seek:event.target.value})
		this.player.seekTo(event.target.value)
	}

	ref = player => {
		this.player = player
	}
	
	onTextUpdate = (event) => {
		this.setState({videoURL: event.target.value})
	}
	
	handleKeyPress = (event) => {
		
		if(event.key == 'Enter'){
			console.log('Submitted!');
			this.setState({videoURL: event.target.value});
			this.sendNamesToServer(event.target.value);
		}
	}

	nextVideo = (event) => {
		console.log("event")

	}

	sendNamesToServer = (link) => {
		var data = { youtube : link };
		fetch("http://localhost:8000/upload", {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				youtube: link

		})}).then( response => response.json()).then(data => {
			this.setState({videoNames: data})
			console.log(this.state.videoNames)
		})
	}

	onToggleNext = () => {

	}

	onDelete = (video) => {
		fetch("http://localhost:8000/delete", {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				link: video

		})}).then( response => response.json()).then(data => {
			this.setState({videoNames: JSON.stringify({data})})
			console.log(this.state.videoNames)
		})
	}

	onToggleStart = () => {
		this.setState({playing: 1});
		
	}

	onTogglePause = () => {
		this.setState({playing: 0});
		
	}

	onLoad = () => {
		fetch("http://localhost:8000/load", {
			method: 'post',
			headers: {'Content-Type': 'application/json'}
			}).then( response => response.json()).then(data => {
			this.setState({videoNames: data, queue: data.slice(1)})
		})
	}
	
	onDragStart = (event, index) => {
		this.draggedItem = this.state.queue[index];
		event.dataTransfer.effectAllowed = "move";
		event.dataTransfer.setData("text/html", event.target.parentNode);
		event.dataTransfer.setDragImage(event.target.parentNode, 20, 20);
	}

	onDragOver = (index) => {
		console.log(index)
		const draggedOverItem = this.state.queue[index];

		if(this.draggedItem === draggedOverItem){
			return;
		}

		let items = this.state.videoNames.filter(item => item !== this.draggedItem);

		items.splice(index, 0, this.draggedItem);

		this.setState({queue: items})
	}

	onDragEnd = () => {
		this.draggedIdx = null;
		var oldList = this.state.queue;
		var first = this.state.videoNames[0];
		var newList = oldList.unshift(first)
		this.setState({})
	}
	render() {

		const opts = {
	      height: "auto", //set the video to a 16:9 ratio based on window size
	      width: "100%"
	    };

	    const first = this.state.videoNames.length > 0 ? this.state.videoNames[0].youtube : this.state.videoNames;

	    return (
	      <div>
		      <h3>React Player</h3>
			  <input type="text"  onKeyPress={this.handleKeyPress}/>
			  <div className = 'main_container' onClick={this.onTogglePlay}>
			      <ReactPlayer className='main_container'

			      	controls = {this.state.controls}
			      	ref = {this.ref}
			      	url = {first}
			      	width = {opts.width} 
			      	
			      	playing = {this.state.playing}
			      	onProgress = {this.onProgress}
			      	onDuration = {this.onDuration}
			      	onSeek = { e => console.log('onSeek',e),50}
					
					onPause = {this.onTogglePause}
					onPlay = {this.onToggleStart}
			      	/>
			  </div>
			  <h1></h1>
		      <h1>{this.state.isseeking ? this.state.clock : this.state.percentage}</h1>
		      <PlayerControls change = {this.onSeekChange} duration={this.state.duration} seek={ this.state.seek } _onMouseDown = {this.onSeekSearch} _onMouseUp = {this.onSeekDone} /> 
		      <button onClick = {this.onTogglePlay}>Pause/Play</button>
		      <button onClick = {this.onToggleNext}> Next Video</button>
		      <VideoQueue {...this.props} dragEnd = {this.onDragEnd} dragOver = {this.onDragOver} dragStart={this.onDragStart} deleteVideo = {this.onDelete} changeVideo = {this.nextVideo} videoNames = {this.state.queue} />
	      </div>
	    );
	  }

}
