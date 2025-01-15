import {
	COLOR_ORANGE,
	COLOR_BLUE,
} from '../constants'

export const CustomLegend = () => {
  const legendItems = [
    { name: "Maximum, no internal or solar gain", color: COLOR_ORANGE, type: "line" },
    { name: "Average, with internal & solar gain", color: COLOR_BLUE, type: "line" },
    { name: "Maximum at design temperature", color: COLOR_ORANGE, type: "diamond" },
    { name: "Average at design temperature", color: COLOR_BLUE, type: "diamond" }
  ];

  return (
    <div className="absolute top-6 right-6 bg-white border border-gray-200 rounded p-4 shadow-sm">
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2 mb-2 last:mb-0">
          {item.type === 'line' ? (
            <div className="w-8 h-0.5" style={{ backgroundColor: item.color }} />
          ) : (
            <div className="w-3 h-3 rotate-45" style={{ backgroundColor: item.color }} />
          )}
          <span className="text-sm">{item.name}</span>
        </div>
      ))}
    </div>
  );
};
