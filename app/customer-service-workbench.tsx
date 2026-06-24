"use client";

import { useMemo, useState } from "react";
import { serviceCases, type RiskLevel, type ServiceCase } from "./mock-service-data";

type DraftAction = "not_reviewed" | "accepted" | "editing" | "ignored";

const actionCopy: Record<DraftAction, string> = {
  not_reviewed: "Awaiting agent review",
  accepted: "Accepted, waiting for send confirmation",
  editing: "Editing draft, no message sent",
  ignored: "Ignored, agent will handle manually",
};

export default function CustomerServiceWorkbench() {
  const [selectedCaseId, setSelectedCaseId] = useState(serviceCases[0].id);
  const [draftActions, setDraftActions] = useState<Record<string, DraftAction>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(serviceCases.map((serviceCase) => [serviceCase.id, serviceCase.ai.draft])),
  );

  const selectedCase =
    serviceCases.find((serviceCase) => serviceCase.id === selectedCaseId) ??
    serviceCases[0];
  const draftAction = draftActions[selectedCase.id] ?? "not_reviewed";
  const draft = drafts[selectedCase.id] ?? selectedCase.ai.draft;

  const metrics = useMemo(() => {
    const highRiskCount = serviceCases.filter((item) => item.risk === "high").length;
    const acceptedCount = Object.values(draftActions).filter(
      (action) => action === "accepted",
    ).length;
    const adoptionRate = Math.round((acceptedCount / serviceCases.length) * 100);

    return [
      ["Today service cases", "128", "+14% vs. last shift"],
      ["AI adoption rate", `${adoptionRate || 73}%`, "mock baseline + live actions"],
      ["High-risk cases", String(highRiskCount + 11), "needs supervisor attention"],
      ["Avg handle time", "8.6m", "target under 10m"],
    ];
  }, [draftActions]);

  function chooseCase(caseId: string) {
    setSelectedCaseId(caseId);
  }

  function updateDraft(value: string) {
    setDrafts((current) => ({ ...current, [selectedCase.id]: value }));
    setDraftActions((current) => ({ ...current, [selectedCase.id]: "editing" }));
  }

  function setAction(action: DraftAction) {
    setDraftActions((current) => ({ ...current, [selectedCase.id]: action }));
  }

  return (
    <main className="min-h-screen bg-[#eef2f5] text-[#17202a]">
      <TopBar />
      <section className="mx-auto flex max-w-[1760px] flex-col gap-4 px-4 py-4 lg:px-6">
        <Metrics metrics={metrics} />
        <div className="grid min-h-[calc(100vh-176px)] grid-cols-1 gap-4 xl:grid-cols-[330px_minmax(0,1fr)_430px]">
          <CaseQueue selectedCase={selectedCase} onChooseCase={chooseCase} />
          <CaseDetails selectedCase={selectedCase} />
          <AiAssistantPanel
            selectedCase={selectedCase}
            draft={draft}
            draftAction={draftAction}
            onDraftChange={updateDraft}
            onAction={setAction}
          />
        </div>
      </section>
    </main>
  );
}

function TopBar() {
  return (
    <header className="border-b border-[#d8e0e6] bg-white">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div>
          <p className="text-xs font-semibold uppercase text-[#5c6b78]">
            Tianmao Global AI Service Center
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#111820]">
            Cross-border customer support workbench
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge tone="neutral">Role: Platform agent</Badge>
          <Badge tone="neutral">Queue: EU / APAC exceptions</Badge>
          <Badge tone="green">AI reads masked snapshots only</Badge>
        </div>
      </div>
    </header>
  );
}

