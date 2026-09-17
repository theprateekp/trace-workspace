# Trace product-gap synthesis

## Executive conclusion

Across meeting platforms, team collaboration suites, project-management tools, and collaborative file editors, the recurring problem is not the absence of individual primitives. Users can already record meetings, send messages, edit files, create tasks, and generate summaries. The unmet need is a **trustworthy work record** that explains what was captured, where it came from, who can access it, what is ready, and what must happen next.

Trace should therefore be a **permission-aware conversation-to-work layer**, not another meeting client, chat system, document editor, or heavyweight project-management suite. Its core promise should be: **every decision and action is traceable to the source conversation, artifact, or timestamp, and every handoff makes capture and access limits explicit**.

This direction is supported by a consistent pattern in the research. Meeting products separate recordings, captions, transcripts, chats, summaries, and webinar channels, often with different settings and readiness times. [1] [3] [9] [10] Collaboration suites distribute work across chats, channels, meeting recaps, and file libraries. [14] [16] Project tools add state and automation but can bury decisions under notifications and setup overhead. [22] [25] [26] Collaborative editors provide co-authoring and version history, yet users still encounter export loss, opaque conflicts, and fragmented review handoffs. [30] [32] [33] [39] [41]

The MVP should make these boundaries visible and useful without claiming to repair the underlying source systems. A missing transcript must remain **not captured**, not become an apparently complete record. An inaccessible file must remain **restricted**, not be copied into Trace. An AI-generated action must remain a **reviewable suggestion** until a person confirms it.

## Recurring unmet needs

### 1. Capture is ambiguous and incomplete

A meeting may have recording, live captions, recorded captions, transcription, notes, chat, Q&A, polls, or attachments enabled independently. Availability depends on edition, administrator policy, host role, device, consent, and storage. [1] [2] [3] [4] Zoom likewise separates recording, transcript, chat, webinar channels, and AI notes; being recorded does not prove that every discussion channel was preserved. [7] [9] [10] [12] [13]

The product gap is a **capture ledger**. People need to see, before and during a session, which channels are active, who initiated them, who is covered by consent, where the output will live, and whether processing is complete. Afterward they need an explicit distinction between available, processing, partially captured, failed, blocked, and not captured.

### 2. The work record is fragmented across products and contexts

The same decision can be distributed across a meeting transcript, meeting chat, a channel thread, an email, a file comment, a task, and a recording timestamp. Teams places files in channel libraries and discussions in chats or posts, while meeting transcripts and recaps follow separate access paths. [14] [16] [18] Zoom exposes separate transcript, chat, recording, and summary artifacts. [9] [10] Users consequently spend time searching for a discussion rather than acting on it. Review evidence also describes delayed or inaccurate retrieval, notification overload, and costly context switching. [20] [21] [26] [27]

Trace should model the **relationships between artifacts**, not merely mirror their folders. A search result should carry its meeting, project, speaker, timestamp, nearby transcript or chat context, linked file, decision, and follow-up action. A decision should retain a deep link to the evidence from which it was made.

### 3. Permissions and ownership are difficult to understand at handoff

Access is conditional on organizer, host, participant, team role, channel type, storage location, external identity, and administrator policy. [2] [4] [15] [17] [19] Meeting and file artifacts can therefore be visible to one person but unavailable to another, even when both attended the same conversation. Ownership may also differ between the person who initiated capture, the meeting organizer, the storage owner, and the eventual editor.

Trace needs **permission explanation, not permission abstraction**. It should show the source of each access decision, the current audience, viewer/editor rights, storage location, and the consequence of sharing or revoking access. It should preserve the source system as authority instead of silently creating a second, conflicting access-control model.

### 4. AI output is useful only when evidence and uncertainty remain visible

Research on meeting summaries and transcripts reports missed points, unknown speakers, punctuation or audio-quality errors, incomplete chat, and poor timestamps. [11] [12] [13] This is not a reason to omit assistance; it is a reason to make assistance auditable.

Trace should attach every suggested decision, risk, and action to source excerpts, speakers, timestamps, confidence, and review status. It should support correction and version history. The user must be able to tell the difference between **source fact**, **human-edited record**, and **machine suggestion**.

### 5. Handoff breaks between conversation and execution

Project tools provide tasks, comments, state changes, notifications, and analytics, but chronological activity can bury the next action. Feature-rich systems can also create configuration overhead and notification noise. [22] [23] [24] [25] [26] [28] Files and presentations have a similar gap: comments, decisions, revisions, and approval status are not always unified into a durable delivery record. [33] [36] [37]

Trace should make the end of a conversation operational. A handoff should summarize what was captured, what remains processing, which decisions were confirmed, which actions have owners and due dates, who can view or edit the outputs, and what sharing step is still required.

### 6. Reliability and recovery are part of the product, not edge cases

