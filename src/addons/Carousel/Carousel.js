import React from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'
import dbh from "../../pages/Displays/ext/DBH.jpeg"
import ashwin from "../../pages/Displays/ext/Ashwin.jpg"
import heaven from "../../pages/Displays/ext/Heaven.jpg"
import { useNavigate } from 'react-router-dom';

function BuildingDisplay({timeRange}) {
    var items = [
        {
            name: "Ashwins House (Table)",
            image: ashwin,
            index: 0
        },
        {
            name: "Heaven (XY Plot)",
            image: heaven,
            index: 1
        }
    ]    

    const indicatorStyle = {
        style: {
            "marginTop": "3%"
        }
    }

    return (
        <Carousel autoPlay={false} navButtonsAlwaysVisible={true} indicatorContainerProps={indicatorStyle}>
            {
                items.map( (item, i) => <Item key={i} item={item} tr={timeRange}/> )
            }
        </Carousel>
    );
}

function Item(props)
{
    var navigator = useNavigate()    

    const itemImgStyle = {
        "width": "40%",
        "height": "40%"
    }
    
    const itemBtnStyle = {
        "marginBottom": "3%"
    }
    
    function chooseBuilding(itemIndex){
        switch(itemIndex){
            case 0:
                navigator("/table", {state:{buildingId: itemIndex, timeRange: props.tr}})
                break
            case 1:
                navigator("/selection", {state:{buildingId: itemIndex, timeRange: props.tr}})
                break
            case 2:
                navigator("/map")
                break
        }
    }

    return (
        <Paper>
            <img src={props.item.image} style={itemImgStyle}/>
            <h2>{props.item.name}</h2>

            <Button variant="contained" style={itemBtnStyle} onClick={() => chooseBuilding(props.item.index)}>
                See Data
            </Button>
        </Paper>    
    )
}

export default BuildingDisplay;