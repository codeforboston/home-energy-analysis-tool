import { COLOR_ORANGE, COLOR_BLUE } from '../constants.ts'

export const WholeHomeUAComparisonLegend = () => {
  const legendItems = [
    { name: "This Home", color: COLOR_ORANGE, type: "circle", isThisHome: true },
    { name: "Comparison Homes", color: COLOR_BLUE, type: "circle" },
    { name: "Trend Line", color: "#333", type: "line" }
  ];

  return (
    <div className="absolute bottom-20 right-6 bg-white border border-gray-200 rounded p-4 shadow-sm z-10">
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2 mb-2 last:mb-0">
          {item.type === 'line' ? (
            <div className="w-8 h-0.5" style={{ backgroundColor: item.color }} />
          ) : (
            <div 
              className={`${item.isThisHome ? 'w-4 h-4' : 'w-3 h-3'} rounded-full`} 
              style={{ 
                backgroundColor: item.color,
                border: item.isThisHome ? '1px solid black' : 'none'
              }} 
            />
          )}
          <span className="text-sm">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default WholeHomeUAComparisonLegend;