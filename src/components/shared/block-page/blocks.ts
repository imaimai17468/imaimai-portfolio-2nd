export const BLOCKS = [
  {
    key: "history",
    label: "History",
    href: "/history",
    path: "M74.1914 99.5H0.5V75.3086L49.7764 50.6709L74.1914 99.5Z",
    cx: 35.38,
    cy: 81.22,
    bounds: { minX: 0.5, maxX: 74.19, minY: 50.67, maxY: 99.5 },
    scaleFactor: 1.3,
  },
  {
    key: "links",
    label: "Links",
    href: "/links",
    path: "M99.5 99.5H75.3086L50.6709 50.2236L99.5 25.8086V99.5Z",
    cx: 81.22,
    cy: 64.62,
    bounds: { minX: 50.67, maxX: 99.5, minY: 25.81, maxY: 99.5 },
    scaleFactor: 1.5,
  },
  {
    key: "projects",
    label: "Projects",
    href: "/projects",
    path: "M24.6914 0.5L49.3291 49.7764L0.5 74.1904V0.5H24.6914Z",
    cx: 18.78,
    cy: 35.38,
    bounds: { minX: 0.5, maxX: 49.33, minY: 0.5, maxY: 74.19 },
    scaleFactor: 1.5,
  },
  {
    key: "skills",
    label: "Skills",
    href: "/skills",
    path: "M99.5 0.5V24.6904L50.2236 49.3291L25.8086 0.5H99.5Z",
    cx: 64.62,
    cy: 18.78,
    bounds: { minX: 25.81, maxX: 99.5, minY: 0.5, maxY: 49.33 },
    scaleFactor: 1.3,
  },
] as const;

export type BlockKey = (typeof BLOCKS)[number]["key"];
