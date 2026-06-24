"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Risk = "low" | "medium" | "high";
type CaseStatus = "new" | "in_progress" | "escalated" | "resolved";

type ServiceCase = {
  id: string;
  customer: string;
  country: string;
  language: string;
  title: string;
  issueType: string;
  status: CaseStatus;
  priority: "medium" | "high" | "urgent";
  effectiveRisk: Risk;
  orderId: string;
  updatedAt: string;
  message: string;
  history: string[];
  order: {
    item: string;
    amount: string;
    paidAt: string;
    destination: string;
  };
  logistics: {
    carrier: string;
    trackingNo: string;
    currentNode: string;
    lastUpdate: string;
    eta: string;
    timeline: string[];
  };
  afterSales: {
    id: string;
    type: string;
    status: string;
    platformInvolved: string;
  };
  merchant: {
    name: string;
    serviceScore: string;
    responseTime: string;
    riskTags: string[];
  };
  ai: {
    summary: string;
    sentiment: "calm" | "confused" | "dissatisfied" | "angry";
    suggestedRisk: Risk;
    actions: string[];
    citations: string[];
    draft: string;
    safety: string;
  };
};

const variants = [
  { key: "A", name: "Classic triage" },
  { key: "B", name: "AI command center" },
  { key: "C", name: "Timeline first" },
] as const;

