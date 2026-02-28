#!/usr/bin/env node

/**
 * Example helper script for code-explain
 *
 * This is a placeholder script that can be executed directly.
 * Replace with actual implementation or delete if not needed.
 *
 * Example real scripts from other skills:
 * - pdf/scripts/fill_fillable_fields.cjs - Fills PDF form fields
 * - pdf/scripts/convert_pdf_to_images.cjs - Converts PDF pages to images
 *
 * Agentic Ergonomics:
 * - Suppress tracebacks.
 * - Return clean success/failure strings.
 * - Truncate long outputs.
 */

async function main() {
  try {
    // This example script is a no-op helper used by the skill packaging flow.
    process.stdout.write("Success: example_script executed.\n");
  } catch (err) {
    // Trap the error and output a clean message instead of a noisy stack trace
    process.stderr.write(`Failure: ${err.message}\n`);
    process.exit(1);
  }
}

main();
