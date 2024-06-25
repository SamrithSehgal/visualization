import { Button } from '@mui/material';
import React, {useState, useRef} from 'react';
import { FunnelChart, Tooltip, Funnel, LabelList } from 'recharts';

function FunnelComp({buildingData, timeData}) {

    const [floorData, setFloorData] = useState(buildingData)
    const floorOpen = useRef(false)

    var colors = ["#50998c", "#1ea3af", "#ed4314", "#893b75", "#f42721", "#06a6d0", "#3ee6c7", "#95b5f3", "#753791", "#3232fe", "#14f00c", "#2041b3", "#e922ae", "#db8540", "#ab343d", "#fdfe56", "#6a31db", "#11d997", "#f9436c", "#c535c4", "#8726f8", "#1b645a", "#cd4763", "#e44f31", "#d567fc"]

    for(var i = 0; i < buildingData.length; i++){
        buildingData[i]["fill"] = colors[i]
    }

    function seeFloor(data){

        if(!floorOpen.current){
          var curFloorData = []
          var activeIndex = data["payload"]["payload"]["Floor"]
          var count = 0
          for(var i = 0; i < timeData.length; i++){
            if(timeData[i]["Floor"] == activeIndex){
              timeData[i].name = timeData[i].time + ":00"
              timeData[i]["fill"] = colors[count]
              curFloorData.push(timeData[i])
              count += 1
            }
          }
          setFloorData(curFloorData)
          floorOpen.current = true
        }
    }

    function seeBuilding(){
        for(var i = 0; i < buildingData.length; i++){
          buildingData[i].name = "Floor " + buildingData[i]["Floor"]
          buildingData[i]["fill"] = colors[i]
        }
        setFloorData(buildingData)
        console.log(buildingData)
        floorOpen.current = false
    }


    return (
        <div>
            {floorOpen.current &&
                <Button id="collapseFunnel" variant="contained" onClick={seeBuilding}>Go Back</Button>
            }
            <FunnelChart width={1030} height={600}>
                <Tooltip />
                <Funnel
                    dataKey="pop"
                    data={floorData}
                    isAnimationActive
                    onClick={(info) => {seeFloor(info)}}
                    width={800}
                >
                    <LabelList position="inside" fill="#000" stroke="none" dataKey="name" />
                </Funnel>
            </FunnelChart>
        </div>
    );
}

export default FunnelComp;