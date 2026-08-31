---
name: interaction-theme
description: 모바일 앱 대출 신청 프로세스 프로토타입 디자인 구현헤 활용
---

## 1. 목적

이 프로젝트에서 구현하는 웹페이지는 정적인 모바일 화면 목업이 아니다.

실제 모바일 금융 앱의 대출 신청 프로세스를 사용자가 마우스로 직접 조작하면서
화면 전환, 입력, 동의, 선택, 로딩, 심사 결과 확인 등의 흐름을 체험할 수 있는
"시연용 인터랙티브 프로토타입"을 구현하는 것이 목적이다.

첨부된 실제 테스트앱 조작 영상을 가장 중요한 인터랙션 레퍼런스로 사용한다.

프로토타입을 구현할 때 다음 우선순위를 따른다.

1. 실제 앱과 유사한 인터랙션
2. 화면 상태 변화의 자연스러움
3. 사용자의 조작에 대한 즉각적인 피드백
4. 발표/회의 중 안정적으로 시연 가능한 흐름
5. 화면 디자인의 시각적 유사성

디자인을 정적으로 복제하는 것보다
"실제 앱을 조작하는 것처럼 느껴지는가"를 더 중요하게 판단한다.

---

# 2. 기본 구현 원칙

## 2.1 정적 이미지 프로토타입을 만들지 않는다

아래 방식은 금지한다.

- 전체 화면을 하나의 이미지로 넣고 클릭 영역만 지정
- 화면마다 이미지를 교체하는 방식
- 버튼처럼 보이지만 실제 상태를 가지지 않는 요소
- 입력창처럼 보이지만 실제 입력할 수 없는 요소
- 체크박스 이미지 단순 교체
- 로딩 화면을 정적인 이미지로 표시

UI는 가능한 한 React 컴포넌트로 실제 구현한다.

예:

- Button
- Checkbox
- Radio
- Input
- BottomSheet
- Modal
- ProgressBar
- ProductCard
- SegmentedControl
- Slider
- BankSelector
- AgreementItem
- StepHeader

각 요소는 실제 state를 가져야 한다.

---

# 3. 모바일 앱 프레임

웹페이지 안에 실제 모바일 앱을 조작하는 것처럼 보이는
모바일 viewport 영역을 만든다.

권장 기준:

- width: 약 360~390px
- height: 약 760~850px
- 세로형 모바일 화면
- overflow-y: auto
- 실제 앱처럼 화면 내부에서 스크롤

Desktop에서는 모바일 화면이 하나의 독립된 App Frame처럼 보여야 한다.

사용자는 마우스를 사용하지만,
모든 인터랙션은 모바일의 tap interaction을 기준으로 설계한다.

hover 효과는 최소화한다.

Desktop Web처럼 느껴지는 hover UI보다
Mobile App의 pressed / selected 상태를 표현한다.

---

# 4. 화면 전환 원칙

화면 전환은 즉시 DOM이 교체되는 것처럼 보이지 않도록 한다.

기본적으로 다음 패턴을 사용한다.

### 일반 페이지 이동

현재 화면 → 다음 화면

- 약 180~280ms transition
- opacity 또는 아주 미세한 horizontal movement 사용 가능
- 과도한 page transition animation은 금지

### Bottom Sheet

영상에서 자주 등장하는 핵심 인터랙션이다.

Bottom Sheet가 열릴 때:

1. 현재 화면 유지
2. 화면 전체에 반투명 dim layer 표시
3. Bottom Sheet가 화면 아래쪽에서 위로 이동
4. Sheet 상단은 rounded corner
5. Sheet가 열려있는 동안 background interaction 차단

권장 animation:

- duration: 220~300ms
- transform: translateY(100%) → translateY(0)
- easing: ease-out

닫힐 때 반대로 동작한다.

Bottom Sheet가 나타날 때 background는 사라지는 것이 아니라
반드시 그대로 유지된 상태에서 어두워져야 한다.

---

# 5. Dim Layer

Modal이나 Bottom Sheet가 열리면
현재 화면 위에 dim layer를 표시한다.

예:

background:
rgba(0, 0, 0, 0.45)

또는 원본 앱 화면과 비슷한 농도로 조정한다.