function Metrics({ metrics }: { metrics: string[][] }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(([label, value, note]) => (
        <div key={label} className="border border-[#d8e0e6] bg-white p-4">
          <p className="text-xs font-semibold uppercase text-[#5c6b78]">{label}</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold text-[#111820]">{value}</p>
            <p className="text-right text-xs leading-5 text-[#647382]">{note}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function CaseQueue({
  selectedCase,
  onChooseCase,
}: {
  selectedCase: ServiceCase;
  onChooseCase: (caseId: string) => void;
}) {
  return (
    <aside className="border border-[#d8e0e6] bg-white">
      <SectionHeader eyebrow="Service queue" title="Risk-ranked cases" />
      <div className="divide-y divide-[#e2e8ee]">
        {serviceCases.map((serviceCase) => {
          const isSelected = serviceCase.id === selectedCase.id;
          return (
            <button
              key={serviceCase.id}
              type="button"
              onClick={() => onChooseCase(serviceCase.id)}
              className={`w-full p-4 text-left transition ${
                isSelected
                  ? "bg-[#14213d] text-white"
                  : "bg-white text-[#17202a] hover:bg-[#f6f8fa]"
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold">{serviceCase.id}</span>
                <span className={isSelected ? "text-white/70" : "text-[#647382]"}>
                  {serviceCase.updatedAt}
                </span>
              </div>
              <h2 className="mt-3 text-sm font-semibold leading-6">
                {serviceCase.title}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={isSelected ? "selected" : riskTone(serviceCase.risk)}>
                  {serviceCase.risk} risk
                </Badge>
                <Badge tone={isSelected ? "selected" : "neutral"}>
                  {serviceCase.issueType}
                </Badge>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <MiniDatum label="Order" value={serviceCase.orderId} inverted={isSelected} />
                <MiniDatum label="Status" value={serviceCase.status} inverted={isSelected} />
              </dl>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function CaseDetails({ selectedCase }: { selectedCase: ServiceCase }) {
  return (
    <section className="min-w-0 space-y-4 overflow-hidden">
      <div className="border border-[#d8e0e6] bg-white p-5">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[#5c6b78]">
              Current service case
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-8 text-[#111820]">
              {selectedCase.title}
            </h2>
            <p className="mt-2 text-sm text-[#647382]">
              {selectedCase.consumer} / {selectedCase.region} / {selectedCase.language}
            </p>
          </div>
          <Badge tone={riskTone(selectedCase.risk)}>
            Effective risk: {selectedCase.risk}
          </Badge>
        </div>
        <blockquote className="mt-5 border-l-4 border-[#2b6cb0] bg-[#f6f9fc] p-4 text-sm leading-7 text-[#26313b]">
          {selectedCase.originalMessage}
        </blockquote>
      </div>

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        <InfoCard title="Conversation history">
          <ol className="space-y-3">
            {selectedCase.history.map((item, index) => (
              <li key={item} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3">
                <span className="flex h-7 w-7 items-center justify-center bg-[#edf2f7] text-xs font-semibold text-[#394b5a]">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-[#344454]">{item}</p>
              </li>
            ))}
          </ol>
        </InfoCard>

        <InfoCard title="Order context">
          <InfoLine label="Order ID" value={selectedCase.orderId} />
          <InfoLine label="Item" value={selectedCase.order.item} />
          <InfoLine label="Amount" value={selectedCase.order.amount} />
          <InfoLine label="Paid at" value={selectedCase.order.paidAt} />
          <InfoLine label="Destination" value={selectedCase.order.destination} />
          <InfoLine label="AI PII policy" value={selectedCase.order.piiPolicy} />
        </InfoCard>

        <InfoCard title="Logistics trace">
          <InfoLine label="Carrier" value={selectedCase.logistics.carrier} />
          <InfoLine label="Tracking" value={selectedCase.logistics.trackingNo} />
          <InfoLine label="Current node" value={selectedCase.logistics.currentNode} />
          <InfoLine label="Last update" value={selectedCase.logistics.lastUpdate} />
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCase.logistics.timeline.map((item) => (
              <span
                key={item}
                className="border border-[#d8e0e6] bg-[#f8fafc] px-2 py-1 text-xs text-[#344454]"
              >
                {item}
              </span>
            ))}
          </div>
        </InfoCard>

        <InfoCard title="After-sales and merchant">
          <InfoLine label="After-sales case" value={selectedCase.afterSales.id} />
          <InfoLine label="Type" value={selectedCase.afterSales.type} />
          <InfoLine label="Status" value={selectedCase.afterSales.status} />
          <InfoLine label="Platform involved" value={selectedCase.afterSales.platformInvolved} />
          <InfoLine label="Merchant" value={selectedCase.merchant.name} />
          <InfoLine label="Service score" value={selectedCase.merchant.serviceScore} />
          <InfoLine label="Response time" value={selectedCase.merchant.responseTime} />
        </InfoCard>
      </div>

      <InfoCard title="Relevant platform rules">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {selectedCase.rules.map((rule) => (
            <p
              key={rule}
              className="border border-[#d8e0e6] bg-[#fbfcfd] p-3 text-sm leading-6 text-[#344454]"
            >
              {rule}
            </p>
          ))}
        </div>
      </InfoCard>
    </section>
  );
}

function AiAssistantPanel({
  selectedCase,
  draft,
  draftAction,
  onDraftChange,
  onAction,
}: {
  selectedCase: ServiceCase;
  draft: string;
  draftAction: DraftAction;
  onDraftChange: (value: string) => void;
  onAction: (action: DraftAction) => void;
}) {
  return (
    <aside className="border border-[#b9c9d8] bg-[#101820] text-white">
      <div className="border-b border-white/10 p-5">
        <p className="text-xs font-semibold uppercase text-[#9fd3ff]">
          Local AI assistant
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Suggested handling</h2>
        <p className="mt-2 text-sm leading-6 text-[#c6d3df]">
          AI can draft and cite policy, but cannot send messages, refund, compensate,
          close after-sales, or bypass human approval.
        </p>
      </div>

      <div className="space-y-5 p-5">
        {selectedCase.risk === "high" && (
          <div className="border border-[#ffb4a8] bg-[#3b1614] p-3 text-sm leading-6 text-[#ffd3cc]">
            Supervisor review recommended. Keep commitments conditional until policy
            and logistics review are complete.
          </div>
        )}

        <PanelBlock title="Service summary">
          <p className="text-sm leading-7 text-[#e7eef5]">{selectedCase.ai.summary}</p>
        </PanelBlock>

        <div className="grid grid-cols-2 gap-3">
          <DarkDatum label="Issue type" value={selectedCase.ai.category} />
          <DarkDatum label="Sentiment" value={selectedCase.ai.sentiment} />
          <DarkDatum label="Suggested risk" value={selectedCase.ai.suggestedRisk} />
          <DarkDatum label="Draft status" value={actionCopy[draftAction]} />
        </div>

        <PanelBlock title="Recommended actions">
          <ul className="space-y-2 text-sm leading-6 text-[#e7eef5]">
            {selectedCase.ai.actions.map((action) => (
              <li key={action} className="border-l border-[#4ca3dd] pl-3">
                {action}
              </li>
            ))}
          </ul>
        </PanelBlock>

        <PanelBlock title="Knowledge citations">
          <div className="flex flex-wrap gap-2">
            {selectedCase.ai.citations.map((citation) => (
              <span
                key={citation}
                className="border border-white/15 bg-white/8 px-2 py-1 text-xs text-[#d9e7f2]"
              >
                {citation}
              </span>
            ))}
          </div>
        </PanelBlock>

        <PanelBlock title="Reply draft">
          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            className="min-h-48 w-full resize-y border border-white/15 bg-[#0b1118] p-3 text-sm leading-6 text-white outline-none focus:border-[#77c5ff]"
          />
        </PanelBlock>

        <div className="border border-[#f0c36a] bg-[#2b2414] p-3 text-sm leading-6 text-[#ffe8b6]">
          {selectedCase.ai.safety}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <ActionButton label="Accept draft" onClick={() => onAction("accepted")} />
          <ActionButton label="Edit draft" onClick={() => onAction("editing")} />
          <ActionButton label="Ignore AI" onClick={() => onAction("ignored")} />
        </div>

        <div className="border border-white/10 bg-white/5 p-3 text-xs leading-5 text-[#c6d3df]">
          Audit preview: this action would create an AIUsageEvent with case ID,
          citation versions, draft status, and agent decision. No real message is sent.
        </div>
      </div>
    </aside>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="border-b border-[#d8e0e6] p-4">
      <p className="text-xs font-semibold uppercase text-[#5c6b78]">{eyebrow}</p>
      <h2 className="mt-1 text-lg font-semibold text-[#111820]">{title}</h2>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-[#d8e0e6] bg-white p-4">
      <h3 className="mb-4 text-base font-semibold text-[#111820]">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[132px_minmax(0,1fr)] gap-3 text-sm leading-6">
      <span className="text-[#647382]">{label}</span>
      <span className="min-w-0 break-words font-medium text-[#24313d]">{value}</span>
    </div>
  );
}

function MiniDatum({
  label,
  value,
  inverted = false,
}: {
  label: string;
  value: string;
  inverted?: boolean;
}) {
  return (
    <div>
      <dt className={inverted ? "text-white/60" : "text-[#647382]"}>{label}</dt>
      <dd className="mt-1 truncate font-semibold">{value}</dd>
    </div>
  );
}

function DarkDatum({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/5 p-3">
      <p className="text-xs font-semibold uppercase text-[#9fb2c2]">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-5 text-white">{value}</p>
    </div>
  );
}

function PanelBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase text-[#9fd3ff]">{title}</h3>
      {children}
    </section>
  );
}

function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-[#77c5ff] px-3 py-2 text-sm font-semibold text-[#d9f0ff] transition hover:bg-[#77c5ff] hover:text-[#08111a]"
    >
      {label}
    </button>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "red" | "amber" | "green" | "neutral" | "selected";
}) {
  const tones = {
    red: "border-[#f0afa8] bg-[#fff2f0] text-[#9f2a20]",
    amber: "border-[#efd08a] bg-[#fff8e5] text-[#815400]",
    green: "border-[#a8d8bd] bg-[#eefaf3] text-[#1d6b3d]",
    neutral: "border-[#d8e0e6] bg-[#f8fafc] text-[#344454]",
    selected: "border-white/25 bg-white/10 text-white",
  };

  return (
    <span className={`inline-flex max-w-full items-center border px-2 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function riskTone(risk: RiskLevel): "red" | "amber" | "green" {
  if (risk === "high") return "red";
  if (risk === "medium") return "amber";
  return "green";
}
