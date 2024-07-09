import React, { useEffect, useRef, useState } from 'react';
import MapComp from "../../../addons/Maps/MapComp/MapComp"
import FloorComp from "../../../addons/Maps/FloorComp/FloorComp"
import RoomComp from '../../../addons/Maps/RoomComp/RoomComp';
import { useLocation } from 'react-router-dom';
import { getData } from '../DbHandler/db';
import axios from 'axios'
import './OccMap.css'
import { Button } from '@mui/material';
import DBH from "../../Building/DBH.jpeg"

function OccMap() {

    var location = useLocation()

    const [curLvl, setLvl] = useState(0)
    const [curData, setData] = useState(location.state.data)
    const floorIndexes = useRef([])
    const [curElement, setElement] = useState()
    const [curMap, setMap] = useState(0)
    const [roomLocs, setLocs] = useState([])

    useEffect(() => {
        switch(curLvl){
            case 0:
                setElement(<MapComp mapData={location.state.data} setLvl={setLvl} setData={setData} curMap={curMap} setMap={setMap}/>)
                break
            case 1:
                var floorData = getData(1, location.state.data, 0, 0, curData)
                floorIndexes.current = curData
                setElement(<FloorComp data={floorData[0]} title={floorData[1].replaceAll("_", " ")} setLvl={setLvl} setRoomData={setData} setLocs={setLocs}/>)
                break
            case 2:
                var roomData = getData(2, location.state.data, 0, 1, curData)
                setElement(<RoomComp roomData={roomData[0]} roomLocs={roomLocs} setLvl={setLvl} setData={setData} floorIndexes={floorIndexes.current}/>)
        }
    }, [curLvl])

    //            {curElement}

    const [curImg, setImg] = useState(false)

    //
    //<img src={curImg} style={{right: "43%", top: "10%",position: 'absolute'}}/>
    return ( 
        <div>
            {curElement}
        </div>
     );
}

export default OccMap;