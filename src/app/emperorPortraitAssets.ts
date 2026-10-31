// Exclude ranked video covers so they are neither displayed nor bundled; standalone portraits are included.
const imageFiles = import.meta.glob<{ default: string }>(
  ['../../assets/emperor/source/*.jpg', '!../../assets/emperor/source/第*名_*.jpg'],
  { eager: true },
);

export const filenameToUrl: Record<string, string> = {};
for (const [path, module] of Object.entries(imageFiles)) {
  const filename = path.split('/').pop() ?? '';
  if (filename) filenameToUrl[filename] = module.default;
}
