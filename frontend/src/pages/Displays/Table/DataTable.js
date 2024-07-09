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
import {getInit, moveDownLvl, moveUpLvl} from "../DbHandler/db.js"

import p1 from "./Floorplans/p1.png"
import p2 from "./Floorplans/p2.png"
import p3 from "./Floorplans/p3.png"
import p4 from "./Floorplans/p4.png"


//Source: https://mui.com/material-ui/react-table/
function DataTable() {
    let location = useLocation()

    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);

    const curLvl = useRef(-1) //0: building, 1: floor, 2: room, 3: time
    const [curName, setName] = useState("")
    const [curColumn, _] = useState(["Building Name", "Floor Number", "Room", "Time"])

    const floorParent = useRef([])
    const roomParent = useRef([])
    const parentLvl = useRef(-1)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        findPageData(newPage, rowsPerPage)
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        findPageData(0, parseInt(event.target.value, 10))
    };

    function getInitData(data){
        var initData = getInit(data, curLvl.current)
        var resData = initData[0]
        var pLvl = initData[1]
        if(initData[2].length != 0){
            floorParent.current = initData[2]
        }
        if(initData[3].length != 0){
            roomParent.current = initData[3]
        }        
        if(curLvl.current == -1){
            curLvl.current = pLvl
            parentLvl.current = pLvl
        }

        return resData
    }

    const allData = useRef(getInitData(location.state.data))
    const [tableData, setData] = useState(allData.current.slice((0*rowsPerPage), (0*rowsPerPage+rowsPerPage)))

    function findPageData(curPage, rpp){
        //console.log(allData.current)
        setData(allData.current.slice((curPage*rpp), (curPage*rpp+rpp)))
    }

    function moveDown(indexes=[], areaName=""){
        var data = location.state.data
        var lvlData = moveDownLvl(curLvl.current, data, parentLvl.current, indexes, areaName, curName)
        if(lvlData[5]){
            var resData = lvlData[0]
            var newLvl = lvlData[1]

            if(lvlData[3].length != 0){
                floorParent.current = lvlData[3]
            }
            if(lvlData[4].length != 0){
                roomParent.current = lvlData[4]
            }

            allData.current = resData
            curLvl.current = newLvl

            if(newLvl == parentLvl.current){
                setName("")
            }
            else{
                setName(lvlData[2])
            }
            setPage(0)
            findPageData(0, rowsPerPage)
        }
    }

    useEffect(() => {console.log(location.state.data)})

    function moveUp(){
        //console.log(roomParent.current)
        var lvlData = moveUpLvl(curLvl.current, location.state.data, curName, parentLvl.current, roomParent.current, floorParent.current)
        allData.current = lvlData[0]

        curLvl.current = lvlData[1]

        findPageData(0, rowsPerPage)
        setName(lvlData[2])
        setPage(0)        
    }

    return (
        <div id='table'>
            <div id='tableBckg' />
            <div id='tableHolder'>
                <h1 id='areaTitle'>{curName}</h1>
                {(curLvl.current != parentLvl.current) ? <Button variant="contained" id='goBack' onClick={moveUp}>Go Back</Button> : false}
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {(curLvl.current == 3) ? <TableCell align='center'>Date</TableCell> : false}
                                <TableCell align='center'>{curColumn[curLvl.current]}</TableCell>
                                <TableCell align='center'>Occupancy</TableCell> 
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {tableData.map((row) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    {(curLvl.current == 3) ? <TableCell align='center'>{row.date}</TableCell> : false}
                                    <TableCell align='center' sx={{cursor: 'pointer'}} onClick={() => moveDown(row.nextLvl, row.name)}>{row.name}</TableCell>
                                    <TableCell align='center' sx={{cursor: 'pointer'}} onClick={() => moveDown(row.nextLvl, row.name)}>{row.occupancy}</TableCell>                            
                                </TableRow>
                            ))}
                        </TableBody>


                        <TableFooter>
                        <TablePagination
                            rowsPerPageOptions={[5, 10]}
                            count={allData.current.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />                        
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default DataTable
