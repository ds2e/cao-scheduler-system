function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 1, end.x, end.y
  ].join(' ');
}

export default function SpeedometerArc({ progress }) {
  const radius = 50;
  const angle = 290;
  const cx = 60;
  const cy = 60;

  const fullCircumference = 2 * Math.PI * radius;
  const arcLength = (angle / 360) * fullCircumference;
  const clampedValue = Math.min(Math.max(progress, 0), 1);
  const dashOffset = arcLength * (1 - clampedValue);

  // Now going from left (-145) to right (145)
  const arcPath = describeArc(cx, cy, radius, -145, 145);

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Arc */}
      <path
        d={arcPath}
        fill="none"
        strokeWidth="10"
        className="stroke-gray-200"
      />

      {/* Progress Arc */}
      <path
        d={arcPath}
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
        className="stroke-theme"
        strokeDasharray={arcLength}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
}
