import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useState, useRef } from 'react';
import fetch from 'isomorphic-fetch';
import styles from './Chart.module.css';


export const ChartComponent = ({data}) => {
	// const 
		// data,
	// const colors = {
	// 		backgroundColor = 'white',
	// 		lineColor = '#2962FF',
	// 		textColor = 'black',
	// 		areaTopColor = '#2962FF',
	// 		areaBottomColor = 'rgba(41, 98, 255, 0.28)',
	// 	},
	const backgroundColor = 'white';
	const lineColor = '#2962FF';
	const textColor = 'black';
	const areaTopColor = '#2962FF';
	const areaBottomColor = 'rgba(41, 98, 255, 0.28)';

	// const data = props;
	// console.log('123', data);

	const [_data, setData] = useState(data.data);

	
	

	
	const chartContainerRef = useRef();
	console.log(chartContainerRef);

	useEffect(
		() => {
			


			console.log(new Date(1504015568503).toLocaleDateString("en-US"))


			const handleResize = () => {
				chart.applyOptions({ width: chartContainerRef.current.clientWidth * 0.7 });
			};

			const chart = createChart(chartContainerRef.current, {
				layout: {
					background: { type: ColorType.Solid, color: backgroundColor },
					textColor,
				},
				width: chartContainerRef.current.clientWidth*0.7,
				height: 300,
				borderRadius: 100,
				leftPriceScale: {
			    	visible: false,
			  		},
			  	rightPriceScale: {
			    	visible: false,
			  		},
		  		grid: {
				    vertLines: {
				      visible: false,
				    },
				    horzLines: {
				      visible: false,
				    },
				  },
			});
			chart.timeScale().fitContent();

			const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
			newSeries.setData(_data);

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);

				chart.remove();
			};
		},
		[_data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
	);

	return (
		<div className={`${styles['chart']}`}
			ref={chartContainerRef}
		
		/>
	);
};


function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}


// const initialData = [
// 	{ time: '2018-12-22', value: 32.51 },
// 	{ time: '2018-12-23', value: 31.11 },
// 	{ time: '2018-12-24', value: 27.02 },
// 	{ time: '2018-12-25', value: 27.32 },
// 	{ time: '2018-12-26', value: 25.17 },
// 	{ time: '2018-12-27', value: 28.89 },
// 	{ time: '2018-12-28', value: 25.46 },
// 	{ time: '2018-12-29', value: 23.92 },
// 	{ time: '2018-12-30', value: 22.68 },
// 	{ time: '2018-12-31', value: 22.67 },
// 	{ time: '2018-12-22', value: 32.51 },
// 	{ time: '2018-12-23', value: 31.11 },
// 	{ time: '2018-12-24', value: 27.02 },
// 	{ time: '2018-12-25', value: 27.32 },
// 	{ time: '2018-12-26', value: 25.17 },
// 	{ time: '2018-12-27', value: 28.89 },
// 	{ time: '2018-12-28', value: 25.46 },
// 	{ time: '2018-12-29', value: 23.92 },
// 	{ time: '2018-12-30', value: 22.68 },
// 	{ time: '2018-12-31', value: 22.67 },
// ];


export default function Chart(data) {
	return (
		<ChartComponent data={data}></ChartComponent>
	);
}