import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Post } from "@/data/post-types";
import { format, parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function scrollToSection(sectionId: string) {
	const element = document.getElementById(sectionId.replace("#", ""));
	if (element) {
		element.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}
}

export function formatToFullDate(date: string) {
	try {
		const dateObj = new Date(date);
		if (!isNaN(dateObj.getTime())) {
			return format(dateObj, "EEE, MMM d, yyyy");
		}
	} catch {}
	return date;
}

/**
 * Sorts any array of items by date recency using a date extractor.
 * @param list Array of items
 * @param getDate Function that returns the date string from each item
 */
export function sortByDateRecency<T>(list: T[], getDate: (item: T) => string): T[] {
	const inputFormat = "EEE, MMM d, yyyy";
	return [...list].sort((a, b) => {
		const dateA = parse(getDate(a), inputFormat, new Date());
		const dateB = parse(getDate(b), inputFormat, new Date());
		return dateB.getTime() - dateA.getTime(); // recent first
	});
}

export function formatPosts(rawPosts: Post[]) {
	//Fix any improper date format
	rawPosts.forEach((post) => {
		post.date = formatToFullDate(post.date);
	});

	//sort by date before returning
	return sortByDateRecency(rawPosts, (post) => post.date);
}
