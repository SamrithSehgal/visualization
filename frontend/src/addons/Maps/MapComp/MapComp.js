import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Button, Stack } from '@mui/material'
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON, Polygon } from 'react-leaflet'
import { getInit } from '../../../pages/Displays/DbHandler/db';
import {getGeo} from './DataHolder'
import "./MapComp.css"

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

    //console.log(polygons)
    var polygons = []
    Object.keys(mapData["1"]).map((key, index) => {
        var buildingDict = {}
        buildingDict["name"] = mapData["1"][key]["name"]
        buildingDict["verticies"] = mapData["1"][key]["polygon"]
        buildingDict["spaceId"] = Number(key)
        buildingDict["occupancy"] = mapData["1"][key]["total"]
        polygons.push(buildingDict)
    })

    function getCenter(verticies){
        var centerX = 0
        var centerY = 0

        for(var point of verticies){
            centerX += point[0]
            centerY += point[1]
        }

        centerX /= verticies.length
        centerY /= verticies.length

        return [centerX, centerY]
    }

    var allBuildings = {}
    var centers = []
    var currentPoly = 1

    for(var polygon of polygons){
        var polyInfo = {}
        var centerInfo = {}
        var points = []
        var verticies = polygon['verticies'].split('"')
        const verticiesLen = verticies.length
        verticies.pop()
        for(var i = 0; i < verticiesLen-1; i++){
            if(verticies[i].includes("(")){
                var curVert = verticies[i].slice(1, -1) // Remove the outer parentheses
                .split(',') // Split by the comma
                .map(item => {
                  const trimmed = item.trim(); // Remove whitespace
                  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
                    return trimmed.slice(1, -1); // Handle string values
                  } else if (!isNaN(trimmed)) {
                    return Number(trimmed); // Handle numeric values
                  } else if (trimmed === "true" || trimmed === "false") {
                    return trimmed === "true"; // Handle boolean values
                  }
                  return trimmed; // Return as-is for other cases
                }) 
                curVert.pop()
                points.push(curVert)
            }
        }

        var centerPoint = getCenter(points)
        centerInfo["index"] = (currentPoly-1)
        centerInfo["center"] = centerPoint
        centerInfo["name"] = polygon["name"]
        centers.push(centerInfo)

        polyInfo["points"] = points
        polyInfo["name"] = polygon["name"]
        polyInfo["spaceId"] = polygon["spaceId"]
        polyInfo["occupancy"] = polygon["occupancy"]
        allBuildings[`Building_${polygon["spaceId"]}`] = polyInfo
        currentPoly++
    }
    console.log(allBuildings)

    //const initData = getInit(mapData, 0)[0]
    /*for(var data of initData){
        buildingLocs[data.id].occupancy = data.occupancy
    }*/

    const [curIndex, setIndex] = useState(curMap)


    function changeBuilding(loc){
        setMap(loc)
        setIndex(loc)
    }

    function seeFloors(spaceId){
        //var resData = getData(1, mapData, 0, 0, initData[curIndex].nextLvl)
        //navigate('/floors', {state: {data: allData,floorData: resData[0], title: resData[1].replaceAll("_", " "), curMap: curIndex}})
        //setData(initData[floorIndex].nextLvl)
        //setLvl(1)
        console.log(spaceId)
        var floors = mapData["1"][`${spaceId}`]["nextLvl"]
        var validFloors = []
        var floorIndex = 1

        for(var floor of floors){
            var floorData = mapData["2"][`${floor}`]
            floorData["name"] = `Floor ${floorIndex}`
            floorData["index"] = floorIndex
            floorData["spaceId"] = floor
            floorData["verticies"] = allBuildings[`Building_${spaceId}`]["points"]
            validFloors.push(floorData)
            floorIndex++
        }
        setData([validFloors, mapData["1"][`${spaceId}`]["name"]])
        setLvl(1)
    }

    return ( 
        <div id='allMap'>
            <div id='buildingDropdown'>
                <FormControl fullWidth sx={{backgroundColor: "white"}}>
                    <Select
                        value={centers[curIndex].name}
                        onChange={(info) => {changeBuilding(info.target.value)}}
                        renderValue={(value) => (<MenuItem value={value}>{value}</MenuItem>)}
                    >
                        {centers.map((building) => (
                            <MenuItem value={building.index}>{building.name}</MenuItem>
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
                    {Object.keys(allBuildings).map((key, index) => (
                        <Polygon positions={allBuildings[key]['points']}>
                            <Popup>
                                <Stack direction={"column"} spacing={2}>
                                    <MenuItem value={allBuildings[key]["name"]}>{allBuildings[key]["name"]}, Occupancy: {allBuildings[key]["occupancy"]}</MenuItem>
                                    <Button variant='contained' onClick={() => {seeFloors(allBuildings[key]["spaceId"])}}>See Floors</Button>
                                </Stack>
                            </Popup>
                        </Polygon>
                        //console.log(`Key: ${key}, Value: ${allBuildings[key]}, Index: ${index}`)
                    ))}
                    <RecenterAutomatically ll={centers[curIndex].center}/>
                </MapContainer>       
            </div>
        </div>
     );
}

export default MapComp;

/*                    {buildingLocs.map((building) => (
                        <GeoJSON data={getGeo(building.bLocation)}>
                            <Popup>
                                <Stack direction={"column"} spacing={2}>
                                    <MenuItem value={building.bName}>{building.bName}, Occupancy: {building.occupancy}</MenuItem>
                                    <Button variant='contained' onClick={() => {seeFloors(building.bLocation)}}>See Floors</Button>
                                </Stack>
                            </Popup>                        
                        </GeoJSON>
                    ))}

*/