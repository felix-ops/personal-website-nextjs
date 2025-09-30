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
		const navbarHeight = 68; // Height of the fixed navbar (h-16 = 64px)
		const elementPosition = element.offsetTop - navbarHeight;

		window.scrollTo({
			top: elementPosition,
			behavior: "smooth",
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

/**
 * Calculates the linear projection of an input value onto an output range, based on an input range.
 *
 * @param inputRange A tuple representing the start and end of the input range (inclusive).
 * @param outputRange A tuple representing the start and end of the output range (inclusive).
 * @param inputVal The input value to project onto the output range.
 * @returns The output value corresponding to the input value projected onto the output range.
 */
export function linearProjection(
	inputRange: [start: number, end: number],
	outputRange: [start: number, end: number],
	inputVal: number,
) {
	const outputVal =
		outputRange[0] + ((inputVal - inputRange[0]) * (outputRange[1] - outputRange[0])) / (inputRange[1] - inputRange[0]);

	return outputVal;
}

/**
 * Maps an input value from one range to another.  But unlike linearProjection with
 * mapRange we can pass any value as an inputval and when the inputval is within ActivationRange the values are directly
 * mapped to outputRange, otherwise the values will be clamped to the min and max of outputRange
 *
 * if inputVal is less than ActivationRange[start] the function will return outputRange[min], if its greater than ActivationRange[end]
 * it'll return outputRange[max].
 *
 * @param inputVal The input value to be mapped.
 * @param fromRange The range of the desired starting and ending point as a array [start, End].
 * @param toRange The desired output range as a array [min, max] "in the outputRange the argument min should be smaller than the max.
 * If you want to invert the mapping switch the 'Start' and 'End' values in the ActivationRange".
 * @returns The mapped output value within the specified output range.
 */

export function mapRange(
	inputVal: number,
	fromRange: [min: number, max: number],
	toRange: [min: number, max: number],
	clamp: boolean = true,
) {
	//If min is greater then max swap the values
	if (toRange[1] < toRange[0]) {
		toRange = [toRange[1], toRange[0]];
		fromRange = [fromRange[1], fromRange[0]];
	}

	let mapped_output = linearProjection([fromRange[0], fromRange[1]], [toRange[0], toRange[1]], inputVal);
	if (clamp) mapped_output = Math.max(toRange[0], Math.min(toRange[1], mapped_output));

	return mapped_output;
}

/**
 * takes two inputs a and b and returns a boolean of weather they are almost equal or not
 *
 * @param a value 1 for comparision
 * @param b value 2 for comparision
 * @param epsilon a small value which defines the precision of the comparision
 * @returns The boolean of whether they are almost equal or not
 */
export function almostEqual(a: number, b: number, epsilon: number = Number.EPSILON): boolean {
	return Math.abs(a - b) < epsilon;
}
