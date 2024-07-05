const { Pool } = require('pg')

const pool = new Pool({
    user: "postgres",
    database: "visualization",
    password: "samrith123",
})

process.env.TZ = "UTC"

function getFloors(sqlQuery, tableVar){
        sqlQuery = sqlQuery.slice(0, sqlQuery.indexOf("select") + 6) + ` ${tableVar}.floor, floors.floorname,` + sqlQuery.slice(sqlQuery.indexOf("select") + 6)
        if(sqlQuery.includes("group by")){
            sqlQuery = sqlQuery.slice(0, sqlQuery.indexOf("group by") + 8) + ` ${tableVar}.floor,` + sqlQuery.slice(sqlQuery.indexOf("group by") + 8)
        }

        if(sqlQuery.includes("where")){
            sqlQuery = sqlQuery.slice(0, sqlQuery.indexOf("where")) + `inner join floors on floors.floor=${tableVar}.floor ` + sqlQuery.slice(sqlQuery.indexOf("where"))
            if(sqlQuery.includes("group by")){
                sqlQuery = sqlQuery.slice(0, sqlQuery.indexOf("group by") + 8) + " floors.floorname," + sqlQuery.slice(sqlQuery.indexOf("group by") + 8)
            }
        }
        else{
            sqlQuery = sqlQuery + ` inner join floors on floors.floor=${tableVar}.floor `
            if(sqlQuery.includes("group by")){
                sqlQuery = sqlQuery.slice(0, sqlQuery.indexOf("group by") + 8) + " floors.floorname," + sqlQuery.slice(sqlQuery.indexOf("group by") + 8)
            }            
        }

    return sqlQuery
}

function getBuilding(sqlQuery, tableVar){
    sqlQuery = getFloors(sqlQuery, tableVar)

    sqlQuery = sqlQuery.slice(0, sqlQuery.indexOf("select") + 6) + ` buildings.buildingname,` + sqlQuery.slice(sqlQuery.indexOf("select") + 6)
    sqlQuery = sqlQuery.slice(0, sqlQuery.indexOf("inner join") + (41 + tableVar.length)) + `inner join buildings on buildings.building=floors.building ` + sqlQuery.slice(sqlQuery.indexOf("inner join") + (41 + tableVar.length))
    if(sqlQuery.includes("group by")){
        sqlQuery = sqlQuery.slice(0, sqlQuery.indexOf("group by") + 8) + ` buildings.buildingname,` + sqlQuery.slice(sqlQuery.indexOf("group by") + 8)
    }
    return sqlQuery
}

function shapeData(data, fields, hasBuildings, hasFloors, hasRooms, hasTimes){
    var buildingGroup = {}
    var floorGroup = {}
    var roomGroup = {}
    var timeGroup = {}


    if(hasBuildings){
        var oldBuildings = []
    }

    if(hasFloors){
        var oldFloors = []
    }

    if(hasRooms || hasTimes){
        var oldRooms = []
    }

    for(var row of data){
        if(hasBuildings){
            if(!oldBuildings.includes(row.buildingname)){
                buildingGroup[row.buildingname] = []
                buildingGroup[row.buildingname].push(row)
                oldBuildings.push(row.buildingname)
            }
            else{
                buildingGroup[row.buildingname].push(row)
            }
        }

        if(hasFloors){
            if(!oldFloors.includes(row.floor)){
                floorGroup[row.floor] = []
                floorGroup[row.floor].push(row)
                oldFloors.push(row.floor)
            }
            else{
                floorGroup[row.floor].push(row)
            }
        }

        if(hasRooms || hasTimes){
            if(!oldRooms.includes(row.location)){
                if(hasRooms){
                    roomGroup[row.location] = []
                    roomGroup[row.location].push(row)
                }
                if(hasTimes){
                    timeGroup[row.location] = []
                    timeGroup[row.location].push(row)
                }
                oldRooms.push(row.location)
            }
            else{
                if(hasRooms){
                    roomGroup[row.location].push(row)
                }
                if(hasTimes){
                    timeGroup[row.location].push(row)
                }
            }
        }
    }

    var occName = "occupancy"
    for(var field of fields){
        if(!(["buildingname", "floor", "floorname", "location", "occupancy", "timestamp"].includes(field.name))){
            occName = field.name
            break //change
        }
    }
    return {hasBuildings, hasFloors, hasRooms, hasTimes, occName, buildingGroup, floorGroup, roomGroup, timeGroup}
}

