import React, {useCallback, useState, useRef} from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button } from '@mui/material';
import "./BarComp.css"


function BarComp({buildingData, timeData}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [floorData, setFloorData] = useState(buildingData)
    const floorOpen = useRef(false)
    const onBarEnter = useCallback(
        (_, index) => {
          setActiveIndex(index);
        },
        [setActiveIndex]
    );

    function seeFloor(){
        if(!floorOpen.current){
          var curFloorData = []
          for(var i = 0; i < timeData.length; i++){
            if(timeData[i]["Floor"] == (activeIndex+1)){
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
                <Button id="collapseBars" variant="contained" onClick={seeBuilding}>Go Back</Button>
            }
            <BarChart
              width={800}
              height={600}
              data={floorData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pop" fill="#8884d8" activeBar={<Rectangle fill="gold" stroke="purple" />} onMouseEnter={onBarEnter} onClick={seeFloor}/>
            </BarChart>
        </div>
      );
}

export default BarComp;