Users encounter lag, slow search, crashes, incomplete uploads, timestamp anomalies, export-formatting loss, offline reconnect uncertainty, and opaque or destructive conflicts. [11] [20] [21] [37] [38] [39] [40] [41] These issues undermine trust more than a missing advanced feature does.

Trace should represent recovery explicitly. Processing failures need retry and reprocess controls. Missing source material needs a visible reason. Imported files need compatibility warnings and a conversion report. All derived records need stable source IDs, timestamps, actor metadata, and version history.

### 7. Stable, low-distraction interaction is a prerequisite

Public feedback reports inconsistent terminology and component behavior in meeting interfaces, as well as distracting active-speaker movement that can cause motion discomfort. [5] [6] The broader research also identifies notification overload and excessive configuration as adoption risks. [26] [27] [28]

Trace should use stable layouts, consistent names, keyboard-accessible capture, reduced-motion support, focus mode, and actionable notification defaults. These are not cosmetic refinements; they protect attention while users review consequential records.

## Prioritized MVP feature list

The priorities below are ordered by the smallest set that can deliver Trace's core promise. Each item should be evaluated against a simple acceptance test: **Can a user understand the source, completeness, access, and next action without opening five unrelated tools?**

### P0 — required for a credible first release

1. **Canonical work graph and source-of-truth model.** Define stable entities for workspace, project, conversation, event, artifact, evidence span, person, decision, action, permission snapshot, and revision. Every derived object must store its source artifact ID and location, such as a transcript offset, chat message ID, file comment ID, or meeting timestamp. Trace should display whether it is linking to the source or storing an authorized copy.

2. **Capture and processing ledger.** Provide preflight, live, and post-session status for recording, captions, transcript, chat, Q&A, files, speaker identification, and notes. Each status must include initiator, audience or consent state, destination, last update, and processing state. Use explicit states: `not configured`, `active`, `processing`, `ready`, `partial`, `failed`, `blocked`, and `not captured`.

3. **Unified, permission-aware timeline.** Present recording, speaker-labeled transcript, permitted chat, Q&A, links, files, decisions, and actions in one chronological view. Support filtering by speaker, channel, artifact type, and review status. Keep the original timestamps and indicate when chronology is uncertain or corrected.

4. **Evidence-linked decisions and actions.** Let a user create or approve a decision, risk, or action from a selected source span. Require owner, status, and optional due date for actions. Show the originating speaker, timestamp, excerpt, source link, confidence, editor, and revision history. Machine-generated candidates may accelerate capture but cannot become confirmed work without review.

5. **Contextual search and result bundles.** Search across the authorized work graph, then return a context bundle rather than an isolated hit. The bundle should include the meeting or project, speaker, timestamp, adjacent transcript and chat, linked files, decision, and follow-up task. Preserve access filtering at query time and make a restricted result explain that the user lacks access rather than implying that no record exists.

6. **Plain-language permission and ownership preview.** For every artifact and handoff, show owner, storage location, audience, viewer/editor rights, membership basis, expiration if applicable, and source-system authority. Explain common blockers such as host-only control, administrator policy, edition restriction, device restriction, consent, or unavailable storage. Do not promise access that the source system will not grant.

7. **End-of-session handoff checklist.** Generate a reviewable handoff that lists captured artifacts, missing or still-processing artifacts, confirmed decisions, proposed and confirmed actions, owners, viewers/editors, and the next sharing or export step. The checklist must be exportable as a link or document while retaining deep links back to Trace evidence.

8. **Trust and recovery foundations.** Add immutable source references, audit events, autosave and processing indicators, retry or reprocess actions, partial-result labels, and non-destructive version history. Include stable layouts, reduced-motion preference, focus mode, keyboard-friendly capture, and accessible status text from the first release.

### P1 — add after the core record is trusted

9. **One narrow source connector plus import fallback.** Start with one meeting or collaboration provider selected by the target customer. Support authorized ingestion of its recordings, transcripts, chats, and metadata, then offer file or link import for other systems. Design an adapter boundary for later providers rather than promising simultaneous Meet, Zoom, and Teams parity.

10. **Approved export and follow-through links.** Export reviewed notes and actions to one document or task destination, with a deep link back to evidence, export timestamp, source version, and sync status. Treat the first export as a controlled handoff, not as bidirectional synchronization.

11. **Review workflow for generated records.** Add low-confidence queues for unknown speakers, missing timestamps, transcript errors, incomplete chat, and questionable action extraction. Support assignment, comments, approval, rejection, and named milestones.

12. **Small-team notification controls.** Provide assignment and mention alerts, watch or unwatch, project-level preferences, quiet hours, and a digest. Notifications should point to the exact evidence or action that requires attention.

### Deliberately deferred capabilities

