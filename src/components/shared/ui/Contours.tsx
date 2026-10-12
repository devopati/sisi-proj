type ContoursProps = {
  seed?: number; // a different seed gives a different shape, e.g. pass the project id
  className?: string; // set the line colour with a text colour class, e.g. "text-tea/25"
};

// One wobbly closed line around the centre, like a contour line on a survey map
const contourPath = (radius: number, seed: number) => {
  const points = Array.from({ length: 64 }, (_, i) => {
    const angle = (i / 64) * Math.PI * 2;
    const wobble = 1 + 0.14 * Math.sin(3 * angle + seed) + 0.07 * Math.sin(5 * angle + seed * 1.7);
    const x = Math.cos(angle) * radius * wobble * 1.5;
    const y = Math.sin(angle) * radius * wobble;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M${points.join("L")}Z`;
};

const radii = [16, 34, 54, 76, 100, 126, 154, 184, 216];

// Decorative topographic lines used as covers for projects and wards
const Contours = ({ seed = 1, className = "" }: ContoursProps) => {
  const x = 110 + ((seed * 97) % 200);
  const y = 50 + ((seed * 53) % 140);
  const rotation = (seed * 37) % 180;

  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
      aria-hidden
      className={className}
    >
      <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
        {radii.map((radius) => (
          <path key={radius} d={contourPath(radius, seed + radius / 50)} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
};

export default Contours;