Dim layer가 나타나는 순간도 너무 갑작스럽지 않게
약 150~220ms opacity transition을 적용한다.

---

# 6. 동의 인터랙션

동의 과정은 이 프로토타입에서 매우 중요한 인터랙션이다.

동의 항목은 단순 텍스트가 아니라
각각 독립적인 상태를 갖는다.

예:

```ts
type AgreementState = {
  required1: boolean;
  required2: boolean;
  required3: boolean;
};
```

체크 시:

unchecked
→ tap
→ checked

체크 icon은 즉시 변경하되
100~180ms 정도의 subtle scale animation을 적용해도 좋다.

예:

scale(0.85) → scale(1)

다만 과장된 bounce animation은 사용하지 않는다.

---

# 7. 전체 동의 / 개별 동의

전체 동의를 선택하면 하위 필수 항목도 함께 선택된다.

전체 동의를 해제하면
관련된 하위 항목 역시 적절히 해제한다.

반대로 모든 하위 항목이 선택되면
전체 동의도 선택된 상태가 된다.

일부만 선택되어 있다면
전체 동의는 선택 상태로 표시하지 않는다.

화면상 체크 상태와 내부 state가 항상 일치해야 한다.

---

# 8. 동의서 상세

화살표 또는 동의서명을 선택하면
해당 약관의 상세 화면 또는 상세 상태가 나타날 수 있도록 한다.

프로토타입의 목적상 실제 긴 금융 약관 전체를 구현할 필요는 없지만

- 제목
- 설명문
- 약관 내용 영역
- 체크/동의 영역

등을 실제 UI처럼 구성한다.

목표는 "화면을 눌러보면 실제 앱처럼 반응한다"는 느낌이다.

---

# 9. 입력 필드

영상에 등장하는 다음 유형의 입력을 실제로 구현한다.

- 휴대폰 번호
- 주민등록번호
- 인증번호
- 차량번호
- 계좌번호
- 주소
- 이메일
- 기타 숫자/문자 입력

Input을 클릭하면 focus 상태가 명확하게 보여야 한다.

입력값은 실제 state로 관리한다.

사용자가 타이핑한 값이 즉시 화면에 반영되어야 한다.

---

# 10. 입력 단계별 UI 상태

입력 화면은 최소한 다음 세 상태를 구분한다.

### Empty

아직 아무 값도 입력하지 않은 상태

### Typing

사용자가 입력하고 있는 상태

### Complete

필요한 값이 모두 입력된 상태

예:

휴대폰 번호

빈 값
→ 010620
→ 01062066843

처럼 실제 입력 진행 과정이 보이도록 한다.

입력 완료 여부에 따라 다음 버튼 상태도 함께 변경한다.

---

# 11. 주민등록번호 등 민감정보 표현

주민등록번호와 같은 값은
실제 금융앱처럼 일부 값을 masking 처리한다.

예:

900715 - ●●●●●●●

입력 시 실제 state에는 값을 가지고 있더라도
화면 표시에서는 mask 처리한다.

민감한 실제 개인정보는 사용하지 않는다.
모든 데이터는 dummy data를 사용한다.

---

# 12. Keyboard Interaction

브라우저 기본 input만 사용하는 방식도 가능하지만
시연 화면에서 실제 모바일 앱 느낌이 중요한 입력 단계에는
custom mobile keypad 구현을 적극 고려한다.

특히:

- 주민등록번호
- 계좌번호
- 인증번호

등의 숫자 입력에서 효과적이다.

Custom Keypad를 구현하는 경우:

tap number
→ input state update
→ UI 즉시 update

삭제 버튼:

tap
→ 마지막 문자 삭제

완료 버튼:

validation 통과
→ keyboard close
→ 다음 CTA 활성화

키를 눌렀을 때 약 80~120ms pressed feedback을 표현한다.

---

# 13. 버튼 활성화 상태

CTA 버튼은 다음 상태를 명확히 구분한다.

- disabled
- enabled
- pressed
- loading

필수 입력이나 동의가 완료되지 않았으면 disabled.

완료되면 enabled.