const cases: ServiceCase[] = [
  {
    id: "CASE-1007",
    customer: "Maria G.",
    country: "Germany",
    language: "English",
    title: "Package stuck in customs, customer asks for refund",
    issueType: "Logistics delay / customs",
    status: "escalated",
    priority: "urgent",
    effectiveRisk: "high",
    orderId: "ORDER-889271",
    updatedAt: "12 min ago",
    message:
      "My package is 7 days past the promised delivery window and has been stuck at customs. I contacted support twice. Tell me when it arrives, or refund me.",
    history: [
      "Customer asked for delivery ETA two days ago.",
      "Agent replied with generic logistics guidance.",
      "System detected five days without customs status update.",
    ],
    order: {
      item: "Wool coat, EU size M",
      amount: "EUR 186.40",
      paidAt: "2026-06-08 10:42",
      destination: "Berlin, Germany",
    },
    logistics: {
      carrier: "Cainiao Global",
      trackingNo: "LP938441029CN",
      currentNode: "Destination customs clearance",
      lastUpdate: "5 days ago",
      eta: "Exceeded by 7 days",
      timeline: [
        "Seller shipped",
        "International transit",
        "Arrived destination country",
        "Customs clearance",
        "No update for 5 days",
      ],
    },
    afterSales: {
      id: "No active after-sales case",
      type: "None",
      status: "Not created",
      platformInvolved: "No",
    },
    merchant: {
      name: "Moon Harbor Apparel",
      serviceScore: "4.4 / 5",
      responseTime: "7.2h avg",
      riskTags: ["Customs complaints", "Slow weekend response"],
    },
    ai: {
      summary:
        "Customer is dissatisfied because the order exceeded ETA and customs has not updated for 5 days. They are requesting a clear delivery commitment or refund.",
      sentiment: "dissatisfied",
      suggestedRisk: "high",
      actions: [
        "Acknowledge the delay and avoid promising a specific delivery date.",
        "Escalate to logistics specialist because tracking is stale for more than 5 days.",
        "Explain customs clearance may vary by destination inspection workload.",
        "If no update within 48 hours, route to supervisor for compensation policy review.",
      ],
      citations: [
        "Cross-border customs SLA v3.2, EU region",
        "Logistics exception SOP v5.1, stale tracking over 5 days",
      ],
      draft:
        "Hi Maria, we are sorry for the inconvenience caused by the delivery delay. Your package has arrived in Germany and is currently waiting for customs clearance. We have escalated this case to our logistics specialist for further tracking. If there is still no update within the next 48 hours, we will review the case again and advise you on the next available options.",
      safety:
        "Do not promise a refund amount or exact delivery date before supervisor review.",
    },
  },
  {
    id: "CASE-1014",
    customer: "Kenji T.",
    country: "Japan",
    language: "Japanese",
    title: "Refund submitted but not received",
    issueType: "Refund status",
    status: "in_progress",
    priority: "high",
    effectiveRisk: "medium",
    orderId: "ORDER-773820",
    updatedAt: "26 min ago",
    message:
      "The seller approved my refund, but I still cannot see the money in my account. How many more days will this take?",
    history: [
      "Refund request approved by merchant.",
      "Payment processor shows refund initiated.",
      "Customer asked for bank arrival timing.",
    ],
    order: {
      item: "Noise cancelling earbuds",
      amount: "JPY 14,800",
      paidAt: "2026-06-03 18:05",
      destination: "Osaka, Japan",
    },
    logistics: {
      carrier: "Yamato cross-border",
      trackingNo: "YMT-22019-JP",
      currentNode: "Returned to merchant warehouse",
      lastUpdate: "1 day ago",
      eta: "Returned",
      timeline: ["Delivered", "Return requested", "Return shipped", "Merchant received"],
    },
    afterSales: {
      id: "AS-660281",
      type: "Refund",
      status: "Refund initiated",
      platformInvolved: "No",
    },
    merchant: {
      name: "SoundPeak Official",
      serviceScore: "4.7 / 5",
      responseTime: "3.1h avg",
      riskTags: ["Refund timing questions"],
    },
    ai: {
      summary:
        "Customer asks about refund arrival after merchant approval. Current status shows refund initiated but not yet settled by bank/payment channel.",
      sentiment: "confused",
      suggestedRisk: "medium",
      actions: [
        "Confirm refund has been initiated.",
        "Explain payment channel settlement delay without promising exact arrival.",
        "Ask customer to check original payment account.",
      ],
      citations: ["Refund settlement policy v2.8, Japan", "After-sales reply SOP v4.0"],
      draft:
        "Hi Kenji, your refund has already been initiated after the merchant approved the request. The final arrival time may depend on the original payment method and the bank or payment channel. Please check the account used for the original payment. If it has not arrived after the standard settlement window, we can help you follow up again.",
      safety:
        "Do not state that funds have arrived unless payment settlement confirms it.",
    },
  },
  {
    id: "CASE-1021",
    customer: "Aisha R.",
    country: "United Arab Emirates",
    language: "English",
    title: "Customer asks whether import tax is covered",
    issueType: "Customs tax",
    status: "new",
    priority: "medium",
    effectiveRisk: "medium",
    orderId: "ORDER-910244",
    updatedAt: "45 min ago",
    message:
      "DHL says I need to pay import fees before delivery. I thought the platform already included all fees. Can you confirm who pays?",
    history: [
      "Customer received carrier payment notice.",
      "No after-sales case yet.",
      "System matched UAE tax FAQ.",
    ],
    order: {
      item: "Smart home camera kit",
      amount: "AED 522.00",
      paidAt: "2026-06-16 09:17",
      destination: "Dubai, UAE",
    },
    logistics: {
      carrier: "DHL eCommerce",
      trackingNo: "DHL-AE-763188",
      currentNode: "Awaiting import duty payment",
      lastUpdate: "3 hours ago",
      eta: "Pending fee payment",
      timeline: ["Seller shipped", "Export cleared", "Arrived UAE", "Duty payment requested"],
    },
    afterSales: {
      id: "No active after-sales case",
      type: "None",
      status: "Not created",
      platformInvolved: "No",
    },
    merchant: {
      name: "BrightNest Tech",
      serviceScore: "4.6 / 5",
      responseTime: "4.5h avg",
      riskTags: ["Tax FAQ"],
    },
    ai: {
      summary:
        "Customer received an import duty request from DHL and wants to know whether the platform or customer should pay.",
      sentiment: "confused",
      suggestedRisk: "medium",
      actions: [
        "Check whether the order page included tax-paid terms.",
        "Explain that import charges depend on destination rules and order terms.",
        "Avoid making a reimbursement promise before policy confirmation.",
      ],
      citations: ["UAE import fee FAQ v1.9", "Tax responsibility policy v3.4"],
      draft:
        "Hi Aisha, import fees can depend on the destination country's customs rules and the tax terms shown at checkout. I am checking the order terms for your purchase. Please do not make any duplicate payment until we confirm whether this fee is already covered by the order or needs to be paid to the carrier.",
      safety:
        "Verify checkout tax terms before saying the platform or customer is responsible.",
    },
  },
];

