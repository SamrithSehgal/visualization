import { Canvas, useThree } from '@react-three/fiber';
import { useReducer, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { Circle, Line } from "@react-three/drei"
import Stack from '@mui/material/Stack';
import "./Sketcher.css"
import { FormControl, List } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';


function Sketcher() {
  const location = useLocation();
  const points = location.state.data[0];
  const [roomPolys, setPolys] = useState([])
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const roomNames = useRef(null)

  const coords = [];
  const ogX = points[0][0];
  const ogY = points[0][1];

  const allColors = [
    "#1E90FF", "#00BFFF", "#00CED1", "#2E8B57", "#008000",
    "#ADFF2F", "#FFD700", "#FF6347", "#FF4500", "#DC143C",
    "#FF69B4", "#FF1493", "#8A2BE2", "#6A5ACD", "#483D8B",
    "#40E0D0", "#00FA9A", "#7FFF00", "#32CD32", "#00FF7F",
    "#66CDAA", "#4682B4", "#5F9EA0", "#7B68EE", "#4169E1",
    "#FF7F50", "#FFA500", "#DAA520", "#9ACD32", "#20B2AA"
  ];
  

  for (const point of points) {

    coords.push({
      x: (point[0] - ogX) * 10000,
      y: (point[1] - ogY) * 10000,
      elevation: 0,
    });
  }
  const shape = new THREE.Shape(coords.map(coord => new THREE.Vector2(coord.x, coord.y)));
  const positionArray = coords.map(coord => [coord.x, coord.y, coord.elevation]).flat();

  const extrudeSettings = {
    depth: .1,
    bevelEnabled: false, 
  };
  const shapeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  function changeHighlight(index){
    var newPolys = roomPolys
    newPolys[index]["highlighted"] = !newPolys[index]["highlighted"]
    setPolys(newPolys)
    forceUpdate()
  }

  function handleSave(){
    var namedPolys = []
    var polyIndex = 0
    var textDivs = roomNames.current.children[0].children
    for(var div of textDivs){
      var inputVal = div.children[1].children[0].value
      var polyPoints = []
      for(var point of roomPolys[polyIndex]["points"]){
        polyPoints.push(`${point.x}, ${point.y}`)
      }
      namedPolys.push({"name": inputVal, verticies: polyPoints})
      polyIndex++
    }
    console.log(namedPolys)
    axios.post("http://localhost:8888/saveSketch", {namedPolys, "parent_id": location.state.data[1]}).then((res) => {

    })

  }

  return (
    <div id='layoutHolder'>
      <Stack direction='row' spacing={-10}>
        <Canvas
          camera={{
            fov: 8, 
            near: 0.1,
            far: 100000000,
            position: [.5, 4, -60.4], // Position the camera far enough to see the shape
            rotation: [-3.15, .05, -1.38]
          }}
          style={{ width: '80vw', height: '100vh' }}
        >
          <ambientLight intensity={0.5} />
          <ClickableMesh geometry={shapeGeometry} edges={coords} />
        </Canvas>
        <div id='infoHolder'>
          <div id='roomListHolder'>
            <Stack spacing={1}>
              <Button variant="contained" onClick={() => {handleSave()}}>Save</Button>
              <FormControl ref={roomNames}>
                <Stack spacing={1}>
                {roomPolys.map((rooms, index) => 
                  <TextField id="outlined-basic" label="Room Name" variant="outlined" onFocus={() => {changeHighlight(index)}} onBlur={(e) => {changeHighlight(index)}} />
                )}
                </Stack>
              </FormControl>
            </Stack>
          </div>
        </div>
      </Stack>
    </div>
  );

  function ClickableMesh({ geometry, edges }) {
    const { camera, size } = useThree();
    const [clickedPoints, setClickedPoints] = useState([]);
    const [firstPoint, setFirstPoint] = useState(null); // Store the first clicked point
    const snapThreshold = 0.2; // Define the threshold distance for snapping to an edge or the first point
  
    const handleClick = (event) => {
      const mouse = new THREE.Vector2();
      
      mouse.x = (event.clientX / size.width) * 2 - 1;
      mouse.y = -(event.clientY / size.height) * 2 + 1;
    
      // Create a raycaster and set it from the camera's position
      const raycaster = new THREE.Raycaster();
      
      // Update the raycaster based on the mouse position
      raycaster.setFromCamera(mouse, camera);
    
      // Check for intersections
      const intersects = raycaster.intersectObject(new THREE.Mesh(geometry));
    
      if (intersects.length > 0) {
        const point = intersects[0].point;
    
        const snappedPoint = snapToEdgeOrFirstPoint(point, edges);
        if (!firstPoint) {
          setFirstPoint(snappedPoint);
        }
        setClickedPoints((prev) => [...prev, snappedPoint]);
    
        if (snappedPoint === firstPoint) {
          let polyCoords = [];
          for (let cord of [...clickedPoints, snappedPoint]) {

            polyCoords.push({
              x: cord.x,
              y: cord.y,
              elevation: 0,
            });
          }
          setClickedPoints([]);
          setFirstPoint(null);
          setPolys((prev) => [...prev, {"points": polyCoords, "highlighted": false}]);
          //console.log([...roomPolys, polyCoords]);
        }
    
        //console.log('Recorded Points:', [...clickedPoints, snappedPoint]);
      }
    };
    
  
    // Snap to the first point if within the snap threshold, otherwise snap to the edge
    const snapToEdgeOrFirstPoint = (point, edges) => {
      let closestPoint = point;
      let minDistance = Infinity;
  
      // If firstPoint is set, check if the current point is within the threshold of the first point
      if (firstPoint) {
        const distanceToFirstPoint = point.distanceTo(firstPoint);
        if (distanceToFirstPoint <= snapThreshold) {
          return firstPoint; // Snap to the first point
        }
      }
  
      // If it's not close to the first point, snap to the closest edge if it's within the snap threshold
      let snappedToEdge = false;
      for (let i = 0; i < edges.length; i++) {
        const start = new THREE.Vector3(edges[i].x, edges[i].y, 0);
        const end = new THREE.Vector3(
          edges[(i + 1) % edges.length].x,
          edges[(i + 1) % edges.length].y,
          0
        );
  
        const edgeClosestPoint = closestPointOnLineSegment(point, start, end);
        const distance = point.distanceTo(edgeClosestPoint);
  
        // Only snap to the edge if it's within the threshold and not snapped to the first point
        if (!snappedToEdge && distance < minDistance && distance <= snapThreshold) {
          minDistance = distance;
          closestPoint = edgeClosestPoint;
          snappedToEdge = true;
        }
      }
  
      return closestPoint; // If it's neither close to the first point nor the edge, return the original point
    };
  
    const closestPointOnLineSegment = (point, start, end) => {
      const segment = end.clone().sub(start);
      const projection = point.clone().sub(start).projectOnVector(segment);
      return start.clone().add(projection.clampLength(0, segment.length()));
    };
  
  
    const createPolys = (points, index) => {
      //console.log(points)
      try{
        var curGeo = new THREE.Shape(points["points"].map(coord => new THREE.Vector3(coord.x, coord.y, coord.z)))
        const shapeGeometry = new THREE.ExtrudeGeometry(curGeo, extrudeSettings);
        return(
          <mesh geometry={shapeGeometry} position={[0, 0, -1]}>
            <meshBasicMaterial color={points["highlighted"] ? "#EE4B2B" : allColors[index]} side={THREE.DoubleSide} opacity={0}/>
          </mesh>  
        )
      }catch(error){
        console.error(error)
        return null
      }
    }

    return (
      <>
        <mesh geometry={geometry} onClick={handleClick}>
          <meshBasicMaterial color="#F179AD" side={THREE.DoubleSide} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[geometry]} />
          <lineBasicMaterial color="black" />
        </lineSegments>
        {clickedPoints.map((point, index) =>
          <Circle key={index} args={[.1, 32]} position={[point.x, point.y, -1]} rotation={[0, 2.7, 0.3]}>
            <meshBasicMaterial color="black" />
          </Circle>
        )}
        {clickedPoints.length > 1 && (
          <Line
            points={clickedPoints} 
            color="black"
            lineWidth={2} 
            rotation={[-.1, 0, 0]}
          />
        )}
        {roomPolys.map((points, index) => 
          createPolys(points, index)
        )}
      </>
    );
  }  
}

//          console.log(new THREE.Shape(points.map(coord => new THREE.Vector2(coord.x, coord.y))))
/*<mesh geometry={shapeGeometry}>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          array={new Float32Array(positionArray)}
          itemSize={3}
        />
        <meshBasicMaterial color="#F179AD" side={2} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[shapeGeometry]} />
        <lineBasicMaterial color="black" />
      </lineSegments>      
      */
export default Sketcher;
