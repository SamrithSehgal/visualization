import { Button } from "@mui/material";
import React, {useState, useRef, useCallback} from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
import "./LineComp.css"


export default function LineComp({buildingData, timeData}) {

    const [floorData, setFloorData] = useState(buildingData)
    const floorOpen = useRef(false)

    function seeFloor(data){
        console.log(data)
        var curIndex = data["activePayload"][0]["payload"]["Floor"]
        if(!floorOpen.current){
          var curFloorData = []
          console.log(curIndex)
          for(var i = 0; i < timeData.length; i++){
            if(timeData[i]["Floor"] == curIndex){
              timeData[i].name = timeData[i].time + ":00"
              curFloorData.push(timeData[i])
            }
          }
          setFloorData(curFloorData)
          floorOpen.current = true
        }
    }

    function seeBuilding(){
      for(var i = 0; i < buildingData.length; i++){
        buildingData[i].name = "Floor " + buildingData[i]["Floor"]
      }
      setFloorData(buildingData)
      console.log(buildingData)
      floorOpen.current = false
    }


  return (
    <div>
        {floorOpen.current &&
            <Button id="collapseLine" variant="contained" onClick={seeBuilding}>Go Back</Button>
        }
        <LineChart width={900} height={700} data={floorData} margin={{top:20}} onClick={(data) => seeFloor(data)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 60, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
            type="monotone"
            dataKey="pop"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
        />
        </LineChart>
    </div>
  );
}
