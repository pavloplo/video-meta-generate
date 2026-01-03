// Predefined widths for skeleton tags to avoid Math.random during render
const TAG_WIDTHS = [80, 90, 70, 95, 85, 75, 100, 65, 88, 92, 78, 83];

export const TagsSkeleton = () => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[120px] animate-pulse">
      <div className="flex flex-wrap gap-2">
        {TAG_WIDTHS.map((width, index) => (
          <div
            key={index}
            className="h-8 bg-slate-300 rounded-full"
            style={{
              width: `${width}px`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

