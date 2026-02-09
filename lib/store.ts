import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BEAST_VARIANTS } from "./beasts";

export interface BeastState {
  photoUploaded: boolean;
  photoUrl: string | null;
  photoTemperature: "warm" | "cool" | null;
  beastVariant: string;
  beastName: string;
  goal: string | null;
  intention: string | null;
  rerollsLeft: number;
  xp: number;
  completedSteps: string[];
  subscribed: boolean;

  setPhotoUploaded: (url: string, temp: "warm" | "cool") => void;
  setPhotoSkipped: () => void;
  setBeastVariant: (variant: string) => void;
  setBeastName: (name: string) => void;
  setGoal: (goal: string) => void;
  setIntention: (intention: string | null) => void;
  reroll: () => string;
  addXp: (amount: number) => void;
  completeStep: (step: string, xpAmount: number) => void;
  setSubscribed: () => void;
  reset: () => void;
}

export const useBeastStore = create<BeastState>()(
  persist(
    (set, get) => ({
      photoUploaded: false,
      photoUrl: null,
      photoTemperature: null,
      beastVariant: BEAST_VARIANTS[0].id,
      beastName: "",
      goal: null,
      intention: null,
      rerollsLeft: 1,
      xp: 0,
      completedSteps: [],
      subscribed: false,

      setPhotoUploaded: (url, temp) => {
        // Pick a beast based on photo temperature
        const warmAnimals = BEAST_VARIANTS.filter(
          (v) => v.animal === "cat" || v.animal === "dog"
        );
        const coolAnimals = BEAST_VARIANTS.filter(
          (v) => v.animal === "parrot" || v.animal === "dog"
        );
        const pool = temp === "warm" ? warmAnimals : coolAnimals;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        set({
          photoUploaded: true,
          photoUrl: url,
          photoTemperature: temp,
          beastVariant: pick.id,
        });
      },

      setPhotoSkipped: () => {
        const random =
          BEAST_VARIANTS[Math.floor(Math.random() * BEAST_VARIANTS.length)];
        set({
          photoUploaded: false,
          photoUrl: null,
          beastVariant: random.id,
        });
      },

      setBeastVariant: (variant) => set({ beastVariant: variant }),

      setBeastName: (name) => set({ beastName: name }),

      setGoal: (goal) => set({ goal }),

      setIntention: (intention) => set({ intention }),

      reroll: () => {
        const { rerollsLeft, beastVariant } = get();
        if (rerollsLeft <= 0) return beastVariant;

        const currentIdx = BEAST_VARIANTS.findIndex(
          (v) => v.id === beastVariant
        );
        const nextIdx = (currentIdx + 1) % BEAST_VARIANTS.length;
        const nextVariant = BEAST_VARIANTS[nextIdx].id;

        set({ beastVariant: nextVariant, rerollsLeft: rerollsLeft - 1 });
        return nextVariant;
      },

      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),

      completeStep: (step, xpAmount) =>
        set((s) => {
          const steps = s.completedSteps ?? [];
          if (steps.includes(step)) return s;
          return {
            completedSteps: [...steps, step],
            xp: s.xp + xpAmount,
          };
        }),

      setSubscribed: () => set({ subscribed: true }),

      reset: () =>
        set((s) => ({
          photoUploaded: false,
          photoUrl: null,
          photoTemperature: null,
          beastVariant: BEAST_VARIANTS[0].id,
          beastName: "",
          goal: null,
          intention: null,
          rerollsLeft: 1,
          xp: 0,
          completedSteps: [],
          subscribed: s.subscribed, // preserve subscription
        })),
    }),
    {
      name: "diarybeast-state",
      version: 2,
      migrate: (persisted: unknown) => {
        const state = persisted as Record<string, unknown>;
        return { ...state, xp: 0, completedSteps: [], rerollsLeft: 1 };
      },
    }
  )
);
