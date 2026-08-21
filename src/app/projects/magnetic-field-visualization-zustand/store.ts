import { create } from "zustand";

export interface SolenoidState {
	current: number;
	coilTurns: number;
	solenoidRadius: number;
	interCoilDistance: number;
	currentDirection: 1 | -1;

	// Actions
	setCurrent: (current: number) => void;
	setCoilTurns: (coilTurns: number) => void;
	setSolenoidRadius: (solenoidRadius: number) => void;
	setInterCoilDistance: (interCoilDistance: number) => void;
	setCurrentDirection: (currentDirection: 1 | -1) => void;
	toggleCurrentDirection: () => void;
}

export const useSolenoidStore = create<SolenoidState>((set) => ({
	current: 0,
	coilTurns: 6,
	solenoidRadius: 0.01,
	interCoilDistance: (4 / 3) * 0.01,
	currentDirection: 1,

	setCurrent: (current) => set({ current }),
	setCoilTurns: (coilTurns) => set({ coilTurns }),
	setSolenoidRadius: (solenoidRadius) => set({ solenoidRadius }),
	setInterCoilDistance: (interCoilDistance) => set({ interCoilDistance }),
	setCurrentDirection: (currentDirection) => set({ currentDirection }),
	toggleCurrentDirection: () =>
		set((state) => ({ currentDirection: state.currentDirection === 1 ? -1 : 1 })),
}));