단, 휴대폰번호, 주민등록번호, 인증번호처럼 유효한 입력이 완료된 뒤에만
의미가 생기는 단독 진행 CTA는 이 프로젝트의 모든 입력 화면에서 미완료 상태의
disabled 버튼을 미리 노출하지 않는다. 빈 값 또는 입력 중에는 CTA를 렌더링하지
않고, 화면별 유효 길이와 검증 조건이 충족되는 순간에만 CTA를 표시한다.

CTA가 처음 나타날 때는 약 150~200ms의 짧은 fade 또는 미세한 이동을 적용해
갑작스럽게 보이지 않도록 한다. 단, 기준 화면이나 사용자의 요구가 disabled 상태
노출을 명시한다면 해당 화면의 요구를 우선한다.

예:

```ts
const canProceed = phoneNumber.length >= requiredLength && requiredAgreement;
```

활성화는 abrupt하게 바뀌기보다
background / opacity transition을 150~200ms 적용한다.

---

# 14. 원형 Arrow CTA

영상에 나타나는 우측 하단 또는 입력 영역 옆의
원형 Next Arrow 버튼도 실제 버튼으로 구현한다.

입력 완료 전:

- 렌더링하지 않음

입력 완료 후:

- 활성 색상
- tap 가능

단, 기준 화면이나 사용자의 요구가 disabled 상태 노출을 명시한 경우에는 해당
화면의 요구를 우선한다.

tap 시:

- pressed feedback
- 다음 상태로 이동

---

# 15. Validation

프로토타입이라고 해서 모든 입력을 무조건 통과시키지 않는다.

최소한 시연에 필요한 validation을 구현한다.

예:

휴대폰번호:
숫자 길이 조건

인증번호:
6자리

계좌번호:
최소 입력 길이

이메일:
간단한 email pattern

단 실제 금융 시스템 수준의 검증은 필요하지 않다.

목적은 interaction realism이다.

---

# 16. 인증번호 요청 흐름

인증번호 요청 버튼을 누르면:

1. button pressed
2. 짧은 loading 또는 feedback
3. 인증번호 입력 가능 상태
4. 안내 문구 표시
5. 필요하면 toast/modal 표시

등의 상태 변화가 있어야 한다.

단순히 다음 화면으로 바로 이동시키지 않는다.

---

# 17. Modal / Alert

앱에서 정보 확인 또는 인증 완료 등의 안내가 필요한 경우
Modal을 사용한다.

Modal 구조:

- dim background
- 하단 또는 중앙 panel
- 안내 문구
- confirm CTA

확인 버튼 tap 후 modal close.

Modal open / close 역시 animation을 적용한다.

---

# 18. 인증서 선택 Bottom Sheet

영상에서 인증 과정 중
사용할 인증서를 선택하는 Bottom Sheet 형태의 UI가 등장한다.

이를 프로토타입에서도 재현한다.

예:

인증서 선택

- 카카오 인증서
- 토스 인증서
- 공동 인증서

항목 tap 시:

selected state
또는 해당 인증 플로우로 이동

실제 외부 인증 서비스와 연동하지 않는다.

프로토타입 내부에서 mock 상태 전환으로 구현한다.

---

# 19. 외부 인증 앱 이동 Simulation

실제 앱에서 외부 인증 서비스로 이동하는 것 같은 과정이 필요한 경우

실제 앱을 호출하지 말고
prototype 내부에서 external-auth simulation screen을 사용한다.

예:

인증서 선택
→ 인증 진행 화면
→ loading
→ 인증 완료
→ 원래 대출 프로세스로 복귀

이를 통해 실제 앱 간 이동과 비슷한 흐름을 연출한다.

---

# 20. Loading Spinner

로딩이 발생하는 화면에서는
정적인 spinner 이미지를 사용하지 않는다.

CSS animation 또는 component animation으로 구현한다.

예:

```css
animation: spin 0.8s linear infinite;
```

spinner는 너무 크거나 화려하게 만들지 않는다.

원본 금융 앱처럼
작고 명확한 processing feedback을 제공한다.

---

# 21. 진행률 Progress

영상의 심사/정보조회 단계에서
진행률이 시간에 따라 증가하는 UI를 중요하게 재현한다.

예:

0%
→ 40%
→ 67%
→ 80%
→ 100%

숫자만 바뀌는 것이 아니라
Progress Bar 자체가 자연스럽게 늘어나야 한다.

예:

