# Prompt 07 - DOCX/PDF exports and downloads

Run in a fresh session. Read `build_prompts/README.md` protocol, common references, Prompt 06 handoff, and v3 sections 4.1, 5, 6.2, 8, 10. Inspect actual uploaded template styles and pilot examples before promising pixel fidelity.

## Job

1. Render DOCX in a worker with real paragraph/table styles and a documented mapping from Template Schema/standard to Word styles. Preserve section order, source-safe content, deterministic tables, branding, and pagination as far as the format permits.
2. Render PDF with organization logo, header/footer, page numbers, and readable typography. Apply visible `Draft - not approved` watermark to any unapproved version. Approved final export is allowed only for a current approval bound to the exported version/hash.
3. Store exports in a private bucket under the organization, deduplicate repeated export jobs, log actor/time/version/format/watermark, and issue short-lived signed URLs after role and tenant checks. Validate downloaded format and content type.
4. Test a representative long report with tables, page breaks, special characters, and missing-data sections. Inspect DOCX in Word or LibreOffice and PDF visually. Record fidelity limits and explicit manual workarounds.

## Gate / stop

Pass EXP-01/02 and TEN-02. Demonstrate an approved final export, an unapproved watermarked export, an invalidated approval, cross-org download denial, expired URL, and successful file opening. Update build state and stop.