function findSelect(selectStatement, variable, tableVar){
    var chosenVars = selectStatement.split("from")[0]
    if(!chosenVars.includes(variable)){
        selectStatement = selectStatement.slice(0, selectStatement.indexOf("select") + 6) + ` ${tableVar}${variable},` + selectStatement.slice(selectStatement.indexOf("select") + 6)
        if(selectStatement.includes("group by")){
            selectStatement = selectStatement.slice(0, selectStatement.indexOf("group by") + 8) + ` ${tableVar}${variable},` + selectStatement.slice(selectStatement.indexOf("group by") + 8)
        }
    }
    return selectStatement
}

function getUsing(statement){
    var usingStatement = statement.split("using")[1]
    usingStatement = usingStatement.split(";")[0].replaceAll(' ', "")
    var graphs = ["bargraph", "piechart", "linegraph", "funnelgraph", "scatterplot"]
    var typeGraph = -1

    if(usingStatement.includes("table")){
        return ["/table", typeGraph]
    }
    else if(usingStatement.includes("graph")){
        var graphString = usingStatement.split(".")[1]
        for(var graph in graphs){
            if(graphs[graph].includes(graphString)){
                return ["/graph", graph]
            }
        }
    }
    else if(usingStatement.includes("map")){
        return ["/map", typeGraph]
    }
}

module.exports.sendQuery = async (req, res) => {
    const sqlQuery = req.body.query
    
    var sqlStatements = sqlQuery.toLowerCase().replaceAll("\n", "").split(";")
    var selectStatement = sqlStatements[0]

    var hasBuildings = false
    var hasFloors = false
    var hasRooms = false
    var hasTimes = false
    var visualization = []


    for(var statement of sqlStatements){
        if(statement.includes("with")){ //Buildings, Floors, Rooms, Time
            var tableVar = statement.split(" ")[1].split(".")[0]
            if(statement.includes("building")) {
                selectStatement = getBuilding(selectStatement, tableVar)
                hasBuildings = true
            }

            if(statement.includes("floor")) {
                if(hasBuildings == false){
                    selectStatement = getFloors(selectStatement, tableVar)
                }
                hasFloors = true
            }

            if(statement.includes("room")) { 
                selectStatement = findSelect(selectStatement, ".location", tableVar)
                hasRooms = true
            }

            if(statement.includes("time")) {
                selectStatement = findSelect(selectStatement, ".timestamp", tableVar)
                hasTimes = true
            }
        }
        else if(statement.includes("using")){
            visualization = getUsing(statement)
        }
    }

    try {
        const psql = await pool.connect()
        const dataRes = await psql.query(selectStatement)
        psql.release()
        const shapedData = shapeData(dataRes.rows, dataRes.fields, hasBuildings, hasFloors, hasRooms, hasTimes)
        res.json({shapedData, visualization})  


    } catch(error){
        console.error(error)
    }
}

module.exports.getInfo = async (req, res) => {
    const tableData = req.body.data
    var locations = []
    for(var row of tableData){
        if(row.location != undefined){
            locations.push(row.location)
        }
    }
    try {
        var sqlQuery = "SELECT * FROM occupancy_table o WHERE location IN ( "

        for(var location of locations){
            sqlQuery += location
            sqlQuery += ", "
        }
        sqlQuery = sqlQuery.substring(0, sqlQuery.length-2)
        sqlQuery += " ) ORDER BY o.floor"

        const floorRes = await pool.query(sqlQuery);
        
        var prevFloor = 0
        var curData = []

        for(var row in floorRes.rows){
            if(row.floor != prevFloor){

            }
            else{
                curData.push({})
            }
        }


    } catch(error){
        console.error(error)
    }
}