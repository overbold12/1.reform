export type ServiceId = "partnerLoan" | "creditConsent";
export type ProcedureId = "required-consent" | "information-review";

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

export type FlowGroupData = {
  id: string;
  title: string;
  steps: FlowStepData[];
};

type ComparisonDetail = {
  change: string | null;
  intent: string | null;
  effect: string | null;
};

export type FlowConsolidationItem = {
  id: string;
  title: string;
  detail: ComparisonDetail;
  type: "flow-consolidation";
  procedure: ProcedureId;
  asIsScreens: string[];
  toBeScreen: string | null;
};

export type ComparisonService = {
  id: ServiceId;
  title: string;
  summary: ComparisonSummaryData | null;
  asIsFlow: FlowGroupData[];
  toBeFlow: FlowGroupData[];
  comparisonItems: FlowConsolidationItem[];
};

export const comparisonServices: Record<ServiceId, ComparisonService> = {
  partnerLoan: {
    id: "partnerLoan",
    title: "제휴대출-신용",
    summary: {
      message:
        "서식 항목 및 정보 확인 절차 개편을 통해 전체 페이지를 34페이지에서 28페이지로 축약했습니다.",
      metrics: [
        {
          id: "total-pages",
          label: "전체 페이지 수",
          asIs: "34 페이지",
          toBe: "28 페이지",
        },
      ],
      effect: null,
    },
    asIsFlow: [
      {
        id: "required-consent",
        title: "필수 동의 절차",
        steps: [
          {
            id: "credit-public-data-consent",
            title: "필수 동의",
            description: "신용정보조회, 공공마이데이터",
          },
          { id: "identity-consent", title: "본인인증 동의" },
          { id: "required-terms-1", title: "필수약관 동의 (1)" },
          { id: "required-terms-2", title: "필수약관 동의 (2)" },
        ],
      },
      {
        id: "information-review",
        title: "정보 확인 절차",
        steps: [
          { id: "suitability", title: "적합성 원칙 확인" },
          { id: "payday", title: "급여일 확인" },
          { id: "fund-purpose", title: "자금용도 확인" },
          { id: "income-type", title: "소득유형 확인" },
          { id: "beneficial-owner", title: "실소유자 여부 확인" },
        ],
      },
    ],
    toBeFlow: [
      {
        id: "required-consent",
        title: "필수 동의 절차",
        steps: [
          {
            id: "integrated-required-consent",
            title: "필수 동의",
            description: "서식 통합",
          },
        ],
      },
      {
        id: "information-review",
        title: "정보 확인 절차",
        steps: [
          {
            id: "integrated-information-review",
            title: "정보 확인",
            description: "절차 통합",
          },
        ],
      },
    ],
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
