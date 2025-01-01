const { Pool } = require('pg')

const pool = new Pool({
    user: "postgres",
    database: "tippersdb",
    password: "samrith123",
})

process.env.TZ = "UTC"


async function dataGen(){

    var buildings = [2, 78, 483, 794, 749]
    var floors = []
    var rooms = []

    var days = ["2024-06-27", "2024-06-28", "2024-06-29", "2024-06-30", "2024-07-01"]

    try{
        const psql = await pool.connect()
        var query = `SELECT * FROM space s WHERE s.parent_space_id in (${buildings});`
        const buildingRes = await psql.query(query)
        for(var row of buildingRes.rows){
            floors.push(row.space_id)
        }

        query = `SELECT * FROM space s WHERE s.parent_space_id in (${floors});`
        console.log(query)
        const roomRes = await psql.query(query)
        console.log(roomRes.rowCount)

        var insertStmnt = ""
        for(var room of roomRes.rows){
            var roomId = room.space_id
            var curDay = 0
            for(var i = 1; i <= 120; i++){
                if(i % 24 == 0 && curDay < 4){
                    curDay++
                }
                var randOcc = Math.floor(Math.random() * (7-2) + 2)
                var curTime = `${days[curDay]} ${(i - (curDay*24))}:00:00`
                const insertRes = await psql.query("INSERT INTO occupancy_table(space_id, occupancy, timestamp) VALUES($1, $2, $3)", [roomId, randOcc, curTime])
            }

        }
        console.log("Done!")


        psql.release()
        return("")
    }
    catch(error){
        console.error(error)
    }

}
dataGen()
/*module.exports.dataGen = async(req, res) => {

    var buildings = req.body.buildings

    try{
        const psql = await pool.connect()
        const buildingRes = await psql.query(`SELECT * FROM occupancy_table o WHERE o.space_id in ${buildings};`)
    }
    catch(error){
        console.error(error)
    }

}*/
