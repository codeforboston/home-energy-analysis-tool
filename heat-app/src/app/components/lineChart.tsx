import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const options = {
  responsive: true,
  scales: {
    x: {
      suggestedMin: 59,
      suggestedMax: 62,
      title: {
        display: true,
        text: 'Balance Point (F)',
      },
    },
    y: {
      suggestedMin: 5.73,
      suggestedMax: 5.8,
      title: {
        display: true,
        text: 'Standard Deviation',
      },
      ticks: {
        callback: function (value: number) {
          return value + '%';
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Standard Deviation of UA',
    },
  },
};

export function LineChart({ data }: any) {
  return <Line data={data} options={options} />;
}
