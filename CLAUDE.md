# 연오재한의원 홈페이지 (정적 HTML)

옛 사이트 www.yeonojae.com(Next.js + Tailwind v4)을 정적 HTML로 복제한 뒤 홈을 새 구성(v2)으로 바꾼 사이트. **대표 도메인은 www.yeonojae.co.kr**(2026-10-24 전환, 가비아 2026-10-23 신규 등록, Vercel 에 apex→www 308). 옛 .com 은 KT 서버의 옛 사이트가 아직 살아 있고 가비아 DNS 권한 확인 후 .co.kr 로 리다이렉트 예정. 코드의 `SITE_URL`·site-config `siteUrl`·robots 가 .co.kr 이며, 원본 저장본의 .com 주소는 `write_page` 가 치환한다. 원본 10페이지 + 신규 원장칼럼·개인정보처리방침·404. 메뉴는 원본의 "블로그"를 "연오재 소식"(외부 블로그 링크 유지)으로 바꾸고 "원장칼럼"을 추가했다. Vercel에 폴더째 배포한다(서버 빌드 없음, CSS만 로컬에서 사전 빌드).
자세한 페이지 목록·수정 방법은 README.md 참고.

## 구조
- `index.html`: 홈 v2. egowoon.co.kr 의 정보 배치 방식을 연오재 톤으로 옮긴 구성(히어로 영상 → MISSION(글만) → PROMISE 01~03(사진 3:2) → DOCTORS(#doctors) → WHY US(#why, 사진 카드) → CONCERNS Q카드 → CARE 01~06(#service-grid) → TRUST(키움 명판) → 병원 둘러보기(TOUR) → FAQ·예약·지도(#location) → COLUMN → CTA(로비 배경)). 섹션 데이터는 build.py 의 `HERO_V2`, `DOCTORS_V2`, `PROMISES`, `WHY_US`, `CONCERNS`, `CARE`, `TRUST`, `TOUR`.
- 의료진 섹션(`sec_doctors()`): 텍스트 중심. 카드마다 작은 원형 프로필(`doctor_avatar()`, 대표원장 112px·파트너 96px, 사진 없으면 이름 첫 글자 원). 대표원장은 왼쪽 직함·이름·인용문·분야 + 오른쪽 이력 목록, 파트너 2인은 2열 카드. 이력은 `DOCTORS_V2[*]["career"]`(출처: 원내 안내판, 2026-10-20). 큰 사진 레이아웃은 index-v3 의 `sec3_doctors` 참고.
- `index-v3.html`: 2026-10-20 리디자인 시안(밝은 톤, 사진 카드 4, 흑백 의료진 `.bw`, 검사 7종 목록 `EXAMS`, 종이 질감 `.paper`). 빌더 `sec3_*`·`build_home_v3()`, 데이터 `AUDIENCE`·`EXAMS`·`STEPS`·`HERBAL`. noindex, 배포 제외. 부분 차용 시 참고용.
- `index-v1.html`: 원본 복제 홈. noindex, 배포 제외.
- `diagnostics.html`, `personalized-herbal-medicine.html`, `clinics/*.html`(7개): 원본 SSR 본문을 변환한 페이지. 사진은 `PAGE_IMAGES`(페이지별 목록, 원본의 placeholder/picsum 을 등장 순서대로 치환). 피부 클리닉 배너는 사용자 제공 사진(`photo/skin-diagnosis.webp`, 2026-10-22).
- `column.html`(/column): 신규 원장칼럼. `COLUMNS` 데이터로 카드 3개. 글 본문은 아직 없고 기존 페이지로 링크한다.
- `faq/<key>.html`(/faq/<key>, 12개, 2026-10-23): 주제별 FAQ 독립 페이지(`build_faq_topic_page()`, FAQPage JSON-LD, 다른 주제 칩, 관련 클리닉 링크). 허브 섹션 헤더의 "이 주제만 보기", 클리닉 FAQ 의 "질문 전체 보기", 본문 중간 CTA(`sec_inline_cta()`, `insert_mid_cta()` 가 서브페이지 3번째 섹션 뒤에 삽입)가 여기로 연결된다.
- `column/<slug>.html`(/column/<slug>, 6편, 2026-10-23): 원장칼럼 글. 데이터 `_tools/column_data.py` 의 `ARTICLES`(sections/takeaways/related/faq_topic), 빌더 `article_main()`·`build_article_page()`, Article JSON-LD(`article_ld()`, author = 연오재한의원 원장진 Organization, og:type article). 허브·홈 카드 `COLUMNS` 는 ARTICLES 에서 파생(홈은 3편). 검수 문서 `_tools/brand/칼럼_검수용_<날짜>.md` 를 build 마다 생성. 글은 사이트 본문·FAQ 에 있는 내용만 풀어 쓴 초안이며 원장 검수 전.
- `faq.html`(/faq): 자주 묻는 질문 허브(2026-10-23, 레퍼런스 egowoon.co.kr/faq). 2026-10-24부터 허브 카드는 답변 앞 두 문장만 보이고(`faq_card(full=False)`, 검색은 `data-search` 전체 답변으로) 주제 페이지로 "답변 전체 보기" 링크, 허브 JSON-LD 는 FAQPage 대신 주제 페이지 ItemList(중복 콘텐츠 축소). 서브페이지 하단에는 `sec_related_columns()`(관련 칼럼, 없으면 최신 2편)가 FAQ 앞에 들어간다. 네이버 표시 길이 기준으로 제목 ≤30자·설명 앞 80자에 핵심(`HOME_TITLE` 27자, 칼럼 글 제목은 "글제목 | 연오재한의원"). 데이터는 `_tools/faq_data.py` 의 `FAQ_ALL`(주제 12개·70문항, 항목=(질문, 답변, 링크문구, 링크, 홈대표)). 같은 데이터로 홈 하단 5문항(home=True), 클리닉·진단·한약 페이지 하단 아코디언(`sec_clinic_faq`, 주제의 `page` 로 매칭), FAQPage JSON-LD(모든 곳), 검수용 문서 `_tools/brand/FAQ_검수용_2026-10-23.md` 가 생성된다. 검색·주제 칩 필터는 main.js(`[data-faq-search]`). 답변은 1~4문장, 효과 보장 표현 금지, 비용은 숫자 없이.
- `privacy.html`(/privacy), `404.html`: `PRIVACY_SECTIONS`, `build_404_page()`. 둘 다 noindex. Vercel 이 404.html 을 자동 사용.
- 헤더·푸터·퀵바는 build.py 가 모든 페이지에 넣는다(`build_header()`, `build_footer()`). 푸터는 4단(병원 정보 / 진료시간 `FOOTER_HOURS` / 진료 `FOOTER_CARE` / 안내 `FOOTER_GUIDE`, 레퍼런스 egowoon 푸터, 2026-10-23). 의료기관 표시 정보(대표자·주소·전화·사업자등록번호·역 안내)는 `CLINIC` 딕셔너리. 주소는 네이버 플레이스 표기 기준이며 transform_body/build_head 가 원본 본문·JSON-LD 의 옛 주소를 이 값으로 치환한다. 메뉴 순서는 `NAV`(병원소개 → 맞춤한약치료 → 질환별 클리닉 → 진단·검사센터 → 원장칼럼 → 자주 묻는 질문 → 연오재 소식).
- `css/tailwind.css`: 사전 빌드된 Tailwind (직접 편집 금지). `css/site.css`: 공통 추가 CSS (Mona Sans 폰트, `[data-reveal]` 등장 애니메이션, 메뉴, FAQ, `.seo-fold`, v3 용 `.bw`·`.paper`·`.exam-item`).
- `js/site-config.js`: 전화번호·네이버 예약 링크·주소·네이버 지도 키(`naverMapKeyId`, 비어 있으면 `mapFallback`: "google"=구글 지도 iframe(키 불필요, 현재) / "card"=주소 카드)·좌표·GA4 ID. 설정은 여기서만 바꾼다. `js/main.js`: 헤더 드롭다운, 모바일 메뉴, FAQ 아코디언, 의료진 팝업(v1), 검사 목록 전환(v3), 네이버 지도(`#site-map`, 2026-10-22 카카오에서 전환), GA4 로딩.
- `images/photo/*.webp`: 2026-10-19 촬영본에서 변환한 사진. `images/team/*.webp`: 김경민·강선우 스튜디오 사진(예전 사이트 SVG 에서 추출), 조문영은 사용자가 준 스튜디오 사진(좌우반전, 338px 원본). 원본 번호·용도 매핑은 `_tools/photos.md`, 변환 매니페스트는 `_tools/photos-convert.py`(원본 JPG 157장은 `E:\projects\yeonohjae-home\웹 (1)\웹\`, 배포 제외).
- `video/yeonojae-intro.mp4`: 히어로 영상(2분, 11MB). 원본 파일명이 한글이라 build.py 의 `VIDEO_SRC` 로 치환한다.
- `logo/ icon/ og/ fonts/`: 자산. 경로는 원본 사이트와 동일(루트 절대경로). OG 이미지는 `og/yeonojae-og-sign-1200x630.jpg`(목재 간판 사진).
- `_tools/build.py`: `_tools/original/*.html`(원본 SSR 저장본) → 전 페이지 + sitemap + CSS 재생성. `_tools/tailwind/`: Tailwind CLI. `_tools/check/`: 검증 스크립트(README 있음). `_tools/unused-assets/`: 안 쓰는 옛 자산·잘못 만든 합성본 보관. `_tools/brand/`: 소개문 원문, 외부 등록 체크리스트(2026-10-21), FAQ 검수용 문서(2026-10-23, build.py 가 매번 다시 씀).
- 구조화 데이터·수정일·llms.txt(2026-10-23, 1단계 SEO/AEO): `build_head()` 가 원본 MedicalClinic JSON-LD 를 `enrich_clinic_ld()` 로 보강(@id, 실제 사진, hasMap·sameAs=`CLINIC["same_as"]`, 의료진 Person 상세 `person_ld()`(DOCTORS_V2 career 문구에서 학력·자격·학회·수상 자동 분류), 홈에는 availableService·ReserveAction) 하고 `page_ld()` 로 MedicalWebPage(dateModified)+BreadcrumbList 를 붙인다. 모든 페이지는 `write_page()` 로 저장해야 한다: 날짜 토큰(`@@LASTMOD@@`, `@@LASTMOD_KR@@`)을 채우며, 날짜를 뺀 내용이 HEAD 커밋과 같으면 커밋에 적힌 날짜를 유지하고 달라졌으면 오늘 날짜를 넣는다(푸터 "이 페이지 최종 수정일", JSON-LD dateModified, sitemap lastmod 가 모두 이 값). `write_llms()` 가 `llms.txt`(병원 정보·진료시간·의료진·페이지 목록·대표 FAQ·주제 링크)를 생성한다. GA4 이벤트는 main.js: call_click·booking_click·map_click·outbound_click(캡처 단계 클릭 위임), faq_open·faq_search·faq_filter, scroll_depth(25/50/75/100). 파라미터(link_text, section, faq_question, percent_scrolled)는 GA4 맞춤 정의에 등록해야 보고서에 보인다.
- `vercel.json`: `cleanUrls: true`, 보안 헤더(nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy), 자산 캐시. `.vercelignore`: CLAUDE.md, README, `.claude/`, `_tools/`, serve.py, index-v1.html·index-v3.html 과 v1 전용 자산.

## 배포 (2026-10-23 연결)
- 깃허브 `musicman0519-a11y/-yeonohjae-web2`(public, 이름 앞 하이픈은 생성 시 실수지만 동작엔 무관) ← 이 폴더가 로컬 git 저장소(`main`). 반영: `git add -A && git commit -m "..." && git push` (일반 푸시는 Claude 가 직접 할 수 있음. force push·merge 는 권한 정책에 막힘).
- `.gitignore` 가 `_tools/`, `.claude/`, serve.py, index-v1/v3, node_modules 를 제외한다. CLAUDE.md·README 는 깃허브에는 올라가고 `.vercelignore` 로 배포에서만 빠진다.
- Vercel: 새 저장소를 Import 해 프로젝트 생성(Framework Other, 빌드 없음). 옛 저장소 `yeonohjae-home` 과 옛 Vercel 프로젝트는 도메인 이전 후 삭제 예정.
- 로컬 git 은 `core.autocrlf=false`.

## 명령
- 로컬 미리보기: `python serve.py 8090` → http://localhost:8090 (cleanUrl 지원). 8080은 다른 프로젝트(한국인덕션)가 점유하므로 쓰지 않는다. `file://`로 열면 절대경로 때문에 깨진다.
- 전체 재생성: `python _tools/build.py` (페이지 34개(기본 16 + FAQ 주제 12 + 칼럼 6) + sitemap.xml + llms.txt + css/tailwind.css + FAQ 검수 문서 덮어씀. 수정일은 git HEAD 와 비교해 정하므로 커밋 전 빌드는 바뀐 페이지만 오늘 날짜가 된다. 직접 고친 HTML이 있으면 먼저 build.py에 반영할 것). CSS 빌드는 끝에서 `npm run build` 를 자동 호출하며 `_tools/tailwind/node_modules` 가 없으면 `npm install --prefix _tools/tailwind` 먼저.
- CSS 만 다시 빌드: `npm --prefix _tools/tailwind run build`
- 사진 다시 변환: `python -I _tools/photos-convert.py` (매니페스트의 번호만 바꾸면 됨)
- Python 주의: Git Bash 에서 `python` 은 다른 프로젝트 venv(`pyeonsawon-flask/.venv`)로 잡혀 Pillow 가 없다. 이미지 작업은 `/c/Users/music/AppData/Local/Programs/Python/Python314/python` 을 명시(Pillow, rembg, onnxruntime 설치돼 있음). build.py 는 어느 쪽이든 된다.

## 규칙
- Tailwind v4 정적 빌드: 입력 `_tools/tailwind/input.css`(`@theme static` + `@source` 목록), `js/main.js` 도 스캔한다. HTML 을 손으로 고쳐 새 클래스를 쓰면 CSS 도 다시 빌드해야 한다. 새 페이지를 만들면 input.css 의 `@source` 에 추가.
- build.py 를 문자열 치환으로 고칠 때 같은 마크업이 v2·v3 빌더에 둘 다 있는 경우가 있다(예: 의료진 `<ul>`). 치환 전에 개수를 확인할 것. 본문에서 섹션을 찾을 때 메뉴 글자와 겹치는 문구("자주 묻는 질문")로 찾지 말고 태그를 포함해 찾는다.
- 메뉴 변경은 build.py 의 `NAV` 수정 후 재생성. 퀵바 지도 아이콘은 홈에서는 `#location`, 다른 페이지에서는 `/#location`(transform_body 가 치환).
- 클리닉 상단 배너(h-400 와이드)와 홈 CTA 배경에는 가로 사진만 쓴다. 세로 사진은 얼굴이 잘린다. 사진을 통째로 보여야 하는 페이지는 build.py `BANNER_UNCROPPED` 에 넣으면 배너가 3:2 비율로 바뀐다(맞춤한약·피부 클리닉 적용. 클리닉 배너 클래스는 `h-[300px] md:h-[400px]` 변형이라 두 패턴 모두 처리). 사진 교체는 같은 파일명으로 WebP(가로 1200~1600px, q80) 덮어쓰기가 가장 쉽다.
- 사람 사진은 사용자가 지목한 것만 쓴다. 촬영본 속 인물 식별을 추정해서 넣지 않는다(2026-10-20 조문영 사진 오류). 얼굴을 AI 로 생성하지 않는다(실제 사진의 배경 분리·화질 복원까지만).
- 등장 애니메이션: 원본 framer-motion 초기값(`opacity:0`, `translate/scale`)을 `data-reveal` + `--reveal-from`으로 바꿔 두었다. `%` 단위 transform(가운데 정렬·오버레이)은 레이아웃용이라 변환 대상이 아니다.
- 홈 히어로는 `restyle_hero()`가 문구를 왼쪽 아래로 배치하고 구분선+지표 3개를 붙인다. 높이는 `calc(100vh-64px)`. 영상은 사용자 지시로 그대로 둔다(압축·포스터 안 함).
- 원본 상단의 `<details class="seo-fold">`(숨긴 소개글, 전 페이지 동일 4,800자)는 2026-10-24 **제거**했다(네이버는 숨긴 텍스트를 어뷰징으로 봄). 대신 `write_page` 가 푸터 바로 위에 보이는 "한눈에 보는 연오재한의원" 요약 블록(`seo_fold_html()`, `data-section="summary"`: 이 페이지 설명 + 병원 사실 + 진료 분야·시간·예약, 404·privacy 제외)을 넣는다. css/site.css 의 `.seo-fold` 규칙은 더 이상 쓰이지 않는다.
- 내부 링크는 확장자 없는 절대경로(`/diagnostics`, `/clinics/...`)를 유지한다.
- 비밀값은 없다. 네이버 지도 Client ID(ncpKeyId)·카카오 JS 키는 도메인 등록이 필요한 공개 키, GA4 ID 도 공개값.
- 진단 페이지의 수치("총 38년 · 100,000+")와 촬영 사진 사용은 2026-10-19 사용자가 확인했다. 임의로 빼지 않는다.

## 확인 방법
- `_tools/check/` 의 puppeteer-core 스크립트(실행 전 그 폴더에서 `npm i puppeteer-core`, Chrome 경로는 스크립트 상단). `full.js`(전체 페이지 캡처+넘침·깨진 이미지), `allpages.js`(13페이지 × 데스크톱/모바일 콘솔 오류·404·넘침), `console.js`, `shot.js`(뷰포트 캡처·스크롤·클릭·eval).
- `python -I _tools/check/audit.py`: 내부 링크·앵커·파일 존재·중복 id·임시 문구·JSON-LD·sitemap(lastmod)·최종 수정일·BreadcrumbList·llms.txt 검사 + 의료광고 표현 경고(`AD_PATTERNS`: 완치·100%·효과 보장·부작용/재발 없음 단정·최상급·치료율·비교·경험담·유인·안전 단정. 경고는 참고용, 문제 수에는 안 들어감). 2026-10-23 기준 남는 경고는 seo-fold 의 원본 문장 "…표현은 피하는 것이 안전합니다"(전 페이지, 작성 지침 같은 문장이라 seo-fold 교체 때 정리) 뿐. 피부 클리닉의 "완치가 어렵다고 알려진 질환에서도 호전을 경험한"(원본 문구)은 패턴에서 제외했지만 원장 검수 대상. `classcheck.py`: HTML/JS 의 클래스가 css/tailwind.css 에 있는지.
- headless Chrome `--screenshot`과 수동 CDP는 이 사이트에서 불안정했다. 전체 페이지 캡처에서 히어로가 끝에 한 번 더 보이는 건 캡처 현상이다.
- 지도는 `naverMapKeyId` 가 비어 있으면 구글 지도 iframe(`maps?q=위도,경도&output=embed`, 키 불필요)으로 표시된다. 네이버 키를 넣고 NCP 콘솔에 도메인을 등록하면 네이버 지도로 바뀌고, 네이버 로드 실패 시에도 구글로 떨어진다. 지도 아래 주소·역 안내·버튼 행은 JS 가 붙인다.

## 남은 체크리스트
- [ ] 원장 검수 대기: FAQ 70문항(`_tools/brand/FAQ_검수용_2026-10-23.md`, 수정은 `_tools/faq_data.py` 만 고치고 재생성), 푸터의 "고양 화정 · 일산 · 덕양 인접 진료" 문구와 진료시간 표기. 비급여 비용 안내 페이지는 만들지 않기로(비용 질문은 "진료 시 안내"). 만들게 되면 푸터 `FOOTER_GUIDE` 에 추가.
- [ ] 조문영 원장: 진료 분야 문구("스포츠 손상 · 근골격 초음파 진단 · 한방비만 · 도핑 상담")는 이력에서 추정한 것, "국제HI웰니스페스타" 표기도 확인 필요. 사진은 2026-10-22 받은 스튜디오 사진으로 해결(원본 `_tools/unused-assets/team/jo-munyoung_studio_original.png`, 338px 라 작은 프로필 전용).
- [x] 도메인 www.yeonojae.co.kr 연결 완료(2026-10-24): Vercel Domains 에 yeonojae.co.kr(308→www)·www, 가비아 DNS 관리툴(dns.gabia.com)에 @ A 76.76.21.21 · www CNAME cname.vercel-dns.com. Let's Encrypt 인증서 자동 발급, http→https·apex→www 308 확인. 주의: 깃허브 푸시를 Vercel 이 가끔 못 받는다(f24996e). 배포 안 되면 빈 커밋 푸시로 재트리거.
- [x] 네이버 서치어드바이저(2026-10-24): www.yeonojae.co.kr 등록·HTML 태그 소유 확인(`NAVER_SITE_VERIFICATION`), sitemap.xml·rss.xml(원장칼럼 피드, `write_rss()`) 제출, 홈 수집 요청 완료. 구글 서치콘솔은 `GOOGLE_SITE_VERIFICATION` 에 코드만 넣으면 됨.
- [ ] 도메인 연결 뒤 할 일: 네이버 클라우드(ncloud.com) Maps 에서 Client ID 발급·www.yeonojae.co.kr 등록 후 site-config.js `naverMapKeyId` 입력(그 전까지는 구글 지도). 서치콘솔·서치어드바이저에 새 도메인 등록·사이트맵 제출·색인 요청, GA4 보존기간 14개월 설정(개인정보처리방침과 일치). 검색엔진 등록 자체는 사용자가 배포 전에 라이브 도메인으로 먼저 한다(아래 SEO 항목).
- [x] SEO/AEO 1단계(2026-10-23 완료): GA4 전환·체류 이벤트, sitemap lastmod·dateModified·푸터 수정일 자동 갱신, llms.txt, BreadcrumbList·MedicalWebPage, Person 스키마 보강(이력 자동 분류), 의료광고 표현 자동 점검. 후속: GA4 관리 > 맞춤 정의에 link_text·section·faq_question·percent_scrolled 등록(사용자), `CLINIC["same_as"]` 에 네이버 플레이스 고유 URL·굿닥·카카오맵 추가(링크 대기), seo-fold 원본 문장 교체.
- [x] SEO/AEO 2차(2026-10-23, 외부 진단서 6영역 대응): robots.txt AI 봇 명시 허용, JSON-LD 설명 클리셰 교체(`CLINIC_DESC`), seo-fold 사실 요약 교체, 서브페이지 중간 CTA + 클리닉 FAQ 하단 예약 CTA, FAQ 주제 페이지 12개, 칼럼 글 6편(초안), 푸터 네이버 플레이스 링크. sitemap 12→30.
- [x] 브랜드 표기 A안(2026-10-24): 홈 title/설명은 build.py `HOME_TITLE`·`HOME_DESC`, og:site_name "연오재한의원", 서브페이지 설명문의 "일산한의원 연오재" → "고양 화정 연오재한의원"(`build_head` 의 `_fix`), keywords 에 화정·고양 지역어 추가. "일산"은 설명문 끝 보조어로만 남김. 원본의 "한방신경정신과 전문의" 문구는 이때 제거됨. 상위노출은 트래픽 조작 대신 플레이스·칼럼 주 1편·블로그·지식iN·리뷰·(필요시 심의받은 광고)로 진행하기로 함.
- [ ] 보류: 의료진 페이지(/doctors)는 나중에(조문영 원장 분야 확인 후). 네이버 플레이스 **고유 URL**(현재는 검색 URL)과 굿닥·카카오맵 주소 받으면 `CLINIC["same_as"]`·`map_url`·푸터 링크 교체.
- [ ] 2026-11-06 이후: GA4 이벤트 2주치(call_click·booking_click·scroll_depth·faq_open) 보고 CTA 위치 조정. 사용자가 GA4 맞춤 정의 등록을 먼저 해야 함.
- [ ] 원장 검수: 칼럼 6편(`_tools/brand/칼럼_검수용_2026-10-23.md`), 글쓴이 표기(현재 '원장진')를 특정 원장으로 바꿀지. 3단계 후보: 히어로 영상 자막(.vtt)·대본, FAQ 질문문 환자어 재점검, Microsoft Clarity 여부.
- [ ] SEO/AEO/GEO: 2026-10-21 측정 결과 현재 라이브 사이트는 병원명 검색에도 공식 사이트가 안 나옴(굿닥만). 사용자가 B안(서치콘솔·서치어드바이저·플레이스·디렉터리 등록과 정보 통일)을 직접 하기로 함 → 체크리스트 `_tools/brand/외부등록_체크리스트_2026-10-21.md`. 끝나면 A안(제목·설명·JSON-LD·robots·llms.txt·seo-fold 교체·클리닉 FAQ·의료진 페이지) 진행. 주소 표기는 2026-10-22 네이버 플레이스 기준("경기 고양시 덕양구 화중로 60 2층 205호, 206호")으로 푸터·예약 안내·JSON-LD·지도 카드 통일 완료.
- [ ] 노란 물결 밑줄(`decoration-wavy decoration-amber-400`, 12곳): 소제목은 라벨형, 문장 강조는 브론즈 글자색, 원장 이름은 강조 제거로 바꾸는 안을 제안했고 결정 대기. 적용은 transform_body 치환으로.
- [ ] 리디자인은 보류(사용자가 v2 선호). 다시 꺼내면 index-v3.html 의 섹션을 하나씩 보여주고 고르게 할 것.
- [ ] 원장칼럼 글 본문 없음(카드가 기존 페이지로 링크). 어린이·임산부·피부 사진은 촬영본에 없어 상담 사진으로 대체함. 클리닉 7페이지 상단 배너(h-400)도 가로 사진 위아래가 조금 잘림(얼굴은 안 잘림).
- [ ] 원본의 점심시간 이중 표기는 원본 그대로다.
- [ ] `E:\projects\yeonohjae-web 2`(공백 포함)는 0바이트 빈 파일이다. 사용자가 직접 지우면 된다.