```css
transition: width 600ms ease;
```

가능하면 React state와 timer를 사용한다.

예:

```ts
setProgress(40);

setTimeout(() => {
  setProgress(67);
}, 800);

setTimeout(() => {
  setProgress(80);
}, 1600);

setTimeout(() => {
  setProgress(100);
}, 2400);
```

정확한 duration보다
"단계적으로 시스템이 처리되고 있다"는 느낌이 중요하다.

---

# 22. Loading 화면의 메시지 변화

긴 로딩에서는 동일한 화면을 계속 보여주지 않는다.

영상처럼 진행 과정에 따라:

- 진행률
- 아이콘
- 설명 문구
- illustration

등이 변경될 수 있다.

예:

"기관에서 서류를 가져오고 있어요."

→

"신용정보를 확인하고 있어요."

→

"한도와 금리를 계산하고 있어요."

각 변화는 fade transition으로 연결한다.

---

# 23. Loading 시간을 너무 길게 만들지 않는다

실제 업무 시연용 프로토타입이므로
실제 앱의 대기시간을 그대로 재현할 필요는 없다.

권장:

일반 loading:
300~800ms

중요 processing:
1~3초

긴 심사 simulation:
약 3~6초

발표자가 기다리느라 흐름이 끊길 정도로 길게 만들지 않는다.

---

# 24. 대출 결과 화면

대출 결과는 하나 이상의 Product Card 형태로 구현한다.

각 카드에는 필요에 따라:

- 상품명
- 금리
- 한도
- 간단한 설명
- CTA

를 표시한다.

카드는 실제 clickable element이다.

클릭하면 해당 상품의 상세 또는 조건 입력 화면으로 이동한다.

단순 display card로 구현하지 않는다.

---

# 25. Product Card Interaction

Product Card에 다음 상태를 고려한다.

default
→ pressed
→ selected

선택된 상품이 있다면
다른 카드와 시각적으로 구분될 수 있도록 한다.

다만 Web UI처럼 강한 hover 효과를 주지 않는다.

---

# 26. 상품 상세 화면

상품 상세에서는

- 한도
- 금리
- 기간
- 상환 방식
- 예상 납입금액
- 신청 CTA

등의 정보를 보여준다.

영상처럼 상단에서 결과 화면과 연결된 흐름을 유지한다.

---

# 27. 금액 Slider

대출 금액 등을 조정하는 UI는
실제 range slider로 구현한다.

사용자가 drag하면:

slider thumb 이동
→ 금액 변경
→ 관련 계산값 변경

이 동시에 일어나야 한다.

예:

```ts
loanAmount;
monthlyPayment;
```

등을 state로 관리한다.

프로토타입에서는 복잡한 금융 계산 대신
간단한 mock calculation을 사용해도 된다.

---

# 28. Segmented Control

대출 기간 선택처럼

12
24
36
48
60

형태의 선택 UI가 있다면
각 항목을 실제 selectable component로 구현한다.

선택하면:

previous selected
→ unselected

new item
→ selected

금리/예상 납입액 등 관련 값도 필요하면 함께 변경한다.

---

# 29. Radio Interaction

상환방법, 자동이체일, 기타 선택형 질문은
radio selection 방식으로 구현한다.

한 항목 선택 시
같은 group의 다른 항목은 자동 해제한다.

선택 결과에 따라 다음 영역이 표시되는 경우
conditional rendering을 사용한다.

---

# 30. Multi-step Header

대출 신청 과정에서 현재 단계를 보여주는 Header를 구현한다.

예:

1 대출정보
2 계좌정보
3 약관동의
4 신청정보확인

현재 단계는 강조하고
나머지 단계는 비활성 상태로 표시한다.

화면 이동 시 current step state도 변경한다.

---

# 31. Bank Selection

은행 선택 화면에서는
실제 선택 가능한 은행 grid/list를 만든다.

Bank item:

default
→ tap
→ selected

selected bank state를 저장한다.

은행 선택 후 계좌 입력 화면에
선택된 은행명을 표시한다.

---

# 32. 계좌번호 입력

계좌번호는 숫자 input으로 구현한다.

입력 중:

number update

입력 완료:

자동이체 관련 동의 또는 확인 CTA 활성화

필요하면 account verification simulation을 넣는다.

