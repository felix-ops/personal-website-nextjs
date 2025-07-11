"use client";

import { Button } from "@/components/atoms/button";
import { scrollToSection } from "@/lib/utils";

interface ScrollButtonProps extends Omit<React.ComponentProps<typeof Button>, "onClick" | "href" | "type"> {
	target: string; // Section ID to scroll to (e.g., "#stories")
	children: React.ReactNode; // Button text or content
}

export function ScrollButton({ target, children, className, variant, size, ...props }: ScrollButtonProps) {
	return (
		<Button onClick={() => scrollToSection(target)} className={className} variant={variant} size={size} {...props}>
			{children}
		</Button>
	);
}
