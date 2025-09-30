"use client";

import BabylonScene from "@/components/organisms/babylon-renderer";
import { setup } from "./setup";
import { Slider } from "./components/slider";
import { Toggle } from "./components/toggle";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BabylonDemo() {
	const [current, setCurrent] = useState(0);
	const [coilTurns, setCoilTurns] = useState(6);
	const [solenoidRadius, setSolenoidRadius] = useState(0.01);
	const [interCoilDistance, setInterCoilDistance] = useState((4 / 3) * 0.01);
	const [currentDirection, setCurrentDirection] = useState<1 | -1>(1);
	const [controlsOpen, setControlsOpen] = useState(true);

	useEffect(() => {
		(window as any)._updateState?.({ current, isCurrentUpdated: true });
	}, [current]);

	useEffect(() => {
		(window as any)._updateState?.({ coilTurns, isCoilTurnsUpdated: true });
	}, [coilTurns]);

	useEffect(() => {
		(window as any)._updateState?.({ solenoidRadius, isSolenoidRadiusUpdated: true });
	}, [solenoidRadius]);

	useEffect(() => {
		(window as any)._updateState?.({ interCoilDistance, isInterCoilDistanceUpdated: true });
	}, [interCoilDistance]);

	useEffect(() => {
		(window as any)._updateState?.({ currentDirection, isCurrentDirectionUpdated: true });
	}, [currentDirection]);

	return (
		<div className="relative">
			<BabylonScene className="w-full h-screen" onSceneReady={setup} debug={true} />
			<div className="pointer-events-none absolute left-0 top-0 z-10 flex w-full justify-start p-4">
				{controlsOpen ? (
					<div className="pointer-events-auto relative w-full max-w-sm rounded-xl border border-color6/60 bg-color8/70 p-4 shadow-xl backdrop-blur-md">
						<button
							type="button"
							aria-label="Hide controls"
							onClick={() => setControlsOpen(false)}
							className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-color8 text-color4 shadow hover:bg-color6/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<div className="mb-2 pr-8 text-sm font-bold uppercase tracking-wide text-color2">Solenoid Properties</div>
						<div className="grid grid-cols-1 gap-4">
							<Slider
								label="Current"
								min={0}
								max={2}
								step={0.01}
								value={[current]}
								onValueChange={(v: number[]) => setCurrent(v[0] ?? 0)}
								formatValue={(v) => `${v.toFixed(3)} A`}
							/>
							<Slider
								label="Coil Turns"
								min={1}
								max={10}
								step={1}
								value={[coilTurns]}
								onValueChange={(v: number[]) => setCoilTurns(Math.round(v[0] ?? 1))}
								formatValue={(v) => `${Math.round(v)}`}
							/>
							<Slider
								label="Solenoid Radius"
								min={0.005}
								max={0.05}
								step={0.0001}
								value={[solenoidRadius]}
								onValueChange={(v: number[]) => setSolenoidRadius(v[0] ?? 0.01)}
								formatValue={(v) => `${(v * 100).toFixed(3)} cm`}
							/>
							<Slider
								label="Inter-coil Distance"
								min={0.0035}
								max={0.03}
								step={0.0001}
								value={[interCoilDistance]}
								onValueChange={(v: number[]) => setInterCoilDistance(v[0] ?? (4 / 3) * 0.01)}
								formatValue={(v) => `${(v * 100).toFixed(3)} cm`}
							/>
							<Toggle
								label="Current Direction"
								pressed={currentDirection === -1}
								onPressedChange={(pressed: boolean) => setCurrentDirection(pressed ? -1 : 1)}
							/>
						</div>
					</div>
				) : (
					<div className="pointer-events-auto">
						<button
							type="button"
							aria-label="Show controls"
							onClick={() => setControlsOpen(true)}
							className="inline-flex items-center gap-2 rounded-full border border-color6/60 bg-color8/70 px-3 py-1.5 text-xs font-semibold text-color5 shadow backdrop-blur-md hover:bg-color6/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<ChevronRight className="h-4 w-4" />
							Controls
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
