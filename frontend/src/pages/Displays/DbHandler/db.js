
export function getData(lvl, data, parentLvl, curLvl, indexes=[], areaName="", curName = ""){
        
    //Maybe change it to group by buildings for floors, floors for rooms, rooms for times. Then instead
    //of passing indexes you can just take the ID of the floor. Worth doin allat tho?

    var occName = data.occName
    var lvlData = []
    var lvlId = 0
    var lvlOccs = []
    var lvlName = ""
    var floorParent = []
    var roomParent = []
    var titleName = curName

    switch(lvl){
        case 0:
            for(var building in data.buildingGroup){
                var floors = []
                var prevFloor = data.buildingGroup[building].location
                for(var bRoom of data.buildingGroup[building]){
                    lvlOccs.push(bRoom[occName])
                    lvlName = bRoom.buildingname
                    if(bRoom.location != prevFloor || bRoom == data.buildingGroup[building][data.buildingGroup[building].length-1]){
                        floors.push(bRoom.location)
                        prevFloor = bRoom.location
                    }
                }
                var buildingAvg = Math.round((lvlOccs.reduce((a, b) => parseFloat(a)+parseFloat(b))/lvlOccs.length) * 100)/100
                lvlData.push({name: lvlName, occupancy: buildingAvg, id: lvlId, nextLvl: floors})
                lvlId += 1
                lvlOccs = []
                lvlName = ""
            }
            //console.log(lvlData)
            break
        case 1:
            var floorIndexes = []
            for(var floor in data.floorGroup){
                if(indexes.includes(data.floorGroup[floor][0].location)){
                    floorIndexes.push(floor)
                    floorParent.push(parseInt(data.floorGroup[floor][0].location))
                }
            }

            var prevRoom = data.floorGroup[floorIndexes[0]].location
            for(var index of floorIndexes){
                var floorRooms = []
                for(var fRoom of data.floorGroup[index]){
                    lvlOccs.push(fRoom[occName])
                    lvlName = fRoom.floorname
                    if(fRoom.location != prevRoom){
                        floorRooms.push(fRoom.location)
                        prevRoom = fRoom.location
                    }
                }
                var floorAvg = Math.round((lvlOccs.reduce((a, b) => parseFloat(a)+parseFloat(b))/lvlOccs.length) * 100)/100
                lvlData.push({name: lvlName, occupancy: floorAvg, id: lvlId, nextLvl: floorRooms})
                lvlId += 1
                lvlOccs = []
                lvlName = ""
            }
            if(lvl != parentLvl){
                if(curLvl != lvl-1){
                    titleName = "All Floors"
                }
                else{
                    titleName = data.floorGroup[floorIndexes[0]][0].buildingname
                }
            }
            break
        case 2:
            var roomIndexes = []
            for(var room in data.roomGroup){
                if(indexes.includes(data.roomGroup[room][0].location)){
                    roomIndexes.push(room)
                    roomParent.push(parseInt(data.roomGroup[room][0].location))
                }
            }

            for(var rIndex of roomIndexes){
                for(var rRoom of data.roomGroup[rIndex]){
                    lvlOccs.push(rRoom[occName])
                    lvlName = "Room #" + rRoom.location.toString()
                }
                var roomAvg = Math.round((lvlOccs.reduce((a, b) => parseFloat(a)+parseFloat(b))/lvlOccs.length) * 100)/100
                lvlData.push({name: lvlName, occupancy: roomAvg, id: lvlId, nextLvl: [data.roomGroup[rIndex][0].location]})
                lvlId += 1
                lvlOccs = []
                lvlName = ""
            }

            if(lvl != parentLvl){
                if(curLvl != lvl-1){
                    titleName = (`${(areaName != "") ? `${(curName != "") ? `${curName}${areaName}` : areaName} - ` : ""}All Rooms`)
                }
                else{
                    titleName = (`${curName}${(curName != "" ? "-" : "")}${areaName} Rooms`)
                }
            }
            break
        case 3:
            var timeIndexes = []
            for(var time in data.timeGroup){
                if(indexes.includes(data.timeGroup[time][0].location)){
                    timeIndexes.push(time)
                }                    
            }

            for(var tIndex of timeIndexes){
                for(var tRoom of data.timeGroup[tIndex]){
                    var roomDate = tRoom.timestamp.split("T")[0]
                    lvlName = tRoom.timestamp.split("T")[1].split("Z")[0]
                    lvlData.push({name: lvlName, occupancy: tRoom[occName], id: lvlId, nextLvl: undefined, date: roomDate, timeStamp: tRoom.timestamp})
                    lvlId += 1
                    lvlName = ""
                }
            }
            lvlData.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
            if(lvl != parentLvl){
                if(curLvl != lvl-1){
                    titleName = (`${(areaName != "") ? `${(curName != "") ? `${curName} - ${areaName}` : areaName} - ` : ""}All Times`)
                }
                else{
                    titleName = (`${curName}${(curName != "" ? "-" : "")}${areaName} Times`)
                }
            }
            break
    }
    return [lvlData, titleName, floorParent, roomParent]


}

