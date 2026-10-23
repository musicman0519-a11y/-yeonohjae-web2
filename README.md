# 연오재한의원 홈페이지 (정적 HTML 버전)

www.yeonojae.com 과 동일한 레이아웃·메뉴·콘텐츠를 정적 HTML + Tailwind CSS 로 재구성한 프로젝트입니다.
서버 빌드 없이 Vercel 등 정적 호스팅에 그대로 올릴 수 있습니다. (Tailwind CSS 만 로컬에서 미리 빌드해 `css/tailwind.css` 로 넣어 둡니다.)

## 페이지 구성 (11페이지)

| 주소 | 파일 | 내용 |
|---|---|---|
| / | index.html | 홈 v2 (영상 히어로, 미션, 약속 3, 의료진, 왜 연오재, 고민 Q카드, 진료 6, 신뢰, 둘러보기, FAQ, 지도, 칼럼, CTA) |
| (시안) | index-v3.html | 2026-10-20 리디자인 시안. 검색·배포 제외 |
| (비교용) | index-v1.html | 원본 사이트 그대로 복제한 홈. 검색 제외 |
| /diagnostics | diagnostics.html | 진단·검사센터 |
| /personalized-herbal-medicine | personalized-herbal-medicine.html | 맞춤한약치료 |
| /clinics/musculoskeletal | clinics/musculoskeletal.html | 통증·근골격·추나 클리닉 |
| /clinics/pediatrics-growth | clinics/pediatrics-growth.html | 소아·청소년 성장 클리닉 |
| /clinics/womens-health | clinics/womens-health.html | 여성 클리닉 |
| /clinics/metabolic-weight-loss | clinics/metabolic-weight-loss.html | 린다이어트·대사질환 클리닉 |
| /clinics/skin-immunity | clinics/skin-immunity.html | 피부·면역·체질 클리닉 |
| /clinics/autonomic | clinics/autonomic.html | 두뇌·자율신경·수험생 클리닉 |
| /clinics/ear-nose-throat | clinics/ear-nose-throat.html | 안면마비·이명·어지럼 클리닉 |
| /column | column.html | 원장칼럼 (신규) |
| /faq | faq.html | 자주 묻는 질문 70개 (신규, 검색·주제 필터) |
| /faq/<주제> | faq/*.html (12) | 주제별 FAQ 페이지 (2026-10-23, `_tools/faq_data.py` 의 key) |
| /column/<slug> | column/*.html (6) | 원장칼럼 글 (2026-10-23, `_tools/column_data.py`) |
| /privacy | privacy.html | 개인정보처리방침 (신규, 검색 제외) |
| (오류) | 404.html | 없는 주소 안내 (Vercel 자동 사용) |

메뉴: 병원소개(드롭다운 2) · 맞춤한약치료 · 질환별 클리닉(드롭다운 7) · 진단·검사센터 · 원장칼럼 · 자주 묻는 질문 · 연오재 소식(외부 블로그)

## 폴더 구조

```
index.html, diagnostics.html, ...   페이지 본문 (Tailwind 클래스 그대로 편집 가능)
clinics/                            클리닉 7페이지
css/tailwind.css                    사전 빌드된 Tailwind CSS (_tools/tailwind 에서 생성, 직접 편집 금지)
css/site.css                        공통 추가 CSS (폰트, 등장 애니메이션, 메뉴, FAQ)
js/site-config.js                   전화번호·예약 링크·주소·네이버 지도 키·GA4 ID
js/main.js                          메뉴·드롭다운·FAQ·의료진 팝업·지도(네이버 키 없으면 구글 지도)·GA 스크립트
logo/ icon/ images/ video/ og/      이미지·영상 자산 (원본 사이트와 동일 경로)
fonts/Mona-Sans.var.woff2           영문 디스플레이 폰트
vercel.json                         cleanUrls(확장자 없는 주소) + 보안 헤더
sitemap.xml, robots.txt             검색엔진용
serve.py                            로컬 미리보기 서버
_tools/build.py                     원본 HTML -> 정적 페이지 변환 스크립트 (재생성용)
_tools/original/                    변환에 사용한 원본 SSR HTML (참고용)
```

## 로컬에서 보기

```
python serve.py
```
브라우저에서 http://localhost:8080 접속. (파일을 더블클릭으로 여는 file:// 방식은 절대경로 때문에 동작하지 않습니다.)

## 수정 방법

- **문구·레이아웃**: 각 HTML 파일을 직접 편집합니다. 새 Tailwind 클래스를 쓰면 `npm --prefix _tools/tailwind run build` 로 CSS 를 다시 만들어야 합니다.
- **헤더 메뉴**: 10개 페이지에 같은 헤더가 들어 있습니다. 메뉴를 바꾸려면 `_tools/build.py` 의 `NAV` 를 고친 뒤 `python _tools/build.py` 로 전체 재생성하는 것이 가장 빠릅니다. (본문을 직접 고친 뒤에는 재생성하면 덮어쓰이므로 주의)
- **전화·예약·지도·GA**: `js/site-config.js` 만 수정합니다.
- **FAQ**: `_tools/faq_data.py` 의 `FAQ_ALL` 을 고치고 재생성(홈·/faq·클리닉 하단·검수 문서가 모두 갱신됨). **의료진 / 원장칼럼 목록**: `_tools/build.py` 의 `DOCTORS_V2`, `COLUMNS`.
- **이미지 교체**: 같은 파일명으로 덮어쓰거나 HTML 의 `src` 를 바꿉니다.

## 배포 (Vercel)

프로젝트 폴더를 Vercel 에 연결하면 끝입니다 (Framework Preset: Other, Build Command 없음).
`vercel.json` 의 `cleanUrls` 로 `/diagnostics` 같은 확장자 없는 주소가 동작합니다.

## 아직 손봐야 할 것

1. **사진**: 2026-10-19 촬영본을 `images/photo/`, `images/team/` 에 WebP로 넣어 임시 이미지를 모두 교체했습니다. 어떤 사진이 어디에 쓰였는지는 `_tools/photos.md` 참고. 의료진 섹션은 작은 원형 프로필 + 이력 목록 형태이며, 조문영 원장 사진만 미수령(이름 첫 글자 원으로 표시).
2. **카카오 지도 키**: 현재 키는 yeonojae.com 도메인에만 등록되어 있어 다른 도메인·localhost 에서는 지도가 뜨지 않습니다. developers.kakao.com 에서 새 도메인을 플랫폼(Web)에 추가하거나 새 키를 `js/site-config.js` 에 넣으세요.
3. **진료시간 표기 통일**: 원본 그대로 "토/일/공휴일 점심시간 없음" 과 "점심시간 13:00~14:00" 이 같이 표기되어 있습니다.
4. **개인정보처리방침 페이지**: 원본과 같이 `#privacy` 앵커만 있고 실제 페이지가 없습니다.
