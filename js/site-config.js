// 사이트 공통 설정 - 전화번호·예약 링크·지도 키 등은 여기서만 바꾸면 됩니다.
window.SITE_CONFIG = {
  siteUrl: "https://www.yeonojae.co.kr",
  phone: "031-994-2378",
  bookingUrl: "https://booking.naver.com/booking/13/bizes/889913?area=plt&map-search=1",
  // 지도: 네이버 지도 (2026-10-22 카카오에서 전환)
  // naverMapKeyId 가 비어 있으면 주소 카드 + "네이버 지도에서 보기" 버튼만 표시, 채우면 지도가 삽입됨.
  // 키 발급: ncloud.com 콘솔 > AI·Application Service > Maps > Application 등록 > Web 서비스 URL 에 사이트 도메인 추가 > Client ID(ncpKeyId)
  naverMapKeyId: "",
  // 네이버 키가 없을 때 지도 자리: "google"(구글 지도 iframe, 키 불필요) 또는 "card"(주소 카드만)
  mapFallback: "google",
  naverPlaceUrl: "https://map.naver.com/p/search/%EC%97%B0%EC%98%A4%EC%9E%AC%ED%95%9C%EC%9D%98%EC%9B%90",
  // 카카오톡 채널 (2026-10-30)
  kakaoChannelUrl: "https://pf.kakao.com/_TNXHxj",
  // 온라인 상담 폼 전송 주소(무료 폼 서비스 endpoint). 비어 있으면 /reservation 폼은 안내 문구만 보여 준다.
  formEndpoint: "",
  address: "경기 고양시 덕양구 화중로 60 2층 205호, 206호",
  transit: "화정역 2번 출구에서 404m",
  mapLat: 37.6323269,
  mapLng: 126.8307436,
  mapZoom: 16,
  // (이전) 카카오 지도 키. 다시 쓰려면 main.js 의 네이버 블록을 카카오 블록으로 되돌릴 것.
  kakaoAppKey: "9d566411a15467b4a9168404d53161a3",
  // 회원 로그인 (Supabase Auth, 구글·카카오). anon 키는 공개용. 비어 있으면 로그인 버튼이 "준비 중"으로 표시된다. (2026-10-30)
  supabaseUrl: "https://lussfeezminlzaezgzhv.supabase.co",
  supabaseAnonKey: "sb_publishable_qMAvyJsLBUCtPLpgDdyjww_ob-cwLqs",
  // 카카오 로그인 제공자를 Supabase 에 등록한 뒤 true 로 (병원 명의 카카오 개발자 앱 필요)
  kakaoLogin: false,
  // Google Analytics 4 측정 ID (비우면 비활성)
  gaId: "G-P0WZ4QYYH3"
};
