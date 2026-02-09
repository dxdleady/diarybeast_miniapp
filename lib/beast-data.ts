export interface BeastVariant {
  id: string;
  name: string;
  animal: string;
  image: string;
}

export const BEAST_VARIANTS: BeastVariant[] = [
  { id: "cat_orange", name: "Orange Cat", animal: "cat", image: "/beast-cat-orange.png" },
  { id: "dog_golden", name: "Golden Dog", animal: "dog", image: "/beast-dog-golden.png" },
  { id: "parrot_green", name: "Green Parrot", animal: "parrot", image: "/beast-parrot-green.png" },
  { id: "cat_black", name: "Black Cat", animal: "cat", image: "/beast-cat-black.png" },
  { id: "dog_corgi", name: "Corgi", animal: "dog", image: "/beast-dog-corgi.png" },
  { id: "parrot_blue", name: "Blue Parrot", animal: "parrot", image: "/beast-parrot-blue.png" },
  { id: "dog_husky", name: "Husky", animal: "dog", image: "/beast-dog-husky.png" },
  { id: "parrot_rainbow", name: "Rainbow Parrot", animal: "parrot", image: "/beast-parrot-rainbow.png" },
];

export function getBeastImage(variantId: string): string {
  return (
    BEAST_VARIANTS.find((v) => v.id === variantId)?.image ??
    "/beast-cat-orange.png"
  );
}

export function getBeastDisplayName(variantId: string): string {
  return (
    BEAST_VARIANTS.find((v) => v.id === variantId)?.name ?? "Orange Cat"
  );
}

export const NAME_SUGGESTIONS = [
  "Mochi",
  "Luna",
  "Nimbus",
  "Pixel",
  "Cosmo",
] as const;

export function getRandomNameSuggestion(): string {
  return NAME_SUGGESTIONS[Math.floor(Math.random() * NAME_SUGGESTIONS.length)];
}
