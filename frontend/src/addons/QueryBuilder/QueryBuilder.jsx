import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, Checkbox, Chip, Divider, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, OutlinedInput, Paper, Select, Stack, TextField, Typography, useTheme} from '@mui/material';


function QueryBuilder({setOpen, query, saveQuery}) {


    const selectOptions = [
        'Location',
        'Occupancy',
        'Timestamp',
    ];

    const areaOptions = [
        'Buildings',
        'Floors',
        'Rooms',
        'Times'
    ]

    const graphOptions = [
        'Bar Graph',
        'Pie Chart',
        'Line Graph',
        'Funnel Graph',
        'Scatter Plot'
    ]

    const [selections, setSelections] = useState([]);
    const [statements, setStatements] = useState([])

    const [selectStatement, setSelect] = useState([])
    const [selectVars, setVars] = useState([])

    const tableVar = useRef({value: ""})
    const [withStatement, setWith] = useState("")
    const [withVars, setWithVars] = useState([])
    const [withSelections, setWithSelections] = useState([])

    const [using, setUsing] = useState("")
    const [graph, setGraph] = useState("Graph")

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        setSelections(
            typeof value === 'string' ? value.split(',') : value,
        );

        var newSelections = typeof value === 'string' ? value.split(',') : value

        if(selections.length < newSelections.length){
            updateSelect(newSelections[newSelections.length-1], true)
        }
        else{
            for(var selection of selections){
                if(!newSelections.includes(selection)){
                    updateSelect(selection, false)
                }
            }
        }
    };

    const handleWithChange = (event) => {
        const {
        target: { value },
        } = event;
        setWithSelections(
            typeof value === 'string' ? value.split(',') : value,
        );

        var newSelections = typeof value === 'string' ? value.split(',') : value

        if(withSelections.length < newSelections.length){
            updateWith(newSelections[newSelections.length-1], true)
        }
        else{
            for(var selection of withSelections){
                if(!newSelections.includes(selection)){
                    updateWith(selection, false)
                }
            }
        }
    };    

    const handleUsingChange = (event) =>{
        var curUsing = event.target.value
        if(curUsing != undefined){
            setUsing(curUsing)

            if(graphOptions.includes(curUsing)){
                curUsing = `graph.${curUsing.split(" ")[0].toLowerCase()}`
            }
            var newStatements = statements
            newStatements[2] = `Using ${curUsing.toLowerCase()};`
            setStatements(newStatements)
        }
    }

    useEffect(() =>{
        if(query != undefined && query != ""){
            var allStatements = query.split('\n')
            setStatements(allStatements)
            setWith("WITH ")

            var selectStmnt = allStatements[0].toLowerCase().split("from")[0] //Change
            var newTableVar = allStatements[0].toLowerCase().split("from")[1].split(" ")[2]
            tableVar.current.value = newTableVar
            setSelect(["SELECT ", ` FROM occupancy_table ${tableVar.current.value}`, `WHERE${allStatements[0].split(RegExp("where", "gi"))[1]}`])
            var initSelected = []
            var initVars = []
            
            for(var select of selectOptions){
                if(selectStmnt.includes(select.toLowerCase())){
                    initSelected.push(select)
                    initVars.push(`${newTableVar}.${select.toLowerCase()}`)
                }
            }
            setSelections(initSelected)
            setVars(initVars)

            var withStmnt = allStatements[1].toLowerCase()
            var withInit = []
            var withSelected = []
            for(var area of areaOptions){
                if(withStmnt.includes(area.toLowerCase())){
                    withSelected.push(area)
                    withInit.push(`${newTableVar}.${area.toLowerCase()}`)
                }
            }
            setWithSelections(withSelected)
            setWithVars(withInit)

            var usingStmnt = allStatements[2].split(" ")[1]
            usingStmnt = usingStmnt.replaceAll(";", "")
            var newVisual = ""
            if(!["table", "map"].includes(usingStmnt.toLowerCase())){
                if(usingStmnt.includes("graph")){
                    var graphStmnt = usingStmnt.split(".")[1]
                    for(var option of graphOptions){
                        if(option.toLowerCase().includes(graphStmnt)){
                            newVisual = option
                            break
                        }
                    }
                    if(newVisual != ""){
                        setGraph(newVisual)
                    }
                }
            }
            else{
                if(usingStmnt.toLowerCase() == "table"){
                    newVisual = "Table"
                }
                else{
                    newVisual = "Map"
                }
            }
            setUsing(newVisual)
        }
        else if(query == ""){
            setSelect(["SELECT ", ` FROM occupancy_table`, ";"])
            setStatements(["SELECT FROM occupancy_table WHERE", "With _____________", "Using _____________"])
        }


    }, [])
    
    function createSelect(newVars){
        var newStatements = statements
        var newSelects = selectStatement

        newSelects[0] = "SELECT " + newVars.join(", ")
        newSelects[0] = newSelects[0].substring(0, newSelects[0].length)
        newStatements[0] = newSelects.join(" ")
        setSelect(newSelects)
        setStatements(newStatements)
    }

    function createFrom(){
        var newStatements = statements
        var newSelects = selectStatement
        var newWith = "WITH "
        var newWithVars = []
        var newVars = []
        
        newSelects[1] = ` FROM occupancy_table ${tableVar.current.value}`

        if(selectVars.length != 0){
            newSelects[0] = "SELECT "
            for(var selected of selectVars){
                var curSelected = selected.split(".")[1]
                newSelects[0] += `${tableVar.current.value}.${curSelected}, `
                newVars.push(`${tableVar.current.value}.${curSelected}`)
            }
            newSelects[0] = newSelects[0].substring(0, newSelects[0].length-2)
            
            setVars(newVars)
        }


        var curWheres = newSelects[2].split(" ")
        for(var where in curWheres){
            if(curWheres[where].includes(".")){
                var curWhereVars = curWheres[where].split(".")
                if(["timestamp", "occupancy", "location"].includes(curWhereVars[1])){
                    curWhereVars[0] = tableVar.current.value
                }
                curWheres[where] = curWhereVars.join(".")
            }
        }
        newSelects[2] = curWheres.join(" ")
        newStatements[0] = newSelects.join(" ")

        setSelect(newSelects)

        if(withVars.length != 0){
            for(var areaSelected of withVars){
                var curWithSelected = areaSelected.split(".")[1]
                newWith += `${tableVar.current.value}.${curWithSelected}, `
                newWithVars.push(`${tableVar.current.value}.${curWithSelected}`)
            }
            newWith = newWith.substring(0, newWith.length-2)
            newWith += ";"
            newStatements[1] = newWith
            
            setWithVars(newWithVars)
            setWith(newWith)
        }
        setStatements(newStatements)
    }

    function createWith(newVars){
        var newStatements = statements
        var newSelects = withStatement

        newSelects = "WITH " + newVars.join(", ")
        newSelects = newSelects.substring(0, newSelects.length-1) + ";"
        newStatements[1] = newSelects
        setWith(newSelects)
        setStatements(newStatements)
    }

    function updateSelect(inputString, add){
        if(inputString != undefined){
            if(add){
                var inputVariable = inputString.toLowerCase()
                var newVars = [...selectVars, `${tableVar.current.value}.${inputVariable}`]
                setVars(newVars)
                createSelect(newVars)
            }
            else{
                var newVars = selectVars
                //console.log(inputString)
                for(var selected in newVars){
                    if(newVars[selected].includes(inputString.toLowerCase())){
                        newVars.splice(selected, 1)
                    }
                }
                createSelect(newVars)

            }
        }
    }


    function updateWith(inputString, add){
        if(inputString != undefined){
            if(add){
                var inputVariable = inputString.toLowerCase()
                var newVars = [...withVars, `${tableVar.current.value}.${inputVariable}`]
                setWithVars(newVars)
                createWith(newVars)
            }
            else{
                var newVars = withVars
                for(var selected in newVars){
                    if(newVars[selected].includes(inputString.toLowerCase())){
                        newVars.splice(selected, 1)
                    }
                }
                createWith(newVars)

            }
        }
    }

    function setQuery(){
        var allStatements = statements.join("\n")
        saveQuery(allStatements)
        setOpen(false)
    }
    
    return (
        <div>
            <div id='queryModal'>
                <Button sx={{color: "black", fontSize: 24, float: 'right'}} onClick={() => {setOpen(false)}}>X</Button>
                <Card elevation={5} sx={{ width: '90%', height: '25%', bgcolor: 'white', marginLeft: "3%", borderRadius: 2, marginTop: "5%", overflow: 'auto', padding: '1%'}}>
                    <Stack direction={'row'} spacing={10} sx={{maxWidth: '100%', marginTop: "2.5%", marginLeft: '3%'}} alignItems={'center'}>
                        <div>
                            <FormControl sx={{ m: 1, width: 300, float: 'left', marginLeft: '5%'}}>
                                <InputLabel id="demo-multiple-chip-label">SELECT</InputLabel>
                                <Select
                                    multiple
                                    value={selections}
                                    onChange={handleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="SELECT" />}
                                    renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                        {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                    )}
                                >
                                    {selectOptions.map((name) => (
                                    <MenuItem
                                        key={name}
                                        value={name}
                                    >
                                        <Checkbox checked={selections.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>


                        <TextField label="Table Variable" variant="standard" inputRef={tableVar} onChange={(event) => {if(event.target.value != "" && event.target.value != undefined){createFrom()}}}/>
                    
                    
                        <div>
                            <FormControl sx={{ m: 1, width: 300, float: 'left', marginLeft: '5%'}}>
                                <InputLabel>Area</InputLabel>
                                <Select
                                    multiple
                                    value={withSelections}
                                    onChange={handleWithChange}
                                    input={<OutlinedInput label="Area" />}
                                    renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                        {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                    )}
                                >
                                    {areaOptions.map((name) => (
                                    <MenuItem
                                        key={name}
                                        value={name}
                                    >
                                        <Checkbox checked={withSelections.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>       

                        <div>
                            <Box sx={{ minWidth: 170, float: 'left', marginLeft: '5%'}}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Visualization</InputLabel>
                                    <Select
                                    value={using}
                                    label="Visualization"
                                    onChange={handleUsingChange}                                    
                                    renderValue={(value) => (<MenuItem value={value}>{value}</MenuItem>)}                                    
                                    displayEmpty={true}
                                    >
                                        <MenuItem value={"Table"}>Table</MenuItem>
                                        <MenuItem value={undefined}>
                                            <FormControl fullWidth>
                                                <Select sx={{width: '100%'}} value={graph} onChange={(event) => {setGraph(event.target.value); handleUsingChange(event);}} renderValue={(value) => (<MenuItem value={value}>{value}</MenuItem>)}>
                                                    {graphOptions.map((map) => (
                                                        <MenuItem value={map}>{map}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </MenuItem>
                                        <MenuItem value={"Map"}>Map</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>    
                        </div>            


                    </Stack>
                </Card>

                <Card variant='outlined' sx={{ width: '60%', maxWidth: '60%', bgcolor: 'white', borderRadius: 2, marginTop: "5%", marginLeft: '15%', padding: '2%', paddingLeft: '2%', maxHeight: '19%'}}>
                    <Stack direction={'row'} spacing={4}>
                        {statements.map((statement) => (
                            <Paper elevation={3} sx={{width: 'auto', maxWidth: '53%', height: '5%'}}>
                                <Typography sx={{color: 'black', padding: '5%'}}>{statement}</Typography>
                            </Paper>
                        ))}       
                    </Stack>                                         
                </Card>

                <Button variant='contained' sx={{marginTop: '5%', width: '30%'}} onClick={setQuery}>
                    Save
                </Button>
            </div>
        </div>        
    );
}

export default QueryBuilder;