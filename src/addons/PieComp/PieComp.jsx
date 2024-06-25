import { Button } from "@mui/material";
import React, { useCallback, useState, useRef} from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";
import "./PieComp.css"

//Source: https://recharts.org/en-US/examples/CustomActiveShapePieChart 
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    pop
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy-20} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Occupancy: ${pop}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Percent: ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function PieComp({buildingData, timeData}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [floorActive, setFloorActive] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const [floorData, setFloorData] = useState(buildingData)
  const floorOpen = useRef(false)

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
    setFloorActive(activeIndex)
  }

  function seeBuilding(){
    for(var i = 0; i < buildingData.length; i++){
      buildingData[i].name = "Floor " + buildingData[i]["Floor"]
    }
    setFloorData(buildingData)
    console.log(buildingData)
    floorOpen.current = false
    setActiveIndex(floorActive)
  }
  
  var colors = ["#50998c", "#1ea3af", "#ed4314", "#893b75", "#f42721", "#06a6d0", "#3ee6c7", "#95b5f3", "#753791", "#3232fe", "#14f00c", "#2041b3", "#e922ae", "#db8540", "#ab343d", "#fdfe56", "#6a31db", "#11d997", "#f9436c", "#c535c4", "#8726f8", "#1b645a", "#cd4763", "#e44f31", "#d567fc"]

  return (
    <div>
      {floorOpen.current &&
        <Button id="buildingBtn" variant="contained" onClick={seeBuilding}>Go Back</Button>
      }
      <PieChart width={1400} height={900} onClick={seeFloor} id="PieChart">
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={floorData}
          cx={570}
          cy={490}
          innerRadius={270}
          outerRadius={290}
          fill="#3d6ee0"
          dataKey="pop"
          onMouseEnter={onPieEnter}
          id="PieData"
          animationDuration={300}
        >
          {
            floorData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]}/>
            ))
          }
        </Pie>
      </PieChart>
    </div>
  );
}
