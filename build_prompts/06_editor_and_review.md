# Prompt 06 - Draft editing, comments, and approval

Run in a fresh session. Read `build_prompts/README.md` protocol, common references, Prompt 05 handoff, and v3 sections 4.1, 5, 8, 9, 10. Confirm D04 and the final report transition policy in D12.

## Job

1. Implement structured section content and TipTap editing for headings, paragraphs, lists, and tables. Preserve deterministic table values separately from generated narrative and make them editable only through controlled input correction where appropriate.
2. Add autosave with revision/ETag conflict handling, source panel, section status/question display, comments, and immutable version snapshots. Restore creates a new version; it does not overwrite history.
3. Implement server-enforced transitions Draft -> In review -> Changes requested -> Approved. Record reviewer, time, decision, and exact report version/hash. Enforce the role/action matrix and self-approval decision. Any substantive edit after approval invalidates the approval and final-export eligibility.
4. Audit edits, comments, restores, and decisions. Ensure a cross-org report/section/comment ID cannot be used to read or mutate content. Cover two simultaneous editors and stale writes.

## Gate / stop

Pass REV-01/02 and TEN-01 for every new route. Demonstrate approval, an edit invalidating it, a stale autosave conflict, version restore, and a denied cross-org comment. Update build state and stop before exports.
