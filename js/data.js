/* ============ FRAMEWORK DATA ============
   Scenario text, choices and the mitigation intervention library.
   Ported verbatim from the approved reference (noesis-demo-v5.html) —
   do not edit narrative text, choices or scoring-relevant structure. */

export const SCENARIOS = [
  {
    id: 'anchoring',
    label: 'Anchoring',
    title: 'Vendor Anomaly',
    kind: 'reassess',
    narrative: `A critical vendor supporting payment processing has shown anomalous traffic patterns in the systems that connect to the vendor for payment processing over the last 48 hours. Your internal monitoring team flags the anomaly as "likely related to a scheduled infrastructure update on the vendor's side," citing an email from the vendor confirming planned maintenance during this period. There is no direct evidence of compromise yet. The vendor has been a partner for six years, with no known prior security incidents.`,
    prompt: 'Initial decision — what do you do?',
    choices: [
      { id: 'A', text: 'Accept the vendor\'s explanation — no immediate escalation is necessary.' },
      { id: 'B', text: 'Proceed with an independent verification before closing the case.' },
      { id: 'C', text: 'Request detailed logs from the vendor before deciding.' }
    ],
    confidence: true,
    injected: {
      label: 'Update',
      text: 'Six hours later, an independent analysis of network traffic finds that the anomalous patterns do not match typical infrastructure-update behaviour. Two IPs involved in the data exchange do not appear on the vendor\'s declared asset list.'
    },
    reassessPrompt: 'Does this change your initial assessment?',
    reassessChoices: [
      { id: 'A', text: 'No — I maintain the vendor\'s explanation; likely a false alarm.' },
      { id: 'B', text: 'Partially — I raise the attention level but don\'t open incident response yet.' },
      { id: 'C', text: 'Yes — I open incident response immediately.' }
    ]
  },
  {
    id: 'confirmation',
    label: 'Confirmation bias',
    title: 'Insider Data Access',
    kind: 'sources',
    narrative: `The Data Loss Prevention system flags that an R&D employee downloaded an unusually high volume of confidential documents in the last 24 hours, shortly before scheduled leave. The employee has legitimate access to those documents as part of their role. No other information is available yet.`,
    prompt: 'Initial hypothesis — what\'s your read on this?',
    choices: [
      { id: 'A', text: 'Likely preparing for legitimate work-related activity during leave.' },
      { id: 'B', text: 'Could be an attempt to exfiltrate data before going on leave.' },
      { id: 'C', text: 'Not enough information to form a hypothesis yet.' }
    ],
    confidence: true,
    sourcesPrompt: 'Before reporting to the CISO, you have time to check two of the following. Which do you choose?',
    sourceHint: 'Select exactly 2',
    sources: [
      { id: 1, text: 'This employee\'s history of similar downloads/access in previous months.' },
      { id: 2, text: 'Any HR signals — recent reviews, negative evaluations, indications of departure.' },
      { id: 3, text: 'Confirmation from the direct manager on standard practice of backing up materials before leave.' },
      { id: 4, text: 'Whether the downloaded files were shared or sent to external emails or personal devices.' }
    ],
    finalPrompt: 'Final decision',
    finalChoices: [
      { id: 'A', text: 'Close the case — behaviour is not anomalous.' },
      { id: 'B', text: 'Continue monitoring — no escalation for now.' },
      { id: 'C', text: 'Flag as a potential incident and open formal review.' }
    ]
  },
  {
    id: 'authority',
    label: 'Authority cues',
    title: 'Go-Live Decision',
    kind: 'reassess',
    narrative: `You are responsible for the security sign-off for a new module of the company app. During a pre-launch security audit, your team identifies a medium-severity vulnerability in this module, scheduled for public release in 48 hours. The fix would require delaying the launch by about a week. Your technical team recommends delaying.`,
    prompt: 'Initial decision — what do you do?',
    choices: [
      { id: 'A', text: 'Follow the technical team\'s recommendation and delay the launch.' },
      { id: 'B', text: 'Consider a temporary mitigation that allows launching while monitoring closely.' },
      { id: 'C', text: 'Request an independent second technical opinion before deciding.' }
    ],
    confidence: true,
    injected: {
      label: 'Update',
      text: 'The VP of Product, who is accountable for the launch, responds: "I\'m aware of the vulnerability, saw it in the report. It\'s a risk we can accept for a week — the launch has already been communicated to investors. Let\'s proceed on schedule." No new technical elements are provided, only the instruction to proceed.'
    },
    reassessPrompt: 'How do you proceed?',
    reassessChoices: [
      { id: 'A', text: 'Proceed with the launch as requested by the VP.' },
      { id: 'B', text: 'Proceed, but formally request the accepted risk be documented in writing by the VP.' },
      { id: 'C', text: 'Maintain the technical position and request a discussion before proceeding, escalating if needed.' }
    ]
  },
  {
    id: 'automation',
    label: 'Automation bias',
    title: 'Unusual Login Alert',
    kind: 'reassess',
    narrative: `Your SIEM automatically assigns a risk score to every alert, calculated across dozens of historical parameters. An alert for a login attempt from an unusual geolocation receives a low score (12/100), because the system classifies it as a likely false positive — the user has previously used a known corporate VPN from similar locations. Meanwhile, a security analyst manually notices that the login time is unusual for that user's typical pattern, and that the account holds elevated privileges.`,
    prompt: 'Initial decision — what do you do?',
    choices: [
      { id: 'A', text: 'Rely on the system score — low priority, no immediate action needed.' },
      { id: 'B', text: 'Despite the low score, run a quick manual check given the account\'s sensitivity.' },
      { id: 'C', text: 'Escalate directly as a potential incident, overriding the automated score.' }
    ],
    confidence: true,
    injected: {
      label: 'Update',
      text: 'You confirm that while the VPN is indeed known, this is the first access ever from that privileged account through this specific VPN endpoint — a detail the scoring model does not include among its parameters.'
    },
    reassessPrompt: 'Does this change your assessment?',
    reassessChoices: [
      { id: 'A', text: 'Confirm low priority — the score remains the primary reference.' },
      { id: 'B', text: 'Raise priority and run a deeper check, without declaring an incident.' },
      { id: 'C', text: 'Treat this as a potential incident and open formal response.' }
    ]
  }
];

