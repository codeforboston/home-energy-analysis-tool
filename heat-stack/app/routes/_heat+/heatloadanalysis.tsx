import React from 'react';
import { Graphs } from '../../components/ui/heat/CaseSummaryComponents/HeatLoadAnalysis.tsx';

type HeatLoadRecord = Map<
  'balance_point' | 'heat_loss_rate' | 'change_in_heat_loss_rate' | 'percent_change_in_heat_loss_rate' | 'standard_deviation',
  number
>;

interface HeatLoadAnalysisProps {
  heatLoadData: HeatLoadRecord[];
}

/**
 * Transforms raw heat load data into a format suitable for graphing.
 * Each record is mapped to an object with `x` and `y` coordinates.
 * 
 * @param {HeatLoadRecord[]} data - Array of heat load records as Maps.
 * @returns {{x: number, y: number}[]} Transformed data with `balance_point` as `x` and `heat_loss_rate` as `y`.
 */
function transformHeatLoadData(data: HeatLoadRecord[]): { x: number; y: number }[] {
  return data
    .map(record => {
      const balancePoint = record.get('balance_point');
      const heatLossRate = record.get('heat_loss_rate');
      if (typeof balancePoint === 'number' && typeof heatLossRate === 'number') {
        return { x: balancePoint, y: heatLossRate };
      }
      return null;
    })
    .filter(item => item !== null) as { x: number; y: number }[];
}

export default function HeatLoadAnalysis({ heatLoadData }: HeatLoadAnalysisProps) {
  return <Graphs heatLoadData={transformHeatLoadData(heatLoadData)} />;
}
