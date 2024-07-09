import React, {useEffect, useRef, useState} from 'react';
import './Building.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Card, Divider, List, ListItem, ListItemButton, ListItemText, Paper, Typography} from '@mui/material';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import QueryBuilder from '../../addons/QueryBuilder/QueryBuilder';

function Building() {
  const queryRef = useRef({value: ""}) 
  const [openedQuery, setOpened] = useState(false)
  const [modalOpen, setModal] = useState(false)
  var navigator = useNavigate()
  var [queryList, setList] = useState([])

  const sendValue = () => {
    const query = queryRef.current.value
    var tempChoice = 0

    setPrevs(true, query)

    axios.post("http://localhost:8888/sendQuery", {query}).then((res) => {
      console.log(res.data.visualization)
      navigator(`${res.data.visualization[0]}`, {state:{data: res.data.shapedData, chart: parseInt(res.data.visualization[1]), curMap: 0}})
    })
  }

  function setPrevs(append, query=""){
    var prevQueries = JSON.parse(localStorage.getItem("queries"))

    
    if(prevQueries == null){
      if(append){
        localStorage.setItem("queries", JSON.stringify([query]))
      }
      else{
        return -1
      }
    }
    else{
      if(append){
        if(prevQueries.length >= 10){
          prevQueries.pop()
        }

        if(!prevQueries.includes(query)){
          prevQueries.unshift(query)
          localStorage.setItem("queries", JSON.stringify(prevQueries))
        }
      }
      else{
        return prevQueries
      }
    }
  }

  useEffect(() =>{
    var res = setPrevs(false)
    if(res != -1){
      setList(res)
    }
  }, [])

  function updateQuery(newQuery){
    queryRef.current.value = newQuery
    setOpened(true)
  }

  return (
    <div className="App">
      <div id='backgroundHolder'>
        <div id='bckgOverlay' />
      </div>

      {modalOpen &&
        <QueryBuilder setOpen={setModal} query={queryRef.current.value} saveQuery={updateQuery}/>
      }
      <div id='buildingSelection'>
        <div id='prevQueries'>
          <Box sx={{ width: '100%', height: '100%',maxWidth: 460, bgcolor: '#48494B', borderRadius: 4, paddingBottom: '5%', paddingTop: '1%'}}>
            <List sx={{maxHeight: '100%', overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '0.4em',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,1)',
                outline: '1px solid slategrey',
                borderRadius: 4
              }}}
            >
              {queryList.map((prevQuery, index) => (
                <Box key={index} sx={{ width: '80%', maxWidth: 460, bgcolor: 'white', marginLeft: "12%", borderRadius: 2, marginTop: "3%", marginBottom: "5%", overflow: 'auto'}}>
                  <ListItem >
                    <ListItemButton sx={{marginRight: "5%"}} onClick={() => {updateQuery(prevQuery)}}>
                      <EditIcon />
                    </ListItemButton>
                    <Box sx={{ width: '100%', maxWidth: 460, bgcolor: 'white', marginLeft: "2%", borderRadius: 2}}>
                      {prevQuery.split("\n").map((statement) => (
                        <Paper sx={{ width: '100%', maxWidth: 460, bgcolor: 'white', borderRadius: 2,}}>
                          <ListItemText primary={statement} sx={{color: 'black', marginTop: '5%', textAlign: 'center'}}/>
                        </Paper>
                      ))}
                    </Box>
                  </ListItem>
                </Box>
              ))}
            </List>
          </Box>   
        </div>         

        <div id='queryHolder'>
          <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }, display: 'inline-block'}} noValidate autoComplete="off">
            <TextField id="sqlQuery" label="SQL Query" variant="outlined" multiline required maxRows={16} inputRef={queryRef} focused={openedQuery}/>
            <Button variant='contained' size='small' onClick={sendValue} sx={{bgcolor: '#48494B'}}>
            Send
            </Button>
            <Button variant='contained' size='small' onClick={() => {setModal(true)}} sx={{bgcolor: '#48494B'}}>
            Query Builder
            </Button>
          </Box>
        </div>    
      </div>
    </div>
  );
}

export default Building;
