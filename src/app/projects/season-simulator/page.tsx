"use client";

import BabylonScene from "@/components/organisms/babylon-renderer";
import { setup } from "./setup";
import { useEffect, useState } from "react";

export default function BabylonDemo() {
	const [progress, setProgress] = useState(0);
	const [lat, setLat] = useState(45);
	const [stats, setStats] = useState({ dayHours: 12, sunAngle: 45 });
	const [isPlaying, setIsPlaying] = useState(false);
	const [showPath, setShowPath] = useState(true);
	const [cameraSynced, setCameraSynced] = useState(true);
	const [isSpinPlaying, setIsSpinPlaying] = useState(true);
	const [timeProgress, setTimeProgress] = useState(() => {
		const now = new Date();
		const gmtHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
		return gmtHours / 24;
	}); // 0 to 1 (GMT 0-24)
	const [isDragging, setIsDragging] = useState(false);
	const [isSpinDragging, setIsSpinDragging] = useState(false);

	// Initial State Sync setup is handled inside setup.ts via window binding,
	// but we need to listen for updates FROM setup.ts if we want the slider to move with autoplay
	useEffect(() => {
		// Define the update bridge
		(window as any)._updateState = (state: any) => {
			if (state.progress !== undefined && !isDragging) {
				setProgress(state.progress);
			}
			if (state.timeProgress !== undefined && !isSpinDragging) {
				setTimeProgress(state.timeProgress);
			}
			if (state.dayHours !== undefined) {
				setStats({
					dayHours: state.dayHours,
					sunAngle: state.sunAngle,
				});
			}
		};
	}, [isDragging, isSpinDragging]);

	const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const p = parseFloat(e.target.value);
		setProgress(p);
		(window as any).setOrbitProgress?.(p);
	};

	const togglePlay = () => {
		const newState = !isPlaying;
		setIsPlaying(newState);
		(window as any).setIsPlaying?.(newState);
	};

	const togglePath = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newState = e.target.checked;
		setShowPath(newState);
		(window as any).setShowOrbitPath?.(newState);
	};

	const toggleCameraSync = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newState = e.target.checked;
		setCameraSynced(newState);
		(window as any).setCameraSync?.(newState);
	};

	const toggleSpinPlay = () => {
		const newState = !isSpinPlaying;
		setIsSpinPlaying(newState);
		(window as any).setIsSpinPlaying?.(newState);
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const p = parseFloat(e.target.value);
		setTimeProgress(p);
		(window as any).setEarthSpinProgress?.(p);
	};

	const getFormattedGMT = (p: number) => {
		const totalHours = p * 24;
		const h = Math.floor(totalHours);
		const m = Math.floor((totalHours % 1) * 60);
		return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} GMT`;
	};

	const getFormattedDate = (p: number) => {
		// p=0 -> Jan 1
		const days = p * 365.25;
		// Base date: Jan 1, 2023
		const date = new Date(2023, 0, 1);
		date.setDate(date.getDate() + days);
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	};

	const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const l = parseFloat(e.target.value);
		setLat(l);
		(window as any).setLatitude?.(l);
	};

	return (
		<div className="relative">
			<BabylonScene className="w-full h-screen" onSceneReady={setup} debug={true} />
			<div className="pointer-events-none absolute left-0 top-0 z-10 flex w-full h-full flex-col justify-between p-6">
				{/* Header */}
				<div className="pointer-events-auto relative rounded-xl border border-white/10 bg-black/50 p-6 shadow-xl backdrop-blur-md max-w-md">
					<div className="flex justify-between items-start mb-2">
						<h1 className="text-2xl font-bold text-white">Season Simulator</h1>
					</div>

					<div className="mt-6 space-y-6">
						{/* Settings Toggles */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<label htmlFor="camera-sync" className="text-sm text-white font-medium block">
										Sync Camera with Orbit
									</label>
									<p className="text-[10px] text-gray-400 uppercase tracking-tighter">Fix Sun-Earth line on screen</p>
								</div>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										id="camera-sync"
										className="sr-only peer"
										checked={cameraSynced}
										onChange={toggleCameraSync}
									/>
									<div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
								</label>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<label htmlFor="orbit-path" className="text-sm text-white font-medium block">
										Show Orbit Path
									</label>
									<p className="text-[10px] text-gray-400 uppercase tracking-tighter">Elliptical Reference</p>
								</div>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										id="orbit-path"
										className="sr-only peer"
										checked={showPath}
										onChange={togglePath}
									/>
									<div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
								</label>
							</div>
						</div>

						{/* Orbit Control */}
						<div className="space-y-1">
							<div className="flex justify-between items-end h-8">
								<span className="text-white text-lg font-bold tabular-nums">{getFormattedDate(progress)}</span>
								<span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Orbit Progress</span>
							</div>

							<div className="relative pt-6 pb-2">
								{/* Seasonal Markers Grid - Aligned to Slider */}
								<div className="absolute top-0 left-11 right-0 h-4 flex text-[10px] font-bold text-gray-500 uppercase">
									<span className="absolute" style={{ left: "0%" }}>
										Jan
									</span>
									<span className="absolute" style={{ left: "21.9%", transform: "translateX(-50%)" }}>
										Mar
									</span>
									<span className="absolute" style={{ left: "47.1%", transform: "translateX(-50%)" }}>
										Jun
									</span>
									<span className="absolute" style={{ left: "72.3%", transform: "translateX(-50%)" }}>
										Sep
									</span>
									<span className="absolute" style={{ left: "97.2%", transform: "translateX(-100%)" }}>
										Dec
									</span>
								</div>

								<div className="flex items-center gap-3">
									<button
										onClick={togglePlay}
										className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white active:scale-95 shadow-lg border border-white/5"
										aria-label={isPlaying ? "Pause" : "Play"}
									>
										{isPlaying ? (
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
											</svg>
										) : (
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M8 5v14l11-7z" />
											</svg>
										)}
									</button>
									<input
										type="range"
										value={progress}
										min={0}
										max={1}
										step={0.0001}
										onChange={handleProgressChange}
										onPointerDown={() => setIsDragging(true)}
										onPointerUp={() => setIsDragging(false)}
										className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
									/>
								</div>
							</div>
							<p className="text-[10px] text-center text-gray-500 font-medium">
								{isPlaying ? "Simulation Running" : "Paused • Drag to explore"}
							</p>
						</div>

						{/* Earth Rotation (GMT) Control */}
						<div className="space-y-1">
							<div className="flex justify-between items-end h-8">
								<div className="flex items-center gap-2">
									<svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
										/>
									</svg>
									<span className="text-white text-lg font-bold tabular-nums">{getFormattedGMT(timeProgress)}</span>
								</div>
								<span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Time of Day (GMT)</span>
							</div>

							<div className="relative pt-6 pb-2">
								{/* Time Marks */}
								<div className="absolute top-0 left-11 right-0 h-4 flex text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
									<span className="absolute" style={{ left: "0%" }}>
										00:00
									</span>
									<span className="absolute" style={{ left: "25%", transform: "translateX(-50%)" }}>
										06:00
									</span>
									<span className="absolute" style={{ left: "50%", transform: "translateX(-50%)" }}>
										12:00
									</span>
									<span className="absolute" style={{ left: "75%", transform: "translateX(-50%)" }}>
										18:00
									</span>
									<span className="absolute" style={{ left: "100%", transform: "translateX(-100%)" }}>
										00:00
									</span>
								</div>

								<div className="flex items-center gap-3">
									<button
										onClick={toggleSpinPlay}
										className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white active:scale-95 shadow-lg border border-white/5"
										aria-label={isSpinPlaying ? "Pause Spin" : "Play Spin"}
									>
										{isSpinPlaying ? (
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
											</svg>
										) : (
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M8 5v14l11-7z" />
											</svg>
										)}
									</button>
									<input
										type="range"
										value={timeProgress}
										min={0}
										max={1}
										step={0.0001}
										onChange={handleTimeChange}
										onPointerDown={() => setIsSpinDragging(true)}
										onPointerUp={() => setIsSpinDragging(false)}
										className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
									/>
								</div>
							</div>
							<p className="text-[10px] text-center text-gray-500 font-medium">
								{isSpinPlaying ? "Rotation Active" : "Paused • Adjust GMT Time"}
							</p>
						</div>

						{/* Latitude Control */}
						<div className="space-y-3 bg-white/5 p-3 rounded-lg border border-white/5">
							<div className="flex justify-between items-center text-sm font-medium text-white">
								<span>Latitude: {lat.toFixed(0)}°</span>
								<span className="text-orange-300 font-bold">{stats.dayHours.toFixed(1)}h Daylight</span>
							</div>
							<input
								type="range"
								value={lat}
								min={-89}
								max={89}
								step={1}
								onChange={handleLatChange}
								className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
							/>
							<div className="flex justify-between text-[9px] text-gray-500 uppercase tracking-widest font-bold">
								<span>South Pole</span>
								<span>Equator</span>
								<span>North Pole</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
