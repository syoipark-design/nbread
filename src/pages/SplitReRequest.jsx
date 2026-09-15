import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import splitBackArrow from '../assets/split-back-arrow.svg';
import nofriendIcon from '../assets/nofriend.svg';
import nudgeBreadIcon from '../assets/nudge-bread-icon.png';

const IMG_ME_BG = 'https://www.figma.com/api/mcp/asset/b4e01d5d-1ac3-4a83-b0e0-37a6494e636e.svg';
const IMG_SHARE = 'https://www.figma.com/api/mcp/asset/d868db47-28d4-4039-b78a-e904f859f4a1.svg';

const P = { fontFamily: 'Pretendard, sans-serif', fontStyle: 'normal', margin: 0 };
const fmt = v => v.toLocaleString('ko-KR');

const STYLE_LIST = ['기본형', '속보형', '택배형', '사극형', '직접 입력'];

const TEMPLATES_MULTI = {
  '기본형': [
    (name, amount) => `${name}님, ${fmt(amount)}원 정산 부탁드려요`,
  ],
  '속보형': [
    (name, amount) => `[속보] ${name}, ${fmt(amount)}원 송금 소식 아직 들려오지 않아… 시민들 불안`,
    (name, amount) => `[속보] ${name}씨, ${fmt(amount)}원 미상환 상태 지속… 관계자 "곧 보낼 것"`,
    (name, amount) => `[단독] ${name}, ${fmt(amount)}원 보내는 걸 깜빡한 정황 포착`,
    (name, amount) => `[속보] ${fmt(amount)}원 정산 지연 사태… ${name}씨 침묵 이어져`,
    (name, amount) => `[긴급] ${name}, ${fmt(amount)}원 송금 임박?… 전 국민 주목`,
  ],
  '택배형': [
    (name, amount) => `[배송조회] ${name}님의 빵🍞 ${fmt(amount)}원이 출고를 기다리고 있어요`,
    (name, amount) => `[배송조회] ${name}님이 보낼 ${fmt(amount)}원, 현재 '미출고' 상태예요 🚚`,
    (name, amount) => `[배송조회] ${fmt(amount)}원 상품이 ${name}님 손에서 대기 중이에요`,
    (name, amount) => `[배송조회] ${name}님, 아직 송장 등록이 안 됐어요… 확인 부탁해요`,
    (name, amount) => `[배송조회] ${fmt(amount)}원, 발송지에서 움직이지 않고 있어요 📦`,
  ],
  '사극형': [
    (name, amount) => `${name}아, 네 빚 ${fmt(amount)}원을 어이 아직 갚지 아니하였느냐`,
    (name, amount) => `여봐라, ${name}에게 일러라. ${fmt(amount)}원 송금이 늦으면 곳간이 빈다 하였느니라`,
    (name, amount) => `${name}아… 과인이 ${fmt(amount)}원을 기다린 지 오래이니, 어서 봉투를 대령하라`,
    (name, amount) => `${name}님, 부디 ${fmt(amount)}원을 어서 보내주시옵소서`,
    (name, amount) => `${name}님, ${fmt(amount)}원 어서 갚아주시길 청하옵니다`,
  ],
  '직접 입력': [() => ''],
};

const SAGUK_SUFFIX = '. . ! ! !';

const COLORS = [
  { color: '#bcdeef', left: 22,  width: 48 },
  { color: '#c7e3d5', left: 92,  width: 49 },
  { color: '#ffa4ae', left: 163, width: 49 },
  { color: '#92d5dd', left: 234, width: 49 },
  { color: '#edd0c2', left: 305, width: 49 },
];

