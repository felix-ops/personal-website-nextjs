"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToggleProps = {
	pressed: boolean;
	onPressedChange: (pressed: boolean) => void;
	label?: string;
	className?: string;
};

export function Toggle({ pressed, onPressedChange, label, className }: ToggleProps) {
	return (
		<div className={cn("w-full select-none", className)}>
			{label ? (
				<div className="mb-2 flex items-center justify-between">
					<span className="text-xs font-semibold uppercase tracking-wide text-color5">{label}</span>
					<span className="text-[10px] font-semibold text-color5">{pressed ? "(Reverse)" : "(Forward)"}</span>
				</div>
			) : null}
			<button
				type="button"
				aria-pressed={pressed}
				onClick={() => onPressedChange(!pressed)}
				className={cn(
					"relative inline-flex h-7 w-12 items-center rounded-full bg-color7 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					pressed ? "bg-color5" : "bg-color5",
				)}
			>
				<span
					className={cn(
						"pointer-events-none inline-block h-5 w-5 translate-x-1 rounded-full bg-color6 shadow transition-transform",
						pressed ? "translate-x-1" : "translate-x-6",
					)}
				/>
			</button>
		</div>
	);
}
