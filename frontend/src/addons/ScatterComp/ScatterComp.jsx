import React from 'react';
import { ScatterChart, CartesianGrid, XAxis, YAxis, ZAxis,Tooltip, Legend, Scatter } from 'recharts';


//Source: https://recharts.org/en-US/api/ScatterChart
function ScatterComp({graphData, timeRange}){
    var colors = ["#50998c", "#1ea3af", "#95b5f3", "#893b75", "#f42721", "#06a6d0", "#3ee6c7", "#61fa61", "#753791", "#3232fe", "#14f00c", "#2041b3", "#e922ae", "#db8540", "#ab343d", "#fdfe56", "#6a31db", "#11d997", "#f9436c", "#c535c4", "#8726f8", "#1b645a", "#cd4763", "#e44f31", "#d567fc"]


    for(var time in timeRange){
        timeRange[time] = parseInt(timeRange[time])
    }
    return (
        <ScatterChart
            width={1130}
            height={550}
            margin={{
                top: 20,
                right: 20,
                bottom: 10,
                left: 10,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" type="number" name="Time" padding={{ left: 20, right: 0 }} domain={timeRange} tickFormatter={(tick) => {var dateTime = new Date(tick); return dateTime.toUTCString().split("GMT")[0];}} tickCount={10}/>
            <YAxis dataKey="occupancy" type="number" name="Occupancy" unit=" ppl" ticks={[3, 10, 30, 50]} domain={[-1, 50]} tickCount={4} allowDataOverflow/>
            <ZAxis dataKey="name" type="category" name="Name" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name, props) => {
                if(props.name == "Time"){
                    var dateTime = new Date(parseInt(props.value))
                    return dateTime.toUTCString()
                }
                else{
                    return props.value
                }
            }}/>
            <Legend />
            {graphData.map((plot, index) => (
                <Scatter name={plot[0].name} data={plot} fill={colors[index]} key={plot[0].id}/>
            ))

            }
        </ScatterChart>
    );
}

export default ScatterComp;