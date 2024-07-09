import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import axios from 'axios';
import "./RoomComp.css"
import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

function RoomComp({roomData, roomLocs, setLvl, setData, floorIndexes}) {

    const [curLoc, setLoc] = useState([-1, -1])

    function goBack(){
        //navigate("/floors", {state: {data: location.state.data, floorData: location.state.floorData, title: location.state.building, curMap: location.state.curMap}})
        setData(floorIndexes)
        setLvl(1)
    }

    
    return ( 
        <div>
            <Button variant='contained' id='floorBtn' onClick={() => goBack()}>Go Back</Button>
            <MapContainer center={[0, 0]} zoom={3} scrollWheelZoom={false}>
                <TileLayer url={"../Floorplans/curFloor/{z}/{x}/{y}.png"} attribution='The Goat' noWrap/>
                {roomData.map((room, index) => (
                    <Marker position={roomLocs[index].locs}>
                        <Popup>
                            {room.name}, Occupancy: {room.occupancy}
                        </Popup>
                    </Marker>                
                ))}

            </MapContainer>
        </div>
    );
}

export default RoomComp;