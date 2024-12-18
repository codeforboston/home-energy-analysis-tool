import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
  ResponsiveContainer,
  Legend,
  Label,
} from 'recharts';
import { SummaryOutputSchema } from '../../../../../../types/types';

const COLOR_ORANGE = "#FF5733 ";
const COLOR_BLUE = "#8884d8";
const COLOR_GREY_DARK = "#d5d5d5";
const COLOR_GREY_LIGHT = "#f5f5f5";
const COLOR_WHITE = "#fff";

interface ChartDataPoint {
  temperature: number;     // Temperature value for the X-axis
  maxLine?: number;        // Max heat load line value
  avgLine?: number;        // Average heat load line value
  maxPoint?: number;       // Max heat load at design temperature (scatter point)
  avgPoint?: number;       // Average heat load at design temperature (scatter point)
}

interface HeatLoadProps {
  heatLoadSummaryOutput: SummaryOutputSchema;
}

export function HeatLoad({ heatLoadSummaryOutput }: HeatLoadProps) {
  // Generate the data points for the lines and scatter points
  const data = useMemo(() => {
    const points: ChartDataPoint[] = [];
    
    for (let temp = heatLoadSummaryOutput.design_temperature; temp <= heatLoadSummaryOutput.estimated_balance_point; temp += 2) {
      // Calculate the maximum heat load (without internal/solar gain)
      const maxHeatLoad = heatLoadSummaryOutput.whole_home_heat_loss_rate * (heatLoadSummaryOutput.average_indoor_temperature - temp);
      
      // Calculate the average heat load (with internal/solar gain)
      const avgHeatLoad = heatLoadSummaryOutput.whole_home_heat_loss_rate * 
        (heatLoadSummaryOutput.average_indoor_temperature - (temp + heatLoadSummaryOutput.difference_between_ti_and_tbp));

      // Add the calculated points to the array
      points.push({
        temperature: temp,
        maxLine: Math.max(0, maxHeatLoad),
        avgLine: Math.max(0, avgHeatLoad),
      });
    }

    // Add the design temperature points (for the scatter points)
    points.push({
      temperature: heatLoadSummaryOutput.design_temperature,
      maxPoint: heatLoadSummaryOutput.maximum_heat_load,
      avgPoint: heatLoadSummaryOutput.average_heat_load,
    });

    return points;
  }, [heatLoadSummaryOutput]);

  // Calculate the minimum Y value, ensuring it doesn't go below 0
  const minYValue = useMemo(() => {
    const minValue = Math.min(
      ...data.map(point => Math.min(
        point.maxLine || Infinity,
        point.avgLine || Infinity,
        point.maxPoint || Infinity,
        point.avgPoint || Infinity
      ))
    );
    return Math.max(0, Math.floor(minValue / 10000) * 10000);  // Round down to the nearest 10,000
  }, [data]);

  // Calculate the maximum Y value with extra headroom (to add space above the maximum value)
  const maxYValue = useMemo(() => {
    const maxValue = Math.max(
      ...data.map(point => Math.max(
        point.maxLine || 0,
        point.avgLine || 0,
        point.maxPoint || 0,
        point.avgPoint || 0
      ))
    );

    // Add 10% headroom to the max value (rounded up to the nearest 10,000)
    const headroom = Math.ceil(maxValue * 0.1 / 10000) * 10000;

    return (Math.ceil(maxValue / 10000) * 10000) + headroom;
  }, [data]);

  return (
    <div>
      <div className="text-lg font-semibold mb-4">Heating System Demand</div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          margin={{
            top: 20,
            right: 20,
            bottom: 50,
            left: 100,
          }}
          data={data}
        >
          {/* Grid lines for background */}
          <CartesianGrid stroke={COLOR_GREY_LIGHT} />  
          
          {/* X-Axis: Outdoor Temperature */}
          <XAxis
            type="number"
            dataKey="temperature"
            name="Outdoor Temperature"
            unit="°F"
            domain={['dataMin - 2', 'dataMax']}
          >
            <Label 
              value="Outdoor Temperature (°F)" 
              position="bottom" 
              offset={20}
            />
          </XAxis>

          {/* Y-Axis: Heat Load (with dynamic range) */}
          <YAxis 
            type="number" 
            name="Heat Load" 
            unit=" BTU/h"
            domain={[() => minYValue, () => maxYValue]}
          >
            <Label
              value="Heat Load (BTU/h)"
              position="left"
              angle={-90}
              offset={30}
            />
          </YAxis>
          
          {/* Tooltip for displaying data on hover */}
          <Tooltip 
            formatter={(value: any, name: string) => [
              `${Number(value).toLocaleString()} BTU/h`,
              name.replace('Line', ' Heat Load').replace('Point', ' at Design Temperature')
            ]}
          />
          
          {/* Legend for chart */}
          <Legend 
            wrapperStyle={{
              backgroundColor: COLOR_WHITE,
              border: `1px solid ${COLOR_GREY_DARK}`,
              borderRadius: '3px',
              padding: '15px'
            }}
            align="right"
            verticalAlign="top"
            layout="middle"
            formatter={(value: string) => value.replace('Line', ' Heat Load').replace('Point', ' at Design Temperature')}
          />
          
          {/* Line for maximum heat load */}
          <Line
            type="monotone"
            dataKey="maxLine"
            stroke={COLOR_ORANGE}
            dot={false}
            name="Maximum, no internal or solar gain"
          />
          
          {/* Line for average heat load */}
          <Line
            type="monotone"
            dataKey="avgLine"
            stroke={COLOR_BLUE}
            dot={false}
            name="Average, with internal & solar gain"
          />
          
          {/* Scatter point for maximum heat load at design temperature */}
          <Scatter
            dataKey="maxPoint"
            fill={COLOR_ORANGE}
            name="Maximum at design temperature"
            shape="diamond"
            legendType="diamond"
          />
          
          {/* Scatter point for average heat load at design temperature */}
          <Scatter
            dataKey="avgPoint"
            fill={COLOR_BLUE}
            name="Average at design temperature"
            shape="diamond"
            legendType="diamond"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HeatLoad;
