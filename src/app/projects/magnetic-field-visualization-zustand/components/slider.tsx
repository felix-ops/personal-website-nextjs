"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
	label?: string;
	showValue?: boolean;
	formatValue?: (v: number) => string;
};

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
	({ className, label, showValue = true, formatValue, ...props }, ref) => {
		const value = (props.value as number[] | undefined)?.[0];

		return (
			<div className={cn("w-full select-none", className)}>
				{label ? (
					<div className="mb-2 flex items-center justify-between">
						<span className="text-xs font-semibold uppercase tracking-wide text-color5">{label}</span>
						{showValue && typeof value === "number" ? (
							<span className="rounded bg-color6/60 px-2 py-0.5 text-[10px] font-semibold text-color4">
								{formatValue ? formatValue(value) : value}
							</span>
						) : null}
					</div>
				) : null}
				<SliderPrimitive.Root
					ref={ref}
					className={cn("relative flex w-full touch-none select-none items-center")}
					{...props}
				>
					<SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-color6">
						<SliderPrimitive.Range className="absolute h-full bg-color3" />
					</SliderPrimitive.Track>
					<SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-color3 bg-color3 shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-color4/10 disabled:pointer-events-none disabled:opacity-50" />
				</SliderPrimitive.Root>
			</div>
		);
	},
);
Slider.displayName = "Slider";

export { Slider };
