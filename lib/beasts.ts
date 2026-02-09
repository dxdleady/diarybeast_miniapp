export {
  type BeastVariant,
  BEAST_VARIANTS,
  getBeastImage,
  getBeastDisplayName,
  NAME_SUGGESTIONS,
  getRandomNameSuggestion,
} from "./beast-data";

export function getImageTemperature(
  file: File
): Promise<"warm" | "cool"> {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    img.onload = () => {
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      const data = ctx.getImageData(0, 0, 50, 50).data;

      let r = 0;
      let b = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        b += data[i + 2];
      }

      resolve(r > b ? "warm" : "cool");
    };

    img.src = URL.createObjectURL(file);
  });
}
