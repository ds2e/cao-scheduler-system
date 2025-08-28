import { useEffect, useState } from "react";
import SpeedometerArc from "./SpeedometerArc";
import { differenceInSeconds, parseISO } from "date-fns";

export default function Timer({ timeStart }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Compute initial elapsed time
    const start = parseISO(timeStart);
    const updateElapsed = () => {
      const now = new Date();
      const seconds = differenceInSeconds(now, start);
      setElapsed(seconds);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [timeStart]);

  // progress from 0 to 1 for the arc (e.g. 8 hours = full circle)
  const totalSeconds = 8 * 60 * 60; // 8h workday
  const progress = Math.min(elapsed / totalSeconds, 1);

  // format elapsed hh:mm:ss
  const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <SpeedometerArc progress={progress} />
      <span className="font-bold text-sm">{`${hours}:${minutes}:${seconds}`}</span>
    </div>
  );
}