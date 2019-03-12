
import ReactPlayer from 'react-player';
import './VideoQueue.css';

import React from 'react';

const VideoQueue = ( {videoNames, changeVideo, deleteVideo, dragStart, dragOver, dragEnd} ) => {
	const state = {
		playing: 0,
		width: '168 px',
		height: '94 px',
		controls: false

	}

	const videos = videoNames;
	const videoComp = (videos || []).map((user, i) => {
		return (
		<div className = 'playerContainer' onDragOver = {() => dragOver(i)} >
				<div className="drag" onDragStart = {(e) => dragStart(e,i) } onDragEnd = {dragEnd} draggable >
					<ReactPlayer 
				      	url = {JSON.stringify(videos[i].youtube)}
				      	width = {state.width}
				      	height= {state.height}
				      	playing = {state.playing}
				      	controls = {state.controls}
				      	onClick={changeVideo}
				      	/>
				    <button onClick = {()=> {deleteVideo(videoNames[i])}}>Delete</button>
				</div>
		</div>)
	})	

	return(
		
		<div>
			{videoComp}
		</div>
	);
}

export default VideoQueue;