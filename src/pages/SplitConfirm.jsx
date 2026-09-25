import { useNavigate, useLocation } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import splitBackArrow from '../assets/split-back-arrow.svg';
import nofriendIcon from '../assets/nofriend.svg';
import breadIcon from '../assets/bread.svg';
import nudgeBreadIcon from '../assets/nudge-bread-icon.png';

import IMG_ME_BG from '../assets/me-avatar-bg.svg';

const P = {
  fontFamily: 'Pretendard, sans-serif',
  fontStyle: 'normal',
  margin: 0,
  whiteSpace: 'nowrap',
};

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

export default function SplitConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formattedAmount = '224,000', selectedFriends = [] } = location.state ?? {};

  const rawAmount = parseInt(formattedAmount.replace(/,/g, ''), 10) || 0;
  const n = selectedFriends.length + 1;
  const perPerson = Math.floor(rawAmount / n);
  const myAmount  = rawAmount - perPerson * selectedFriends.length;

  const fmt = v => v.toLocaleString('ko-KR');

  const allParticipants = [
    { id: 'me', name: '나(빵장)', isMe: true, amount: myAmount },
    ...selectedFriends.map(f => ({ ...f, amount: perPerson })),
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '375px', height: '812px',
        overflow: 'hidden', flexShrink: 0,
        background: 'linear-gradient(to bottom, #fff1e3 0%, #fff1e3 47.78%, #ffffff 47.78%)',
      }}
    >
      {/* 상태바 */}
      <StatusBar />

      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute', left: '17.5px', top: '57px',
          width: '44px', height: '44px',
          border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.6'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        aria-label="뒤로가기"
      >
        <img src={splitBackArrow} alt="" style={{ width: '9px', height: '18px', display: 'block' }} />
      </button>

      {/* 타이틀 */}
      <p style={{ ...P, position: 'absolute', left: 0, right: 0, top: '66px', textAlign: 'center', fontWeight: 600, fontSize: '16px', lineHeight: '24.443px', letterSpacing: '-0.0986px', color: '#000' }}>
        1/N 빵나누기
      </p>

      {/* 취소 */}
      <button
        onClick={() => navigate(-2)}
        style={{
          position: 'absolute', left: 'calc(50% + 129.5px)', top: '66px',
          border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
        }}
      >
        <p style={{ ...P, fontWeight: 500, fontSize: '16px', lineHeight: '24.443px', letterSpacing: '-0.0986px', color: '#000' }}>취소</p>
      </button>

      {/* 빵 일러스트 */}
      <div style={{ position: 'absolute', left: '187.5px', top: '167px', transform: 'translateX(-50%)', width: '93px', height: '76px', pointerEvents: 'none' }}>
        <img
          alt="빵"
          src={breadIcon}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </div>

      {/* 요약 — "N,NNN원을 / N명이 나눴어요" */}
      <div style={{ position: 'absolute', left: '187.5px', top: '277px', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <p style={{ ...P, fontWeight: 600, fontSize: '20px', lineHeight: '29.301px', letterSpacing: '-0.1182px', color: '#222', whiteSpace: 'nowrap' }}>
          {formattedAmount}원을
        </p>
        <p style={{ ...P, fontWeight: 600, fontSize: '20px', lineHeight: '29.301px', letterSpacing: '-0.1182px', color: '#222', whiteSpace: 'nowrap' }}>
          {n}명이 나눴어요
        </p>
      </div>

      {/* 안내 문구 */}
      <p style={{ ...P, position: 'absolute', left: 0, right: 0, top: '345px', textAlign: 'center', fontWeight: 400, fontSize: '13.5px', lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#888' }}>
        친구 이름과 금액은 수정할 수 있어요
      </p>

      {/* 메모 선택 pill */}
      <div style={{
        position: 'absolute', left: '187px', top: '380px',
        transform: 'translateX(-50%)',
        width: '88px',
        background: 'white', border: '0.7px solid #dadada', borderRadius: '100px',
        padding: '8.5px 11px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}>
        <p style={{ ...P, fontWeight: 400, fontSize: '12.004px', lineHeight: 'normal', color: '#303030' }}>메모 선택</p>
      </div>

      {/* ── 참여자 스크롤 영역 ── */}
      <div
        className="participant-scroll"
        style={{
          position: 'absolute', left: 0, right: 0,
          top: '461px', bottom: '113.55px',
          overflowY: 'auto', overflowX: 'hidden',
          scrollbarWidth: 'none',
        }}
      >
        {allParticipants.map(p => (
          <div key={p.id} style={{ position: 'relative', height: '63px', flexShrink: 0 }}>
            {/* 아바타 — 41×41, left=24, top=0 */}
            <div style={{ position: 'absolute', left: '24px', top: '11px', width: '41px', height: '41px' }}>
              <Avatar f={p} />
            </div>
            {/* 이름 — left=75, top=21 */}
            <p style={{
              ...P, position: 'absolute', left: '75px', top: '21px',
              fontWeight: 400, fontSize: '16px', lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#222',
            }}>{p.name}</p>
            {/* 금액 — right=24, top=21 */}
            {p.isMe ? (
              <p style={{
                ...P, position: 'absolute', right: '24px', top: '21px',
                fontWeight: 600, fontSize: '16px', lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#000', textAlign: 'right',
              }}>{fmt(p.amount)}원</p>
            ) : (
              <p style={{
                ...P, position: 'absolute', right: '24px', top: '21px',
                fontWeight: 600, fontSize: '16px', lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#000', textAlign: 'right',
              }}>
                <span style={{ textDecoration: 'underline' }}>{fmt(p.amount)}</span>원
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── CTA 바 — 하단 고정 ── */}
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: '375px', height: '113.55px', background: 'white', zIndex: 10 }}>
        <button
          onClick={() => navigate('/split/status', { state: { formattedAmount, selectedFriends, perPerson, myAmount } })}
          style={{
            position: 'absolute',
            left: 'calc(50% - 171.278px)', top: '20px',
            width: '342.557px', height: '55.344px',
            borderRadius: '13.359px',
            background: '#ffe200',
            border: 'none',
            fontFamily: 'Pretendard, sans-serif',
            fontWeight: 600, fontSize: '16.221px',
            lineHeight: 1, letterSpacing: '-0.4771px',
            color: '#222', cursor: 'pointer',
          }}
        >
          1/N 요청하기
        </button>
      </div>
    </div>
  );
}
