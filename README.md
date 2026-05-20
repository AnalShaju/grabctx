# grabctx

Convert webpages into clean, token-efficient markdown for AI models.

## Install

```bash
npm install -g grabctx
```

## Usage

```bash
# Print clean markdown to terminal
grabctx https://example.com

# Copy clean markdown to clipboard
grabctx https://example.com --copy

# Get help
grabctx --help
```

## Features

- Extracts main content from webpages (removes nav, ads, footers)
- Converts HTML to clean markdown
- Shows token count before and after
- Copy to clipboard with `--copy` flag

## Limitations

- Does not work with JavaScript-heavy sites (Twitter, LinkedIn, npm)
- Works best with articles, blogs, wikis, and documentation pages

## License

MIT
