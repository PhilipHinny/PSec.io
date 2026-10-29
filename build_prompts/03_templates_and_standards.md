# Prompt 03 - Template and Report Standard pipeline

Run in a fresh session. Read `build_prompts/README.md` protocol, common references, Prompt 02 handoff, and v3 sections 3, 4.1, 5, 8, 9, 10, Appendix A/B. Resolve D03, D06, and the document-retention part of D08.

## Job

1. Build the authenticated upload flow for DOCX/PDF and 3-10 example reports. Validate type, size, checksum, malformed/encrypted files, and scanning/quarantine policy. Use private storage, org-prefixed keys, and server-authorized signed upload/download operations. Expose parse status and useful errors.
2. Extract headings, tables, placeholders, and basic styles with source locations. Create a versioned Template Schema that an Admin can reorder/edit/mark required and publish. Failed parsing must lead to manual schema editing.
3. Extract a Report Standard from approved examples: section order, tone, terms, banned phrases, boilerplate, and length guidance. Store source provenance and make every field editable before publishing. Ensure prompt-injection text from documents cannot become system instructions.
4. Seed the three NGO templates in v3 Appendix B. Preserve immutable versions; reports will pin exact versions. Add role/tenant checks to all document, template, standard, chunk, and storage operations.

## Gate / stop

Pass TMP-01/02/03 and relevant TEN-01/02 cases with representative real DOCX/PDF fixtures. Demonstrate one parse failure and manual recovery, one version change leaving an older snapshot stable, and cross-org signed URL denial. Update build state and stop.