예:

확인 tap
→ spinner
→ success state

---

# 33. 정보 선택 Bottom Sheet

직업, 소득 종류, 자금 목적, 기타 정보처럼
목록에서 하나를 선택하는 UI는 Bottom Sheet로 구현한다.

예:

직업

"항목을 선택해 주세요"
tap
↓
Bottom Sheet open

- 근로소득
- 사업소득
- 부동산임대소득
- 연금소득
- 기타소득

item tap
↓
sheet close
↓
선택값 화면 반영

이 패턴을 reusable component로 만든다.

---

# 34. 선택 질문

예 / 아니오 형식의 질문은
실제 radio state로 구현한다.

질문마다 독립적인 state를 가진다.

모든 필수 질문에 답변하기 전까지
다음 CTA는 disabled 상태를 유지한다.

---

# 35. 긴 약관 화면

약관 페이지는 mobile viewport 내부에서 scroll 가능해야 한다.

상단 설명
↓
약관 본문
↓
질문
↓
다음 본문
↓
질문

형태로 자연스럽게 스크롤된다.

브라우저 전체 페이지가 움직이는 것보다
모바일 App Frame 내부가 스크롤되는 형태를 우선한다.

---

# 36. Sticky CTA

긴 입력/약관 화면에서는
필요에 따라 CTA를 화면 하단에 고정한다.

예:

확인
다음
대출 신청하기

단 keyboard 또는 Bottom Sheet가 열린 경우
CTA와 겹치지 않도록 처리한다.

---

# 37. Scroll Position

새로운 화면으로 이동하면
기본적으로 scroll position을 top으로 초기화한다.

단 Bottom Sheet open/close에서는
background scroll 위치를 유지한다.

Bottom Sheet가 열린 상태에서
background가 스크롤되지 않게 한다.

---

# 38. Interaction Feedback

모든 클릭 가능한 UI는
사용자가 눌렀다는 피드백이 있어야 한다.

가능한 방식:

- opacity
- scale
- background change

권장 예:

```css
transform: scale(0.98);
```

약 80~120ms 정도의 pressed feedback.

과장된 animation은 금지한다.

---

# 39. Animation Timing Guideline

전체 프로토타입에서 animation timing을 통일한다.

Micro Interaction:
80~160ms

Button / Checkbox:
120~180ms

Fade:
150~220ms

Page transition:
180~280ms

Bottom Sheet:
220~300ms

Modal:
200~280ms

Progress update:
400~800ms

Loading simulation:
500ms~3s

실제 앱에서 느껴지는 빠르고 절제된 motion을 목표로 한다.

---

# 40. Animation 원칙

금융 앱이므로 animation은 화려함보다
명확한 상태 전달을 위한 목적으로 사용한다.

Avoid:

- 큰 bounce
- excessive spring
- overshoot
- flashy gradient animation
- unnecessary parallax
- desktop website style animation

Prefer:

- fade
- slide
- subtle scale
- progress animation
- spinner
- state transition

---

# 41. 상태 기반 구현

화면 구현을 URL 단위로만 생각하지 않는다.

하나의 화면에서도 여러 UI 상태가 존재한다.

예:

```ts
type ScreenState =
  | "idle"
  | "typing"
  | "valid"
  | "loading"
  | "success"
  | "error";
```

가능하면 명시적인 state로 관리한다.

사용자의 행동에 따라 state가 변화하고,
UI가 state를 표현하는 구조로 만든다.

---

# 42. Flow State

전체 대출 흐름도 state로 관리한다.

예:

```ts
type LoanStep =
  | "intro"
  | "agreement"
  | "phone"
  | "identity"
  | "vehicle"
  | "certificate"
  | "documents"
  | "screening"
  | "result"
  | "loanCondition"
  | "account"
  | "personalInfo"
  | "terms"
  | "review";
```

반드시 이 enum을 그대로 사용할 필요는 없다.

중요한 것은
사용자가 실제로 이전 단계 → 다음 단계로 진행한다고 느낄 수 있도록
명확한 flow state를 만드는 것이다.

---

# 43. Mock Data

Backend API는 필요하지 않다.

프로토타입 내부의 mock data를 사용한다.

예:

