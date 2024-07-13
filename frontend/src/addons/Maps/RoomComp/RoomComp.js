import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Rectangle } from 'react-leaflet'
import "./RoomComp.css"
import { Button } from '@mui/material';

function RoomComp({roomData, roomLocs, setLvl, setData, floorIndexes}) {

    const hasLoaded = useRef(false)

    useEffect(() => {hasLoaded.current = true})

    function seeFloors(){
        if(hasLoaded.current){
            setData(floorIndexes)
            setLvl(1)
        }
    }

    function generateRect(curLocs){
        return(
            [
                [curLocs[0]-15, curLocs[1]-15],
                [curLocs[0]+18, curLocs[1]+18]
            ]
        )
    }

    const rectangleData = [
        [-38, -52],
        [-5, -19],
    ]

    return ( 
        <div>
            <Button variant='contained' id='floorBtn' onClick={() => seeFloors()}>Go Back</Button>
            <MapContainer center={[0, 0]} zoom={3} scrollWheelZoom={false}>
                <TileLayer url={"../Floorplans/curFloor/{z}/{x}/{y}.png"} attribution='The Goat' noWrap/>
                {roomData.map((room, index) => (
                    <Rectangle bounds={generateRect(roomLocs[index].locs)}>
                        <Popup>
                            {room.name}, Occupancy: {room.occupancy}
                        </Popup>
                    </Rectangle>                
                ))}
            </MapContainer>
        </div>
    );
}

export default RoomComp;