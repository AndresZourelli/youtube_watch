import React from 'react';
import "./PlayerControls.css";

const Filler = (props) => {
	return(
		<div>
			<div>
				<div className="filler" style= {{ width: `${props.percentage}%` }}>
				</div>
			</div>
		</div>
		);
};

export default Filler