```ts
const mockUser = {
  name: "김종성",
};

const mockLoan = {
  limit: 60000000,
  rate: 10.33,
  period: 60,
};
```

실제 개인정보를 사용하지 않는다.

---

# 44. Mock API Delay

API 호출처럼 보이는 작업은 Promise 또는 timeout으로 simulation한다.

예:

```ts
await delay(800);
```

그 사이 spinner나 progress UI를 보여준다.

다음과 같은 작업에 적합하다.

- 인증
- 계좌 확인
- 서류 조회
- 심사
- 상품 계산

---

# 45. 실패 상태도 필요하면 구현

모든 흐름이 항상 성공하는 단순 slide show가 되지 않도록 한다.

특히 비교 시연에 도움이 된다면
일부 화면에 간단한 validation feedback을 제공한다.

예:

입력값 부족
→ CTA disabled

잘못된 값
→ field message

단 복잡한 error scenario를 만드는 것이 프로젝트 목적은 아니다.

---

# 46. 컴포넌트 재사용

같은 interaction pattern을 여러 화면에서 반복 구현하지 않는다.

예상 reusable components:

```txt
MobileFrame
AppHeader
StepHeader
PrimaryButton
CircleNextButton
TextInput
NumericInput
Checkbox
Radio
AgreementRow
BottomSheet
OptionBottomSheet
Modal
LoadingSpinner
ProgressBar
ProductCard
SegmentedControl
AmountSlider
BankGrid
Toast
```

Interaction 동작은 component에 포함시키되
business flow state는 상위 screen에서 관리한다.

---

# 47. Desktop Presentation 환경

이 웹페이지는 실제 모바일 고객용 서비스가 아니라
회의/보고/발표에서 사용하는 시연용 웹페이지이다.

따라서 다음을 고려한다.

- 마우스 클릭만으로 모든 동작 가능
- 발표 도중 입력하기 어렵지 않아야 함
- 작은 클릭 영역 금지
- 화면 전환이 안정적이어야 함
- loading이 지나치게 오래 걸리지 않아야 함
- refresh하면 처음 상태로 복구 가능
- 브라우저 오류나 실제 외부 앱 호출 금지

---

# 48. Reset 기능

시연 도중 언제든 프로토타입을 처음부터 다시 실행할 수 있도록
Reset 기능을 제공하는 것을 권장한다.

Reset 시:

- 입력값 초기화
- 선택값 초기화
- 동의 상태 초기화
- progress 초기화
- 현재 screen 초기화

발표 중 다시 시연하기 쉬워야 한다.

---

# 49. 실제 조작 영상 활용 원칙

실제 테스트앱 영상에서 다음 사항을 적극적으로 분석하여 구현한다.

- 화면 등장 순서
- 사용자가 tap하는 위치
- tap 이후 화면 변화
- Bottom Sheet가 열리는 방향
- 버튼 활성화 시점
- 입력 필드 변화
- masking
- 선택 완료 후 UI 변화
- loading 표시 방식
- progress 변화
- 화면 스크롤 방식
- 다음 단계 이동 방식
- CTA 위치
- Modal open/close 방식

영상에 존재하는 interaction이 확인된다면
정적 UI보다 해당 interaction 구현을 우선한다.

---

# 50. 영상에서 특히 재현해야 하는 Interaction Pattern

이번 프로토타입에서는 아래 Interaction Pattern을
높은 우선순위로 구현한다.

### A. 동의 방식

동의 항목 tap
→ check state 변경
→ 필수 항목 완료 여부 계산
→ CTA state 변경

### B. 동의 종류 선택 Bottom Sheet

Button tap
→ dim background
→ Bottom Sheet slide-up
→ option 선택
→ confirm
→ Bottom Sheet close

### C. 번호 입력

Input focus
→ keyboard
→ 숫자 입력
→ 실시간 입력 표시
→ 유효 길이 충족
→ 숨겨져 있던 CTA 표시 및 활성화

### D. 주민등록번호

숫자 입력
→ 앞자리 표시
→ 뒷자리 masking
→ 완료 상태

### E. 인증

인증 요청
→ loading
→ 인증 UI
→ confirm
→ 인증 완료 feedback

### F. 인증서 선택

Bottom Sheet open
→ 인증서 선택
→ external authentication simulation
→ 원래 화면 복귀

