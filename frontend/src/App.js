import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Building from "./pages/Building/Building"
import DataTable from './pages/Displays/Table/DataTable';
import Graph from './pages/Displays/Plot/Graph'
import OccMap from './pages/Displays/Map/OccMap';
import MapComp from './addons/Maps/MapComp/MapComp';
import FloorComp from './addons/Maps/FloorComp/FloorComp';
import RoomComp from './addons/Maps/RoomComp/RoomComp';


function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Building />} />
            <Route path='/table' element={<DataTable />} />
            <Route path='/graph' element={<Graph />} />
            <Route path='/map' element={<OccMap />} />
            <Route path='/floors' element={<FloorComp />} />
            <Route path='/rooms' element={<RoomComp />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App