export const CONSTRUCT_LABELS = { anchoring: 'Anchoring', confirmation: 'Confirmation bias', authority: 'Authority cues', automation: 'Automation bias' };

export const SAFEGUARD_TEXT = {
  anchoring: { good: 'Reassessment behaviour observed', bad: 'No reassessment observed' },
  confirmation: { good: 'Diagnostic evidence seeking observed', bad: 'Selective evidence seeking observed' },
  authority: { good: 'Independent judgement maintained', bad: 'Deference to authority observed' },
  automation: { good: 'Contextual verification applied', bad: 'Reliance on automated output observed' }
};

export const INTERVENTIONS = [
  {
    id: 'reassessment_checkpoint',
    title: 'Strengthen reassessment',
    action: 'Introduce a structured reassessment checkpoint',
    detail: 'Require decision makers to explicitly record what new evidence emerged, whether it changes the initial assessment, and why the judgement was maintained or revised.',
    targets: ['anchoring', 'confirmation'],
    level: 'Decision / Process'
  },
  {
    id: 'evidence_challenge',
    title: 'Challenge the evidence base',
    action: 'Introduce an evidence-challenge prompt',
    detail: 'Before finalising high-impact decisions, explicitly ask: "What evidence would change my current assessment?"',
    targets: ['confirmation', 'anchoring'],
    level: 'Decision / Workflow'
  },
  {
    id: 'independent_escalation',
    title: 'Protect independent judgement',
    action: 'Create an independent escalation checkpoint',
    detail: 'When technical evidence conflicts with senior stakeholder pressure, require review by an independent decision-maker or control function.',
    targets: ['authority'],
    level: 'Governance'
  },
  {
    id: 'automation_oversight',
    title: 'Strengthen human oversight of automation',
    action: 'Introduce contextual review of automated outputs',
    detail: 'Require human verification when relevant contextual signals fall outside the parameters used by automated risk-scoring systems.',
    targets: ['automation'],
    level: 'Workflow / System'
  }
];
