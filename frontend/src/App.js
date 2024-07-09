import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Building from "./pages/Building/Building"
import DataTable from './pages/Displays/Table/DataTable';
import Graph from './pages/Displays/Plot/Graph'
import OccMap from './pages/Displays/Map/OccMap';


function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Building />} />
            <Route path='/table' element={<DataTable />} />
            <Route path='/graph' element={<Graph />} />
            <Route path='/map' element={<OccMap />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App