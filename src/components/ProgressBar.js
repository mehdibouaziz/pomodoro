import React, {useEffect, useState, useRef} from 'react';
import './ProgressBar.css';
 

const ProgressBar = (props) => {
    const [offset, setOffset] = useState(0);
    const circleRef = useRef(null);
    const {
        label,
        time,
        progress,
        size,
        strokeWidth,
        circleOneStroke,
        circleTwoStroke,
    } = props;

    const center = size/2;
    const radius = center - strokeWidth/2;
    const circumference = 2 * Math.PI * radius;
    const rotation = 'rotate(-90 ' + center + ' ' + center + ')'


  

    return(
        <>
  
            <svg className="svg" width={size} height={size}>
                <circle
                    className="svg-circle-bg"
                    stroke={circleOneStroke}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <circle
                    className="svg-circle-bg"
                    ref={circleRef}
                    stroke={circleTwoStroke}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={((100 - progress)/100)*circumference}
                    transform={rotation}
                />
                <text id='timer-label' className="svg-circle-text" x={center} y={center-40}>
                  {label}
                </text>
                <text id='time-left' className="svg-circle-text" x={center} y={center+40}>
                  {time}
                </text>
  
            </svg>
  
        </>
    );
  }


export default ProgressBar;