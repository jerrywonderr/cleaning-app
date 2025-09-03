export const useResponsiveSizes = (heightClassName?: string) => {
  const getResponsiveSizes = (heightClass: string) => {
    const heightMap: {
      [key: string]: { iconSize: number; fontSize: string; padding: number };
    } = {
      "h-8": { iconSize: 10, fontSize: "text-xs", padding: 3 },
      "h-10": { iconSize: 12, fontSize: "text-xs", padding: 4 },
      "h-12": { iconSize: 14, fontSize: "text-xs", padding: 6 },
      "h-14": { iconSize: 16, fontSize: "text-sm", padding: 8 },
      "h-16": { iconSize: 18, fontSize: "text-sm", padding: 10 },
      "h-20": { iconSize: 20, fontSize: "text-base", padding: 12 },
    };

    return heightMap[heightClass] || heightMap["h-12"];
  };

  const currentHeight = heightClassName || "h-12";
  return getResponsiveSizes(currentHeight);
};
