import React, { useMemo } from "react";

interface TimelineProps {
	className?: string;
	labels: string[];
	currentIndex: number;
	setCurrentIndex: (index: number) => void;
}

// Helper to parse 'MMM YYYY' to timestamp
function parseMonthYear(str: string) {
	const [month, year] = str.split(" ");
	return new Date(`${month} 1, ${year}`).getTime();
}

const Timeline: React.FC<TimelineProps> = ({ labels, currentIndex, setCurrentIndex, className }) => {
	// Calculate timestamps from labels
	const timestamps = useMemo(() => labels.map(parseMonthYear), [labels]);
	// Calculate normalized positions
	const timelineData = useMemo(() => {
		const min = Math.min(...timestamps);
		const max = Math.max(...timestamps);
		const span = max - min || 1;
		return timestamps.map((ts) => (ts - min) / span);
	}, [timestamps]);

	return (
		<div className={className ? className : "max-w-5xl mx-auto mt-12 mb-10 px-4"}>
			{/* Labels above dots */}
			<div className="relative h-8 mb-3">
				{labels.map((label, index) => {
					const isActive = index === currentIndex;
					const pos = timelineData[index] * 100;
					return (
						<span
							key={index}
							className={`absolute text-sm font-medium text-center transition-all duration-200 whitespace-nowrap -translate-x-1/2 ${isActive ? "text-white font-bold -translate-y-2 scale-125 z-10" : "text-white/70"}`}
							style={{ left: `${pos}%` }}
						>
							{label}
						</span>
					);
				})}
			</div>

			{/* Dots and Progress Line */}
			<div className="relative flex items-center">
				{/* Background Line */}
				<div
					className="absolute top-1/2 left-0 h-[2px] bg-white/30 transform -translate-y-1/2 z-0"
					style={{ right: "-0.75rem" }}
				/>

				{/* Progress Line */}
				<div
					className="absolute top-1/2 left-0 h-[2px] bg-white transform -translate-y-1/2 z-10 transition-all duration-500"
					style={{
						width:
							currentIndex === timelineData.length - 1
								? `calc(${timelineData[currentIndex] * 100}% + 0.75rem)`
								: `${timelineData[currentIndex] * 100}%`,
					}}
				/>

				{/* Arrow */}
				<div
					className="absolute"
					style={{
						left: "calc(100% + 0.75rem)",
						top: "50%",
						transform: "translateY(-50%)",
						zIndex: 20,
					}}
				>
					<div
						className={
							`w-0 h-0 border-t-7 border-b-7 border-l-14 border-t-transparent border-b-transparent ` +
							(currentIndex === timelineData.length - 1 ? "border-l-white" : "border-l-white/60")
						}
					/>
				</div>

				{/* Dots */}
				{timelineData.map((_, index) => {
					const isActive = index === currentIndex;
					const isPast = index <= currentIndex;
					const pos = timelineData[index] * 100;
					return (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className="absolute z-20 w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center focus:outline-none cursor-pointer"
							style={{
								left: `calc(${pos}% - 0.625rem)`,
								backgroundColor: isPast ? "#ffffff" : "rgba(255,255,255,0.6)",
								borderColor: isPast ? "#ffffff" : "rgba(255,255,255,0.3)",
								boxShadow: isActive ? "0 0 10px rgba(255,255,255,0.6)" : "none",
							}}
						>
							<div className="w-2 h-2 bg-white rounded-full" />
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default Timeline;
