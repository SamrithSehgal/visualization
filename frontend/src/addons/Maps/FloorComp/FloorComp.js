import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from "@react-three/fiber"
import { Edges, Html } from "@react-three/drei"
import "./FloorComp.css"
import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FloorComp({data, title, setLvl, setRoomData, setLocs}) {

    const roomAble = useRef(false)

    const colors = ["#F179AD", "#EF4E9B","#E43983","#ED4968","#F04543","#A64D9D","#7A5CA4","#2263AF"]

    const [floorsData, setData] = useState([])
    var navigator = useNavigate()

    useEffect(() => {
        var newData = []
        console.log(data)
        for(var floor of data){
            newData.push({name: floor.name, occupancy: floor.total, index: floor.index, location: floor.spaceId, nextLvl: floor.nextLvl, polygon: floor.verticies})
        }
        setData(newData)
        roomAble.current = true
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
        console.log("Goin Back")
        setLvl(0)
    }

    function seeRooms(floor){
        /*
        if(roomAble.current == true){
            try{
                axios.post("http://localhost:8888/getImg", {floorId: floor.location}).then((imgRes) =>{
                    axios.post("http://localhost:8888/getRooms", {nextLvl: floor.nextLvl}).then((roomRes) => {
                        setRoomData(floor.nextLvl)
                        setLocs(roomRes.data.data)
                        setLvl(2)
                    })            
                })
            }catch(error){
                console.error(error)
            }
            roomAble.current = false
        }
        else{
            roomAble.current = true
        }
            axios.post("http://localhost:8888/getRoomImg", {}).then((res) => {

            })*/
            //navigator("/layout", {state: {data: [floor.polygon, floor.location]}})
            axios.post("http://localhost:8888/getRooms", {"parent_id": floor.location}).then((res) => {
                var data = res.data

                if(data.isSketch = true){
                    navigator("/sketch", {state: {"data": data.sketch, "polygon": floor.polygon}})
                }
            })   
        }

    return (
        <div id='mapHolder'>
            <div id='Floors'>
                <div id='backMapHolder'>
                    <Button variant='contained' id='mapBtn' onClick={() => goBack()}>Go Back</Button>
                </div>
                <Canvas camera={{fov: 25, near: 0.1, far: 1000, position: [-1.5, 1.75, 3.2], rotation: [-0.4, -0.4, -0.15]}}>
                    <ambientLight intensity={4.5} />                
                    {floorsData.map((floor) =>(
                        <mesh name={floor.index} visible position={[0, (0.9+(.1345 * floor.index-1)), 0]} onPointerEnter={(info) => highlightFloor(info, floor.index)} onPointerDown={() => {seeRooms(floor)}}>
                            <boxGeometry args={[1, .1, 1]} />
                            <meshStandardMaterial color={colors[floor.index-1]} transparent/>
                            <Html occlude distanceFactor={0.9} position={[-.15, 0, 0.51]} rotation={[-0.2, 0, 0]} transform >
                                <p key={floor.index}>{floor.name} Has An Occupancy Of: {floor.occupancy}</p>
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