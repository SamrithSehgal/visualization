import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from "@react-three/fiber"
import { Edges, Html, OrbitControls } from "@react-three/drei"
import "./FloorComp.css"
import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getData } from '../../../pages/Displays/DbHandler/db';

function FloorComp({data, allData, title, setLvl, setRoomData, setLocs}) {

    const roomAble = useRef(true)

    const colors = ["#F179AD", "#EF4E9B","#E43983","#ED4968","#F04543","#A64D9D","#7A5CA4","#2263AF"]

    const [floorsData, setData] = useState([])

    useEffect(() => {
        var newData = []
        for(var floor of data){
            newData.push({name: floor.name, occupancy: floor.occupancy, index: (floor.id+1), location: floor.floorId, nextLvl: floor.nextLvl})
        }
        setData(newData)
    }, [])

    const prevFloor = useRef(null)
    const highlightedColor = new THREE.Color("red")
    const cubeColor = new THREE.Color("#797978")

    function highlightFloor(info){
        info.stopPropagation()
        if(prevFloor.current != null){
            if(info.object.uuid != prevFloor.current.uuid){
                prevFloor.current.material.color.set(new THREE.Color(colors[(prevFloor.current.name-1)]))
                prevFloor.current = info.object
                info.object.material.color.set(highlightedColor)
            }
        }
        else{
            prevFloor.current = info.object
            info.object.material.color.set(highlightedColor)
        }
    }
    
    function goBack(){
        setLvl(0)
    }

    function seeRooms(floor){ //Fix the whole 2 onclicked shits
        //console.log(roomAble.current)
        if(roomAble.current == true){
            axios.post("http://localhost:8888/getImg", {floorId: floor.location}).then((imgRes) =>{
                axios.post("http://localhost:8888/getRooms", {nextLvl: floor.nextLvl}).then((roomRes) => {
                    //navigate("/rooms", {state: {data: location.state.data, roomData: resData[0], title: resData[1], curFloor: floor.location, roomLocs: roomRes.data.data, floorData: data, curMap: location.state.curMap, building: title}})
                    setRoomData(floor.nextLvl)
                    setLocs(roomRes.data.data)
                    setLvl(2)
                })            
            })
            roomAble.current = false
        }
        else{
            roomAble.current = true
        }
    }

    return (
        <div id='mapHolder'>
            <div id='Floors'>
                <Button variant='contained' id='mapBtn' onClick={() => goBack()}>Go Back</Button>
                <Canvas camera={{fov: 25, near: 0.1, far: 1000, position: [-1.5, 1.75, 3.2], rotation: [-0.4, -0.4, -0.15]}}>
                    <ambientLight intensity={4.5} />                
                    {floorsData.map((floor) =>(
                        <mesh name={floor.index} visible position={[0, (0.9+(.1345 * floor.index-1)), 0]} onPointerEnter={(info) => highlightFloor(info, floor.index)} onPointerDown={() => {seeRooms(floor)}}>
                            <boxGeometry args={[1, .1, 1]} />
                            <meshStandardMaterial color={colors[floor.index-1]} transparent/>
                            <Html occlude distanceFactor={0.9} position={[-.15, 0, 0.51]} rotation={[-0.2, 0, 0]} transform >
                                <p key={floor.index} onPointerEnter={(info) => {console.log(``)}}>{floor.name} Has An Occupancy Of: {floor.occupancy}</p>
                            </Html>
                            {(floor.index == floorsData.length) &&
                                <Html occlude distanceFactor={1.5} position={[0, 0.06, 0]} rotation={[-1.4, 0, -0.5]} transform>
                                    <h1>{title}</h1>
                                </Html>
                            }
                            <Edges linewidth={5} color={"black"} />
                        </mesh>
                    ))}
                </Canvas>
            </div>
        </div>
    );
}

export default FloorComp;