export function getTimes(data, initData){
    console.log(initData)
    if(data.hasTimes){  
        var resData = []
        var areaId = 0       
        var times = []
        var done = false
        for(var tParent of initData){
            var timeAvgs = {}
            var parentData = []
            for(var tIndex of tParent.nextLvl){
                for(var tRoom of data.timeGroup[tIndex]){
                    console.log(tRoom)
                    var curDate = Date.parse(tRoom.timestamp)
                    if(!Object.keys(timeAvgs).includes(curDate)){
                        timeAvgs[curDate] = tRoom[data.occName]
                    }
                    else{
                        timeAvgs[curDate] += tRoom[data.occName]
                    }
                }
            }
            times = Object.keys(timeAvgs)
            //console.log(timeAvgs)
            for(var avg in timeAvgs){
                timeAvgs[avg] = Math.round(((timeAvgs[avg] / tParent.nextLvl.length)*100)/100)
                parentData.push({name: tParent.name, occupancy: timeAvgs[avg], id: areaId, timestamp: avg})
                areaId += 1
            }
            resData.push(parentData)
        }

        return [resData, times]
    }
}

export function getInit(data, curLvl, skipToTimes=false){
    var indexData = []
    var resData = []
    var parentLvl = -1
    var floorParent = []
    var roomParent = []

    if(!skipToTimes){
        if(data.hasBuildings){
            parentLvl = 0
            var curData = getData(0, data, 0, curLvl)
            resData = curData[0]
            floorParent = curData[2]
            
        }
        else if(data.hasFloors){
            parentLvl = 1
            for(var floor in data.floorGroup){
                indexData.push(data.floorGroup[floor][0].location)
            }            
            var curData = getData(1, data, 1, curLvl.current, indexData)
            resData = curData[0]
            floorParent = indexData
            roomParent = curData[3]
        }
        else if(data.hasRooms){
            parentLvl = 2
            for(var room in data.roomGroup){
                indexData.push(data.roomGroup[room][0].location)
            }            
            resData = getData(2, data, 2, curLvl.current, indexData)[0]
            roomParent = indexData
        }
        else if(data.hasTimes){
            parentLvl = 3
            for(var time in data.timeGroup){
                indexData.push(data.timeGroup[time][0].location)
            }            
            resData = getData(3, data, 3, curLvl.current, indexData)[0]
        }
    }
    else{
        getTimes(data)
    }
    
    return [resData, parentLvl, floorParent, roomParent]
}

export function moveDownLvl(curLvl, data, parentLvl, indexes=[], areaName="", curName=""){
    var newLvl = curLvl
    var done = false
    var allData = []
    var resData = []
    var title = ""
    var floorParent = []
    var roomParent = []
    switch(curLvl){
        case 0:
            if(data.hasFloors){
                resData = getData(1, data, parentLvl, curLvl, indexes, areaName, curName)
                allData = resData[0]
                title = resData[1]
                floorParent = resData[2]
                newLvl = 1
                done = true
            }
        case 1:
            if(data.hasRooms && !done){
                resData = getData(2, data, parentLvl, curLvl, indexes, areaName, curName)
                allData = resData[0]
                title = resData[1]
                roomParent = resData[3]
                newLvl = 2
                done = true
            }
        case 2:
            if(data.hasTimes && !done){
                resData = getData(3, data, parentLvl, curLvl, indexes, areaName, curName)
                allData = resData[0]
                title = resData[1]
                newLvl = 3
                done = true
            }
            break
    }
    return [allData, newLvl, title, floorParent, roomParent, done]

}

//lvl, data, parentLvl, curLvl, indexes=[], areaName="", curName = ""
export function moveUpLvl(curLvl, data, curName, parentLvl, roomParent, floorParent){
    var prevLvl = curLvl - 1
    var completed = false
    var newName = curName.split("-")
    newName.pop()
    newName = newName.join("-")
    var allData = []
    console.log(`Floors: ${floorParent}, Rooms: ${roomParent}`)

    switch(prevLvl){
        case 2:
            if(data.hasRooms){
                allData = getData(2, data, parentLvl, curLvl, roomParent)[0]
                completed = true
                prevLvl = 2
            }
        case 1:
            if(data.hasFloors && !completed){
                allData = getData(1, data, parentLvl, curLvl, floorParent)[0]
                console.log(allData)
                completed = true
                prevLvl = 1
            }
        case 0:
            if(data.hasBuildings && !completed){
                allData = getData(0, data, parentLvl, curLvl)[0]
                prevLvl = 0
            }
            break
    }
    return [allData, prevLvl, newName]
}