# 삼기에너지솔루션즈 (419050) 기업 노트

`ezejwn/stock-tracker`(아이씨에이치 기업 노트, teal-salamander-64b50e)의 구조를 **복사해서 만든 별도 프로젝트**입니다.
원본 저장소와 원본 사이트는 건드리지 않습니다. 이 폴더는 **새 저장소 + 새 Netlify 사이트**로 배포하세요.

> ⚠️ 이 폴더 내용을 `stock-tracker` 저장소에 덮어쓰거나 push하지 마세요. 그러면 기존 아이씨에이치 사이트가 바뀝니다.

## 폴더 구성

```
├─ public/
│   ├─ index.html               화면 뼈대
│   ├─ app.js                   렌더링·차트·필터
│   ├─ market.js                주가 변동 이유 · 주변 시장
│   └─ data/samkee-data.js      ★ 내용 데이터 — 업데이트는 여기만
├─ netlify/functions/
│   ├─ stock.js                 KIS 현재가·일봉·투자자 (기본 종목 419050)
│   ├─ news.js                  네이버 뉴스 (기본 검색어 삼기에너지솔루션즈)
│   └─ notes.js                 사이트에서 기록 추가 (Blobs 저장소 samkee-notes)
├─ netlify.toml                 publish = "public"
├─ package.json
└─ .gitignore                   .env 커밋 방지
```

## 새 사이트로 배포 (원본과 분리)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ezejwn/samkee)

위 버튼을 누르면 이 저장소로 **새 Netlify 프로젝트**가 만들어집니다. 아래는 직접 연결할 때의 순서입니다.

1. GitHub에서 **새 저장소**를 만듭니다 (예: `samkee-note`). 기존 `stock-tracker`가 아닌 새 저장소입니다.
2. 이 폴더 내용을 새 저장소에 올립니다 (commit → push).
3. Netlify → **Add new site → Import an existing project** → 방금 만든 새 저장소 선택.
   새 주소(예: `xxxx.netlify.app`)가 생기고, 기존 teal-salamander 사이트는 그대로 남습니다.
4. 새 사이트의 Site configuration → Environment variables:

| 이름 | 필수 | 내용 |
|---|---|---|
| `KIS_APPKEY` | ✅ | 한국투자증권 Open API 앱키 |
| `KIS_APPSECRET` | ✅ | 시크릿 |
| `NAVER_CLIENT_ID` | | 네이버 검색 API (실시간 뉴스) |
| `NAVER_CLIENT_SECRET` | | 〃 |
| `NOTE_ADMIN_TOKEN` | | 사이트에서 기록 추가·삭제용 비밀 문자열 |

   KIS 키를 기존 사이트와 같이 써도 동작은 하지만, 토큰 발급 1분 1회 제한을 두 사이트가 나눠 쓰게 됩니다. 가능하면 앱키를 하나 더 발급해 분리하세요.

5. Deploys → **Trigger deploy → Clear cache and deploy site**.
6. 확인: `https://<새 주소>/.netlify/functions/stock?type=price` 에서 `"ok":true`, 종목코드 419050이면 성공.

| 열었을 때 | 의미 |
|---|---|
| 404 | 함수가 배포 안 됨 — 드래그 앤 드롭 배포는 함수를 안 올림. Git 연결로 배포 |
| `환경변수가 없습니다` | 4번 후 재배포 안 함 |
| `토큰 발급 실패` | 키 오류 또는 1분 1회 발급 제한 — 1분 뒤 재시도 |

## 원본(아이씨에이치 노트) 대비 바뀐 점

- **데이터** — `ich-data.js` → `samkee-data.js`, 전역 변수 `window.ICH` → `window.NOTE`
- **함수 기본값** — 종목코드 419050, 뉴스 검색어 삼기에너지솔루션즈, 기록 저장소 `samkee-notes`
- **실적 차트** — 손익분기 띠(아이씨에이치 전용) 제거, 눈금 자동. `CHART`에 같은 길이 기간만 넣고, 누적·별도 수치는 `QUARTERS` 표로
- **밸류** — 부동산 유동화 입력 대신 **미전환 CB 잔액·전환가**를 넣어 희석 PBR 계산. 자본은 지배주주 자본(비지배지분 제외)
- **동종업계** — 실적을 모르는 회사는 `null`로 두면 "–" 표시
- **화면** — 사업 구조 그림 2개(생산 거점·고객 흐름, 배터리 모듈 속 End-Plate·FF-PCB 위치)를 삼기ES 내용으로 교체

## 정보 업데이트

`public/data/samkee-data.js`를 고쳐 push하면 반영됩니다.

| 새로 생긴 것 | 고칠 곳 |
|---|---|
| 미팅·IR·통화 | `LOG` 맨 위에 추가 |
| 기사 | `NEWS` 맨 위에 추가 |
| 분기 실적 | `QUARTERS` 행 추가, `CHART`·`BS`·`META.equity`·`META.ttmSales` 갱신 |
| CB 전환청구 | `META.sharesEst`·`META.cbLeft`, `CAPITAL` |
| 고객·아이템 진척 | `ITEMS`의 `stage`·`size`·`updated` |
| 답을 들은 질문 | `OPEN`의 `status`·`answer`·`date` |
| 수정 내역 | `CHANGELOG` 맨 위 |

## 공개 범위
netlify.app 주소는 링크를 아는 누구나 볼 수 있습니다(검색 노출만 `noindex`로 막음).
내부 기안 문서의 신규 수주 진행 건, 공시 전 고객사 명칭, 내부 엑셀의 미공시 수주 금액, 미팅 녹음 링크는 넣지 않았습니다.
