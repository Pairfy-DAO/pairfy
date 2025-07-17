# 🤝 Contributing Guide

Thank you for your interest in contributing to this open-source project governed by a Decentralized Autonomous Organization (DAO). We are committed to building in public, with transparency, fairness, and inclusiveness.

This guide outlines how to contribute, how decisions are made, and what to expect as a contributor or maintainer.

---

## ✅ General Requirements

Before contributing:

- Please read and agree to our [Code of Conduct](CODE_OF_CONDUCT.md).
- Ensure your proposed change aligns with the DAO's mission and roadmap.
- For significant changes, open a GitHub Discussion or community proposal before submitting a PR.
- Respect our [license](LICENSE) and community rules.

---

## 🧩 Types of Contributions

You can contribute in many ways:

- Reporting bugs
- Suggesting new features or improvements
- Fixing typos or documentation errors
- Reviewing and commenting on others' pull requests
- Participating in governance discussions and proposals

---

## 🛠️ How to Get Started

1. **Fork this repository**
2. **Create a branch for your changes:**
   ```bash
   git checkout -b feature/your-change-name
   ```

3. **Make your changes and commit regularly.**

4. **Run tests and linters:**
   ```bash
   npm test
   # or
   pytest
   # depending on your project
   ```

5. **Open a Pull Request (PR) and include:**
   - What the change does
   - Why it's needed
   - Link to the related issue, discussion, or DAO proposal (if applicable)

---

## 📋 Pull Request Requirements

All PRs must:

- Be scoped and focused on a single topic.
- Pass all tests and linter checks.
- Include updated documentation if behavior changes.
- Link to a DAO proposal or discussion if the change is major.

### Approval Rules

| Change Type | Minimum Reviews | DAO Vote Required |
|-------------|----------------|-------------------|
| Typos / Docs | 1 maintainer | No |
| Bug fixes / Minor features | 2 maintainers | No |
| Core logic / Contracts | 2–3 maintainers | Yes |
| Structural / Governance changes | Community discussion + vote | Yes |

**Note:** PRs must remain open for at least 72 hours before being merged (unless critical fix).

---

## 🔄 Keeping Your Fork in Sync

To stay updated with the main repository:

```bash
git remote add upstream https://github.com/dao-org/project.git
git fetch upstream
git checkout main
git rebase upstream/main
```

Then push to your fork:

```bash
git push origin main
```

---

## 👥 Becoming a Maintainer

Maintainers help review PRs, ensure code quality, and support contributors.

**To become a maintainer:**

- Have at least 5 accepted PRs.
- Be active for at least 2 months.
- Be proposed and approved via DAO vote (e.g., Snapshot).
- Follow the community rules and review in good faith.

**Note:** Maintainer inactivity or misconduct may lead to removal via a community vote.

---

## 🗳️ DAO Governance Integration

As a DAO-governed project, major decisions follow community-driven processes.

**Decisions requiring governance:**

- Changes to project architecture or direction
- Adding/removing maintainers
- Modifying contribution or licensing rules
- Deploying on-chain contracts

**Governance tools may include:**

- Snapshot for off-chain voting
- Discussions for proposals and deliberation
- On-chain platforms like Aragon or Tally for binding votes

---

## 📁 Repo Structure (Recommended)

```
project-root/
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── service-*/
├── tests/
├── README.md
├── LICENSE
├── CHANGELOG.md
```

---

## 🙌 Thank You

Your contribution helps build a stronger, more transparent and decentralized ecosystem. If you're unsure where to start, check out our **Good First Issues**, or ask in our community chat.

**Together, we DAO.** 🚀