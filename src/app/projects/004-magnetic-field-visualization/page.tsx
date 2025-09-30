"use client";

import BabylonScene from "@/components/organisms/babylon-renderer";
import { setup } from "./setup";
import { Slider } from "./components/slider";
import { Toggle } from "./components/toggle";
import { useEffect, useState } from "react";

export default function BabylonDemo() {
	const [current, setCurrent] = useState(0);
	const [coilTurns, setCoilTurns] = useState(6);
	const [solenoidRadius, setSolenoidRadius] = useState(0.01);
	const [interCoilDistance, setInterCoilDistance] = useState((4 / 3) * 0.01);
	const [currentDirection, setCurrentDirection] = useState<1 | -1>(1);

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
				<div className="pointer-events-auto w-full max-w-sm rounded-xl border border-color6/60 bg-color8/70 p-4 shadow-xl backdrop-blur-md">
					<div className="mb-2 text-sm font-bold uppercase tracking-wide text-color2">Solenoid Properties</div>
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
			</div>
		</div>
	);
}
