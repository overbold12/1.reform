export type ServiceId = "partnerLoan" | "creditConsent";

export type ComparisonSummaryData = {
  message: string;
  metrics: Array<{
    id: string;
    label: string;
    asIs: string;
    toBe: string;
  }>;
  effect: string | null;
};

export type FlowStepData = {
  id: string;
  title: string;
  description?: string;
};

type ComparisonDetail = {
  change: string | null;
  intent: string | null;
  effect: string | null;
};

type BaseComparisonItem = {
  id: string;
  title: string;
  detail: ComparisonDetail;
};

export type ScreenComparisonItem = BaseComparisonItem & {
  type: "screen-comparison";
  asIsScreen: string | null;
  toBeScreen: string | null;
};

export type FlowConsolidationItem = BaseComparisonItem & {
  type: "flow-consolidation";
  asIsScreens: string[];
  toBeScreens: string[];
};

export type ComparisonItem = ScreenComparisonItem | FlowConsolidationItem;

export type ComparisonService = {
  id: ServiceId;
  title: string;
  summary: ComparisonSummaryData | null;
  asIsFlow: FlowStepData[];
  toBeFlow: FlowStepData[];
  comparisonItems: ComparisonItem[];
};

export const comparisonServices: Record<ServiceId, ComparisonService> = {
  partnerLoan: {
    id: "partnerLoan",
    title: "제휴대출-신용",
    summary: null,
    asIsFlow: [],
    toBeFlow: [],
    comparisonItems: [],
  },
  creditConsent: {
    id: "creditConsent",
    title: "신용정보조회동의",
    summary: null,
    asIsFlow: [],
    toBeFlow: [],
    comparisonItems: [],
  },
};
