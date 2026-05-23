# grabctx

Convert webpages and PDFs into clean, token-efficient markdown for AI models.

## Install

```bash
npm install -g grabctx
```

## Usage

```bash
# Convert a webpage
grabctx https://example.com

# Convert a PDF
grabctx ./document.pdf

# Copy output to clipboard
grabctx https://example.com --copy
grabctx ./document.pdf --copy

# Get help
grabctx --help
```

## Features

- Extracts main content from webpages (removes nav, ads, footers)
- Converts HTML to clean markdown
- Shows token count before and after
- Supports PDF files
- Copy to clipboard with `--copy` flag

## Limitations

- Does not work with JavaScript-heavy sites (Twitter, LinkedIn, npm)
- Works best with articles, blogs, wikis, and documentation pages

## License

MIT
