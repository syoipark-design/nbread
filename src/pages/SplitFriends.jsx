import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import splitBackArrow from '../assets/split-back-arrow.svg';
import katalkIcon from '../assets/katalk.svg';
import plusIcon from '../assets/plus.svg';
import xIcon from '../assets/x.svg';
import nudgeBreadIcon from '../assets/nudge-bread-icon.png';

const IMG_ME_BG     = 'https://www.figma.com/api/mcp/asset/b4e01d5d-1ac3-4a83-b0e0-37a6494e636e.svg';
const IMG_JANGYUNA  = 'https://www.figma.com/api/mcp/asset/7f5e3f40-2ead-44eb-881b-dcf74b3d96de.png';
const IMG_CHOISUJIN = 'https://www.figma.com/api/mcp/asset/32d574e4-f06d-4604-a68b-473cf792642f.png';
const IMG_LIYUBIN   = 'https://www.figma.com/api/mcp/asset/03ce629c-c710-4c48-b284-bdd72deedd0d.png';

const FRIENDS = [
  { id: 1, name: '장유나', img: IMG_JANGYUNA  },
  { id: 2, name: '최수진', img: IMG_CHOISUJIN },
  { id: 3, name: '이유빈', img: IMG_LIYUBIN   },
];

// n = 나 포함 총 인원 (n ≤ 6에서만 사용)
function avatarLeft(i, n) {
  const leftmostCenter = 187.5 - (n - 1) * 33;
  return leftmostCenter + i * 66 - 25.5;
}
function avatarCenterX(i, n) {
  return 187.5 - (n - 1) * 33 + i * 66;
}

const NAME_STYLE = {
  fontFamily: 'Pretendard, sans-serif', fontStyle: 'normal',
  fontWeight: 400, fontSize: '14px',
  lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#222',
  whiteSpace: 'nowrap', margin: 0,
};

