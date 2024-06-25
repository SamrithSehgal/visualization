import React, {useState, useRef, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import "./DataTable.css";
import { TablePagination, TableFooter } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import SideBar from '../../../addons/SideBar/SideBar';

import p1 from "./Floorplans/p1.png"
import p2 from "./Floorplans/p2.png"
import p3 from "./Floorplans/p3.png"
import p4 from "./Floorplans/p4.png"


//Source: https://mui.com/material-ui/react-table/
function DataTable() {

    var tempData = [
        {"time": 11, "data": [
            {"id": 0, "Floor": 1, "Pop": 200, "APs": ["3192-clwa-2110", "2378-clwa-3593", "8255-clwa-6588"], "LU": "13:01", "Index": 0, "Img": p1,},
            {"id": 1, "Floor": 2, "Pop": 100, "APs": ["9536-clwa-8443", "5198-clwa-7457", "6608-clwa-1993"], "LU": "13:03", "Index": 1, "Img": p2},
            {"id": 2, "Floor": 3, "Pop": 400, "APs": ["3348-clwa-3059", "1838-clwa-0920", "9785-clwa-0339"], "LU": "13:02", "Index": 2, "Img": p3},
        ]},
        {"time": 12, "data": [
            {"id": 4, "Floor": 1, "Pop": 220, "APs": ["3192-clwa-2110", "2378-clwa-3593", "8255-clwa-6588"], "LU": "13:01", "Index": 0, "Img": p1},
            {"id": 5, "Floor": 2, "Pop": 90, "APs": ["9536-clwa-8443", "5198-clwa-7457", "6608-clwa-1993"], "LU": "13:03", "Index": 1, "Img": p2},
            {"id": 6, "Floor": 3, "Pop": 390, "APs": ["3348-clwa-3059", "1838-clwa-0920", "9785-clwa-0339"], "LU": "13:02", "Index": 2, "Img": p3},
        ]},
        {"time": 13, "data": [
            {"id": 8, "Floor": 1, "Pop": 180, "APs": ["3192-clwa-2110", "2378-clwa-3593", "8255-clwa-6588"], "LU": "13:01", "Index": 0, "Img": p1},
            {"id": 9, "Floor": 2, "Pop": 120, "APs": ["9536-clwa-8443", "5198-clwa-7457", "6608-clwa-1993"], "LU": "13:03", "Index": 1, "Img": p2},
            {"id": 10, "Floor": 3, "Pop": 420, "APs": ["3348-clwa-3059", "1838-clwa-0920", "9785-clwa-0339"], "LU": "13:02", "Index": 2, "Img": p3},
        ]},
        {"time": 14, "data": [
            {"id": 12, "Floor": 1, "Pop": 210, "APs": ["3192-clwa-2110", "2378-clwa-3593", "8255-clwa-6588"], "LU": "13:01", "Index": 0, "Img": p1},
            {"id": 13, "Floor": 2, "Pop": 80, "APs": ["9536-clwa-8443", "5198-clwa-7457", "6608-clwa-1993"], "LU": "13:03", "Index": 1, "Img": p2},
            {"id": 14, "Floor": 3, "Pop": 380, "APs": ["3348-clwa-3059", "1838-clwa-0920", "9785-clwa-0339"], "LU": "13:02", "Index": 2, "Img": p3},
        ]},

    ]

    var apData = [
        {"time": 11, "data": [
            {"id": 0, "AP": "3192-clwa-2110", "Pop": 124, "FloorIndex": 0},
            {"id": 1, "AP": "2378-clwa-3593", "Pop": 36, "FloorIndex": 0},
            {"id": 2, "AP": "8255-clwa-6588", "Pop": 40, "FloorIndex": 0},
    
            {"id": 3, "AP": "9536-clwa-8443", "Pop": 30, "FloorIndex": 1},
            {"id": 4, "AP": "5198-clwa-7457", "Pop": 45, "FloorIndex": 1},
            {"id": 5, "AP": "6608-clwa-1993", "Pop": 25, "FloorIndex": 1},
    
            {"id": 6, "AP": "3348-clwa-3059", "Pop": 176, "FloorIndex": 2},
            {"id": 7, "AP": "1838-clwa-0920", "Pop": 100, "FloorIndex": 2},
            {"id": 8, "AP": "9785-clwa-0339", "Pop": 124, "FloorIndex": 2},
    
        ]},
        {"time": 12, "data": [
            {"id": 12, "AP": "3192-clwa-2110", "Pop": 129, "FloorIndex": 0},
            {"id": 13, "AP": "2378-clwa-3593", "Pop": 46, "FloorIndex": 0},
            {"id": 14, "AP": "8255-clwa-6588", "Pop": 45, "FloorIndex": 0},
    
            {"id": 15, "AP": "9536-clwa-8443", "Pop": 25, "FloorIndex": 1},
            {"id": 16, "AP": "5198-clwa-7457", "Pop": 43, "FloorIndex": 1},
            {"id": 17, "AP": "6608-clwa-1993", "Pop": 22, "FloorIndex": 1},
    
            {"id": 18, "AP": "3348-clwa-3059", "Pop": 173, "FloorIndex": 2},
            {"id": 19, "AP": "1838-clwa-0920", "Pop": 96, "FloorIndex": 2},
            {"id": 20, "AP": "9785-clwa-0339", "Pop": 121, "FloorIndex": 2},
        ]},
        {"time": 13, "data": [
            {"id": 24, "AP": "3192-clwa-2110", "Pop": 110, "FloorIndex": 0},
            {"id": 25, "AP": "2378-clwa-3593", "Pop": 30, "FloorIndex": 0},
            {"id": 26, "AP": "8255-clwa-6588", "Pop": 40, "FloorIndex": 0},
    
            {"id": 27, "AP": "9536-clwa-8443", "Pop": 33, "FloorIndex": 1},
            {"id": 28, "AP": "5198-clwa-7457", "Pop": 51, "FloorIndex": 1},
            {"id": 29, "AP": "6608-clwa-1993", "Pop": 26, "FloorIndex": 1},
    
            {"id": 30, "AP": "3348-clwa-3059", "Pop": 176, "FloorIndex": 2},
            {"id": 31, "AP": "1838-clwa-0920", "Pop": 113, "FloorIndex": 2},
            {"id": 32, "AP": "9785-clwa-0339", "Pop": 131, "FloorIndex": 2},
        ]},
        {"time": 14, "data": [
            {"id": 36, "AP": "3192-clwa-2110", "Pop": 128, "FloorIndex": 0},
            {"id": 37, "AP": "2378-clwa-3593", "Pop": 38, "FloorIndex": 0},
            {"id": 38, "AP": "8255-clwa-6588", "Pop": 44, "FloorIndex": 0},
    
            {"id": 39, "AP": "9536-clwa-8443", "Pop": 15, "FloorIndex": 1},
            {"id": 40, "AP": "5198-clwa-7457", "Pop": 42, "FloorIndex": 1},
            {"id": 41, "AP": "6608-clwa-1993", "Pop": 23, "FloorIndex": 1},
    
            {"id": 42, "AP": "3348-clwa-3059", "Pop": 166, "FloorIndex": 2},
            {"id": 43, "AP": "1838-clwa-0920", "Pop": 98, "FloorIndex": 2},
            {"id": 44, "AP": "9785-clwa-0339", "Pop": 116, "FloorIndex": 2},
        ]},
    ]

    let location = useLocation()

    const [infoVisible, setInfo] = useState(false)   
    const [floorVisible, setFloor] = useState(false)   

    const buildingData = useRef([])  
    const floorIndex = useRef(0)
    const loadedFloorData = useRef([])

    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const numData = useRef(0)

    const [apPage, setapPage] = React.useState(0);
    const numAps = useRef(0)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeApPage = (event, newPage) => {
        setapPage(newPage);
        findValidData(newPage);
    };
    

    function showInfoModal(index){
        setInfo(true)
        floorIndex.current = index
    }
    
    function hideInfoModal(){
        setInfo(false)
    }

    function findValidData(newPage=0){
        var validData = []
        console.log(newPage)
        for(var i = 0; i < apData.length; i++){
            if(apData[i]["time"] >= location.state.timeRange[0] && apData[i]["time"] <= location.state.timeRange[1]){
               for(var j = 0; j < apData[i]["data"].length; j++){
                    if(apData[i]["data"][j]["FloorIndex"] == floorIndex.current){
                        validData.push(apData[i]["data"][j])
                        validData[validData.length-1]["time"] = apData[i]["time"]
                    }
               }
            }
        }
        numAps.current = validData.length
        //Source: https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value/16174180#comment31549267_1129270
        validData.sort((a,b) => (a.AP > b.AP) ? 1 : ((b.AP > a.AP) ? -1 : 0))
        validData = validData.slice((newPage*5), (newPage*5+5))
        loadedFloorData.current = validData
    }

    function showFloorModal(index){
        setFloor(true)
        floorIndex.current = index
        findValidData()
    }

    function hideFloorModal(){
        setFloor(false)
    }

    function switchModal(){
        setFloor(!floorVisible)
        setInfo(!infoVisible)
    }

    function initData(){
        var parsedData = []
        for(var i = 0; i < tempData.length; i++){
            if(tempData[i]["time"] >= location.state.timeRange[0] && tempData[i]["time"] <= location.state.timeRange[1]){
                for(var j = 0; j < tempData[i]["data"].length; j++){
                    parsedData.push(tempData[i]["data"][j])
                    parsedData[parsedData.length-1]["time"] = tempData[i]["time"]
                }
            }
        }
        parsedData.sort((a,b) => a.Floor - b.Floor);
        numData.current = parsedData.length
        parsedData = parsedData.slice((page*rowsPerPage), (page*rowsPerPage+rowsPerPage))
        buildingData.current = parsedData
    }
    initData()


    return (
        <div id='table'>
            <div id='tableBckg' />
                <SideBar isGraph={false} buildingId={0} timeRange={location.state.timeRange}/>
            <div id='tableHolder'>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>Floor Number</TableCell>
                                <TableCell align='center'>Occupancy</TableCell> 
                                <TableCell align='center'>Time</TableCell>                                                       
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {buildingData.current.map((row) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align='center' onClick={() => showFloorModal(row.Index)} sx={{cursor: 'pointer'}}>{row.Floor}</TableCell>
                                    <TableCell align='center' onClick={() => showInfoModal(row.Index)} sx={{cursor: 'pointer'}}>{row.Pop}</TableCell>                            
                                    <TableCell align='center'>{row.time}</TableCell>                            
                                </TableRow>
                            ))}
                        </TableBody>


                        <TableFooter>
                        <TablePagination
                            rowsPerPageOptions={[5, 10]}
                            count={numData.current}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />                        
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>

            {infoVisible &&
                <div id='floorModal'>
                    <Button variant='text' id='closeModalBtn' onClick={hideInfoModal}>X</Button>
                    <img id='floorPlan' src={buildingData.current[floorIndex.current]["Img"]} />
                    <div id='floorText'>
                        <h1 id='floorNum'>Floor {buildingData.current[floorIndex.current]["Floor"]}</h1>
                        <h2 id="occupancyNum">Occupancy: {buildingData.current[floorIndex.current]["Pop"]}</h2>
                        <h3 id='lastUpdated'>Last Updated: {buildingData.current[floorIndex.current]["LU"]}</h3>
                        <h3 id='acsessPoints'>Acsess Points: [{buildingData.current[floorIndex.current]["APs"].map((point) => (
                            <p style={{fontSize: "16px", marginLeft: "3%"}}>{point}, </p>    
                        ))}]</h3>
                    </div>

                    <Button variant='contained' id="seeAp" onClick={switchModal}>
                        Acsess Point Data
                    </Button>
                </div>
            }


            {floorVisible &&
                <div id='floorModal'>
                    <Button variant='text' id='closeModalBtn' onClick={hideFloorModal}>X</Button>
                    <h1 id="dataTitle">Floor {buildingData.current[floorIndex.current]["Floor"]}</h1>
                    <div id='apTable'>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>Acsess Point</TableCell>
                                        <TableCell align='center'>Occupancy</TableCell>                            
                                        <TableCell align='center'>Time</TableCell>                            
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {loadedFloorData.current.map((ap) => (
                                        
                                        <TableRow key={ap.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell align='center'>{ap.AP}</TableCell>
                                            <TableCell align='center'>{ap.Pop}</TableCell>                            
                                            <TableCell align='center'>{ap.time}</TableCell>                            
                                        </TableRow>
                                    ))}
                                </TableBody>

                                <TableFooter>
                                    <TablePagination
                                        rowsPerPageOptions={[5]}
                                        count={numAps.current}
                                        rowsPerPage={5}
                                        page={apPage}
                                        onPageChange={handleChangeApPage}
                                    />                        
                                </TableFooter>

                            </Table>
                        </TableContainer>
                    </div>
                    <Button variant='contained' id="seeInfo" onClick={switchModal}>
                        Floor Info
                    </Button>
                </div>
            }
        </div>
    );
}

export default DataTable
