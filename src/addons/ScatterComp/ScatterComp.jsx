import React from 'react';
import { ScatterChart, CartesianGrid, XAxis, YAxis, ZAxis,Tooltip, Legend, Scatter } from 'recharts';


//Source: https://recharts.org/en-US/api/ScatterChart
function ScatterComp({timeData}){
    timeData.sort((a,b) => a.Floor - b.Floor);
    var seperatedData = []
    var finalData = []
    var prevFloor = timeData[0]["Floor"]
    for(var i = 0; i < timeData.length; i++){
        if(timeData[i]["Floor"] != prevFloor){
            finalData.push(seperatedData)
            seperatedData = [timeData[i]]
        }
        else{
            seperatedData.push(timeData[i])
            if(i == (timeData.length-1)){
                finalData.push(seperatedData)
            }
        }
        prevFloor = timeData[i]["Floor"]
    }
    var colors = ["#50998c", "#1ea3af", "#95b5f3", "#893b75", "#f42721", "#06a6d0", "#3ee6c7", "#61fa61", "#753791", "#3232fe", "#14f00c", "#2041b3", "#e922ae", "#db8540", "#ab343d", "#fdfe56", "#6a31db", "#11d997", "#f9436c", "#c535c4", "#8726f8", "#1b645a", "#cd4763", "#e44f31", "#d567fc"]
    
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
            <XAxis dataKey="time" type="number" name="Time" unit=":00" padding={{ left: 20, right: 0 }}/>
            <YAxis dataKey="pop" type="number" name="Occupancy" unit=" ppl"/>
            <ZAxis dataKey="Floor" type="number" name="Floor" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            {finalData.map((plot) => (
                <Scatter name={plot[0].name} data={plot} fill={colors[plot[0]["Floor"]]}/>
            ))

            }
        </ScatterChart>
    );
}

export default ScatterComp;