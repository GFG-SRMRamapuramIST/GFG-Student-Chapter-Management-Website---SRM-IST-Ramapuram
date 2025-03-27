const medalStyles = {
  gold: {
    background: "bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600",
    glow: "shadow-yellow-400/50",
    inner: "bg-gradient-to-br from-yellow-50 to-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-400",
  },
  silver: {
    background: "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
    glow: "shadow-gray-400/50",
    inner: "bg-gradient-to-br from-gray-50 to-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  },
  bronze: {
    background: "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800",
    glow: "shadow-amber-500/50",
    inner: "bg-gradient-to-br from-amber-50 to-amber-100",
    text: "text-amber-800",
    border: "border-amber-500",
  },
  dailyActiveStreak: {
    background: "bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600",
    glow: "shadow-emerald-400/50",
    inner: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-400",
  },
  maxAvgPerDay: {
    background: "bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600",
    glow: "shadow-blue-400/50",
    inner: "bg-gradient-to-br from-blue-50 to-blue-100",
    text: "text-blue-700",
    border: "border-blue-400",
  },
};

const Medal = ({ 
  type = "bronze", 
  content, 
  size = "medium",
  showLabel = true,
  labelClassName = "mt-2 text-sm font-medium text-center text-gray-700"
}) => {
  const style = medalStyles[type] || medalStyles.bronze;
  
  const sizeClasses = {
    small: {
      outer: "w-12 h-12",
      inner: "w-9 h-9",
      text: "text-xs",
      border: "border-2",
      shadow: "shadow-md",
    },
    medium: {
      outer: "w-16 h-16 sm:w-18 sm:h-18",
      inner: "w-12 h-12 sm:w-14 sm:h-14",
      text: "text-sm sm:text-base",
      border: "border-2",
      shadow: "shadow-lg",
    },
    large: {
      outer: "w-20 h-20 sm:w-24 sm:h-24",
      inner: "w-16 h-16 sm:w-20 sm:h-20",
      text: "text-base sm:text-lg",
      border: "border-3",
      shadow: "shadow-xl",
    }
  };

  const sizes = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className="flex flex-col items-center justify-center relative group">
      <div
        className={`
          ${sizes.outer}
          ${style.background}
          ${sizes.shadow}
          ${style.glow}
          ${sizes.border}
          ${style.border}
          rounded-full flex items-center justify-center
          transform transition-all duration-300
          group-hover:scale-110 group-hover:rotate-3
        `}
      >
        <div
          className={`
            ${sizes.inner}
            ${style.inner}
            ${sizes.border}
            ${style.border}
            rounded-full flex items-center justify-center
            shadow-inner
          `}
        >
          <div className={`${sizes.text} font-bold ${style.text}`}>
            {typeof content === 'string' ? content.slice(0, 2).toUpperCase() : content}
          </div>
        </div>
      </div>
      {showLabel && (
        <div className={labelClassName}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Medal;