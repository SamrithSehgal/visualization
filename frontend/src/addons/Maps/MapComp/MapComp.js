import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import { FormControl, InputLabel, Select, MenuItem, Button, Stack, Menu } from '@mui/material'
import { getInit } from '../../../pages/Displays/DbHandler/db';
import "./MapComp.css"
import { useLocation, useNavigate } from 'react-router-dom';
import { getData } from '../../../pages/Displays/DbHandler/db';

const RecenterAutomatically = ({ll}) => {
    const map = useMap();
    useEffect(() => {
        map.setView(ll);
    }, [ll]);
    return null;
}

function MapComp({mapData, setLvl, setData, curMap, setMap}) {


    var buildingLocs = [
        {bName: "Donald Bren Hall", bLoc: [33.64380884254004, -117.84222307979927], bLocation: 0},
        {bName: "Ashwins House", bLoc: [33.64439038695974, -117.83026620385728], bLocation: 1},
        {bName: "Heaven", bLoc: [36.11316215621086, -115.17646378765673], bLocation: 2},
        {bName: "Library", bLoc: [51.754219085919, -1.2540527311589922], bLocation: 3},
        {bName: "Hell", bLoc: [33.86410784557284, -118.20689285767119], bLocation: 4},
        {bName: "ICS Lab", bLoc: [-47.64437174182548, -124.06381393111971], bLocation: 5},
        {bName: "Newtons Lab", bLoc: [52.20703951741458, 0.11687008235650502], bLocation: 6},
        {bName: "Harvard", bLoc: [42.37498723797886, -71.11799976836872], bLocation: 7},
        {bName: "UK Parliment", bLoc: [51.499546161099154, -0.12466972747308884], bLocation: 8},
        {bName: "White House", bLoc: [38.89791006899353, -77.03644397220845], bLocation: 9},
    ]
//        {bName: "ICS Lab", bLoc: []},


    const initData = getInit(mapData, 0)[0]
    for(var data of initData){
        buildingLocs[data.id].occupancy = data.occupancy
    }

    const [curIndex, setIndex] = useState(curMap)

    function changeBuilding(loc){
        setMap(loc)
        setIndex(loc)
    }

    function seeFloors(){
        //var resData = getData(1, mapData, 0, 0, initData[curIndex].nextLvl)
        //navigate('/floors', {state: {data: allData,floorData: resData[0], title: resData[1].replaceAll("_", " "), curMap: curIndex}})
        setData(initData[curIndex].nextLvl)
        setLvl(1)
    }


    return ( 
        <div id='allMap'>
            <div id='buildingDropdown'>
                <FormControl fullWidth sx={{backgroundColor: "white"}}>
                    <Select
                        value={buildingLocs[curIndex].bName}
                        onChange={(info) => {changeBuilding(info.target.value)}}
                        renderValue={(value) => (<MenuItem value={value}>{value}</MenuItem>)}
                    >
                        {buildingLocs.map((building) => (
                            <MenuItem value={building.bLocation}>{building.bName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>            
            </div>
            <div id='mapDisplay'>
                <MapContainer center={[0, 0]} zoom={18} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={buildingLocs[curIndex].bLoc}>
                        <Popup>
                            <Stack direction={"column"} spacing={2}>
                                <MenuItem value={buildingLocs[curIndex].bName}>{buildingLocs[curIndex].bName}, Occupancy: {buildingLocs[curIndex].occupancy}</MenuItem>
                                <Button variant='contained' onClick={seeFloors}>See Floors</Button>
                            </Stack>
                        </Popup>
                    </Marker>
                    <Circle center={buildingLocs[curIndex].bLoc} radius={100} />
                    <RecenterAutomatically ll={buildingLocs[curIndex].bLoc}/>
                </MapContainer>       
            </div>
        </div>
     );
}

export default MapComp;