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
import { PDFParse } from "pdf-parse";
import { readFileSync } from "node:fs";
console.log(figlet.textSync("grabctx"));
const program = new Command();
program
  .name("grabctx")
  .description("Convert any webpage to AI-ready markdown")
  .argument("<input>", "URL to convert")
  .option("--copy", "copy output to clipboard");
program.parse();
const input = program.args[0];
const options = program.opts();
// url
if (input.startsWith("http")) {
  console.log(chalk.gray("You entered:", input));
  const spinner = ora("Fetching URL...").start();
  async function fetchData(input: string) {
    const response = await fetch(input);
    spinner.text = "Extracting content...";
    const html = await response.text();
    const originalTokens = encode(html);
    const { document } = parseHTML(html);
    const reader = new Readability(document);
    const article = reader.parse();
    spinner.text = "Converting to markdown";
    if (!article) {
      spinner.fail("Could not extract content");
      console.error(
        chalk.red("Error: Could not extract content from this URL"),
      );
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
  fetchData(input);
} else if (input.endsWith(".pdf")) {
  console.log(chalk.gray("You entered:", input));
  const spinner = ora("Fetching Content...").start();
  async function fetchPdf(input: string) {
    const buffer = readFileSync(input);
    const unit8Array = new Uint8Array(buffer);
    const parser = new PDFParse(unit8Array);
    spinner.text = "Extracting content...";
    spinner.text = "Converting to markdown";
    const result = await parser.getText();
    const cleanedText = result.text
      .replace(/-- \d+ of \d+ --/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    spinner.succeed("Done!");

    const originalTokens = encode(result.text);
    const cleanedTokens = encode(cleanedText);
    console.log("Token used before: ", originalTokens.length);
    console.log(chalk.cyan("Tokens used After: ", cleanedTokens.length));
    const savings = Math.round(
      (1 - cleanedTokens.length / originalTokens.length) * 100,
    );
    console.log(chalk.bold.green(`Saved: ${savings}%`));
    if (options.copy) {
      await clipboard.write(cleanedText);
      console.log(chalk.green("✅ Copied to clipboard"));
    }
  }
  fetchPdf(input);
}
