import React from 'react';
import { Box, Slider } from '@mui/material';
import './Building.css';
import BuildingDisplay from '../../addons/Carousel/Carousel';
import SideBar from '../../addons/SideBar/SideBar';

//Source: https://mui.com/material-ui/react-slider/
function valuetext(value) {
  return `${value}:00`;
}

const minDistance = 1;

function Building() {

  const [value1, setValue1] = React.useState([0, 24]);

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
  };




  return (
    <div className="App">
      <div id='backgroundHolder'>
        <div id='bckgOverlay' />
      </div>
      <div id='buildingSelection'>
        <div id='buildingCarousel'>
          <div id='timeRange'>
            <Box sx={{ width: 300 }}>
              <Slider
                getAriaLabel={() => 'Minimum distance'}
                min={0}
                max={23}
                value={value1}
                onChange={handleChange}
                valueLabelDisplay="on"
                getAriaValueText={valuetext}
                valueLabelFormat={valuetext}
                disableSwap
              />
            </Box>
          </div>
          <BuildingDisplay timeRange={value1}/>
        </div>
      </div>
    </div>
  );
}

export default Building;
