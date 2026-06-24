export type RiskLevel = "low" | "medium" | "high";

export type ServiceCase = {
  id: string;
  consumer: string;
  region: string;
  language: string;
  title: string;
  issueType: string;
  status: "new" | "in_progress" | "escalated";
  priority: "medium" | "high" | "urgent";
  risk: RiskLevel;
  orderId: string;
  updatedAt: string;
  originalMessage: string;
  history: string[];
  order: {
    item: string;
    amount: string;
    paidAt: string;
    destination: string;
    piiPolicy: string;
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
  rules: string[];
  ai: {
    summary: string;
    category: string;
    sentiment: "calm" | "confused" | "dissatisfied" | "angry";
    suggestedRisk: RiskLevel;
    actions: string[];
    citations: string[];
    draft: string;
    safety: string;
  };
};

export const serviceCases: ServiceCase[] = [
  {
    id: "CASE-1007",
    consumer: "Maria G.",
    region: "Germany",
    language: "English",
    title: "Package stuck in customs, customer asks for refund",
    issueType: "Logistics delay / customs",
    status: "escalated",
    priority: "urgent",
    risk: "high",
    orderId: "ORDER-889271",
    updatedAt: "12 min ago",
    originalMessage:
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
      piiPolicy: "Address and contact fields are masked in the AI snapshot.",
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
        "Arrived in destination country",
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
    rules: [
      "Stale tracking over 5 days requires logistics specialist escalation.",
      "Refund or compensation requires supervisor review when delivery is still in customs.",
    ],
    ai: {
      summary:
        "Customer is dissatisfied because the order exceeded ETA and customs has not updated for 5 days. They want a clear commitment or a refund.",
      category: "Customs logistics exception",
      sentiment: "dissatisfied",
      suggestedRisk: "high",
      actions: [
        "Acknowledge the delay and avoid promising a specific delivery date.",
        "Escalate to logistics specialist because tracking is stale for more than 5 days.",
        "Explain customs clearance may vary by destination inspection workload.",
        "If no update within 48 hours, route to supervisor for policy review.",
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
    consumer: "Kenji T.",
    region: "Japan",
    language: "Japanese",
    title: "Refund approved but not received",
    issueType: "Refund status",
    status: "in_progress",
    priority: "high",
    risk: "medium",
    orderId: "ORDER-773820",
    updatedAt: "26 min ago",
    originalMessage:
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
      piiPolicy: "Payment account is represented only as original payment channel.",
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
    rules: [
      "Explain payment-channel settlement windows without guaranteeing bank arrival.",
      "Escalate only when standard settlement window is exceeded.",
    ],
    ai: {
      summary:
        "Customer asks about refund arrival after merchant approval. Refund is initiated but final settlement is not yet confirmed by the payment channel.",
      category: "After-sales refund settlement",
      sentiment: "confused",
      suggestedRisk: "medium",
      actions: [
        "Confirm that refund has been initiated.",
        "Explain settlement depends on original payment method and bank processing.",
        "Ask customer to check the original payment account.",
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
    consumer: "Aisha R.",
    region: "United Arab Emirates",
    language: "English",
    title: "Customer asks whether import tax is covered",
    issueType: "Customs tax",
    status: "new",
    priority: "medium",
    risk: "medium",
    orderId: "ORDER-910244",
    updatedAt: "45 min ago",
    originalMessage:
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
      piiPolicy: "Only city-level destination is included in the AI context.",
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
    rules: [
      "Tax responsibility depends on checkout tax terms and destination rules.",
      "Do not promise reimbursement before checking order terms.",
    ],
    ai: {
      summary:
        "Customer received an import duty request from DHL and wants to know whether the platform or customer should pay.",
      category: "Import fee explanation",
      sentiment: "confused",
      suggestedRisk: "medium",
      actions: [
        "Check whether checkout showed tax-paid terms.",
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
  {
    id: "CASE-1033",
    consumer: "Lucas P.",
    region: "Brazil",
    language: "Portuguese",
    title: "Damaged item and seller response delay",
    issueType: "After-sales / merchant response",
    status: "in_progress",
    priority: "high",
    risk: "low",
    orderId: "ORDER-690118",
    updatedAt: "1 hr ago",
    originalMessage:
      "The blender arrived cracked and the seller has not replied. I uploaded photos yesterday. Can someone help me replace it?",
    history: [
      "Customer uploaded damage photos.",
      "Seller has not responded for 20 hours.",
      "Automated reminder sent to merchant operations queue.",
    ],
    order: {
      item: "Kitchen blender, 220V",
      amount: "BRL 318.90",
      paidAt: "2026-06-12 15:31",
      destination: "Sao Paulo, Brazil",
      piiPolicy: "Photo metadata and full address are excluded from the AI snapshot.",
    },
    logistics: {
      carrier: "Correios partner line",
      trackingNo: "BR-441902-MX",
      currentNode: "Delivered",
      lastUpdate: "2 days ago",
      eta: "Delivered",
      timeline: ["Seller shipped", "Import cleared", "Out for delivery", "Delivered"],
    },
    afterSales: {
      id: "AS-661902",
      type: "Replacement",
      status: "Evidence uploaded",
      platformInvolved: "Pending merchant response",
    },
    merchant: {
      name: "Casa Nova Appliances",
      serviceScore: "4.2 / 5",
      responseTime: "18.4h avg",
      riskTags: ["Slow after-sales response"],
    },
    rules: [
      "Merchant must respond within the damage evidence review window.",
      "Replacement decision remains in original after-sales workflow.",
    ],
    ai: {
      summary:
        "Customer received a damaged item and has already uploaded evidence. The next step is merchant evidence review, with platform follow-up if the response window is exceeded.",
      category: "Damaged item replacement",
      sentiment: "dissatisfied",
      suggestedRisk: "low",
      actions: [
        "Acknowledge the damaged delivery and confirm evidence was received.",
        "Remind merchant to review the uploaded photos.",
        "Tell customer the replacement request is being followed in after-sales workflow.",
      ],
      citations: ["Damaged goods SOP v6.0", "Merchant response SLA v2.2, Brazil"],
      draft:
        "Hi Lucas, we are sorry that the item arrived damaged. We can see that your photos were uploaded successfully, and the replacement request is now waiting for merchant review. We have reminded the merchant to respond through the after-sales workflow. If the response window is exceeded, platform support will help follow up according to the damaged goods policy.",
      safety:
        "Do not approve replacement directly from the AI panel; the original after-sales workflow must confirm it.",
    },
  },
];
