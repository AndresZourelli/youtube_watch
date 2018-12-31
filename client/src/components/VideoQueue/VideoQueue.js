import React from 'react';
import ReactPlayer from 'react-player';
import './VideoQueue.css';
const VideoQueue = ( {videoNames, changeVideo, deleteVideo} ) => {
	const state = {
		playing: 0,
		width: '168 px',
		height: '94 px',
		controls: false

	}
	const videoComp = (videoNames || []).map((user, i) => {
		return (
		<div className = 'playerContainer'  >
			<ReactPlayer 
		      	url = {videoNames[i]}
		      	width = {state.width}
		      	height= {state.height}
		      	playing = {state.playing}
		      	controls = {state.controls}
		      	onClick={changeVideo}
		      	/>
		      	<button onClick = {()=> {deleteVideo(videoNames[i])}}>Delete</button>
		</div>)
	})	

	return(
		
		<div>
			{videoComp}
		</div>
	);
}

export default VideoQueue;