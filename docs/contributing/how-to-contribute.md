# How to Contribute

JanVayu depends on community participation to document India's air quality crisis comprehensively. All contributions are welcome — from researchers, journalists, developers, and citizens.

---

## Types of Contributions

### Researchers
- Share datasets and papers on air pollution health impacts
- Help verify and fact-check existing content
- Contribute analysis and visualisations
- Translate research summaries into Indian languages

### Journalists
- Share verified investigative reports
- Document local air quality stories
- Archive important media coverage
- Contribute to the accountability tracker

### Developers
- Report bugs and suggest improvements
- Contribute code fixes and new features
- Build data visualisation tools
- Improve accessibility and performance

### Citizens
- Share firsthand testimonies (anonymised if preferred)
- Document local air quality conditions
- Help translate content into regional languages
- Spread awareness

### Designers
- Improve visual accessibility
- Create infographics and educational materials
- Help with UI/UX improvements

---

## For Code Contributions

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/JanVayu.git
cd JanVayu

# 3. Create a branch
git checkout -b feature/your-feature-name

# 4. Make your changes and test locally
netlify dev

# 5. Commit with a clear message
git commit -m "feat(dashboard): add PM10 toggle to city cards"

# 6. Push and open a Pull Request
git push origin feature/your-feature-name
```

Open your PR against the `main` branch on [github.com/Varnasr/JanVayu](https://github.com/Varnasr/JanVayu).

---

## For Content Contributions

1. **Open an Issue** on GitHub describing what you want to contribute
2. **Provide sources** — all content must be verifiable with a URL or document
3. **Include context** — explain why this is relevant to the JanVayu archive
4. If approved, a maintainer will guide you through adding it

---

## For Data Contributions

- Ensure data comes from a legitimate, verifiable source
- Provide clear attribution and licensing information
- Include methodology documentation if applicable
- Attach RTI responses or original documents where possible

---

## Pull Request Checklist

Before submitting a PR, verify:

- [ ] Changes work correctly in local development (`netlify dev`)
- [ ] No secrets or API keys are hardcoded in any file
- [ ] New environment variables are documented in `docs/technical/environment-variables.md`
- [ ] Code follows the [code standards](code-standards.md)
- [ ] Content follows the [content standards](content-standards.md)
- [ ] The site renders correctly on mobile (check in browser devtools)

---

## Questions?

- **Bugs:** [Open an Issue](https://github.com/Varnasr/JanVayu/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Varnasr/JanVayu/discussions)
- **Email:** [contribute@janvayu.in](mailto:contribute@janvayu.in)
