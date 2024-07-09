import React, {useCallback, useState, useRef} from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ZAxis } from 'recharts';
import { Button } from '@mui/material';
import "./BarComp.css"


function BarComp({graphData, moveDown, moveUp, atParent, CustomTip}) {

  return (
      <div>
          {!atParent &&
            <Button id="collapseBars" variant="contained" onClick={moveUp}>Go Back</Button>
          }
          <BarChart
            width={1000}
            height={600}
            data={graphData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis dataKey="occupancy"/>
            <Tooltip content={<CustomTip />}/>
            <Legend />
            <Bar dataKey="occupancy" fill="#8884d8" activeBar={<Rectangle fill="gold" stroke="purple" />} onClick={(info) => {moveDown(info.nextLvl, info.name); console.log(info)}}/>
          </BarChart>
      </div>
    );
}

export default BarComp;