const { Pool } = require('pg')

const pool = new Pool({
    user: "postgres",
    database: "tippersdb",
    password: "samrith123",
})

process.env.TZ = "UTC"


function groupIds(rows){
    
    var roomIds = {}
    for(var row of rows.rows){
        var rowDict = {}
        var rowArr = []
        rowArr.push(row.timestamp)
        rowArr.push(row.occupancy)
        if(!Object.keys(roomIds).includes(`${row.space_id}`)){
            rowDict["nextLvl"] = [rowArr]
            rowDict["total"] = row.occupancy
            roomIds[row.space_id] = rowDict
        }
        else{
            var newTimeArr = roomIds[row.space_id]["nextLvl"]
            newTimeArr.push(rowArr)
            roomIds[row.space_id]["nextLvl"] = newTimeArr

            var newTotal = roomIds[row.space_id]["total"]
            newTotal += row.occupancy
            roomIds[row.space_id]["total"] = newTotal
        }
    }

    Object.keys(roomIds).map((key, index) => {
        var newTotal = roomIds[key].total
        newTotal /= roomIds[key].nextLvl.length
        roomIds[key].total = Math.round(newTotal)
    })
    return(roomIds)
}

async function groupRooms(psql, roomIds){

    var roomNums = []
    Object.keys(roomIds).map((key, index) => {
        roomNums.push(Number(key))
    })

    const query = `SELECT * FROM space s WHERE s.space_id IN (${roomNums})`
    const floorRes = await psql.query(query)
    var floorRooms = {}
    for(var row of floorRes.rows){
        var floorDict = {}
        if(!Object.keys(floorRooms).includes(`${row.parent_space_id}`)){
            floorDict["nextLvl"] = [row.space_id]
            floorDict["total"] = roomIds[`${row.space_id}`]["total"]
            floorRooms[row.parent_space_id] = floorDict
        }
        else{
            var newFloorArr = floorRooms[row.parent_space_id]["nextLvl"]
            newFloorArr.push(row.space_id)
            floorRooms[row.parent_space_id]["nextLvl"] = newFloorArr

            var newTotal = floorRooms[row.parent_space_id]["total"]
            newTotal += roomIds[`${row.space_id}`]["total"]
            floorRooms[row.parent_space_id]["total"] = newTotal            
        }
    }
    return floorRooms
}

async function groupBuildings(psql, floorRooms){
    var floorRoomNums = Object.keys(floorRooms)
    var floors = []

    for(var fr of floorRoomNums){
        floors.push(Number(fr))
    }
    const query = `SELECT * FROM space s WHERE s.space_id IN (${floors})`
    const buildingRes = await psql.query(query)
    
    var buildings = {}
    for(var row of buildingRes.rows){
        var buildingDict = {}
        if(!Object.keys(buildings).includes(`${row.parent_space_id}`)){
            buildingDict["nextLvl"] = [row.space_id]
            buildingDict["total"] = floorRooms[`${row.space_id}`]["total"]
            buildings[row.parent_space_id] = buildingDict
        }
        else{
            var newBuildingArr = buildings[row.parent_space_id]["nextLvl"]
            newBuildingArr.push(row.space_id)
            buildings[row.parent_space_id]["nextLvl"] = newBuildingArr

            var newTotal = buildings[row.parent_space_id]["total"]
            newTotal += floorRooms[`${row.space_id}`]["total"]
            buildings[row.parent_space_id]["total"] = newTotal            
        }
    }
    
    return buildings
}

async function getPolygons(psql, buildings){
    var buildingNums = Object.keys(buildings)
    var buildingIds = []
    
    for(var num of buildingNums){
        buildingIds.push(Number(num))
    }
    const query = `SELECT * FROM space s WHERE s.space_id IN (${buildingIds})`
    const polyRes = await psql.query(query)

    for(var row of polyRes.rows){
        buildings[`${row.space_id}`]["name"] = row.space_name
        buildings[`${row.space_id}`]["polygon"] = row.vertices
    }
    return buildings
}


//change from only polygons to include rectangles & circles
module.exports.sendQuery = async(req, res) => {
    var query = req.body.query
    var queryParts = query.split(";")

    try{
        const psql = await pool.connect()
        const occRes = await psql.query(`${queryParts[0]};`)
        var idGroup = groupIds(occRes)
        var floorRoomGroup = await groupRooms(psql, idGroup)
        //console.log(floorRoomGroup)
        var buildings = await groupBuildings(psql, floorRoomGroup)
        var finalData = await getPolygons(psql, buildings)

        res.json({"lvlData": {"1": finalData, "2": floorRoomGroup, "3": idGroup}})
    }
    catch(error){
        console.error(error)
    }
}

module.exports.getImgs = async(req, res) => {

    try{
        const psql = await pool.connect()
        //Do check for floor images first
        //const imgRes = await psql.query(`SELECT * FROM image_urls;`)
        const sketchRes = await psql.query(`SELECT * FROM sketches s WHERE s.parent_space_id = ${req.body.parent_id}`)
        psql.release()
        if(sketchRes.rowCount != 0){
            res.json({"sketch": sketchRes.rows, "isSketch": true})
        }
        else{

        }
    }
    catch(error){
        console.error(error)
    }
}

module.exports.saveSketch = async(req, res) => {

    console.log(req.body)
    var polys = req.body.namedPolys
    try{
        const psql = await pool.connect()
        const spaceIdRes = await psql.query(`SELECT s.space_id FROM space s ORDER BY s.space_id DESC;`)
        var space_id = spaceIdRes.rows[0].space_id + 1

        for(var poly of polys){
            const sketchInsert = await psql.query(`INSERT INTO sketches(space_id, parent_space_id, verticies, name) VALUES($1, $2, $3, $4)`, [space_id, req.body.parent_id, poly["verticies"], poly["name"]])
            space_id++
        }
        psql.release()
    }
    catch(error){
        console.error(error)
    }
}




async function getFloors(psql, spaceId){
    var idArr = []
    const floorRes = await psql.query(`SELECT * FROM space s WHERE s.parent_space_id=${spaceId}`)
    for(var row of floorRes.rows){
        idArr.push(row.space_id)
    }
    return idArr
}

module.exports.getBuildings = async(req, res) => {

    //0: polygon, 1: circle

    var resArray = []

    try{
        const psql = await pool.connect()
        const buildingRes = await psql.query("SELECT * FROM space s WHERE s.space_type_id=1;")
        var floorIds = []
        for(var row of buildingRes.rows){
            var resJson = {}
            resJson["name"] = row.space_name
            resJson["shape"] = row.space_shape
            resJson["spaceId"] = row.space_id
            if(row.space_shape == 'circle'){
                resJson["extent"] = row.extent
            }
            resJson["verticies"] = row.vertices
            resArray.push(resJson)
        }
        console.log(floorIds)
        psql.release()
        console.log(resJson)
        res.json({resArray})
        //return resArray
    }
    catch(error){
        console.error(error)
    }
}

module.exports.getFloors = async(req, res) => {
    var spaceId = req.body.spaceId
    
    try{
        const psql = await pool.connect()
        const floorRes = await psql.query(`SELECT * FROM space s WHERE s.parent_space_id=${spaceId};`)
        var resArray = []
        for(var row of floorRes.rows){
            var resJson = {}
            console.log(row)
            resJson["name"] = row.space_name
            resJson["spaceId"] = row.space_id
            console.log(resJson)
            resArray.push(resJson)
        }
        psql.release()
        return res.json({resArray})
    }
    catch(error){
        console.error(error)
    }

}