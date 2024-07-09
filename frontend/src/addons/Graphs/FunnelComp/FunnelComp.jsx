import { Button } from '@mui/material';
import React, {useState, useRef} from 'react';
import { FunnelChart, Tooltip, Funnel, LabelList } from 'recharts';

function FunnelComp({graphData, moveDown, moveUp, atParent, atTime, CustomTip}) {

    var colors = ["#50998c", "#1ea3af", "#ed4314", "#893b75", "#f42721", "#06a6d0", "#3ee6c7", "#95b5f3", "#753791", "#3232fe", "#14f00c", "#2041b3", "#e922ae", "#db8540", "#ab343d", "#fdfe56", "#6a31db", "#11d997", "#f9436c", "#c535c4", "#8726f8", "#1b645a", "#cd4763", "#e44f31", "#d567fc", "#50998c", "#1ea3af", "#ed4314", "#893b75", "#f42721", "#06a6d0", "#3ee6c7", "#95b5f3", "#753791", "#3232fe", "#14f00c", "#2041b3", "#e922ae", "#db8540", "#ab343d", "#fdfe56", "#6a31db", "#11d997", "#f9436c", "#c535c4", "#8726f8", "#1b645a", "#cd4763", "#e44f31", "#d567fc", "#50998c", "#1ea3af", "#ed4314", "#893b75", "#f42721", "#06a6d0", "#3ee6c7", "#95b5f3", "#753791", "#3232fe", "#14f00c", "#2041b3", "#e922ae", "#db8540", "#ab343d", "#fdfe56", "#6a31db", "#11d997", "#f9436c", "#c535c4", "#8726f8", "#1b645a", "#cd4763", "#e44f31", "#d567fc", "#50998c", "#1ea3af", "#ed4314", "#893b75", "#f42721", "#06a6d0", "#3ee6c7", "#95b5f3", "#753791", "#3232fe", "#14f00c", "#2041b3", "#e922ae", "#db8540", "#ab343d", "#fdfe56", "#6a31db", "#11d997", "#f9436c", "#c535c4", "#8726f8", "#1b645a", "#cd4763", "#e44f31", "#d567fc", "#50998c", "#1ea3af", "#ed4314", "#893b75", "#f42721", "#06a6d0", "#3ee6c7", "#95b5f3", "#753791", "#3232fe", "#14f00c", "#2041b3", "#e922ae", "#db8540", "#ab343d", "#fdfe56", "#6a31db", "#11d997", "#f9436c", "#c535c4", "#8726f8", "#1b645a", "#cd4763", "#e44f31", "#d567fc", "#50998c", "#1ea3af", "#ed4314", "#893b75", "#f42721", "#06a6d0", "#3ee6c7", "#95b5f3", "#753791", "#3232fe", "#14f00c", "#2041b3", "#e922ae", "#db8540", "#ab343d", "#fdfe56", "#6a31db", "#11d997", "#f9436c", "#c535c4", "#8726f8", "#1b645a", "#cd4763", "#e44f31", "#d567fc", "#50998c", "#1ea3af", "#ed4314", "#893b75", "#f42721", "#06a6d0", "#3ee6c7", "#95b5f3", "#753791", "#3232fe", "#14f00c", "#2041b3", "#e922ae", "#db8540", "#ab343d", "#fdfe56", "#6a31db", "#11d997", "#f9436c", "#c535c4", "#8726f8", "#1b645a", "#cd4763", "#e44f31", "#d567fc"]

    for(var i = 0; i < graphData.length; i++){
        graphData[i]["fill"] = colors[i]
    }

    return (
        <div>
            {!atParent &&
                <Button id="collapseFunnel" variant="contained" onClick={moveUp}>Go Back</Button>
            }
            <FunnelChart width={1030} height={600}>
                <Tooltip content={<CustomTip />}/>
                <Funnel
                    dataKey="occupancy"
                    data={graphData}
                    isAnimationActive
                    onClick={(info) => {moveDown(info.nextLvl, info.name)}}
                    width={800}
                >
                    {!atTime &&
                        <LabelList position="inside" fill="#000" stroke="none" dataKey="name" />
                    }
                </Funnel>
            </FunnelChart>
        </div>
    );
}

export default FunnelComp;