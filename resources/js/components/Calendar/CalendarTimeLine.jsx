import { useEffect, useRef } from "react";

export default function CalendarTimeLine({
    date = new Date(),
    renderCellContent,
    requestSwitchView
}) {
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const isDragging = useRef(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const scrollLeft = useRef(0);
    const scrollTop = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        const contentContainer = contentRef.current;

        const onMouseDown = (e) => {
            isDragging.current = true;
            startX.current = e.pageX - container.offsetLeft;
            startY.current = e.pageY - container.offsetTop;
            scrollLeft.current = container.scrollLeft;
            scrollTop.current = container.scrollTop;
        };

        const onMouseUp = () => {
            isDragging.current = false;
        };

        const onMouseLeave = () => {
            isDragging.current = false;
        };

        const onMouseMove = (e) => {
            if (!isDragging.current) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const y = e.pageY - container.offsetTop;
            const walkX = x - startX.current;
            const walkY = y - startY.current;
            container.scrollLeft = scrollLeft.current - walkX;
            container.scrollTop = scrollTop.current - walkY;
        };

        const updateHeight = () => {
            if (container) {
                const offsetTop = container.offsetTop;
                const availableHeight = window.innerHeight - offsetTop;
                container.style.height = `${availableHeight}px`;

                const offsetTopContent = offsetTop + (Math.abs(offsetTop - contentContainer.offsetTop));
                const availableHeightContent = window.innerHeight - offsetTopContent;
                contentContainer.style.height=`${availableHeightContent}px`;
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);

        container.addEventListener('mousedown', onMouseDown);
        container.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mouseleave', onMouseLeave);
        container.addEventListener('mousemove', onMouseMove);

        return () => {
            container.removeEventListener('mousedown', onMouseDown);
            container.removeEventListener('mouseup', onMouseUp);
            container.removeEventListener('mouseleave', onMouseLeave);
            container.removeEventListener('mousemove', onMouseMove);

            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    const currentHour = new Date().getHours();
    const rowNum = 3;

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0') + ':00');
    const rows = Array.from({ length: rowNum }, (_, i) => i); // Can represent users or time blocks

    const rowHeightFraction = `grid-rows-${rowNum}`;

    return (
        <>
            <div className="flex flex-col items-center justify-center place-content-center sticky top-16 py-2 z-10 bg-gray-800">
                <div className='flex items-center justify-center gap-4'>
                    <button
                        // onClick={handleMonthNavBackButtonClick} 
                        className='cursor-pointer fill-white'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25}>
                            <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z" />
                        </svg>
                    </button>
                    <select
                        className="month-select text-white"
                    // value={month}
                    // onChange={handleMonthSelect}
                    >
                        {/* {getMonthDropdownOptions().map(({ label, value }) => (
                        <option value={value} key={value} className='text-black'>
                            {label}
                        </option>
                    ))} */}
                    </select>
                    <button
                        // onClick={handleMonthNavForwardButtonClick} 
                        className='cursor-pointer fill-white'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25}>
                            <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z" />
                        </svg>
                    </button>
                    <select
                        className="year-select text-white"
                    // value={year}
                    // onChange={handleYearSelect}
                    >
                        {/* {getYearDropdownOptions(year).map(({ label, value }) => (
                        <option value={value} key={value} className='text-black'>
                            {label}
                        </option>
                    ))} */}
                    </select>
                    <button onClick={() => requestSwitchView()} className="px-2 py-1 text-white border-[1px] border-white rounded-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width={20} height={20} className='fill-white'>
                            <path d="M128 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm32 97.3c28.3-12.3 48-40.5 48-73.3c0-44.2-35.8-80-80-80S48 51.8 48 96c0 32.8 19.7 61 48 73.3L96 224l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0 54.7c-28.3 12.3-48 40.5-48 73.3c0 44.2 35.8 80 80 80s80-35.8 80-80c0-32.8-19.7-61-48-73.3l0-54.7 256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-54.7c28.3-12.3 48-40.5 48-73.3c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 32.8 19.7 61 48 73.3l0 54.7-320 0 0-54.7zM488 96a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM320 392a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div
                ref={containerRef}
                className="w-full relative overflow-auto cursor-grab active:cursor-grabbing select-none border rounded-md mt-16"
            >

                <div className="grid grid-cols-24 min-w-[1200px] sticky top-0">
                    {hours.map((hour, i) => (
                        <div
                            key={i}
                            className="w-[50px] h-12 text-center text-xs text-gray-700 bg-gray-100 border-b border-r pt-2"
                        >
                            {hour}
                        </div>
                    ))}
                </div>

                <div ref={contentRef} className={`grid grid-cols-24 ${rowHeightFraction} min-w-[1200px]`}>
                    {rows.map((row) =>
                        hours.map((_, col) => (
                            <div
                                key={`${row}-${col}`}
                                className="w-[50px] border border-gray-200 bg-white text-sm text-gray-800"
                            >
                                {renderCellContent ? renderCellContent(row, col) : null}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>

    );
}