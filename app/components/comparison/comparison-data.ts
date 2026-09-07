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
    summary: {
      message:
        "불필요한 조건 분기와 반복 동의를 걷어내, 모든 고객이 더 짧고 일관된 흐름으로 신용정보조회 동의를 완료할 수 있도록 개선했습니다.",
      metrics: [
        {
          id: "total-pages",
          label: "전체 페이지 수",
          asIs: "16 페이지",
          toBe: "13 페이지",
        },
        {
          id: "conditional-flow",
          label: "고객 진행 경로",
          asIs: "햇살론·자동차번호 여부에 따라 분기",
          toBe: "조건 분기 없는 공통 흐름",
        },
        {
          id: "consent-process",
          label: "동의 절차",
          asIs: "단계별 개별 동의",
          toBe: "한 번의 통합 동의",
        },
      ],
      effect: "고객이 상품이나 차량 정보 조건과 관계없이 동일한 순서로 진행하며, 한 번의 동의만으로 절차를 마칠 수 있습니다.",
    },
    asIsFlow: [],
    toBeFlow: [],
    comparisonItems: [],
  },
};
