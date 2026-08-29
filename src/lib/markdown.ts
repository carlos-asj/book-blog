import { remark } from 'remark';
import strip from 'strip-markdown';

export async function markdownToPlainText(markdown: string) {
  const file = await remark().use(strip).process(markdown);
  return String(file).trim();
}