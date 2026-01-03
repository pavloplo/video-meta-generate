export const DescriptionSkeleton = () => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[120px] animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-slate-300 rounded w-full"></div>
        <div className="h-4 bg-slate-300 rounded w-11/12"></div>
        <div className="h-4 bg-slate-300 rounded w-full"></div>
        <div className="h-4 bg-slate-300 rounded w-10/12"></div>
        <div className="h-4 bg-slate-300 rounded w-full"></div>
        <div className="h-4 bg-slate-300 rounded w-9/12"></div>
      </div>
    </div>
  );
};

