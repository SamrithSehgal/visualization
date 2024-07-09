import React, {useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';
import "./Graph.css"
import {getInit, moveDownLvl, moveUpLvl, getTimes} from "../DbHandler/db.js"
import PieComp from '../../../addons/Graphs/PieComp/PieComp.jsx';
import BarComp from '../../../addons/Graphs/BarComp/BarComp.jsx';
import LineComp from '../../../addons/Graphs/LineComp/LineComp.jsx';
import FunnelComp from '../../../addons/Graphs/FunnelComp/FunnelComp.jsx';
import ScatterComp from '../../../addons/Graphs/ScatterComp/ScatterComp.jsx';

function Graph() {

    const location = useLocation()
    const chartId = useRef(location.state.chart)  
    console.log(location.state.data)  

    const curLvl = useRef(-1)
    const parentLvl = useRef(-1)
    const [curName, setName] = useState("")

    const floorParent = useRef([])
    const roomParent = useRef([])
    const [atParent, setAt] = useState(true)
    const [atTime, setTime] = useState(false)
    const timeRange = useRef([])
    
    function getInitData(data){
        var initData = []
        if(chartId.current == 4){
            initData = getInit(data, curLvl.current)
            var lvlData = getTimes(data, initData[0])
            var timeData = lvlData[0]
            timeRange.current = lvlData[1] //[lvlData[1][0], lvlData[1][lvlData[1].length - 1]]

            return timeData
        }
        else{
            initData = getInit(data, curLvl.current)
        }
        var resData = initData[0]
        var pLvl = initData[1]
        if(initData[2].length != 0){
            floorParent.current = initData[2]
        }
        if(initData[3].length != 0){
            roomParent.current = initData[3]
        }        
        if(curLvl.current == -1){
            curLvl.current = pLvl
            parentLvl.current = pLvl
        }
        return resData
    }

    const [graphData, setData] = useState(getInitData(location.state.data))

    function moveDown(indexes = [], areaName = ""){
        var lvlData = moveDownLvl(curLvl.current, location.state.data, parentLvl.current, indexes, areaName, curName)
        console.log(lvlData[0])
        var resData = []
        if(lvlData[5]){
            resData = lvlData[0]
            var newLvl = lvlData[1]
            console.log(resData)

            if(lvlData[3].length != 0){
                floorParent.current = lvlData[3]
            }
            if(lvlData[4].length != 0){
                roomParent.current = lvlData[4]
            }

            if(newLvl != parentLvl.current){
                setAt(false)
            }
            if(newLvl == 3){
                setTime(true)
            }

            setData(resData)
            curLvl.current = newLvl

            if(newLvl == parentLvl.current){
                setName("")
            }
            else{
                setName(lvlData[2])
            }
        }
        return [resData, lvlData[5]]
    }

    function moveUp(){
        if(curLvl.current==3){setTime(false)}
        var lvlData = moveUpLvl(curLvl.current, location.state.data, curName, parentLvl.current, roomParent.current, floorParent.current)

        var resData = lvlData[0]
        setData(resData)
        curLvl.current = lvlData[1]
        setName(lvlData[2])

        if(lvlData[1] != parentLvl.current){
            setAt(false)
        }
        else{
            setAt(true)
        }

        return resData
    }


    const CustomTip = (info) =>{
        if(info.payload.length != 0){
          var toolData = info.payload[0].payload
          return(
            <div className='custom-tooltip' style={{backgroundColor: 'white', padding: '5%', width: '110%', height: '80%'}}>
              {(toolData.date == undefined) ?
                <p className='label'>Name: {toolData.name}</p>
                :
                <div>
                  <p className='label'>Time: {toolData.name}</p>
                  <p className='label'>Date: {toolData.date}</p>
                </div>
              }
              <p className='label' style={{color: '#8884d8'}}>Occ: {toolData.occupancy}</p>
            </div>
          )
        }
    }

    let chart;
    function getChart(){
        switch(chartId.current){
            case 0: //Bar
                chart = <div id='barHolder'><BarComp graphData={graphData} curName={curName} moveDown={moveDown} moveUp={moveUp} atParent={atParent} CustomTip={CustomTip}/></div>
                break
            case 1: //Pie
                chart = <div id='pieHolder'><PieComp graphData={graphData} moveDown={moveDown} moveUp={moveUp} atParent={atParent}/></div>
                break
            case 2: //Line
                chart = <div id='lineHolder'><LineComp graphData={graphData} moveDown={moveDown} moveUp={moveUp} atParent={atParent} CustomTip={CustomTip}/></div>
                break
            case 3: //Funnel
                chart = <div id='funnelHolder'><FunnelComp graphData={graphData} moveDown={moveDown} moveUp={moveUp} atParent={atParent} atTime={atTime} CustomTip={CustomTip}/></div>
                break
            case 4: //Scatter
                chart = <div id='scatterHolder'><ScatterComp graphData={graphData} timeRange={timeRange.current}/></div>
                break
        }
    }
    getChart()

    return (
        <div id='graphWrapper'>
            <div id='titleHolder'>
                <h1>{curName}</h1>
            </div>
            {chart}
        </div>
    );
}

export default Graph;