function Avatar({ f }) {
  if (f.isMe) {
    return (
      <>
        <img src={IMG_ME_BG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        <img src={nudgeBreadIcon} alt="" style={{ position: 'absolute', left: '11.33px', top: '11.33px', width: '29.467px', height: '29.467px', display: 'block', objectFit: 'contain' }} />
      </>
    );
  }
  if (f.isAnon) {
    return <img src={nofriendIcon} alt={f.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', borderRadius: '50%', objectFit: 'cover' }} />;
  }
  return <img src={f.img} alt={f.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', borderRadius: '50%', objectFit: 'cover' }} />;
}

export default function SplitReRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    notReceivedList = [],
    clickedFriendId,
    perPerson = 0,
    formattedAmount = '224,000',
  } = location.state ?? {};

  const [selectedId, setSelectedId] = useState(clickedFriendId ?? notReceivedList[0]?.id);
  const [selectedStyle, setSelectedStyle] = useState('속보형');
  const [selectedColor, setSelectedColor] = useState('#bcdeef');
  const [breakingKey, setBreakingKey] = useState(0);
  const [deliveryKey, setDeliveryKey] = useState(0);
  const [styleRandIdx, setStyleRandIdx] = useState({ '기본형': 0, '속보형': 0, '택배형': 0, '사극형': 0, '직접 입력': 0 });
  const [sagukKey, setSagukKey] = useState(0);
  const [sagukTyped, setSagukTyped] = useState('');

  const pillRefs = useRef({});

  useEffect(() => {
    pillRefs.current[selectedStyle]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [selectedStyle]);

  const selectedFriend = notReceivedList.find(f => f.id === selectedId) ?? notReceivedList[0];
  const message =
    TEMPLATES_MULTI[selectedStyle]?.[styleRandIdx[selectedStyle] ?? 0]?.(
      selectedFriend?.name ?? '', perPerson
    ) ?? '';

  const handleStyleSelect = (style) => {
    const arr = TEMPLATES_MULTI[style] ?? [];
    const newIdx = arr.length > 1 ? Math.floor(Math.random() * arr.length) : 0;
    setStyleRandIdx(prev => ({ ...prev, [style]: newIdx }));
    setSelectedStyle(style);
    if (style === '속보형') setBreakingKey(k => k + 1);
    if (style === '택배형') setDeliveryKey(k => k + 1);
    if (style === '사극형') setSagukKey(k => k + 1);
  };

  // 사극형 전체 타이핑: 본문 125ms/글자 → 480ms 뜸 → suffix 210ms/글자
  useEffect(() => {
    if (selectedStyle !== '사극형') return;
    setSagukTyped('');
    const fullText = message + SAGUK_SUFFIX;
    const bodyLen = message.length;
    let i = 0;
    let tid;
    const typeNext = () => {
      i++;
      setSagukTyped(fullText.slice(0, i));
      if (i >= fullText.length) return;
      const delay = i === bodyLen ? 480 : i > bodyLen ? 210 : 125;
      tid = setTimeout(typeNext, delay);
    };
    tid = setTimeout(typeNext, 200);
    return () => clearTimeout(tid);
  }, [sagukKey, selectedStyle, message]);


  return (
    <div style={{ position: 'relative', width: '375px', height: '812px', background: 'white', overflow: 'hidden', flexShrink: 0 }}>

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
      <p style={{ ...P, position: 'absolute', left: 0, right: 0, top: '66px', textAlign: 'center', fontWeight: 600, fontSize: '16px', lineHeight: '24.443px', letterSpacing: '-0.0986px', color: '#000', whiteSpace: 'nowrap' }}>다시요청</p>

      {/* 공유 아이콘 */}
      <div style={{ position: 'absolute', top: '71px', right: '27px', width: '16px', height: '16px' }}>
        <img src={IMG_SHARE} alt="공유" style={{ display: 'block', width: '100%', height: '100%' }} />
      </div>

      {/* 부제목 */}
      <div style={{ position: 'absolute', left: '26px', top: '126px' }}>
        <p style={{ ...P, fontWeight: 600, fontSize: '16px', lineHeight: '24.4px', color: '#222', whiteSpace: 'nowrap' }}>아직 빵을 안 나눈 친구들에게</p>
        <p style={{ ...P, fontWeight: 600, fontSize: '16px', lineHeight: '24.4px', color: '#222', whiteSpace: 'nowrap' }}>정산 요청 메시지를 보내봐요.</p>
      </div>

      {/* 친구 아바타 열 */}
      {notReceivedList.map((f, i) => {
        const isSelected = f.id === selectedId;
        const aLeft = 26 + i * 73;
        const centerX = aLeft + 25.5;
        return (
          <div key={f.id} onClick={() => setSelectedId(f.id)} style={{ cursor: 'pointer' }}>
            {/* 선택 링 */}
            {isSelected && (
              <div style={{
                position: 'absolute', left: `${aLeft - 4}px`, top: '191px',
                width: '59px', height: '59px',
                border: '2px solid #FEE500', borderRadius: '50%',
                pointerEvents: 'none',
              }} />
            )}
            {/* 아바타 51×51 — overflow:hidden으로 원 밖 삐져나옴 방지 */}
            <div style={{ position: 'absolute', left: `${aLeft}px`, top: '195px', width: '51px', height: '51px', borderRadius: '50%', overflow: 'hidden' }}>
              <Avatar f={f} />
            </div>
            {/* 이름 */}
            <p style={{ ...P, position: 'absolute', left: `${centerX}px`, top: '255px', transform: 'translateX(-50%)', fontWeight: 400, fontSize: '14px', lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#222', whiteSpace: 'nowrap' }}>
              {f.name}
            </p>
          </div>
        );
      })}

      {/* 메시지 카드 — overflow:hidden으로 pill 탭을 카드 모서리에서 클리핑 */}
      <div style={{ position: 'absolute', left: '22px', top: '307px', width: '331px', height: '238px', background: selectedColor, borderRadius: '22px', overflow: 'hidden' }}>
        {/* 스타일 pill 가로스크롤 — 카드 내부 top=18 / 좌우 패딩 동일(18px) */}
        <div
          className="re-request-pill-scroll"
          style={{
            position: 'absolute', top: '18px', left: 0, right: 0, height: '46px',
            overflowX: 'hidden', overflowY: 'hidden',
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '0 18px', boxSizing: 'border-box',
          }}
        >
          {STYLE_LIST.map((style) => {
            const isActive = selectedStyle === style;
            return (
              <button
                key={style}
                ref={el => { pillRefs.current[style] = el; }}
                onClick={() => handleStyleSelect(style)}
                style={{
                  flexShrink: 0,
                  padding: '0 15px', height: '28px',
                  borderRadius: '100px',
                  border: `1px solid ${isActive ? '#222' : '#a1bfce'}`,
                  background: isActive ? '#222' : 'transparent',
                  color: isActive ? 'white' : '#222',
                  fontFamily: 'Pretendard, sans-serif',
                  fontWeight: 400, fontSize: '11.9px',
                  cursor: style === '직접 입력' ? 'default' : 'pointer',
                  pointerEvents: style === '직접 입력' ? 'none' : 'auto',
                  outline: 'none', whiteSpace: 'nowrap',
                }}
              >
                {style}
              </button>
            );
          })}
        </div>

        {/* 메시지 콘텐츠 — 유형별 분기 */}
        {selectedStyle === '택배형' ? (
          /* ── 택배형: 배송 상태바 + 슬라이드업 ── */
          <div
            key={deliveryKey}
            style={{
              position: 'absolute', left: '22px', top: '68px', width: '287px',
              animation: 'pkg-slide-up 0.42s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {/* 출고 대기 dot — compact */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FEE500', boxShadow: '0 0 4px #FEE50088', animation: 'pkg-dot-blink 1s ease-in-out infinite', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: 10, fontWeight: 600, color: '#555' }}>출고 대기</span>
            </div>

            <div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#2c4e7a', color: 'white',
                    borderRadius: '4px', padding: '1px 6px',
                    fontFamily: 'Pretendard, sans-serif', fontSize: '12px', fontWeight: 700,
                    animation: 'pkg-tag-pop 0.25s ease-out',
                  }}>[배송조회]</span>
                  {[0, 1, 2].map(n => (
                    <span
                      key={n}
                      style={{
                        fontFamily: 'Pretendard, sans-serif', fontSize: '18px', color: '#444',
                        display: 'inline-block', opacity: 0, marginLeft: n === 0 ? '4px' : '1px',
                        animation: `pkg-dot-type 0.6s ease-in-out ${0.22 + n * 0.17}s 1 forwards`,
                      }}
                    >•</span>
                  ))}
                </div>
                <p style={{
                  ...P, fontWeight: 600, fontSize: '17px', lineHeight: '25px', color: '#222', whiteSpace: 'pre-wrap',
                  opacity: 0, animation: 'pkg-body-appear 0.35s ease-out 0.82s forwards',
                }}>
                  {message.replace('[배송조회] ', '')}
                </p>
              </div>
          </div>
        ) : (() => {
            const brMatch = selectedStyle === '속보형'
              ? message.match(/^(\[[^\]]+\])\s*([\s\S]*)$/)
              : null;
            const brBadge = brMatch?.[1] ?? '';
            const brBody  = brMatch?.[2] ?? message;
            return (
              <p
                key={selectedStyle === '속보형' ? breakingKey : 'msg'}
                style={{
                  ...P,
                  position: 'absolute', left: '22px', top: '77px',
                  width: '272px',
                  fontWeight: selectedStyle === '사극형' ? 400 : 600,
                  fontSize: selectedStyle === '사극형' ? '22px' : '20px',
                  lineHeight: selectedStyle === '사극형' ? '1.3' : '28px',
                  color: '#222', whiteSpace: 'pre-wrap',
                  fontFamily: selectedStyle === '사극형'
                    ? 'JeongseonArirang, sans-serif'
                    : 'Pretendard, sans-serif',
                  animation: selectedStyle === '속보형' ? 'sb-shake 0.55s ease-out' : 'none',
                }}
              >
                {selectedStyle === '속보형' ? (
                  <>
                    <span style={{
                      display: 'inline-block',
                      background: '#E53935',
                      color: 'white',
                      borderRadius: '3px',
                      padding: '1px 5px',
                      marginRight: '4px',
                      fontSize: '18px',
                      fontWeight: 700,
                      animation: 'sb-blink 0.65s ease-in-out',
                    }}>{brBadge}</span>
                    {brBody}
                  </>
                ) : selectedStyle === '사극형' ? (
                  sagukTyped
                ) : message}
              </p>
            );
          })()}
      </div>

      {/* 글자 수 — 직접 입력 시에만 표시 */}
      {selectedStyle === '직접 입력' && (
        <p style={{ ...P, position: 'absolute', left: '44px', top: '506px', fontWeight: 400, fontSize: '12px', color: '#5a6368', opacity: 0.6, whiteSpace: 'nowrap' }}>
          {message.length}/40
        </p>
      )}

      {/* 이모지 컬러 셀렉터 */}
      <div style={{ position: 'absolute', top: '561px', left: 0, width: '375px', height: '70px' }}>
        {COLORS.map(({ color, left, width }) => (
          <div
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{
              position: 'absolute', left: `${left}px`, top: '5px',
              width: `${width}px`, height: '49px',
              background: color, borderRadius: '37px', cursor: 'pointer',
              outline: selectedColor === color ? '2px solid #000' : 'none',
              outlineOffset: '3px',
            }}
          />
        ))}
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: '375px', height: '113.55px', background: 'white', zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            left: 'calc(50% - 171.278px)', top: '20px',
            width: '342.557px', height: '55.344px',
            borderRadius: '13.359px',
            background: '#ffe200', border: 'none',
            fontFamily: 'Pretendard, sans-serif',
            fontWeight: 600, fontSize: '16.221px',
            lineHeight: 1, letterSpacing: '-0.4771px',
            color: '#222', cursor: 'pointer', outline: 'none',
          }}
        >
          보내기
        </button>
      </div>
    </div>
  );
}
