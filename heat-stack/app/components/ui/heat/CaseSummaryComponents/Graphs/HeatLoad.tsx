import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
  Scatter,
} from 'recharts';
import { SummaryOutputSchema } from '../../../../../../types/types';

const COLOR_ORANGE = "#FF5733";
const COLOR_BLUE = "#8884d8";
const COLOR_GREY_LIGHT = "#f5f5f5";
const COLOR_WHITE = "#fff";

interface HeatLoadProps {
  heatLoadSummaryOutput: SummaryOutputSchema;
  heatLoadBalancePoints: any;
}

export function HeatLoad({ heatLoadSummaryOutput, heatLoadBalancePoints }: HeatLoadProps) {
  const designSetPoint = 70; // Design set point is 70°F
  const { whole_home_heat_loss_rate, average_indoor_temperature, estimated_balance_point, design_temperature } = heatLoadSummaryOutput;

  // Calculate the heat load values for average and max load lines
  const data = useMemo(() => {
    const points = [];

    // Calculate heat load at -10°F from the design temperature (start point)
    const startTemperature = design_temperature - 10;
    const avgHeatLoadStart = Math.max(0, (designSetPoint - average_indoor_temperature + estimated_balance_point - startTemperature) * whole_home_heat_loss_rate);
    const maxHeatLoadStart = Math.max(0, (designSetPoint - startTemperature) * whole_home_heat_loss_rate);

    // Calculate heat load at design temperature
    const avgHeatLoad = Math.max(0, (designSetPoint - average_indoor_temperature + estimated_balance_point - design_temperature) * whole_home_heat_loss_rate);
    const maxHeatLoad = Math.max(0, (designSetPoint - design_temperature) * whole_home_heat_loss_rate);

    // Calculate heat load at design set point (70°F)
    const avgHeatLoadSetPoint = Math.max(0, (designSetPoint - average_indoor_temperature + estimated_balance_point - designSetPoint) * whole_home_heat_loss_rate);
    const maxHeatLoadSetPoint = Math.max(0, (designSetPoint - designSetPoint) * whole_home_heat_loss_rate);

    // Points for the average line
    points.push({
      temperature: startTemperature,
      avgLine: avgHeatLoadStart,
    });
    points.push({
      temperature: design_temperature,
      avgLine: avgHeatLoad,
      avgPoint: avgHeatLoad, // Add the point for avg line at design temperature
    });
    points.push({
      temperature: designSetPoint,
      avgLine: avgHeatLoadSetPoint,
    });

    // Points for the max line
    points.push({
      temperature: startTemperature,
      maxLine: maxHeatLoadStart,
    });
    points.push({
      temperature: design_temperature,
      maxLine: maxHeatLoad,
      maxPoint: maxHeatLoad, // Add the point for max line at design temperature
    });
    points.push({
      temperature: designSetPoint,
      maxLine: maxHeatLoadSetPoint,
    });

    return points;
  }, [heatLoadSummaryOutput]);

  // Calculate Y-axis min and max values with buffers
  const minYValue = useMemo(() => {
    const minValue = Math.min(
      ...data.map(point => Math.min(
        point.maxLine || Infinity,
        point.avgLine || Infinity
      ))
    );
    return Math.max(0, Math.floor(minValue * 0.8 / 10000) * 10000); // Add 20% buffer below min Y value
  }, [data]);

  const maxYValue = useMemo(() => {
    const maxValue = Math.max(
      ...data.map(point => Math.max(
        point.maxLine || 0,
        point.avgLine || 0
      ))
    );
    return Math.ceil(maxValue * 1.3 / 10000) * 10000; // Add 30% buffer above max Y value
  }, [data]);

  // Calculate X-axis min and max values with buffers
  const minXValue = useMemo(() => design_temperature - 10, [design_temperature]); // Start the X-axis 10°F below design temperature
  const maxXValue = useMemo(() => designSetPoint, [designSetPoint]); // End at the design set point (70°F)

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
          <CartesianGrid stroke={COLOR_GREY_LIGHT} />
          
          <XAxis
            type="number"
            dataKey="temperature"
            name="Outdoor Temperature"
            unit="°F"
            domain={[minXValue, maxXValue]}
            tickCount={maxXValue - minXValue + 1}  // Ensure whole numbers
          >
            <Label 
              value="Outdoor Temperature (°F)" 
              position="bottom" 
              offset={20}
            />
          </XAxis>

          <YAxis 
            type="number" 
            name="Heat Load" 
            unit=" BTU/h"
            domain={[minYValue, maxYValue]}
          >
            <Label
              value="Heat Load (BTU/h)"
              position="left"
              angle={-90}
              offset={30}
            />
          </YAxis>

          <Tooltip
  formatter={(value: any, name: string, props: any) => {
    // Log the tooltip's payload to inspect the structure of the data
    console.log('In tooltip with value:', value);
    console.log('In tooltip with name:', name);
    console.log('In tooltip with props:', props);

    // Extract the temperature from the payload
    const temperature = props.payload ? props.payload?.temperature : null;

    if (temperature !== null) {
      // Return formatted output, ensuring the temperature is shown in color below the heat load value
      return [
        `${Number(value).toLocaleString()} BTU/h`, // Heat load in BTU/h
        `${temperature}°F ${name.replace('Line', ' Heat Load').replace('Point', ' at Design Temperature')}` // Temperature in °F below the heat load value
      ];
    }

    // Fallback in case the temperature is not available
    return [
      `${Number(value).toLocaleString()} BTU/h`,
      name.replace('Line', ' Heat Load').replace('Point', ' at Design Temperature'),
    ];
  }}
/>

          
          {/* `${temperature}°F ${name.replace('Line', ' Heat Load').replace('Point', ' at Design Temperature')}` */}
          
          <Legend 
            wrapperStyle={{
              backgroundColor: COLOR_WHITE,
              border: `1px solid #ddd`,
              borderRadius: '3px',
              padding: '15px'
            }}
            align="right"
            verticalAlign="top"
            layout="middle"
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
