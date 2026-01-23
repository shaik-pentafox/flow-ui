export function SVG() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-900"> 
      <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        {[...Array(12)].map((_, index) => (
          <circle
            key={index}
            cx={200 + Math.sin(index) * 80}
            cy={200 + Math.cos(index) * 80}
            r={15 + index}
            fill={`hsl(${(index * 36) % 360}, 70%, 50%)`}
            opacity={0.6 - index * 0.03}
          />
        ))}
      </svg>
    </div>
  );
}