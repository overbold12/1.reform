export type AgreementGroup = {
  id: string;
  title: string;
  documents: string[];
};

export const loanAgreementGroups: AgreementGroup[] = [
  {
    id: "personal-collect",
    title: "개인(신용)정보 수집 · 이용 동의",
    documents: [
      "개인(신용) 필수적 정보 수집 · 이용 동의",
      "고유식별정보 수집 · 이용 동의",
      "민감정보 수집 · 이용 동의",
    ],
  },
  {
    id: "personal-inquiry",
    title: "개인(신용)정보 조회 동의",
    documents: [
      "개인(신용) 필수적 정보 조회 동의",
      "고유식별정보 조회 동의",
    ],
  },
  {
    id: "personal-provide",
    title: "개인(신용)정보 제공 동의",
    documents: [
      "개인(신용) 필수적 정보 제공 동의",
      "고유식별정보 제공 동의",
    ],
  },
  {
    id: "loan-terms",
    title: "대출 서비스 이용 약관",
    documents: [
      "대출약관 안내 및 동의",
      "여신거래기본약관",
      "전자금융거래기본약관",
      "자동이체약관",
      "장단기 연체정보 등록에 대한 안내",
      "고액 신용대출의 사후 용도관리 강화 관련 추가약정",
      "국토교통부 주택소유확인 시스템 등 이용 관련 동의",
    ],
  },
  {
    id: "identity-service",
    title: "휴대폰 본인 확인 서비스 동의",
    documents: [
      "개인(신용) 필수적 정보 수집 · 이용 · 제공 동의",
      "고유식별정보 수집 · 이용 · 제공 동의",
      "서비스 이용약관 동의",
      "통신사 이용약관 동의",
    ],
  },
  {
    id: "mobile-safe",
    title: "모바일안심플러스 서비스 동의",
    documents: [
      "개인(신용) 필수적 정보 수집 · 이용 · 제공 동의(롯데캐피탈)",
      "개인정보 제3자 제공 동의(KCB)",
      "개인정보 제3자 제공 동의(이동통신사)",
      "서비스 약관 동의(모바일안심플러스)",
    ],
  },
];

export const publicDataAgreementGroups: AgreementGroup[] = [
  {
    id: "public-data-collect",
    title: "개인(신용)정보 수집 · 이용 동의",
    documents: [
      "개인(신용) 필수적 정보 수집 · 이용 동의",
      "고유식별정보 수집 · 이용 동의",
    ],
  },
  {
    id: "public-data-provide",
    title: "개인(신용)정보 제공 동의",
    documents: [
      "개인(신용) 필수적 정보 제공 동의",
      "고유식별정보 제공 동의",
    ],
  },
  {
    id: "public-data-request",
    title: "본인 행정정보 제공요구신청",
    documents: [
      "본인정보 제공 · 이용에 관한 사항",
      "본인정보 제공 · 이용 항목에 관한 사항",
    ],
  },
];

export const allAgreementGroups = [
  ...loanAgreementGroups,
  ...publicDataAgreementGroups,
];
