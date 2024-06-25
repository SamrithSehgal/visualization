import React from 'react';
import { useLocation } from 'react-router-dom';
import dbh from "../../ext/DBH.jpeg"
import ashwin from "../../ext/Ashwin.jpg"
import heaven from "../../ext/Heaven.jpg"
import "./Selection.css"
import PlotCard from '../../../../addons/PlotCard/PlotCard';

import barChart from "../../ext/Charts/BarChart.png"
import pieChart from "../../ext/Charts/PieChart.jpg"
import lineChart from "../../ext/Charts/LineChart.png"
import FunnelChart from "../../ext/Charts/FunnelChart.png"
import scatterPlot from "../../ext/Charts/ScatterPlot.png"

function Selection(props) {

    const location = useLocation()

    return (
        <div id='visualsWrapper'>
            <div id='visualSelection'>
                <div id='optionsHolder'>
                    <PlotCard name={"Bar Chart"} img={barChart} chartId={0} buildingId={location.state.buildingId} timeRange={location.state.timeRange}/>
                    <PlotCard name={"Pie Chart"} img={pieChart} chartId={1} buildingId={location.state.buildingId} timeRange={location.state.timeRange}/>
                    <PlotCard name={"Line Graph"} img={lineChart} chartId={2} buildingId={location.state.buildingId} timeRange={location.state.timeRange}/>
                    <PlotCard name={"Funnel Diagram"} img={FunnelChart} chartId={3} buildingId={location.state.buildingId} timeRange={location.state.timeRange}/>
                    <PlotCard name={"Scatter Plot"} img={scatterPlot} chartId={4} buildingId={location.state.buildingId} timeRange={location.state.timeRange}/>
                </div>
            </div>
        </div>
    );
}

export default Selection;