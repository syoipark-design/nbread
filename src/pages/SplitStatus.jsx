import { useNavigate, useLocation } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import splitBackArrow from '../assets/split-back-arrow.svg';
import nofriendIcon from '../assets/nofriend.svg';
import nudgeBreadIcon from '../assets/nudge-bread-icon.png';

import IMG_ME_BG from '../assets/me-avatar-bg.svg';
import IMG_SHARE from '../assets/share-icon.svg';
import IMG_GRADIENT_SEP from '../assets/gradient-sep.svg';

const P = { fontFamily: 'Pretendard, sans-serif', fontStyle: 'normal', margin: 0, whiteSpace: 'nowrap' };
const fmt = v => v.toLocaleString('ko-KR');

function Avatar({ f }) {
  if (f.isMe) {
    return (
      <>
        <img src={IMG_ME_BG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        <img src={nudgeBreadIcon} alt="" style={{ position: 'absolute', left: '8.6px', top: '8.6px', width: '23.8px', height: '23.8px', display: 'block', objectFit: 'contain' }} />
      </>
    );
  }
  if (f.isAnon) {
    return <img src={nofriendIcon} alt={f.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', borderRadius: '50%', objectFit: 'cover' }} />;
  }
  return <img src={f.img} alt={f.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', borderRadius: '50%', objectFit: 'cover' }} />;
}

function ParticipantRow({ p, withButtons, onReRequest }) {
  return (
    <div style={{ position: 'relative', height: withButtons ? '75px' : '69px', flexShrink: 0 }}>
      {/* 아바타 */}
      <div style={{ position: 'absolute', left: '27px', top: '2px', width: '41px', height: '41px' }}>
        <Avatar f={p} />
      </div>
      {/* 이름 */}
      <p style={{ ...P, position: 'absolute', left: '78px', top: '0', fontWeight: 400, fontSize: '16px', lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#222' }}>
        {p.name}
      </p>
      {/* 금액 */}
      <p style={{ ...P, position: 'absolute', left: '78px', top: '24px', fontWeight: 600, fontSize: '16px', lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#000' }}>
        {fmt(p.amount)}원
      </p>
      {/* 액션 버튼 (미정산 only) */}
      {withButtons && (
        <>
          {/* Figma 19:2084 — bg=#f6f7f7, w=64, h=28, radius=8, SemiBold 13.5px #222 */}
          <button
            onClick={() => onReRequest?.(p)}
            style={{
              position: 'absolute', left: '213px', top: '9px',
              width: '64px', height: '28px',
              background: '#f6f7f7', border: 'none', outline: 'none', borderRadius: '8px',
              fontFamily: 'Pretendard, sans-serif', fontWeight: 600, fontSize: '13.5px',
              lineHeight: '24.443px', letterSpacing: '-0.0986px', color: '#222',
              cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              whiteSpace: 'nowrap',
            }}>다시요청</button>
          {/* Figma 19:2082 — 동일 스펙, left=285 */}
          <button style={{
            position: 'absolute', left: '285px', top: '9px',
            width: '64px', height: '28px',
            background: '#f6f7f7', border: 'none', outline: 'none', borderRadius: '8px',
            fontFamily: 'Pretendard, sans-serif', fontWeight: 600, fontSize: '13.5px',
            lineHeight: '24.443px', letterSpacing: '-0.0986px', color: '#222',
            cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            whiteSpace: 'nowrap',
          }}>완료하기</button>
        </>
      )}
    </div>
  );
}

export default function SplitStatus() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    formattedAmount = '224,000',
    selectedFriends = [],
    perPerson = 0,
    myAmount = 0,
  } = location.state ?? {};

  const n = selectedFriends.length + 1;

  // 받았어요: 나(빵장) 1명만
  const receivedList = [
    { id: 'me', isMe: true, name: '나(빵장)', amount: myAmount },
  ];
  // 안 받았어요: 나머지 참여자 전원
  const notReceivedList = selectedFriends.map(f => ({ ...f, amount: perPerson }));

  const receivedTotal = myAmount;

  // 오늘 날짜 "YYYY.MM.DD 요청"
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')} 요청`;

  return (
    <div style={{ position: 'relative', width: '375px', height: '812px', background: 'white', overflow: 'hidden', flexShrink: 0 }}>

      {/* ── 고정 헤더 영역 ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '375px', height: '250px', background: 'white', zIndex: 5 }}>

        {/* 상태바 */}
        <StatusBar />

        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', left: '17.5px', top: '57px', width: '44px', height: '44px', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6 }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.6'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          aria-label="뒤로가기"
        >
          <img src={splitBackArrow} alt="" style={{ width: '9px', height: '18px', display: 'block' }} />
        </button>

        {/* 타이틀 */}
        <p style={{ ...P, position: 'absolute', left: 0, right: 0, top: '66px', textAlign: 'center', fontWeight: 600, fontSize: '16px', lineHeight: '24.443px', letterSpacing: '-0.0986px', color: '#000' }}>상세내역</p>

        {/* 공유 아이콘 */}
        <div style={{ position: 'absolute', top: '71px', right: '27px', width: '16px', height: '16px' }}>
          <img src={IMG_SHARE} alt="공유" style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>

        {/* 날짜 */}
        <p style={{ ...P, position: 'absolute', left: '26px', top: '126px', fontWeight: 400, fontSize: '14px', lineHeight: '24.443px', letterSpacing: '-0.0986px', color: '#888' }}>{dateStr}</p>

        {/* 금액 요약 */}
        <p style={{ ...P, position: 'absolute', left: '26px', top: '168px', fontWeight: 700, fontSize: '22px', lineHeight: '33.042px', letterSpacing: '-0.1333px', color: '#222' }}>
          {formattedAmount}원 /{n}명
        </p>

        {/* 받은 합계 */}
        <p style={{ ...P, position: 'absolute', left: '26px', top: '202px', fontWeight: 500, fontSize: '14px', lineHeight: '24.443px', letterSpacing: '-0.0986px', color: '#0086d7' }}>
          {receivedList.length}명에게 {fmt(receivedTotal)}원 받았어요
        </p>
      </div>

      {/* ── 스크롤 참여자 영역 ── */}
      <div
        className="status-scroll"
        style={{
          position: 'absolute', left: 0, right: 0,
          top: '250px', bottom: '113.55px',
          overflowY: 'auto', overflowX: 'hidden',
          scrollbarWidth: 'none',
          display: 'flex', flexDirection: 'column',
          paddingTop: '15px', paddingBottom: '20px',
        }}
      >
        {/* "받았어요" 라벨 */}
        <p style={{ ...P, paddingLeft: '26px', marginBottom: '26px', fontWeight: 600, fontSize: '15px', lineHeight: '24.443px', letterSpacing: '-0.0986px', color: '#888' }}>받았어요</p>

        {/* 받은 참여자 rows */}
        {receivedList.map(p => (
          <ParticipantRow key={p.id} p={p} withButtons={false} />
        ))}

        {/* 구분선 */}
        <div style={{ margin: '30px 28px 0', height: '1px', background: '#e5e5e5', flexShrink: 0 }} />

        {/* "안 받았어요" 라벨 */}
        <p style={{ ...P, paddingLeft: '26px', marginTop: '30px', marginBottom: '26px', fontWeight: 600, fontSize: '15px', lineHeight: '24.443px', letterSpacing: '-0.0986px', color: '#888' }}>안 받았어요</p>

        {/* 안 받은 참여자 rows */}
        {notReceivedList.length === 0 ? (
          <p style={{ ...P, paddingLeft: '26px', fontWeight: 400, fontSize: '14px', color: '#aaa', whiteSpace: 'normal' }}>모두 완료됐어요</p>
        ) : (
          notReceivedList.map(p => (
            <ParticipantRow
              key={p.id}
              p={p}
              withButtons={true}
              onReRequest={f => navigate('/split/re-request', {
                state: { notReceivedList, clickedFriendId: f.id, perPerson, formattedAmount },
              })}
            />
          ))
        )}

        {/* 그라디언트 구분 이미지 */}
        <div style={{ flexShrink: 0, height: '27px', marginTop: '20px', overflow: 'hidden' }}>
          <img src={IMG_GRADIENT_SEP} alt="" style={{ display: 'block', width: '375px', height: '27px', objectFit: 'cover', pointerEvents: 'none' }} />
        </div>

        {/* 입금내역 확인하기 */}
        <p style={{
          ...P, textAlign: 'center', marginTop: '12px',
          fontWeight: 500, fontSize: '14px', lineHeight: '24.443px', letterSpacing: '-0.0986px',
          color: '#666', textDecoration: 'underline', cursor: 'pointer',
        }}>입금내역 확인하기</p>
      </div>

      {/* ── CTA 바 (하단 고정) — 비활성 */}
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: '375px', height: '113.55px', background: 'white', zIndex: 10 }}>
        <button
          disabled
          style={{
            position: 'absolute',
            left: 'calc(50% - 171.278px)', top: '20px',
            width: '342.557px', height: '55.344px',
            borderRadius: '13.359px',
            background: '#e8e8e8', border: 'none',
            fontFamily: 'Pretendard, sans-serif',
            fontWeight: 600, fontSize: '16.221px',
            lineHeight: 1, letterSpacing: '-0.4771px',
            color: '#b0b0b0', cursor: 'not-allowed',
          }}
        >
          1/N 빵나누기 끝내기
        </button>
      </div>
    </div>
  );
}
