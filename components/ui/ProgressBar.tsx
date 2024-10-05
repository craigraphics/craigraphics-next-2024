const ProgressBar = ({ value, label, color, technologies }: { value: number; label: string; color: string; technologies: string[] }) => (
  <div className="mb-6">
    <div className="flex justify-between mb-1">
      <span className="text-base font-bold ">{label}</span>
      <span className="text-sm font-medium">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech, index) => (
        <span key={index} className="text-xs font-medium bg-slate-300 dark:bg-slate-700 px-2 py-1 rounded">
          {tech}
        </span>
      ))}
    </div>
  </div>
);

export default ProgressBar;
