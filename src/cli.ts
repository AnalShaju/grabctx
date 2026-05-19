import { parseHTML } from "linkedom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
const args = process.argv;
const input = args[2];
if (!input) {
  console.log("Error: Please provide a URL");
  console.log("Usage: context-forge <url>");
  process.exit(1);
}
console.log("You entered:", input);
async function fetchData(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const { document } = parseHTML(html);
  const reader = new Readability(document);
  const article = reader.parse();
  if (!article) {
    console.log("Error: Could not extract content from this URL");
    console.log(
      "Tip: Works best with articles, blogs, and documentation pages",
    );
    process.exit(1);
  }
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(article.content ?? "");
  const fullMarkdown = `# ${article.title}\n\n${markdown}`;
  console.log(fullMarkdown);
}

fetchData(input);