### G. 서류 조회 / 심사

화면 진입
→ progress animation
→ 안내 문구/illustration 변화
→ progress 100%
→ 결과 화면 이동

### H. 대출 결과

결과 card 표시
→ card 선택
→ 상품 상세 화면

### I. 조건 변경

금액 slider 변경
→ 금액 표시 update

기간 선택
→ selected state 변경

상환방법 선택
→ radio 변경

관련 예상값도 함께 update

### J. 계좌 등록

은행 선택
→ 계좌번호 입력
→ 확인
→ loading
→ success

### K. 정보 입력

항목 선택
→ Bottom Sheet
→ 값 선택
→ 화면 값 변경

### L. 약관 확인

스크롤
→ 질문별 Yes/No
→ 필수 응답 완료
→ 다음 CTA 활성화

---

# 51. 구현 품질 판단 기준

프로토타입을 완료했다고 판단하기 전에
다음 질문에 모두 Yes가 되어야 한다.

- 화면의 주요 버튼을 실제로 누를 수 있는가?
- 입력 필드에 실제 값을 입력할 수 있는가?
- 입력 결과가 화면에 즉시 반영되는가?
- 동의 체크 상태가 실제로 변경되는가?
- 필수 입력 여부에 따라 CTA가 활성화되는가?
- Bottom Sheet가 실제로 slide-up 되는가?
- Bottom Sheet가 열리면 background가 dim 되는가?
- Modal을 실제로 닫을 수 있는가?
- progress bar가 실제로 움직이는가?
- loading spinner가 실제로 회전하는가?
- 상품 card를 눌러 다음 화면으로 이동하는가?
- slider를 실제로 움직일 수 있는가?
- segmented option을 실제로 변경할 수 있는가?
- radio 선택이 정상적으로 동작하는가?
- 긴 화면을 실제로 scroll 할 수 있는가?
- 전체 흐름을 처음부터 끝까지 직접 조작할 수 있는가?

---

# 52. 금지 사항

다음 구현은 하지 않는다.

### 1.

정적 screenshot을 전체 화면 background로 사용하고
투명 button만 올리는 방식.

### 2.

실제 input 대신
미리 작성된 텍스트를 시간에 따라 보여주는 방식.

### 3.

체크박스를 눌러도 내부 state가 없는 방식.

### 4.

모든 버튼을 단순히 다음 화면 이동 용도로만 사용하는 방식.

### 5.

로딩 화면을 정적인 이미지로 만드는 방식.

### 6.

실제 앱과 관계없는 화려한 animation을 임의 추가하는 것.

### 7.

Desktop Web UI pattern을 Mobile UI보다 우선하는 것.

### 8.

Prototype에 불필요한 backend, database, authentication 서버를 구축하는 것.

---

# 53. 구현 접근 방식

새로운 화면을 구현하기 전에 먼저 영상과 디자인을 분석해
다음 세 가지를 정의한다.

```txt
1. Initial State
2. User Action
3. Result State
```

예:

```txt
Initial
휴대폰 번호 미입력
CTA disabled

Action
사용자가 11자리 입력

Result
CTA enabled
```

또는:

```txt
Initial
동의서 선택 화면

Action
"동의서 종류 선택" tap

Result
Background dim
Bottom Sheet slide-up
```

모든 중요 Interaction을 이런 방식으로 먼저 해석한 후 구현한다.

---

# 54. 화면보다 State Transition을 먼저 생각한다

프로토타입 구현 시 사고 순서는 다음과 같다.

나쁜 방식:

Screen A 디자인
→ Screen B 디자인
→ Screen C 디자인

좋은 방식:

Screen A
→ 사용자가 무엇을 누르는가
→ 어떤 state가 변경되는가
→ 어떤 feedback이 발생하는가
→ Screen B로 언제 이동하는가

---

# 55. 최종 목표

완성된 프로토타입을 처음 보는 사람이
별도의 설명 없이 마우스로 직접 조작했을 때

"실제 모바일 대출 앱을 PC에서 실행하고 있는 것 같다"

는 느낌을 받을 정도의 Interaction Fidelity를 목표로 한다.

Pixel-perfect static mockup보다
Interaction Fidelity를 우선한다.
