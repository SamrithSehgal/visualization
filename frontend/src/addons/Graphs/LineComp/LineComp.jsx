import { Button } from "@mui/material";
import React, {useState, useRef, useCallback} from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
import "./LineComp.css"


export default function LineComp({graphData, moveDown, moveUp, atParent, CustomTip}) {


  return (
    <div>
        {!atParent &&
            <Button id="collapseLine" variant="contained" onClick={moveUp}>Go Back</Button>
        }
        <LineChart width={1000} height={700} data={graphData} margin={{top:20}} onClick={(data) => moveDown(data.activePayload[0].payload.nextLvl, data.activeLabel)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 60, right: 30 }} />
        <YAxis />
        <Tooltip content={<CustomTip />}/>
        <Legend />
        <Line
            type="monotone"
            dataKey="occupancy"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
        />
        </LineChart>
    </div>
  );
}
