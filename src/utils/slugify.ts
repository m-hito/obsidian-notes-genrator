export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric chars
    .replace(/[\s_-]+/g, '-') // swap spaces/underscores with hyphen
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
    || 'obsidian-note';
}

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}