Full Kanban administration, WIP analytics, dependencies, workflow automation, cross-tenant identity switching, real-time document editing, presentation authoring, offline branch merging, webinar-scale replay, and broad ecosystem synchronization are valuable later but are not required to prove Trace's record-and-handoff thesis.

## Implementation shape and success criteria

Trace's first architecture should separate **source ingestion**, **normalized work records**, **derived intelligence**, and **delivery**. Ingestion stores provider IDs, raw timestamps, source permissions, and capture events. Normalization creates common entities without erasing provider-specific semantics, such as in-meeting versus continuous chat or public versus private webinar chat. Derived intelligence creates suggestions with evidence and confidence. Delivery exposes filtered views and controlled exports.

The minimum data contract for every artifact is: source provider and stable ID; artifact type; conversation or project; owner and permission snapshot; capture start and end; readiness state; content version; provenance links; and retention or deletion status. The minimum data contract for every decision or action is: source span; creator; machine or human origin; confidence; review state; current owner; current status; timestamps; and revision history.

MVP success should be measured by trust and retrieval rather than feature count. Recommended measures are the proportion of sessions with an understandable capture state, time to locate a cited decision, percentage of actions with an owner and source link, rate of handoffs with unresolved permission ambiguity, percentage of derived records with visible provenance, and recovery success after an incomplete or failed artifact. These metrics directly test the stated product promise.

## Explicit scope boundaries

1. **Trace is not a conferencing platform.** The MVP will not provide camera and microphone infrastructure, screen sharing, recording codecs, live captions, or meeting moderation. It will ingest authorized source artifacts and explain their state.

2. **Trace is not a replacement chat or channel system.** It will preserve links and permitted content from one selected source, but it will not recreate every provider's chat, retention, threading, reactions, or channel lifecycle semantics.

3. **Trace is not a document or slide editor.** It will link to source files and preserve approved notes or action records. It will not promise real-time co-authoring, pixel-perfect DOCX/PPTX conversion, slide themes, presenter view, or offline object-level conflict merging in the MVP.

4. **Trace is not a general project-management suite.** The initial task model is limited to actions created from evidence. It will not ship a full Jira-, Trello-, or enterprise-workflow replacement with custom schemes, complex dependencies, burndown variants, or broad automation.

5. **Trace will not manufacture missing evidence.** If a provider did not capture a chat, transcript, attachment, or participant identity, Trace will show `not captured` or `unknown`. AI may suggest an interpretation, but it may not silently fill the gap.

6. **Trace will not bypass source permissions or consent.** It will not scrape private content, copy restricted artifacts without authorization, or flatten provider-specific access rules into a weaker Trace permission. Source permissions remain authoritative, and every copied artifact requires an auditable authorization path.

7. **Trace will not promise universal provider parity at launch.** One provider and one controlled ingestion path are the credible starting point. Other providers can be added only when their capture, permission, retention, and deletion semantics have been mapped into the common model.

8. **Trace will not make autonomous commitments.** Generated summaries, decisions, risks, and actions require human review before they become the team's authoritative record or are exported to another system.

9. **Trace will not claim real-time completeness when processing is asynchronous.** A record can remain partial or processing for hours. The interface must preserve that uncertainty and provide retry, refresh, and handoff consequences.

10. **Trace will not optimize for visual novelty over stability.** Motion is restrained, layouts remain stable, and reduced-motion and keyboard access are baseline requirements. Advanced personalization can wait.

## Recommended build sequence

Build the source-aware data model, capture ledger, permission snapshot, and audit trail first. Then implement one provider adapter and the unified timeline. Add evidence-linked decisions and actions, contextual search, and the handoff checklist as the first end-to-end workflow. Only after those paths are reliable should Trace add generated suggestions, exports, notification policy, and additional connectors.

This sequence keeps the MVP credible: Trace earns trust by making the existing work record legible before it attempts to automate or replace the systems that produce it.

## References