export default function SplitFriends() {
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.formattedAmount ?? '224,000';
  const [selectedFriends, setSelectedFriends] = useState([]);

  const n = selectedFriends.length + 1;
  const isActive = selectedFriends.length > 0;

  function addFriend(f) {
    if (selectedFriends.length >= 9) return;
    setSelectedFriends(prev => [f, ...prev]);
  }
  function removeFriend(id) {
    setSelectedFriends(prev => prev.filter(f => f.id !== id));
  }

  const unselectedFriends = FRIENDS.filter(f => !selectedFriends.some(s => s.id === f.id));
  const allFriendsSelected = unselectedFriends.length === 0;

  const useScroll = n >= 6;

  return (
    <div className="relative w-[375px] h-[812px] bg-white overflow-hidden flex-shrink-0">

      {/* 상태바 */}
      <StatusBar />

      {/* 뒤로가기 */}
      <button
        style={{
          position: 'absolute', left: '17.5px', top: '57px',
          width: '44px', height: '44px',
          border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 14,
        }}
        onClick={() => navigate(-1)}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.6'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        aria-label="뒤로가기"
      >
        <img src={splitBackArrow} alt="" style={{ width: '9px', height: '18px', display: 'block' }} />
      </button>

      {/* 타이틀 */}
      <p className="absolute w-full text-center not-italic" style={{
        top: '66px',
        fontFamily: 'Pretendard, sans-serif', fontWeight: 600,
        fontSize: '16px', lineHeight: '24.443px', letterSpacing: '-0.0986px', color: '#000',
      }}>1/N 빵나누기</p>

      {/* 금액 + 원을 */}
      <div className="absolute w-full flex items-baseline justify-center" style={{ top: '143px' }}>
        <span style={{
          fontFamily: 'Pretendard, sans-serif', fontStyle: 'normal', whiteSpace: 'nowrap',
          fontWeight: 700, fontSize: '27.871px', lineHeight: '42.578px',
          letterSpacing: '-0.1718px', color: '#222',
        }}>{amount}</span>
        <span style={{
          fontFamily: 'Pretendard, sans-serif', fontStyle: 'normal', whiteSpace: 'nowrap',
          fontWeight: 600, fontSize: '25.596px', lineHeight: '39.102px',
          letterSpacing: '-0.1578px', color: '#222', marginLeft: '4px',
        }}>원을</span>
      </div>

      {/* N명과 나눌게요 */}
      <p className="absolute w-full text-center not-italic" style={{
        top: '188px',
        fontFamily: 'Pretendard, sans-serif', fontWeight: 700,
        fontSize: '25.6px', lineHeight: '42.578px', letterSpacing: '-0.1718px', color: '#222',
      }}>
        <span style={{ color: '#00bd65' }}>{n}</span>명과 나눌게요
      </p>

      {/* 최대 안내 */}
      <p className="absolute w-full text-center not-italic" style={{
        top: '240px',
        fontFamily: 'Pretendard, sans-serif', fontWeight: 400,
        fontSize: '13.5px', lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#888',
      }}>최대 10명과 나눌 수 있어요.</p>

      {/* ── 참여자 아바타 영역 ── */}

      {/* n ≤ 5: center-spread absolute 레이아웃 */}
      {!useScroll && (
        <>
          {selectedFriends.map((f, i) => {
            const aLeft = avatarLeft(i, n);
            const aCx   = avatarCenterX(i, n);
            return (
              <div key={f.id}>
                <div style={{ position: 'absolute', left: `${aLeft}px`, top: '288px', width: '51px', height: '51px' }}>
                  <img src={f.img} alt={f.name} style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    display: 'block', borderRadius: '50%', objectFit: 'cover',
                  }} />
                  <button
                    onClick={() => removeFriend(f.id)}
                    style={{
                      position: 'absolute', left: '35px', top: 0,
                      width: '16px', height: '16px',
                      border: 'none', padding: 0, background: 'transparent', cursor: 'pointer',
                    }}
                    aria-label={`${f.name} 선택 해제`}
                  >
                    <img src={xIcon} alt="" style={{ display: 'block', width: '100%', height: '100%' }} />
                  </button>
                </div>
                <p style={{ ...NAME_STYLE, position: 'absolute', left: `${aCx}px`, top: '348px', transform: 'translateX(-50%)' }}>
                  {f.name}
                </p>
              </div>
            );
          })}

          {/* 나(빵장) — 항상 우측 */}
          {(() => {
            const meIdx = n - 1;
            const aLeft = avatarLeft(meIdx, n);
            const aCx   = avatarCenterX(meIdx, n);
            return (
              <>
                <div style={{ position: 'absolute', left: `${aLeft}px`, top: '288px', width: '51px', height: '51px' }}>
                  <img src={IMG_ME_BG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
                  <img src={nudgeBreadIcon} alt="" style={{
                    position: 'absolute', left: '11.33px', top: '11.33px',
                    width: '29.467px', height: '29.467px', display: 'block', objectFit: 'contain',
                  }} />
                </div>
                <p style={{ ...NAME_STYLE, position: 'absolute', left: `${aCx}px`, top: '348px', transform: 'translateX(-50%)' }}>
                  나(빵장)
                </p>
              </>
            );
          })()}
        </>
      )}

      {/* n ≥ 6: 가로 스크롤 flex (Figma 14:1774) */}
      {useScroll && (
        <div
          className="avatar-scroll"
          style={{
            position: 'absolute', left: 0, width: '375px',
            top: '270px', height: '118px',
            overflowX: 'auto', overflowY: 'visible',
            scrollbarWidth: 'none',
          }}
        >
          <div style={{
            display: 'flex', flexDirection: 'row', alignItems: 'flex-start',
            gap: '15px',
            padding: '18px 26px 0',
            width: 'max-content',
          }}>
            {[...selectedFriends, { id: 'me', isMe: true, name: '나(빵장)' }].map(f => (
              <div key={f.id} style={{
                flexShrink: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '9px',
              }}>
                <div style={{ position: 'relative', width: '51px', height: '51px', flexShrink: 0 }}>
                  {f.isMe ? (
                    <>
                      <img src={IMG_ME_BG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
                      <img src={nudgeBreadIcon} alt="" style={{
                        position: 'absolute', left: '11.33px', top: '11.33px',
                        width: '29.467px', height: '29.467px', display: 'block', objectFit: 'contain',
                      }} />
                    </>
                  ) : (
                    <img src={f.img} alt={f.name} style={{
                      position: 'absolute', inset: 0, width: '100%', height: '100%',
                      display: 'block', borderRadius: '50%', objectFit: 'cover',
                    }} />
                  )}
                  {!f.isMe && (
                    <button
                      onClick={() => removeFriend(f.id)}
                      style={{
                        position: 'absolute', left: '35px', top: 0,
                        width: '16px', height: '16px',
                        border: 'none', padding: 0, background: 'transparent', cursor: 'pointer',
                      }}
                      aria-label={`${f.name} 선택 해제`}
                    >
                      <img src={xIcon} alt="" style={{ display: 'block', width: '100%', height: '100%' }} />
                    </button>
                  )}
                </div>
                <p style={{ ...NAME_STYLE }}>{f.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 빵을 자주 나눈 친구 라벨 */}
      <p style={{
        position: 'absolute', left: '26px', top: '406px',
        fontFamily: 'Pretendard, sans-serif', fontStyle: 'normal',
        fontWeight: 600, fontSize: '16px',
        lineHeight: '21.878px', letterSpacing: '-0.0883px', color: '#222',
        whiteSpace: 'nowrap',
      }}>빵을 자주 나눈 친구</p>

      {/* 하단 친구 목록 영역 */}
      <div style={{ position: 'absolute', left: '27px', top: '448px' }}>
        {allFriendsSelected ? (
          <p style={{
            fontFamily: 'Pretendard, sans-serif', fontStyle: 'normal',
            fontWeight: 400, fontSize: '13px',
            lineHeight: '20px', letterSpacing: '-0.0704px', color: '#8a8a8e',
            margin: 0,
          }}>자주 나누는 친구는 모두 골랐어요</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '17px' }}>
            {unselectedFriends.map(f => (
              <button
                key={f.id}
                onClick={() => addFriend(f)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '9px',
                  border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
                  width: '51px',
                }}
                aria-label={`${f.name} 선택`}
              >
                <img src={f.img} alt="" style={{
                  width: '51px', height: '51px',
                  display: 'block', borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
                }} />
                <p style={{ ...NAME_STYLE }}>{f.name}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 카카오톡 친구 추가 — 비활성 (디자인 유지) */}
      <button
        style={{
          position: 'absolute', left: '26px', top: '571px', width: '41px', height: '41px',
          background: 'none', border: 'none', cursor: 'default', padding: 0,
        }}
        aria-label="카카오톡 친구 추가"
      >
        <img src={katalkIcon} alt="" style={{ display: 'block', width: '100%', height: '100%' }} />
      </button>
      <p style={{
        position: 'absolute', left: '138.5px', top: '578px',
        transform: 'translateX(-50%)',
        fontFamily: 'Pretendard, sans-serif', fontStyle: 'normal',
        fontWeight: 400, fontSize: '16.138px',
        lineHeight: '26.84px', letterSpacing: '-0.1083px', color: '#222',
        whiteSpace: 'nowrap', pointerEvents: 'none',
      }}>카카오톡 친구 추가</p>

      {/* 연락처 없는 친구 추가 — 비활성 (디자인 유지) */}
      <button
        style={{
          position: 'absolute', left: '26px', top: '634px', width: '41px', height: '41px',
          background: 'none', border: 'none', cursor: 'default', padding: 0,
        }}
        aria-label="연락처 없는 친구 추가"
      >
        <img src={plusIcon} alt="" style={{ display: 'block', width: '100%', height: '100%' }} />
      </button>
      <p style={{
        position: 'absolute', left: '147.5px', top: '641px',
        transform: 'translateX(-50%)',
        fontFamily: 'Pretendard, sans-serif', fontStyle: 'normal',
        fontWeight: 400, fontSize: '16.138px',
        lineHeight: '26.84px', letterSpacing: '-0.1083px', color: '#222',
        whiteSpace: 'nowrap', pointerEvents: 'none',
      }}>연락처 없는 친구 추가</p>

      {/* 흰 CTA 바 */}
      <div style={{ position: 'absolute', left: 0, top: '698px', width: '375px', height: '113.55px', background: 'white' }} />

      {/* 친구 선택 완료 버튼 */}
      <button
        disabled={!isActive}
        onClick={() => isActive && navigate('/split/confirm', { state: { formattedAmount: amount, selectedFriends } })}
        style={{
          position: 'absolute',
          left: 'calc(50% - 171.278px)', top: '718.99px',
          width: '342.557px', height: '55.344px',
          borderRadius: '13.359px',
          background: isActive ? '#ffe200' : '#e5e6e6',
          border: 'none',
          fontFamily: 'Pretendard, sans-serif',
          fontWeight: 600, fontSize: '16.221px',
          lineHeight: 1, letterSpacing: '-0.4771px',
          color: isActive ? '#222' : '#999',
          cursor: isActive ? 'pointer' : 'default',
          transition: 'background 0.2s ease, color 0.2s ease',
        }}
      >
        친구 선택 완료
      </button>

    </div>
  );
}
