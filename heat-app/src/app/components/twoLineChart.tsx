import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const options = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Domestic Hot Water Usage (gal or therms)',
      },
      ticks: {
        stepSize: 0.5,
        autoSkip: false,
      },
    },
    y: {
      type: 'linear',
      suggestedMin: -200,
      suggestedMax: 200,
      display: true,
      position: 'left',
      title: {
        display: true,
        text: 'UA change, BTU/h - F',
      },
      ticks: {
        stepSize: 100,
        autoSkip: false,
      },
    },
    y1: {
      type: 'linear',
      suggestedMin: -10,
      suggestedMax: 10,
      position: 'right',
      display: true,
      grid: {
        display: false,
      },
      ticks: {
        stepSize: 5,
        autoSkip: false,
        callback: function (value: number) {
          return value + '%';
        },
      },
    },
  },
  plugins: {
    legend: {
      display: true,
    },
  },
};

export function TwoLineChart({ data }: any) {
  return <Line data={data} options={options} />;
}
