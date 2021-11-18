import { useState, useEffect } from 'react'
import { Box } from 'theme-ui'
import { Row, Column, Filter } from '@carbonplan/components'
import {
  Chart,
  Circle,
  Plot,
  Line,
  Scatter,
  Grid,
  Label,
  Ticks,
  AxisLabel,
  TickLabels,
} from '@carbonplan/charts'
import Rect from './rect'
import { data as netData } from './data/net-effect'
import { data as fireData } from './data/fire-emissions'
import { getOption, averageOverRange } from './utils'

const fireOptions = ['GFED', 'CARB']
const emissionsOptions = ['holland', 'gonzalez', 'christensen', 'AB 1504']
//const years = Array(8).fill(0).map((_,i) => i + 2005)
const years = Array(13).fill(0).map((_,i) => i + 2000)

const Figure = () => {

  let data = []

  for (let i = 0; i < emissionsOptions.length; i++) {
    for (let j = 0; j < fireOptions.length; j++) {
      for (let k = 0; k < years.length; k++) {
        const net = netData[emissionsOptions[i]]
        const fire = fireData[fireOptions[j]]
        const residual = net.value - averageOverRange(fire, net.range)
        const result = residual + averageOverRange(fire, [years[k], years[k] + 9])
        data.push([years[k] + 9, result])
      }
    }
  }

  data = data.filter(d => !isNaN(d[0]) && !isNaN(d[1]))

  return (
    <Box as='figure' sx={{ mt: [6, 6, 6, 7], mb: [4, 4, 4, 5] }}>
      <Box sx={{ width: '100%', height: '300px', mt: [6]}}>
      <Chart x={[2008, 2022]} y={[-40, 60]} >
        <AxisLabel left align='left'>
          Net CO₂ emissions&nbsp;
          <Box as='span' sx={{ textTransform: 'none', color: 'secondary' }}>
            MMT / year
          </Box>
        </AxisLabel>
        <AxisLabel bottom align='right'>
          Year
        </AxisLabel>
        <Grid horizontal vertical />
        <TickLabels left />
        <Ticks left />
        <TickLabels bottom />
        <Ticks bottom />
        <Plot>
          <Scatter data={data} color='yellow'/>
        </Plot>
      </Chart>
    </Box>
    </Box>
  )
}

export default Figure