[1]: https://support.google.com/a/users/answer/9850339?hl=en "Google Meet live meeting controls and features"
[2]: https://knowledge.workspace.google.com/admin/meet/manage-meet-settings "Google Workspace Meet settings administration"
[3]: https://support.google.com/meet/answer/9308681?hl=en&co=GENIE.Platform%3DAndroid "Google Meet recording, captions, and transcripts"
[4]: https://knowledge.workspace.google.com/admin/meet/turn-meeting-transcription-on-or-off "Google Workspace Meet transcription administration"
[5]: https://www.reddit.com/r/UXDesign/comments/1gxtvt9/google_meet_design_review_seamless_to_disruptive/ "Google Meet design review user feedback"
[6]: https://www.reddit.com/r/google/comments/1jqk5f4/new_google_meets_sucks/ "Google Meet user complaint about interface motion"
[7]: https://www.zoom.com/ "Zoom Workplace product overview"
[8]: https://www.zoom.com/en/products/webinars/resources/what-is-a-webinar/ "Zoom webinar capabilities and audience engagement"
[9]: https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0064927 "Zoom cloud recording audio transcript"
[10]: https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0067312 "Zoom meeting and webinar chat settings"
[11]: https://www.g2.com/products/zoom-workplace/reviews "Zoom Workplace user reviews"
[12]: https://community.zoom.com/webinars-19/webinar-chat-incomplete-812 "Zoom community report on incomplete webinar chat"
[13]: https://community.zoom.com/webinars-19/viewing-chat-in-recorded-webinar-1540 "Zoom community discussion of recorded webinar chat"
[14]: https://support.microsoft.com/en-us/teams/teams-channels/explore-the-new-chat-and-channels-experience-in-microsoft-teams "Microsoft Teams chat and channels experience"
[15]: https://support.microsoft.com/en-us/teams/teams-channels/standard-private-or-shared-channels-in-microsoft-teams "Microsoft Teams standard, private, and shared channels"
[16]: https://support.microsoft.com/en-us/teams/files/share-files-in-microsoft-teams "Sharing files in Microsoft Teams"
[17]: https://support.microsoft.com/en-us/teams/teams-channels/team-owner-member-and-guest-capabilities-in-microsoft-teams "Microsoft Teams owner, member, and guest capabilities"
[18]: https://support.microsoft.com/en-us/teams/meetings/start-stop-and-download-live-transcripts-in-microsoft-teams-meetings "Microsoft Teams meeting transcripts"
[19]: https://support.microsoft.com/en-us/teams/teams-channels/manage-team-settings-and-permissions-in-microsoft-teams "Microsoft Teams team settings and permissions"
[20]: https://feedbackportal.microsoft.com/feedback/forum/ad198462-1c1c-ec11-b6e7-0022481f8472 "Microsoft Teams feedback portal"
[21]: https://www.trustradius.com/products/microsoft-teams/reviews "Microsoft Teams user reviews on TrustRadius"
[22]: https://support.atlassian.com/jira-software-cloud/docs/monitor-work-in-a-kanban-project/ "Jira Kanban project monitoring"
[23]: https://support.atlassian.com/jira-software-cloud/docs/watch-share-and-comment-on-a-work-item/ "Jira work item comments and collaboration"
[24]: https://support.atlassian.com/jira-software-cloud/docs/generate-a-report/ "Jira reporting capabilities"
[25]: https://help.trello.com/category/1134-butler "Trello Butler automation"
[26]: https://www.capterra.com/resources/project-management-software-user-research/ "Capterra project-management software user research"
[27]: https://www.reddit.com/r/projectmanagement/comments/1ham1oo/do_project_management_tools_help_or_just_add_noise/ "Project-management tool user discussion"
[28]: https://www.microsoft.com/en-us/worklab/work-trend-index/breaking-down-infinite-workday "Microsoft Work Trend Index on fragmented work and notifications"
[29]: https://support.atlassian.com/jira-software-cloud/docs/use-jira-cloud-for-slack/ "Jira Cloud for Slack integration"
[30]: https://support.google.com/docs/answer/190843?hl=en&co=GENIE.Platform%3DDesktop "Google Docs collaboration and version history"
[31]: https://workspace.google.com/products/slides/ "Google Slides product capabilities"
[32]: https://support.microsoft.com/en-us/sharepoint/get-started-with-sharepoint/document-collaboration-and-co-authoring "SharePoint document collaboration and co-authoring"
[33]: https://support.microsoft.com/en-us/office/collab-files/view-previous-versions-of-office-files "Microsoft Office version history"
[34]: https://help.dropbox.com/delete-restore/version-history-overview "Dropbox version history"
[35]: https://www.dropbox.com/resources/real-time-editing "Dropbox real-time editing"
[36]: https://support.microsoft.com/en-us/powerpoint/track-changes-in-your-presentation "PowerPoint presentation review and tracked changes"
[37]: https://www.g2.com/products/gdocs/reviews?qs=pros-and-cons "Google Docs user reviews"
[38]: https://www.capterra.com/p/160756/Google-Docs/reviews/ "Capterra Google Docs user reviews"
[39]: https://www.reddit.com/r/GoogleSlides/comments/1fy58wb/slides_doesnt_maintain_background_template/ "Google Slides formatting feedback"
[40]: https://www.reddit.com/r/powerpoint/comments/zlx0l8/if_i_send_someone_my_google_slides_presentation/ "PowerPoint and Google Slides compatibility feedback"
[41]: https://www.reddit.com/r/sharepoint/comments/qxkbiz/constant_conflicts-when-coauthoring-in-sharepoint/ "SharePoint co-authoring conflict feedback"