function riskTone(risk: Risk) {
  if (risk === "high") return "border-red-200 bg-red-50 text-red-700";
  if (risk === "medium") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export default function PrototypeWorkbench() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedVariant = searchParams.get("variant")?.toUpperCase() ?? "A";
  const variant = variants.some((item) => item.key === requestedVariant)
    ? requestedVariant
    : "A";
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0].id);
  const [draftState, setDraftState] = useState("not reviewed");
  const selectedCase =
    cases.find((serviceCase) => serviceCase.id === selectedCaseId) ?? cases[0];
  const currentVariant =
    variants.find((item) => item.key === variant) ?? variants[0];

  const state = useMemo(
    () => ({
      prototype: "throwaway",
      question: "What should the first AI service workbench look like?",
      variant,
      variantName: currentVariant.name,
      selectedCaseId: selectedCase.id,
      issueType: selectedCase.issueType,
      effectiveRisk: selectedCase.effectiveRisk,
      suggestedRisk: selectedCase.ai.suggestedRisk,
      draftState,
      noPersistence: true,
    }),
    [currentVariant.name, draftState, selectedCase, variant],
  );

  function goToVariant(nextVariant: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", nextVariant);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }
      const currentIndex = variants.findIndex((item) => item.key === variant);
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToVariant(variants[(currentIndex + 1) % variants.length].key);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToVariant(
          variants[(currentIndex - 1 + variants.length) % variants.length].key,
        );
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function chooseCase(caseId: string) {
    setSelectedCaseId(caseId);
    setDraftState("not reviewed");
  }

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-slate-950">
      <PrototypeBanner />
      {variant === "A" && (
        <VariantA
          selectedCase={selectedCase}
          onChooseCase={chooseCase}
          draftState={draftState}
          setDraftState={setDraftState}
        />
      )}
      {variant === "B" && (
        <VariantB
          selectedCase={selectedCase}
          onChooseCase={chooseCase}
          draftState={draftState}
          setDraftState={setDraftState}
        />
      )}
      {variant === "C" && (
        <VariantC
          selectedCase={selectedCase}
          onChooseCase={chooseCase}
          draftState={draftState}
          setDraftState={setDraftState}
        />
      )}
      <StatePanel state={state} />
      {process.env.NODE_ENV !== "production" && (
        <PrototypeSwitcher
          current={variant}
          name={currentVariant.name}
          onChange={goToVariant}
        />
      )}
    </main>
  );
}

function PrototypeBanner() {
  return (
    <div className="border-b border-dashed border-slate-300 bg-white px-6 py-3 text-xs text-slate-600">
      PROTOTYPE - throwaway UI route for PRD exploration. No persistence, no real
      customer data, no real AI calls.
    </div>
  );
}

function VariantA({
  selectedCase,
  onChooseCase,
  draftState,
  setDraftState,
}: VariantProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-44px)] max-w-[1600px] flex-col gap-4 p-5">
      <HeaderBar title="Classic triage workspace" />
      <MetricsRow />
      <div className="grid flex-1 grid-cols-[320px_minmax(0,1fr)_420px] gap-4">
        <CaseQueue selectedCase={selectedCase} onChooseCase={onChooseCase} />
        <CaseContext selectedCase={selectedCase} />
        <AiPanel
          selectedCase={selectedCase}
          draftState={draftState}
          setDraftState={setDraftState}
        />
      </div>
    </section>
  );
}

