

import { Canvas } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import "./Sketch.css"

function Sketch() {
  const location = useLocation();
  const points = location.state.polygon;

  const allColors = [
    "#1E90FF", "#00BFFF", "#00CED1", "#2E8B57", "#008000",
    "#ADFF2F", "#FFD700", "#FF6347", "#FF4500", "#DC143C",
    "#FF69B4", "#FF1493", "#8A2BE2", "#6A5ACD", "#483D8B",
    "#40E0D0", "#00FA9A", "#7FFF00", "#32CD32", "#00FF7F",
    "#66CDAA", "#4682B4", "#5F9EA0", "#7B68EE", "#4169E1",
    "#FF7F50", "#FFA500", "#DAA520", "#9ACD32", "#20B2AA"
  ];


  const roomSketches = location.state.data
  var sketchRooms = []

  for(var room of roomSketches){
    var curVerticies = room.verticies
    var sketchPoints = []
    for(var str of curVerticies){
        var point = str.split(",")
        sketchPoints.push({x: parseFloat(point[0]), y: parseFloat(point[1]), elevation: 0})
    }
    sketchRooms.push({"points": sketchPoints, "highlighted": false})
  }


  console.log(sketchPoints)

  const coords = [];
  const ogX = points[0][0];
  const ogY = points[0][1];

  for (const point of points) {
    coords.push({
      x: (point[0] - ogX) * 10000,
      y: (point[1] - ogY) * 10000,
      elevation: 0,
    });
  }

  const shape = new THREE.Shape(coords.map(coord => new THREE.Vector2(coord.x, coord.y)));
  
  // Extrude settings for depth
  const extrudeSettings = {
    depth: .1, // Set the depth of the extrusion
    bevelEnabled: false, // Disable bevels for a straight edge
  };

  const shapeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  const createPolys = (points, index) => {
    console.log(points)
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

    <div id='sketchHolder'>
        <Canvas
        camera={{
            fov: 8, 
            near: 0.1,
            far: 100000000,
            position: [.5, 4, -60.4], // Position the camera far enough to see the shape
            rotation: [-3.15, .05, -1.38]
        }}
        >
        <ambientLight intensity={0.5} />
        {/* Polygon Mesh */}
        <mesh geometry={shapeGeometry}>
            <meshBasicMaterial color="#F179AD" side={THREE.DoubleSide} />
        </mesh>
        {/* Edges */}
        <lineSegments>
            <edgesGeometry args={[shapeGeometry]} />
            <lineBasicMaterial color="black" />
        </lineSegments>

        {sketchRooms.map((sketches, index) => 
            createPolys(sketches, index)
        )}
        </Canvas>
    </div>
  );
}

export default Sketch;