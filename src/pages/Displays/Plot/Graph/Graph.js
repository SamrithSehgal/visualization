import React, {useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';
import "./Graph.css"
import PieComp from '../../../../addons/PieComp/PieComp';
import BarComp from '../../../../addons/BarComp/BarComp';
import LineComp from '../../../../addons/LineComp/LineComp';
import FunnelComp from '../../../../addons/FunnelComp/FunnelComp';
import ScatterComp from '../../../../addons/ScatterComp/ScatterComp';
import SideBar from '../../../../addons/SideBar/SideBar';

function Graph() {

    const location = useLocation()
    var allBuildingData = [
        {"time": 0, "data": [
            {"id": 0, "Floor": 1, name: "Floor 1", pop: 153},
            {"id": 1, "Floor": 2, name: "Floor 2", pop: 83},
            {"id": 2, "Floor": 3, name: "Floor 3", pop: 204},
            {"id": 3, "Floor": 4, name: "Floor 4", pop: 349},
        ]},
        {"time": 1, "data": [
            {"id": 4, "Floor": 1, name: "Floor 1", pop: 124},
            {"id": 5, "Floor": 2, name: "Floor 2", pop: 77},
            {"id": 6, "Floor": 3, name: "Floor 3", pop: 106},
            {"id": 7, "Floor": 4, name: "Floor 4", pop: 251},
        ]},
        {"time": 2, "data": [
            {"id": 8, "Floor": 1, name: "Floor 1", pop: 39},
            {"id": 9, "Floor": 2, name: "Floor 2", pop: 19},
            {"id": 10, "Floor": 3, name: "Floor 3", pop: 60},
            {"id": 11, "Floor": 4, name: "Floor 4", pop: 37},
        ]},
        {"time": 3, "data": [
            {"id": 12, "Floor": 1, name: "Floor 1", pop: 32},
            {"id": 13, "Floor": 2, name: "Floor 2", pop: 67},
            {"id": 14, "Floor": 3, name: "Floor 3", pop: 58},
            {"id": 15, "Floor": 4, name: "Floor 4", pop: 76}
        ]},
        {"time": 4, "data": [
            {"id": 0, "Floor": 1, name: "Floor 1", pop: 56},
            {"id": 1, "Floor": 2, name: "Floor 2", pop: 72},
            {"id": 2, "Floor": 3, name: "Floor 3", pop: 81},
            {"id": 3, "Floor": 4, name: "Floor 4", pop: 92},
        ]},
        {"time": 5, "data": [
            {"id": 4, "Floor": 1, name: "Floor 1", pop: 70},
            {"id": 5, "Floor": 2, name: "Floor 2", pop: 91},
            {"id": 6, "Floor": 3, name: "Floor 3", pop: 101},
            {"id": 7, "Floor": 4, name: "Floor 4", pop: 113},
        ]},
        {"time": 6, "data": [
            {"id": 8, "Floor": 1, name: "Floor 1", pop: 120},
            {"id": 9, "Floor": 2, name: "Floor 2", pop: 145},
            {"id": 10, "Floor": 3, name: "Floor 3", pop: 170},
            {"id": 11, "Floor": 4, name: "Floor 4", pop: 197},
        ]},
        {"time": 7, "data": [
            {"id": 12, "Floor": 1, name: "Floor 1", pop: 122},
            {"id": 13, "Floor": 2, name: "Floor 2", pop: 155},
            {"id": 14, "Floor": 3, name: "Floor 3", pop: 163},
            {"id": 15, "Floor": 4, name: "Floor 4", pop: 210}
        ]},
        {"time": 8, "data": [
            {"id": 0, "Floor": 1, name: "Floor 1", pop: 145},
            {"id": 1, "Floor": 2, name: "Floor 2", pop: 180},
            {"id": 2, "Floor": 3, name: "Floor 3", pop: 202},
            {"id": 3, "Floor": 4, name: "Floor 4", pop: 248},
        ]},
        {"time": 9, "data": [
            {"id": 4, "Floor": 1, name: "Floor 1", pop: 156},
            {"id": 5, "Floor": 2, name: "Floor 2", pop: 199},
            {"id": 6, "Floor": 3, name: "Floor 3", pop: 208},
            {"id": 7, "Floor": 4, name: "Floor 4", pop: 289},
        ]},
        {"time": 10, "data": [
            {"id": 8, "Floor": 1, name: "Floor 1", pop: 210},
            {"id": 9, "Floor": 2, name: "Floor 2", pop: 263},
            {"id": 10, "Floor": 3, name: "Floor 3", pop: 307},
            {"id": 11, "Floor": 4, name: "Floor 4", pop: 356},
        ]},
        {"time": 11, "data": [
            {"id": 12, "Floor": 1, name: "Floor 1", pop: 225},
            {"id": 13, "Floor": 2, name: "Floor 2", pop: 293},
            {"id": 14, "Floor": 3, name: "Floor 3", pop: 336},
            {"id": 15, "Floor": 4, name: "Floor 4", pop: 391}
        ]},
        {"time": 12, "data": [
            {"id": 0, "Floor": 1, name: "Floor 1", pop: 253},
            {"id": 1, "Floor": 2, name: "Floor 2", pop: 276},
            {"id": 2, "Floor": 3, name: "Floor 3", pop: 331},
            {"id": 3, "Floor": 4, name: "Floor 4", pop: 368},
        ]},
        {"time": 13, "data": [
            {"id": 4, "Floor": 1, name: "Floor 1", pop: 233},
            {"id": 5, "Floor": 2, name: "Floor 2", pop: 291},
            {"id": 6, "Floor": 3, name: "Floor 3", pop: 342},
            {"id": 7, "Floor": 4, name: "Floor 4", pop: 364},
        ]},
        {"time": 14, "data": [
            {"id": 8, "Floor": 1, name: "Floor 1", pop: 219},
            {"id": 9, "Floor": 2, name: "Floor 2", pop: 273},
            {"id": 10, "Floor": 3, name: "Floor 3", pop: 312},
            {"id": 11, "Floor": 4, name: "Floor 4", pop: 348},
        ]},
        {"time": 15, "data": [
            {"id": 12, "Floor": 1, name: "Floor 1", pop: 220},
            {"id": 13, "Floor": 2, name: "Floor 2", pop: 273},
            {"id": 14, "Floor": 3, name: "Floor 3", pop: 319},
            {"id": 15, "Floor": 4, name: "Floor 4", pop: 377}
        ]},
        {"time": 16, "data": [
            {"id": 0, "Floor": 1, name: "Floor 1", pop: 228},
            {"id": 1, "Floor": 2, name: "Floor 2", pop: 294},
            {"id": 2, "Floor": 3, name: "Floor 3", pop: 321},
            {"id": 3, "Floor": 4, name: "Floor 4", pop: 368},
        ]},
        {"time": 17, "data": [
            {"id": 4, "Floor": 1, name: "Floor 1", pop: 224},
            {"id": 5, "Floor": 2, name: "Floor 2", pop: 297},
            {"id": 6, "Floor": 3, name: "Floor 3", pop: 317},
            {"id": 7, "Floor": 4, name: "Floor 4", pop: 355},
        ]},
        {"time": 18, "data": [
            {"id": 8, "Floor": 1, name: "Floor 1", pop: 248},
            {"id": 9, "Floor": 2, name: "Floor 2", pop: 312},
            {"id": 10, "Floor": 3, name: "Floor 3", pop: 345},
            {"id": 11, "Floor": 4, name: "Floor 4", pop: 379},
        ]},
        {"time": 19, "data": [
            {"id": 12, "Floor": 1, name: "Floor 1", pop: 286},
            {"id": 13, "Floor": 2, name: "Floor 2", pop: 341},
            {"id": 14, "Floor": 3, name: "Floor 3", pop: 382},
            {"id": 15, "Floor": 4, name: "Floor 4", pop: 401}
        ]},
        {"time": 20, "data": [
            {"id": 0, "Floor": 1, name: "Floor 1", pop: 281},
            {"id": 1, "Floor": 2, name: "Floor 2", pop: 337},
            {"id": 2, "Floor": 3, name: "Floor 3", pop: 386},
            {"id": 3, "Floor": 4, name: "Floor 4", pop: 399},
        ]},
        {"time": 21, "data": [
            {"id": 4, "Floor": 1, name: "Floor 1", pop: 275},
            {"id": 5, "Floor": 2, name: "Floor 2", pop: 309},
            {"id": 6, "Floor": 3, name: "Floor 3", pop: 378},
            {"id": 7, "Floor": 4, name: "Floor 4", pop: 385},
        ]},
        {"time": 22, "data": [
            {"id": 8, "Floor": 1, name: "Floor 1", pop: 245},
            {"id": 9, "Floor": 2, name: "Floor 2", pop: 263},
            {"id": 10, "Floor": 3, name: "Floor 3", pop: 349},
            {"id": 11, "Floor": 4, name: "Floor 4", pop: 321},
        ]},
        {"time": 23, "data": [
            {"id": 12, "Floor": 1, name: "Floor 1", pop: 186},
            {"id": 13, "Floor": 2, name: "Floor 2", pop: 201},
            {"id": 14, "Floor": 3, name: "Floor 3", pop: 288},
            {"id": 15, "Floor": 4, name: "Floor 4", pop: 273}
        ]}
    ]
    
    var timeRangeData = []

    function initData(){
        var parsedData = []
        for(var i = 0; i < allBuildingData.length; i++){
            if(allBuildingData[i]["time"] >= location.state.timeRange[0] && allBuildingData[i]["time"] <= location.state.timeRange[1]){
                for(var j = 0; j < allBuildingData[i]["data"].length; j++){
                    parsedData.push(allBuildingData[i]["data"][j])
                    parsedData[parsedData.length-1]["time"] = allBuildingData[i]["time"]
                }
            }
        }
        timeRangeData = parsedData
        parsedData.sort((a,b) => a.Floor - b.Floor);

        var avgData = []
        var floorSum = 0
        var count = 0
        var prevFloor = parsedData[0]["Floor"]
        for(var j = 0; j < parsedData.length; j++){
            if(parsedData[j]["Floor"] != prevFloor){
                var finalFloor = parsedData[j-1]
                finalFloor.pop = Math.floor(floorSum/count)
                avgData.push(finalFloor)
                floorSum = parsedData[j].pop
                count = 0
            }
            else{
                floorSum += parsedData[j].pop
                count += 1
                if(j == parsedData.length-1){
                    var finalFloor = parsedData[j-1]
                    finalFloor.pop = Math.floor(floorSum/count)
                    avgData.push(finalFloor)                    
                }
            }
            prevFloor = parsedData[j]["Floor"]
        }

        return avgData
    }

    var buildingData = initData()
    const chartId = useRef(location.state.chartId)
    //Add other buildings data
    
    let chart;
    function getChart(){
        switch(chartId.current){
            case 0: //Bar
                chart = <div id='barHolder'><BarComp buildingData={buildingData} timeData={timeRangeData}/></div>
                break
            case 1: //Pie
                chart = <div id='pieHolder'><PieComp buildingData={buildingData} timeData={timeRangeData}/></div>
                break
            case 2: //Line
                chart = <div id='lineHolder'><LineComp buildingData={buildingData} timeData={timeRangeData}/></div>
                break
            case 3: //Funnel
                chart = <div id='funnelHolder'><FunnelComp buildingData={buildingData} timeData={timeRangeData}/></div>
                break
            case 4: //Scatter
                chart = <div id='scatterHolder'><ScatterComp timeData={timeRangeData}/></div>
                break
        }
    }
    getChart()

    return (
        <div id='graphWrapper'>
            <div id='sideBarWrapper'>
                <SideBar isGraph={true} buildingId={1} timeRange={location.state.timeRange} chosenChart={chartId.current}/>
            </div>
            {chart}
        </div>
    );
}

export default Graph;