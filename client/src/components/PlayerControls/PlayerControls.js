import React from 'react';
import "./PlayerControls.css";
import Filler from "./Filler"
const PlayerControls = (props) => {

	return(
		<div>
			<div className="progress-bar">
			
				<input type="range" min="0" max={props.duration} value={props.seek} step = "1" className="slider" id="myRange" onChange = {props.change} onMouseUp = {props._onMouseUp} onMouseDown = {props._onMouseDown} />
				
			</div>
		</div>
		);
};

export default PlayerControls