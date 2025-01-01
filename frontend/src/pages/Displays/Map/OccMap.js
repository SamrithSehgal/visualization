import React, { useEffect, useRef, useState } from 'react';
import MapComp from "../../../addons/Maps/MapComp/MapComp"
import FloorComp from "../../../addons/Maps/FloorComp/FloorComp"
import RoomComp from '../../../addons/Maps/RoomComp/RoomComp';
import { useLocation } from 'react-router-dom';
import { getData } from '../DbHandler/db';
import './OccMap.css'


function OccMap() {

    var location = useLocation()

    const [curLvl, setLvl] = useState(0)
    const [curData, setData] = useState(location.state.data)
    const [floorIndexes, setIndexes] = useState([])
    const [curElement, setElement] = useState()
    const [curMap, setMap] = useState(0)
    const [roomLocs, setLocs] = useState([])

    useEffect(() => {
        console.log(curLvl)
        switch(curLvl){
            case 0:
                setElement(<MapComp mapData={location.state.data} setLvl={setLvl} setData={setData} curMap={curMap} setMap={setMap}/>)
                break
            case 1:
                setElement(<FloorComp data={curData[0]} title={curData[1]} setLvl={setLvl} setRoomData={setData} setLocs={setLocs}/>)
                break
            case 2:
                var roomData = getData(2, location.state.data, 0, 1, curData)
                setElement(<RoomComp roomData={roomData[0]} roomLocs={roomLocs} setLvl={setLvl} setData={setData} floorIndexes={floorIndexes}/>)
                break
        }
    }, [curLvl])

    return ( 
        <div>
            {curElement}
        </div>
     );
}

export default OccMap;