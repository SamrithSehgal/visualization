import React, {useState} from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { IconButton } from '@mui/material';
import Drawer from '@mui/material/Drawer';

import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import ComputerIcon from '@mui/icons-material/Computer';
import TableRowsIcon from '@mui/icons-material/TableRows';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import QueryStatsIcon from '@mui/icons-material/QueryStats';
import BarChartIcon from '@mui/icons-material/BarChart';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TimelineIcon from '@mui/icons-material/Timeline';
import PieChartIcon from '@mui/icons-material/PieChart';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import { useNavigate } from 'react-router-dom';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

export default function SideBar({isGraph, buildingId, timeRange, chosenChart=-1}) {
    const [open, setOpen] = useState(false);

    const [drop1Open, setDrop1] = useState(true);
    const [drop2Open, setDrop2] = useState(true);
    const [drop3Open, setDrop3] = useState(true);

    const [buildingOpen, setBuilding] = useState(buildingId)
    const [tableOpen, setTable] = useState(!isGraph)
    const [graphOpen, setGraph] = useState(chosenChart)

  const handleClick = (dropNum) => {
    switch(dropNum){
        case 1:
            setDrop1(!drop1Open)
            break
        case 2:
            setDrop2(!drop2Open)
            break
        case 3:
            setDrop3(!drop3Open)
            break
    }
  };
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  var navigate = useNavigate()

  const loadChart = (chartNum) => {
    navigate("/graph", {state:{buildingId: buildingId, timeRange: timeRange, chartId: chartNum}})
    navigate(0, {state:{buildingId: buildingId, timeRange: timeRange, chartId: chartNum}})
  }

  function handleOptions(element){
        switch(element){
            case 1:
                setBuilding(0)
                handleOptions(3)
                break
            case 2:
                setBuilding(1)
                handleOptions(4)
                break
            case 3:
                navigate("/table", {state:{buildingId: buildingId, timeRange: timeRange}})
                break
            case 4:
                setTable(false)
                if(graphOpen != -1){
                    loadChart(graphOpen)
                }
                break
            case 5:
                setGraph(0)
                loadChart(0)
                break
            case 6:
                setGraph(1)
                loadChart(1)
                break
            case 7:
                setGraph(2)
                loadChart(2)
                break
            case 8:
                setGraph(3)
                loadChart(3)
                break
            case 9:
                setGraph(4)
                loadChart(4)
                break        
            case 10:
                navigate("/")  
                break      
        }
  }

  const DrawerList = (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
      component="nav"
    >

        <ListItemButton onClick={() => {handleOptions(10)}}>
            <ListItemIcon>
                <ViewCarouselIcon sx={{color: "black"}}/>
            </ListItemIcon>
            <ListItemText primary="Go Home" />
        </ListItemButton>

        <ListItemButton onClick={() => {handleClick(1)}}>
            <ListItemIcon>
                <HomeIcon sx={{color: "black"}}/>
            </ListItemIcon>
            <ListItemText primary="Building" />
            {drop1Open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={drop1Open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} onClick={() => {handleOptions(1)}}>
                    <ListItemIcon>
                        <BuildIcon sx={{color: buildingOpen == 0 ? "red" : "grey"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Ashwins House" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} onClick={() => {handleOptions(2)}}>
                    <ListItemIcon>
                        <BuildIcon sx={{color: buildingOpen == 1 ? "red" : "grey"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Heaven" />
                </ListItemButton>
            </List>
        </Collapse>

      <ListItemButton onClick={() => {handleClick(2)}}>
            <ListItemIcon>
                <ComputerIcon sx={{color: "black"}}/>
            </ListItemIcon>
            <ListItemText primary="Display" />
            {drop2Open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={drop2Open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} onClick={() => {handleOptions(3)}}>
                    <ListItemIcon>
                        <TableRowsIcon sx={{color: tableOpen ? "red" : "grey"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Table" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} onClick={() => {handleOptions(4)}}>
                    <ListItemIcon>
                        <AutoGraphIcon sx={{color: tableOpen ? "grey" : "red"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Graph" />
                </ListItemButton>                
            </List>
        </Collapse>
        {!tableOpen &&
            <div>
                <ListItemButton onClick={() => {handleClick(3)}}>
                    <ListItemIcon>
                        <QueryStatsIcon sx={{color: "black"}}/>
                    </ListItemIcon>
                    <ListItemText primary="Graph Type" />
                    {drop3Open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={drop3Open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => {handleOptions(5)}}>
                            <ListItemIcon>
                                <BarChartIcon sx={{color: graphOpen == 0 ? "red" : "grey"}}/>
                            </ListItemIcon>
                            <ListItemText primary="Bar Graph" />
                        </ListItemButton>

                        <ListItemButton sx={{ pl: 4 }} onClick={() => {handleOptions(8)}}>
                            <ListItemIcon>
                                <FilterAltIcon sx={{color: graphOpen == 3 ? "red" : "grey"}}/>
                            </ListItemIcon>
                            <ListItemText primary="Funnel Graph" />
                        </ListItemButton>

                        <ListItemButton sx={{ pl: 4 }} onClick={() => {handleOptions(7)}}>
                            <ListItemIcon>
                                <TimelineIcon sx={{color: graphOpen == 2 ? "red" : "grey"}}/>
                            </ListItemIcon>
                            <ListItemText primary="Line Graph" />
                        </ListItemButton>

                        <ListItemButton sx={{ pl: 4 }} onClick={() => {handleOptions(6)}}>
                            <ListItemIcon>
                                <PieChartIcon sx={{color: graphOpen == 1 ? "red" : "grey"}}/>
                            </ListItemIcon>
                            <ListItemText primary="Pie Chart" />
                        </ListItemButton>

                        <ListItemButton sx={{ pl: 4 }} onClick={() => {handleOptions(9)}}>
                            <ListItemIcon>
                                <ScatterPlotIcon sx={{color: graphOpen == 4 ? "red" : "grey"}}/>
                            </ListItemIcon>
                            <ListItemText primary="Scatter Plot" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </div>
        }
    </List>
  );

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)}><ArrowForwardIcon sx={{color: isGraph ? "black" : "white", fontSize: "3rem", marginTop: "500%", marginLeft: "100%"}}/></IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}