function VariantB({
  selectedCase,
  onChooseCase,
  draftState,
  setDraftState,
}: VariantProps) {
  return (
    <section className="min-h-[calc(100vh-44px)] bg-[#101820] text-white">
      <div className="grid min-h-[calc(100vh-44px)] grid-cols-[88px_360px_minmax(0,1fr)]">
        <nav className="border-r border-white/10 bg-[#0b1118] px-3 py-6">
          <div className="mb-8 h-12 w-12 rounded-md bg-cyan-400 text-center text-xl font-black leading-[48px] text-slate-950">
            AI
          </div>
          {["Queue", "Cases", "Rules", "Audit"].map((item) => (
            <div
              key={item}
              className="mb-3 rounded-md px-2 py-3 text-center text-[11px] uppercase tracking-[0.18em] text-slate-400"
            >
              {item}
            </div>
          ))}
        </nav>
        <aside className="border-r border-white/10 bg-[#131d27] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
            Command queue
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Risk-ranked cases</h1>
          <div className="mt-6 space-y-3">
            {cases.map((serviceCase) => (
              <button
                key={serviceCase.id}
                onClick={() => onChooseCase(serviceCase.id)}
                className={`w-full border p-4 text-left transition ${
                  serviceCase.id === selectedCase.id
                    ? "border-cyan-300 bg-cyan-300/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{serviceCase.id}</span>
                  <span>{serviceCase.updatedAt}</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  {serviceCase.title}
                </p>
                <p className="mt-3 text-xs text-cyan-200">
                  {serviceCase.issueType}
                </p>
              </button>
            ))}
          </div>
        </aside>
        <div className="grid grid-rows-[auto_minmax(0,1fr)]">
          <div className="border-b border-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
              AI decision cockpit
            </p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-semibold">{selectedCase.title}</h2>
                <p className="mt-2 text-sm text-slate-300">
                  {selectedCase.customer} / {selectedCase.country} /{" "}
                  {selectedCase.orderId}
                </p>
              </div>
              <span className="border border-red-300 bg-red-300/10 px-4 py-2 text-sm text-red-100">
                Effective risk: {selectedCase.effectiveRisk}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_480px] gap-0 overflow-hidden">
            <div className="space-y-4 overflow-auto p-5">
              <DarkPanel title="Customer message">
                <p className="text-lg leading-8 text-slate-100">
                  {selectedCase.message}
                </p>
              </DarkPanel>
              <DarkPanel title="Context stack">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <ContextMini label="Order" value={selectedCase.order.item} />
                  <ContextMini
                    label="Logistics"
                    value={selectedCase.logistics.currentNode}
                  />
                  <ContextMini
                    label="After-sales"
                    value={selectedCase.afterSales.status}
                  />
                  <ContextMini
                    label="Merchant"
                    value={selectedCase.merchant.name}
                  />
                </div>
              </DarkPanel>
              <DarkPanel title="Tracking">
                <div className="flex flex-wrap gap-2">
                  {selectedCase.logistics.timeline.map((item) => (
                    <span
                      key={item}
                      className="border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </DarkPanel>
            </div>
            <div className="overflow-auto border-l border-white/10 bg-[#0e151d] p-5">
              <AiPanel
                selectedCase={selectedCase}
                draftState={draftState}
                setDraftState={setDraftState}
                dark
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VariantC({
  selectedCase,
  onChooseCase,
  draftState,
  setDraftState,
}: VariantProps) {
  return (
    <section className="mx-auto max-w-[1500px] p-6">
      <HeaderBar title="Timeline first service review" />
      <div className="mt-5 grid grid-cols-[360px_minmax(0,1fr)] gap-5">
        <div className="space-y-4">
          <CaseQueue selectedCase={selectedCase} onChooseCase={onChooseCase} />
          <section className="border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Escalation rules
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>Five days without tracking update requires logistics review.</li>
              <li>Refund requests after logistics exception require supervisor check.</li>
              <li>Do not promise compensation before policy review.</li>
            </ul>
          </section>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-5">
          <section className="border border-slate-200 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Case timeline
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{selectedCase.title}</h1>
            <div className="mt-6 space-y-5">
              {[
                ["Customer", selectedCase.message],
                ["History", selectedCase.history.join(" ")],
                ["Order", `${selectedCase.order.item} / ${selectedCase.order.amount}`],
                ["Logistics", selectedCase.logistics.timeline.join(" -> ")],
                ["AI readout", selectedCase.ai.summary],
              ].map(([label, value], index) => (
                <div key={label} className="grid grid-cols-[92px_minmax(0,1fr)] gap-4">
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                  </div>
                  <div className="border-l border-slate-200 pb-4 pl-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {label}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-800">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <AiPanel
            selectedCase={selectedCase}
            draftState={draftState}
            setDraftState={setDraftState}
          />
        </div>
      </div>
    </section>
  );
}

type VariantProps = {
  selectedCase: ServiceCase;
  onChooseCase: (caseId: string) => void;
  draftState: string;
  setDraftState: (state: string) => void;
};

function HeaderBar({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between border border-slate-200 bg-white p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Tianmao Global AI Service Center
        </p>
        <h1 className="mt-1 text-3xl font-semibold">{title}</h1>
      </div>
      <div className="text-right text-sm text-slate-600">
        <p>Role: Platform agent</p>
        <p>Shift: EU cross-border queue</p>
      </div>
    </header>
  );
}

function MetricsRow() {
  const metrics = [
    ["Today cases", "128"],
    ["AI adoption", "73%"],
    ["High risk", "12"],
    ["Avg handle", "8.6m"],
  ];
  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map(([label, value]) => (
        <section key={label} className="border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </section>
      ))}
    </div>
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
    <section className="overflow-hidden border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Service queue
        </p>
        <h2 className="mt-1 text-xl font-semibold">Cross-border cases</h2>
      </div>
      <div className="divide-y divide-slate-200">
        {cases.map((serviceCase) => (
          <button
            key={serviceCase.id}
            onClick={() => onChooseCase(serviceCase.id)}
            className={`w-full p-4 text-left transition ${
              selectedCase.id === serviceCase.id
                ? "bg-slate-950 text-white"
                : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="mb-2 flex items-center justify-between text-xs">
              <span>{serviceCase.id}</span>
              <span>{serviceCase.updatedAt}</span>
            </div>
            <p className="text-sm font-semibold">{serviceCase.title}</p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`border px-2 py-1 text-xs ${
                  selectedCase.id === serviceCase.id
                    ? "border-white/30 text-white"
                    : riskTone(serviceCase.effectiveRisk)
                }`}
              >
                {serviceCase.effectiveRisk}
              </span>
              <span className="text-xs opacity-75">{serviceCase.issueType}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function CaseContext({ selectedCase }: { selectedCase: ServiceCase }) {
  return (
    <section className="space-y-4 overflow-auto">
      <div className="border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Current service case
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{selectedCase.title}</h2>
          </div>
          <span className={`border px-3 py-2 text-sm ${riskTone(selectedCase.effectiveRisk)}`}>
            Effective risk: {selectedCase.effectiveRisk}
          </span>
        </div>
        <p className="text-base leading-8 text-slate-800">{selectedCase.message}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InfoBlock title="Order">
          <InfoLine label="Order ID" value={selectedCase.orderId} />
          <InfoLine label="Item" value={selectedCase.order.item} />
          <InfoLine label="Amount" value={selectedCase.order.amount} />
          <InfoLine label="Destination" value={selectedCase.order.destination} />
        </InfoBlock>
        <InfoBlock title="Logistics">
          <InfoLine label="Carrier" value={selectedCase.logistics.carrier} />
          <InfoLine label="Tracking" value={selectedCase.logistics.trackingNo} />
          <InfoLine label="Current node" value={selectedCase.logistics.currentNode} />
          <InfoLine label="Last update" value={selectedCase.logistics.lastUpdate} />
        </InfoBlock>
        <InfoBlock title="After-sales">
          <InfoLine label="Case" value={selectedCase.afterSales.id} />
          <InfoLine label="Type" value={selectedCase.afterSales.type} />
          <InfoLine label="Status" value={selectedCase.afterSales.status} />
          <InfoLine label="Platform involved" value={selectedCase.afterSales.platformInvolved} />
        </InfoBlock>
        <InfoBlock title="Merchant">
          <InfoLine label="Name" value={selectedCase.merchant.name} />
          <InfoLine label="Score" value={selectedCase.merchant.serviceScore} />
          <InfoLine label="Response" value={selectedCase.merchant.responseTime} />
          <InfoLine label="Tags" value={selectedCase.merchant.riskTags.join(", ")} />
        </InfoBlock>
      </div>
    </section>
  );
}

function InfoBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

function AiPanel({
  selectedCase,
  draftState,
  setDraftState,
  dark = false,
}: {
  selectedCase: ServiceCase;
  draftState: string;
  setDraftState: (state: string) => void;
  dark?: boolean;
}) {
  const panel = dark
    ? "border border-white/10 bg-white/5 text-white"
    : "border border-slate-200 bg-white text-slate-950";
  const muted = dark ? "text-slate-300" : "text-slate-600";
  return (
    <section className={`${panel} p-5`}>
      <p className={`text-xs uppercase tracking-[0.2em] ${muted}`}>
        AI assistant
      </p>
      <h2 className="mt-2 text-2xl font-semibold">Suggested handling</h2>
      <div className="mt-5 space-y-5">
        <div>
          <p className={`mb-2 text-xs uppercase tracking-[0.16em] ${muted}`}>
            Summary
          </p>
          <p className="text-sm leading-7">{selectedCase.ai.summary}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <ContextMini label="Issue" value={selectedCase.issueType} />
          <ContextMini label="Sentiment" value={selectedCase.ai.sentiment} />
          <ContextMini label="Suggested risk" value={selectedCase.ai.suggestedRisk} />
          <ContextMini label="Draft state" value={draftState} />
        </div>
        <div>
          <p className={`mb-2 text-xs uppercase tracking-[0.16em] ${muted}`}>
            Actions
          </p>
          <ul className="space-y-2 text-sm leading-6">
            {selectedCase.ai.actions.map((action) => (
              <li key={action}>- {action}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className={`mb-2 text-xs uppercase tracking-[0.16em] ${muted}`}>
            Citations
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedCase.ai.citations.map((citation) => (
              <span
                key={citation}
                className={`border px-2 py-1 text-xs ${
                  dark ? "border-white/15 bg-white/10" : "border-slate-200 bg-slate-50"
                }`}
              >
                {citation}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className={`mb-2 text-xs uppercase tracking-[0.16em] ${muted}`}>
            Reply draft
          </p>
          <textarea
            className={`h-44 w-full resize-none border p-3 text-sm leading-6 outline-none ${
              dark
                ? "border-white/10 bg-black/20 text-white"
                : "border-slate-200 bg-slate-50 text-slate-950"
            }`}
            defaultValue={selectedCase.ai.draft}
            onFocus={() => setDraftState("editing")}
          />
        </div>
        <div className="border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
          {selectedCase.ai.safety}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["accepted", "editing", "ignored"].map((state) => (
            <button
              key={state}
              onClick={() => setDraftState(state)}
              className={`border px-3 py-2 text-sm font-semibold ${
                dark
                  ? "border-cyan-300 text-cyan-100 hover:bg-cyan-300/10"
                  : "border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white"
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContextMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-current/10 p-3">
      <p className="text-[11px] uppercase tracking-[0.14em] opacity-60">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function DarkPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-white/10 bg-white/5 p-5">
      <p className="mb-4 text-xs uppercase tracking-[0.18em] text-cyan-200">
        {title}
      </p>
      {children}
    </section>
  );
}

function StatePanel({ state }: { state: Record<string, unknown> }) {
  return (
    <aside className="fixed bottom-5 right-5 z-30 max-w-[360px] border border-slate-300 bg-white/95 p-3 text-xs text-slate-700 shadow-xl backdrop-blur">
      <p className="mb-2 font-semibold text-slate-950">Prototype state</p>
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap">
        {JSON.stringify(state, null, 2)}
      </pre>
    </aside>
  );
}

function PrototypeSwitcher({
  current,
  name,
  onChange,
}: {
  current: string;
  name: string;
  onChange: (variant: string) => void;
}) {
  const currentIndex = variants.findIndex((item) => item.key === current);
  const previous = variants[(currentIndex - 1 + variants.length) % variants.length];
  const next = variants[(currentIndex + 1) % variants.length];
  return (
    <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-slate-950 px-4 py-3 text-white shadow-2xl">
      <button
        type="button"
        onClick={() => onChange(previous.key)}
        className="h-9 w-9 rounded-full border border-white/20 text-lg hover:bg-white/10"
        aria-label="Previous variant"
      >
        ←
      </button>
      <div className="min-w-[220px] text-center text-sm font-semibold">
        {current} — {name}
      </div>
      <button
        type="button"
        onClick={() => onChange(next.key)}
        className="h-9 w-9 rounded-full border border-white/20 text-lg hover:bg-white/10"
        aria-label="Next variant"
      >
        →
      </button>
    </div>
  );
}
