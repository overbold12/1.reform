export type OptionalAgreementGroup = {
  id: string;
  title: string;
  kind: "channels" | "documents";
  children: string[];
};

export const optionalAgreementGroups: OptionalAgreementGroup[] = [
  {
    id: "product-marketing",
    title: "서비스 및 마케팅 정보 수신 동의 (상품서비스 안내)",
    kind: "channels",
    children: ["서면", "전화", "문자", "E-mail"],
  },
  {
    id: "lotte-members-provide",
    title: "롯데멤버스 제공 동의(L.POINT)",
    kind: "documents",
    children: ["업무제휴 계약을 체결한 롯데멤버스 제공"],
  },
  {
    id: "lpoint-required-personal",
    title: "개인정보 수집 · 이용 · 제공 동의 (L.POINT)",
    kind: "documents",
    children: [
      "개인정보의 필수적인 수집 · 이용에 관한 사항",
      "개인정보의 필수적인 제3자 제공에 관한 사항",
    ],
  },
  {
    id: "lpoint-optional-personal",
    title: "개인정보 선택 동의(L.POINT)",
    kind: "documents",
    children: [
      "개인정보의 선택적인 수집 · 이용에 관한 사항",
      "개인정보의 선택적인 제3자 제공에 관한 사항",
    ],
  },
  {
    id: "lpoint-marketing",
    title: "서비스 및 마케팅 정보 수신 동의 (L.POINT)",
    kind: "channels",
    children: ["서면", "전화", "문자", "E-mail"],
  },
];

export function optionalChildId(groupId: string, child: string) {
  return `${groupId}:${child}`;
}

export const initialOptionalAgreements: Record<string, boolean> =
  Object.fromEntries(
    optionalAgreementGroups.flatMap((group) => [
      [group.id, false],
      ...group.children.map((child) => [optionalChildId(group.id, child), false]),
    ]),
  );
