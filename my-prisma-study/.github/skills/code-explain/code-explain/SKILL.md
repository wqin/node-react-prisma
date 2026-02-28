---
name: code-explain
description: Explain code, functions, and file structure. Use when the user asks to interpret, summarize, or document source code, snippets, or repository layout.
---

# Code Explain

## Overview

`code-explain` helps the agent provide clear, succinct explanations of source code and repository structure. Trigger this skill when the user asks for:

- "Explain what this function does"
- "Summarize this file"
- "How does this module interact with others?"
- "Document the API of this codebase"

Keep explanations short (2–6 sentences) for quick answers, with an option to expand into step-by-step walkthroughs, example usages, or annotated code blocks when requested.

## Quick Patterns

- **Function explain**: Input: function snippet. Output: one-sentence purpose + explanation of inputs/outputs + complexity/side-effects.
- **File summary**: Input: entire file. Output: top-level responsibilities, important exported symbols, and external dependencies.
- **Repo overview**: Input: project root. Output: key folders, runtime entrypoints, main dependencies, and where to look for common tasks.

## Examples (triggers)

- "Explain this function" → returns purpose, params, return value, and side effects.
- "What does server.js do?" → returns brief summary of server responsibilities and exposed routes.
- "Where is the database logic?" → points to files and models related to DB and lists relevant functions.

## When To Expand

If user asks follow-ups like "How to change X" or "Show me an example", provide:

- short rationale for modification steps
- minimal code diff or snippet demonstrating the change
- tests or manual verification steps if applicable

## Resources

This skill does not require bundled scripts by default. Add small `references/` files for project-specific explanation patterns if desired.
