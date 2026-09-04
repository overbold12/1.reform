비교 탭의 뼈대를 구성하는 작업을 해보자

이번 작업에서는 "비교" 탭의 실제 콘텐츠를 구현하지 말고,
향후 기획 내용을 순차적으로 추가할 수 있는
UI 구조와 컴포넌트 뼈대만 구현해줘.

중요:
현재 AS-IS의 구체적인 화면, 프로세스 단계, 개선 수치,
개선 효과에 대한 정보는 아직 제공하지 않았다.

따라서 실제 내용을 임의로 추론하거나 만들어 넣지 않는다.

예를 들어

- 4 Screens → 1 Screen
- 단계 50% 감소
- 이탈률 개선
- 동의시간 단축

등과 같은 수치나 효과를 임의로 작성하면 안 된다.

실제 정보가 없는 부분은
명확한 placeholder 상태로 구현한다.

────────────────
[비교 탭 구조]
────────────────

비교 탭에서는 다음 2개 서비스를 각각 구분해서 보여준다.

1. 제휴대출-신용
2. 신용정보조회동의

비교 페이지 상단에 secondary tab 또는 segmented control 형태로

[ 제휴대출-신용 ] [ 신용정보조회동의 ]

를 배치한다.

서비스를 선택하면
해당 서비스의 비교 콘텐츠 영역이 표시되도록 한다.

두 서비스는 동일한 UI 구조를 사용하지만
데이터는 서로 독립적으로 관리할 수 있도록 구현한다.

────────────────
[각 서비스의 공통 구조]
────────────────

각 서비스에는 아래 4개의 section을 만든다.

1. 개선 요약
2. 전체 프로세스 비교
3. 주요 변경사항
4. 인터랙션 비교

────────────────

1. 개선 요약
   ────────────────

페이지 최상단에는
해당 서비스의 핵심 개선사항을 요약할 수 있는 영역을 만든다.

현재 실제 내용은 없으므로 placeholder로 구현한다.

예:

[핵심 개선 메시지 입력 예정]

AS-IS → TO-BE

[지표] [지표]

[개선 효과 입력 예정]

실제 수치나 문구는 임의로 작성하지 않는다.

──────────────── 2. 전체 프로세스 비교
────────────────

AS-IS와 TO-BE의 전체 user flow를
나란히 비교할 수 있는 영역을 만든다.

예시 UI 구조:

AS-IS

[ Step ] → [ Step ] → [ Step ]

TO-BE

[ Step ] → [ Step ]

현재 실제 단계는 제공되지 않았으므로

"AS-IS 프로세스 입력 예정"
"TO-BE 프로세스 입력 예정"

등의 placeholder만 표시한다.

추후 step 데이터를 추가하면
자동으로 flow가 렌더링되도록 component화한다.

──────────────── 3. 주요 변경사항
────────────────

향후 여러 개의 개선사항을 추가할 수 있도록
comparison card 구조를 만든다.

최소 아래 2가지 비교 유형을 지원할 수 있도록 설계한다.

TYPE A
screen-comparison

AS-IS 화면 1개와
TO-BE 화면 1개를 비교하는 형태.

레이아웃 예:

AS-IS TO-BE

[ Mobile Frame ] → [ Mobile Frame ]

아래에는

- 변경 내용
- 개선 의도
- 기대 효과

를 입력할 수 있는 영역을 만든다.

TYPE B
flow-consolidation

기존 여러 개 화면이
TO-BE에서 하나 또는 더 적은 화면으로 통합되는 경우를 위한 형태.

예:

AS-IS

[ Screen ]
↓
[ Screen ]

         →

TO-BE

[ Screen ]

현재 실제 이미지는 없으므로
mobile frame 내부에는

"AS-IS 화면 등록 예정"
"TO-BE 화면 등록 예정"

placeholder를 사용한다.

──────────────── 4. 인터랙션 비교
────────────────

향후 AS-IS / TO-BE 프로토타입을
동시에 실행할 수 있는 영역의 뼈대를 만든다.

좌측:

AS-IS
[ Prototype Area ]

우측:

TO-BE
[ Prototype Area ]

현재 실제 프로토타입은 연결하지 않는다.

대신

"AS-IS 프로토타입 연결 예정"
"TO-BE 프로토타입 연결 예정"

placeholder를 표시한다.

추후 기존 AS-IS / TO-BE component를
이 영역에 import할 수 있는 구조로 만든다.

────────────────
[Component 구조]
────────────────

비교 페이지 전체를 하나의 거대한 component로 만들지 않는다.

재사용 가능한 component 단위로 분리한다.

예:

ComparisonPage
ServiceComparisonTabs
ComparisonSummary
FlowComparison
FlowStep
ComparisonSection
ScreenComparison
FlowConsolidationComparison
InteractiveComparison
MobileFramePlaceholder

필요하면 더 적절한 이름으로 조정해도 된다.

────────────────
[데이터 구조]
────────────────

UI에 데이터를 직접 하드코딩하지 않는다.

향후 실제 기획 정보를 입력하기 쉽도록
서비스별 comparison data 구조를 별도로 만든다.

예:

comparisonServices = {
partnerLoan: {
title: "제휴대출",
summary: null,
asIsFlow: [],
toBeFlow: [],
comparisonItems: []
},

creditConsent: {
title: "신용정보조회동의",
summary: null,
asIsFlow: [],
toBeFlow: [],
comparisonItems: []
}
}

실제 정보가 없는 경우
임의 데이터를 넣지 않고
null / empty array 상태를 처리한다.

데이터가 없는 경우에도
레이아웃이 깨지지 않고
placeholder UI가 표시되도록 한다.

────────────────
[디자인]
────────────────

현재 웹페이지의 기존 디자인 시스템과
sidebar / tab / typography / spacing 규칙을 우선적으로 따른다.

새로운 디자인 시스템을 별도로 만들지 않는다.

비교 페이지는
금융 서비스 기획안을 발표하는 용도이므로

- white / gray 중심
- 충분한 whitespace
- 명확한 정보 위계
- 과도한 shadow / gradient 금지
- 카드 남발 금지
- 발표 화면에서도 읽기 쉬운 크기

를 유지한다.

AS-IS와 TO-BE는
시각적으로 구분 가능하게 하되
강한 색상을 과도하게 사용하지 않는다.

────────────────
[중요 구현 원칙]
────────────────

이번 작업의 목적은
"비교 내용 작성"이 아니라
"비교 콘텐츠를 담을 수 있는 확장 가능한 틀 구축"이다.

따라서:

1. 임의의 기획 내용을 만들지 않는다.
2. 실제 수치를 만들어내지 않는다.
3. 실제 AS-IS / TO-BE 화면을 추정해서 구현하지 않는다.
4. placeholder로 구조만 완성한다.
5. 추후 데이터를 하나씩 추가하기 쉽게 만든다.
6. 기존 프로젝트 구조와 스타일을 우선 분석한다.

먼저 현재 프로젝트의
layout, sidebar, AS-IS / TO-BE 탭 구현 방식,
공통 component 구조를 확인한 뒤

그 구조를 최대한 유지하면서
비교 탭의 skeleton을 구현해줘.
