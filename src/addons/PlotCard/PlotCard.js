import React from 'react';
import { useNavigate } from 'react-router-dom';

function PlotCard({name, img, chartId, buildingId, timeRange}) {

    const navigate = useNavigate()

    function chooseChart(chosenChart){
        navigate('/graph', {state: {buildingId: buildingId, chartId: chosenChart, timeRange: timeRange}})
    }

    var imgStyle = {
        width: "100%",
        height: "auto",
        display: "block",
        margin: "auto"
    }

    var headerStyle = {
        fontSize: "20px"
    }

    var holderStyle = {
        width: "27%",
        height: "auto",
        border: "3px solid black",
        marginTop: "5%",
        marginLeft: "4%",
        display: "inline-block"
    }

    var overlayStyle = {
        width: "100%",
        height: "100%",
        backgroundColor: "black"
    }

    return (
        <div id='cardHolder' style={holderStyle} onClick={() => chooseChart(chartId)}>
            <div id='cardBckg' style={overlayStyle} />
            <img src={img} style={imgStyle}/>
            <hr class="separator" style={{height: "5px", backgroundColor: "black", border: "none", margin: "0"}}/>
            <h1 style={headerStyle}>{name}</h1>
        </div>
    );
}

export default PlotCard;