#!/usr/bin/env node
import { Command } from "commander";
import { parseHTML } from "linkedom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { encode } from "gpt-tokenizer";
import chalk from "chalk";
import clipboard from "clipboardy";
import ora from "ora";
import figlet from "figlet";
console.log(figlet.textSync("grabctx"));
const program = new Command();
program
  .name("grabctx")
  .description("Convert any webpage to AI-ready markdown")
  .argument("<url>", "URL to convert")
  .option("--copy", "copy output to clipboard");
program.parse();
const url = program.args[0];
const options = program.opts();

console.log(chalk.gray("You entered:", url));
const spinner = ora("Fetching URL...").start();
async function fetchData(url: string) {
  const response = await fetch(url);
  spinner.text = "Extracting content...";
  const html = await response.text();
  const originalTokens = encode(html);
  const { document } = parseHTML(html);
  const reader = new Readability(document);
  const article = reader.parse();
  spinner.text = "Converting to markdown";
  if (!article) {
    spinner.fail("Could not extract content");
    console.error(chalk.red("Error: Could not extract content from this URL"));
    console.error(
      chalk.yellow(
        "Tip: Works best with articles, blogs, and documentation pages",
      ),
    );
    process.exit(1);
  }
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(article.content ?? "");
  const fullMarkdown = `# ${article.title}\n\n${markdown}`;
  const cleanedTokens = encode(fullMarkdown);
  spinner.succeed("Done!");
  console.log("Token used before: ", originalTokens.length);
  console.log(chalk.cyan("Tokens used After: ", cleanedTokens.length));
  const savings = Math.round(
    (1 - cleanedTokens.length / originalTokens.length) * 100,
  );
  console.log(chalk.bold.green(`Saved: ${savings}%`));
  if (options.copy) {
    await clipboard.write(fullMarkdown);
    console.log(chalk.green("✅ Copied to clipboard"));
  }
}

fetchData(url);
