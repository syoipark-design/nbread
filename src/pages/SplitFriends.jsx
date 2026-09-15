import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import splitBackArrow from '../assets/split-back-arrow.svg';
import nudgeBreadIcon from '../assets/nudge-bread-icon.png';

const P = { fontFamily: 'Pretendard, sans-serif', fontStyle: 'normal', margin: 0 };

// ── 그룹 카드 이미지 (51:2277) ─────────────────────────────────────────
const IMG_ME_BG       = 'https://www.figma.com/api/mcp/asset/ba183758-8aee-467e-80e6-bb4bd9cd6bf5.svg';
const IMG_GROUP_BG    = 'https://www.figma.com/api/mcp/asset/592ec4af-8d6d-4c9e-909a-bd6d404193d3.svg';
const IMG_JANGHOYOUNG = 'https://www.figma.com/api/mcp/asset/0992e625-3db7-4bd9-962c-383383e7c1bd.png';

const IMG_G1_A = 'https://www.figma.com/api/mcp/asset/d22c70c7-b4ff-4b58-ad81-b58a4a91bfc6.png';
const IMG_G1_B = 'https://www.figma.com/api/mcp/asset/de9d0b3f-43c7-4cf7-9acc-040a14e7f8e9.png';
const IMG_G1_C = 'https://www.figma.com/api/mcp/asset/1c69fff7-0998-4b9d-b72f-98f4d0c5cdf9.png';

const IMG_G2_A = 'https://www.figma.com/api/mcp/asset/9027d64a-b929-49c6-8d30-f3a7070ef3f1.png';
const IMG_G2_B = 'https://www.figma.com/api/mcp/asset/0b7ffb4a-93e9-4ced-9421-b62c7119d928.png';
const IMG_G2_C = 'https://www.figma.com/api/mcp/asset/7b079d5f-3138-4b05-8b62-c68b172c0945.png';
const IMG_G2_D = 'https://www.figma.com/api/mcp/asset/9a0c2395-9164-4817-807e-38924d6188eb.png';

const IMG_G4_A = 'https://www.figma.com/api/mcp/asset/e255c113-3ffa-49b0-90af-52dfd4a0df5c.png';
const IMG_G4_B = 'https://www.figma.com/api/mcp/asset/906eec30-4f0f-424a-b6f2-d5281f15efce.png';
const IMG_G4_C = 'https://www.figma.com/api/mcp/asset/abc68cbe-ea9e-40e8-880e-36eebe6f92bc.png';
const IMG_G4_D = 'https://www.figma.com/api/mcp/asset/c15f6c9e-af58-4b1e-a190-5635bccae129.png';

const IMG_KAKAO_BG   = 'https://www.figma.com/api/mcp/asset/c195fba5-5a13-4ece-9afb-bd11e7355b23.svg';
const IMG_KAKAO_LOGO = 'https://www.figma.com/api/mcp/asset/a4b3453b-3f5c-4b4b-919a-ebf683ccf317.png';
const IMG_PLUS_BG    = 'https://www.figma.com/api/mcp/asset/b687197d-da74-4f93-9b81-6e5dc301db08.svg';
const IMG_PLUS_ICON  = 'https://www.figma.com/api/mcp/asset/457bc331-5046-44d0-8b9e-0fd29f16cd38.svg';

// ── 바텀시트 이미지 (51:2349 원본 재확인) ──────────────────────────────
const IMG_SHEET_GROUP_BG = 'https://www.figma.com/api/mcp/asset/0b5ef831-67e2-4985-9fe9-bf4b1532a592.svg';
const IMG_SHEET_INNER_A  = 'https://www.figma.com/api/mcp/asset/c0a85aa5-baed-42ed-b227-e06992b57c1e.png';
const IMG_SHEET_INNER_B  = 'https://www.figma.com/api/mcp/asset/6f3223c3-b003-4316-9574-cbd633492afa.png';
const IMG_SHEET_INNER_C  = 'https://www.figma.com/api/mcp/asset/e7a37cf1-f90c-42dd-90de-8fd4eca17055.png';
const IMG_SHEET_M1       = 'https://www.figma.com/api/mcp/asset/c84a0911-513f-4584-b0d5-47faa35028fc.png';
const IMG_SHEET_M2       = 'https://www.figma.com/api/mcp/asset/ce004205-2fc2-4091-8bfe-2a8ac19348e2.png';
const IMG_SHEET_M3       = 'https://www.figma.com/api/mcp/asset/f02775c3-c2a3-426f-8bf7-d27d1bd0a068.png';
// 선택 ON(노랑 체크) / OFF(회색 빈 원) — imgGroup2085665349 / imgGroup2085665351
const IMG_CHECK_ON       = 'https://www.figma.com/api/mcp/asset/8c2eaa83-f678-4fb5-9cff-993331830de3.svg';
const IMG_CHECK_OFF      = 'https://www.figma.com/api/mcp/asset/28a9facc-2b0b-4eb9-aebb-c79b67b223ff.svg';
const IMG_INSIGHT_ICON   = 'https://www.figma.com/api/mcp/asset/4d26de65-e280-46ca-9b92-403250e4fc57.png';
const IMG_EDIT           = 'https://www.figma.com/api/mcp/asset/3900edf5-8aa9-46e5-8f9a-7af54db6f666.svg';

// × 제거 버튼 (14:1674 기준)
const IMG_REMOVE_BTN = 'https://www.figma.com/api/mcp/asset/d6d4d87f-1147-4741-8815-f482e001c4c8.svg';

// ── 그룹 데이터 ────────────────────────────────────────────────────────
const GROUPS = [
  {
    id: 'g1', left: 27, count: 3, pillLeft: 32, pillLabel: '3명',
    bg: IMG_GROUP_BG,
    avatars: [
      { img: IMG_G1_A, rl: 15,    rt: 2,     size: 20.119 },
      { img: IMG_G1_B, rl: 4,     rt: 23.12, size: 20.119 },
      { img: IMG_G1_C, rl: 26.12, rt: 23.12, size: 20.119 },
    ],
    insight: '금요일 저녁에 자주 정산했어요.',
    sheetInnerAvatars: [IMG_SHEET_INNER_A, IMG_SHEET_INNER_B, IMG_SHEET_INNER_C],
    members: [
      { id: 'm1', name: '장유나', img: IMG_SHEET_M1 },
      { id: 'm2', name: '최수진', img: IMG_SHEET_M2 },
      { id: 'm3', name: '이유빈', img: IMG_SHEET_M3 },
    ],
  },
  {
    id: 'g2', left: 96, count: 6, pillLeft: 101, pillLabel: '6명',
    bg: IMG_GROUP_BG,
    avatars: [
      { img: IMG_G2_A, rl: 7,     rt: 7,     size: 17.78 },
      { img: IMG_G2_B, rl: 26.87, rt: 7,     size: 17.78 },
      { img: IMG_G2_C, rl: 7,     rt: 27.22, size: 17.78 },
      { img: IMG_G2_D, rl: 26.87, rt: 27.22, size: 17.78 },
    ],
    plusText: '+3', plusLeft: 131.5,
    insight: '한 달에 두 번 이상 정산했어요.',
    sheetInnerAvatars: [IMG_G2_A, IMG_G2_B, IMG_G2_C, IMG_G2_D],
    members: [
      { id: 'm4', name: '박지민', img: IMG_G2_A },
      { id: 'm5', name: '김하은', img: IMG_G2_B },
      { id: 'm6', name: '이서연', img: IMG_G2_C },
      { id: 'm7', name: '정민준', img: IMG_G2_D },
      { id: 'm8', name: '강태양', img: IMG_G2_A },
      { id: 'm9', name: '윤지호', img: IMG_G2_B },
    ],
  },
  {
    id: 'g3', left: 165, count: 1,
    bg: IMG_JANGHOYOUNG,
    isSingle: true, singleName: '장호영', nameCenterX: 190.5,
    insight: '자주 함께 빵을 나눴어요.',
    sheetInnerAvatars: [],
    members: [
      { id: 'm10', name: '장호영', img: IMG_JANGHOYOUNG },
    ],
  },
  {
    id: 'g4', left: 234, count: 4, pillLeft: 239, pillLabel: '4명',
    bg: IMG_GROUP_BG,
    avatars: [
      { img: IMG_G4_A, rl: 7,     rt: 7,     size: 17.78 },
      { img: IMG_G4_B, rl: 26.87, rt: 7,     size: 17.78 },
      { img: IMG_G4_C, rl: 7,     rt: 27.22, size: 17.78 },
      { img: IMG_G4_D, rl: 26.87, rt: 27.22, size: 17.78 },
    ],
    insight: '주말마다 자주 정산했어요.',
    sheetInnerAvatars: [IMG_G4_A, IMG_G4_B, IMG_G4_C, IMG_G4_D],
    members: [
      { id: 'm11', name: '오준혁', img: IMG_G4_A },
      { id: 'm12', name: '신예린', img: IMG_G4_B },
      { id: 'm13', name: '류성민', img: IMG_G4_C },
      { id: 'm14', name: '한소희', img: IMG_G4_D },
    ],
  },
];

// 전체 멤버 플랫 목록 (selectedFriends 조회용)
const ALL_MEMBERS = GROUPS.flatMap(g => g.members);

// 14:1674 참여자 행 배치 공식
// n명 선택 시: startX = 162 - 32*n, step = 64px
// 나(빵장) left = startX + 64*n
function participantLayout(numFriends) {
  const startX = 162 - 32 * numFriends;
  const step = 64;
  return { startX, step };
}

export default function SplitFriends() {
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.formattedAmount ?? '224,000';

  // 단일 소스: 선택된 멤버 ID Set
  const [selectedFriends, setSelectedFriends] = useState(new Set());

  // 바텀시트
  const [sheetGroup, setSheetGroup] = useState(null);
  const [isClosing, setIsClosing]   = useState(false);

  // 드래그 dismiss
  const [dragStartY, setDragStartY] = useState(null);
  const [dragDelta, setDragDelta]   = useState(0);

  // 선택된 멤버 객체 배열 (순서 보존: ALL_MEMBERS 기준)
  const selectedMembersList = ALL_MEMBERS.filter(m => selectedFriends.has(m.id));
  const numSelected = selectedMembersList.length;
  const n = 1 + numSelected;
  const isActive = numSelected > 0;

  // 참여자 행 좌표
  const { startX, step } = participantLayout(numSelected);

  // 개별 멤버 토글 (추가 → 참여자 행, 해제 → 목록 복귀)
  function toggleMember(id) {
    setSelectedFriends(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const openSheet = (g) => {
    setIsClosing(false);
    setSheetGroup(g);
  };

  const closeSheet = () => {
    setIsClosing(true);
    setDragDelta(0);
    setTimeout(() => {
      setSheetGroup(null);
      setIsClosing(false);
    }, 250);
  };

  const handleTouchStart = (e) => setDragStartY(e.touches[0].clientY);
  const handleTouchMove  = (e) => {
    const d = e.touches[0].clientY - (dragStartY ?? e.touches[0].clientY);
    if (d > 0) setDragDelta(d);
  };
  const handleTouchEnd = () => {
    if (dragDelta > 60) closeSheet(); else setDragDelta(0);
    setDragStartY(null);
  };

  const sheetAnim = dragDelta > 0
    ? { transform: `translateY(${dragDelta}px)`, animation: 'none' }
    : { animation: isClosing
        ? 'nbread-sheet-down 0.25s ease-in forwards'
        : 'nbread-sheet-up 0.32s cubic-bezier(0.2,0.82,0.2,1) forwards' };

  const overlayAnim = {
    animation: isClosing
      ? 'nbread-dim-out 0.25s ease-in forwards'
      : 'nbread-dim-in 0.32s ease-out forwards',
  };

  // 현재 열린 시트에서 선택된 인원수 (헤더 카운트용)
  const selectedInGroup = sheetGroup
    ? sheetGroup.members.filter(m => selectedFriends.has(m.id)).length
    : 0;

  return (
    <div style={{ position: 'relative', width: '375px', height: '812px', background: 'white', overflow: 'hidden', flexShrink: 0 }}>

      <StatusBar />

      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute', left: '17.5px', top: '57px',
          width: '44px', height: '44px',
          border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6,
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.6'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        aria-label="뒤로가기"
      >
        <img src={splitBackArrow} alt="" style={{ width: '9px', height: '18px', display: 'block' }} />
      </button>

      {/* 타이틀 */}
      <p style={{ ...P, position: 'absolute', left: 0, right: 0, top: '66px', textAlign: 'center', fontWeight: 600, fontSize: '16px', lineHeight: '24.443px', letterSpacing: '-0.0986px', color: '#000', whiteSpace: 'nowrap' }}>
        1/N 빵나누기
      </p>

      {/* 금액 */}
      <p style={{ ...P, position: 'absolute', left: '219px', top: '142px', transform: 'translateX(-100%)', fontWeight: 700, fontSize: '27.871px', lineHeight: '42.578px', letterSpacing: '-0.1718px', color: '#222', whiteSpace: 'nowrap', textAlign: 'right' }}>
        {amount}
      </p>
      <p style={{ ...P, position: 'absolute', left: '219px', top: '143px', fontWeight: 600, fontSize: '25.596px', lineHeight: '39.102px', letterSpacing: '-0.1578px', color: '#222', whiteSpace: 'nowrap' }}>
        원을
      </p>

      {/* N명과 나눌게요 — selectedFriends 실시간 연동 */}
      <p style={{ ...P, position: 'absolute', left: 0, right: 0, top: '188px', textAlign: 'center', fontWeight: 700, fontSize: '25.6px', lineHeight: '42.578px', letterSpacing: '-0.1718px', color: '#222', whiteSpace: 'nowrap' }}>
        <span style={{ color: '#00bd65' }}>{n}</span>명과 나눌게요
      </p>

      {/* 최대 안내 */}
      <p style={{ ...P, position: 'absolute', left: 0, right: 0, top: '240px', textAlign: 'center', fontWeight: 400, fontSize: '13.5px', lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#888', whiteSpace: 'nowrap' }}>
        최대 10명과 나눌 수 있어요.
      </p>

      {/* ── 참여자 행 (14:1674 규칙) ─────────────────────────────────
          선택된 친구들 + 나(빵장) 가로 배치, 중앙 정렬
          startX = 162 - 32*numSelected, step = 64px
      */}
      {selectedMembersList.map((m, i) => {
        const avatarLeft = startX + step * i;
        return (
          <div key={m.id}>
            {/* 친구 아바타 */}
            <div style={{
              position: 'absolute', left: `${avatarLeft}px`, top: '288px',
              width: '51px', height: '51px', borderRadius: '50%', overflow: 'hidden',
            }}>
              <img src={m.img} alt={m.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            {/* × 제거 버튼 — 14:1674 아바타 우상단 */}
            <button
              onClick={() => toggleMember(m.id)}
              style={{
                position: 'absolute',
                left: `${avatarLeft + 35}px`, top: '288px',
                width: '16px', height: '16px',
                border: 'none', background: 'transparent', padding: 0,
                cursor: 'pointer', zIndex: 2,
              }}
              aria-label={`${m.name} 제거`}
            >
              <img src={IMG_REMOVE_BTN} alt="제거"
                style={{ width: '16px', height: '16px', display: 'block' }} />
            </button>
            {/* 이름 */}
            <p style={{
              ...P, position: 'absolute',
              left: `${avatarLeft + 25.5}px`, top: '348px',
              transform: 'translateX(-50%)',
              fontWeight: 400, fontSize: '14px', lineHeight: '21.976px',
              letterSpacing: '-0.0887px', color: '#222', whiteSpace: 'nowrap',
            }}>
              {m.name}
            </p>
          </div>
        );
      })}

      {/* 나(빵장) — 선택 인원에 따라 위치 이동 */}
      <div style={{
        position: 'absolute',
        left: `${startX + step * numSelected}px`, top: '288px',
        width: '51px', height: '51px',
      }}>
        <img src={IMG_ME_BG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        <img src={nudgeBreadIcon} alt="" style={{ position: 'absolute', left: '11.33px', top: '11.33px', width: '29.467px', height: '29.467px', display: 'block', objectFit: 'contain' }} />
      </div>
      <p style={{
        ...P, position: 'absolute',
        left: `${startX + step * numSelected + 25.5}px`, top: '348px',
        transform: 'translateX(-50%)',
        fontWeight: 400, fontSize: '14px', lineHeight: '21.976px',
        letterSpacing: '-0.0887px', color: '#222', whiteSpace: 'nowrap',
      }}>
        나(빵장)
      </p>

      {/* 섹션 라벨 */}
      <p style={{ ...P, position: 'absolute', left: '26px', top: '406px', fontWeight: 600, fontSize: '16px', lineHeight: '21.878px', letterSpacing: '-0.0883px', color: '#222', whiteSpace: 'nowrap' }}>
        비슷한 빵나누기를 했던 친구·모임
      </p>

      {/* 그룹 카드 — 클릭 시 시트 오픈 (선택 상태 없음) */}
      {GROUPS.map(g => (
        <button
          key={g.id}
          onClick={() => openSheet(g)}
          style={{
            position: 'absolute', left: `${g.left}px`, top: '448px',
            width: '51px', height: '51px',
            border: 'none', padding: 0, background: 'transparent',
            cursor: 'pointer', borderRadius: '50%',
          }}
          aria-label={g.isSingle ? g.singleName : g.pillLabel}
        >
          <img src={g.bg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', borderRadius: '50%', objectFit: 'cover' }} />
          {!g.isSingle && g.avatars?.map((av, i) => (
            <img key={i} src={av.img} alt=""
              style={{
                position: 'absolute', left: `${av.rl}px`, top: `${av.rt}px`,
                width: `${av.size}px`, height: `${av.size}px`,
                display: 'block', borderRadius: '50%', objectFit: 'cover',
              }}
            />
          ))}
          {g.plusText && (
            <span style={{
              position: 'absolute', left: `${g.plusLeft - g.left}px`, top: '31px',
              transform: 'translateX(-50%)',
              fontFamily: 'Pretendard, sans-serif', fontWeight: 800,
              fontSize: '10px', lineHeight: 1, color: '#5c677c', whiteSpace: 'nowrap',
            }}>
              {g.plusText}
            </span>
          )}
        </button>
      ))}

      {/* 그룹 레이블 / pill — 클릭 시 시트 오픈 */}
      {GROUPS.map(g => (
        g.isSingle ? (
          <p
            key={`label-${g.id}`}
            onClick={() => openSheet(g)}
            style={{
              ...P, position: 'absolute',
              left: `${g.nameCenterX}px`, top: '508px',
              transform: 'translateX(-50%)',
              fontWeight: 400, fontSize: '14px', lineHeight: '21.976px',
              letterSpacing: '-0.0887px', color: '#222', whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {g.singleName}
          </p>
        ) : (
          <div
            key={`label-${g.id}`}
            onClick={() => openSheet(g)}
            style={{
              position: 'absolute', left: `${g.pillLeft}px`, top: '507px',
              height: '24px', padding: '0 10px',
              background: 'rgba(0,189,101,0.1)', borderRadius: '100px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span style={{ ...P, fontWeight: 400, fontSize: '14px', lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#000', whiteSpace: 'nowrap' }}>
              {g.pillLabel}
            </span>
          </div>
        )
      ))}

      {/* 카카오톡 친구 추가 — 비활성 */}
      <div style={{ position: 'absolute', left: '26px', top: '580px', width: '41px', height: '41px' }}>
        <img src={IMG_KAKAO_BG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        <div style={{ position: 'absolute', left: '6px', top: '7px', width: '29px', height: '27px', borderRadius: '100px', overflow: 'hidden' }}>
          <img src={IMG_KAKAO_LOGO} alt="" style={{ display: 'block', width: '100%', height: '107.41%', objectFit: 'cover' }} />
        </div>
      </div>
      <p style={{ ...P, position: 'absolute', left: '138.5px', top: '587px', transform: 'translateX(-50%)', fontWeight: 400, fontSize: '16.138px', lineHeight: '26.84px', letterSpacing: '-0.1083px', color: '#222', whiteSpace: 'nowrap' }}>
        카카오톡 친구 추가
      </p>

      {/* 연락처 없는 친구 추가 — 비활성 */}
      <div style={{ position: 'absolute', left: '26px', top: '643px', width: '41px', height: '41px' }}>
        <img src={IMG_PLUS_BG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        <div style={{ position: 'absolute', left: '13px', top: '13px', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={IMG_PLUS_ICON} alt="" style={{ display: 'block', width: '9.899px', height: '9.899px', transform: 'rotate(45deg)' }} />
        </div>
      </div>
      <p style={{ ...P, position: 'absolute', left: '147.5px', top: '650px', transform: 'translateX(-50%)', fontWeight: 400, fontSize: '16.138px', lineHeight: '26.84px', letterSpacing: '-0.1083px', color: '#222', whiteSpace: 'nowrap' }}>
        연락처 없는 친구 추가
      </p>

      {/* CTA 바 */}
      <div style={{ position: 'absolute', left: 0, top: '698px', width: '375px', height: '113.55px', background: 'white' }} />
      <button
        disabled={!isActive}
        onClick={() => {}}
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

      {/* ── 바텀시트 (51:2349 원본 그대로) ───────────────────────────── */}
      {sheetGroup && (
        <>
          {/* 오버레이 */}
          <div
            onClick={isClosing ? undefined : closeSheet}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.7)', zIndex: 20,
              ...overlayAnim,
            }}
          />

          {/* 시트 패널 */}
          <div
            style={{
              position: 'absolute', left: '-1px', top: '324px',
              width: '375px', height: '495px',
              background: 'white', borderRadius: '28.626px 28.626px 0 0',
              zIndex: 21, overflow: 'hidden',
              ...sheetAnim,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 드래그 핸들 */}
            <div style={{
              position: 'absolute', left: '169.8px', top: '13px',
              width: '34.351px', height: '4.771px',
              background: '#d9d9d9', borderRadius: '95.42px',
            }} />

            {/* 그룹 썸네일 (top=54) */}
            <div style={{ position: 'absolute', left: '26px', top: '54px', width: '62.059px', height: '62.059px' }}>
              <img src={IMG_SHEET_GROUP_BG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
              {[
                { img: sheetGroup.sheetInnerAvatars[0], l: '18.25px', t: '2.43px' },
                { img: sheetGroup.sheetInnerAvatars[1], l: '4.87px',  t: '28.13px' },
                { img: sheetGroup.sheetInnerAvatars[2], l: '31.78px', t: '28.13px' },
              ].filter(av => av.img).map((av, i) => (
                <img key={i} src={av.img} alt=""
                  style={{
                    position: 'absolute', left: av.l, top: av.t,
                    width: '24.482px', height: '24.482px',
                    borderRadius: '50%', objectFit: 'cover', display: 'block',
                  }}
                />
              ))}
            </div>

            {/* "함께 정산한 N명" — 실시간 선택 인원 반영 (left=108 per Figma) */}
            <p style={{
              ...P, position: 'absolute', left: '108px', top: '54px',
              fontWeight: 500, fontSize: '16px', lineHeight: '21.878px',
              letterSpacing: '-0.0883px', color: '#222', whiteSpace: 'nowrap',
            }}>
              함께 정산한 {selectedInGroup > 0 ? selectedInGroup : sheetGroup.count}명
            </p>
            <img src={IMG_EDIT} alt="" style={{
              position: 'absolute', left: '220px', top: '58px',
              width: '13.223px', height: '13.492px', display: 'block',
            }} />

            {/* AI 인사이트 칩 (left=105, top=85 per Figma) */}
            <div style={{
              position: 'absolute', left: '105px', top: '85px',
              display: 'flex', alignItems: 'center', gap: '8px',
              height: '32px', padding: '8px 17px 8px 12px',
              borderRadius: '12px', background: 'rgba(2,204,255,0.07)',
            }}>
              <img src={IMG_INSIGHT_ICON} alt="" style={{ width: '15px', height: '15px', flexShrink: 0, display: 'block' }} />
              <span style={{ ...P, fontSize: '13.5px', lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#616161', whiteSpace: 'nowrap' }}>
                {sheetGroup.insight}
              </span>
            </div>

            {/* 참여자 목록 — 탭으로 추가/해제, single source of truth */}
            <div style={{
              position: 'absolute', left: 0, right: 0,
              top: '156px', bottom: '114px',
              overflowY: 'auto', scrollbarWidth: 'none',
            }}>
              {sheetGroup.members.map(m => {
                const checked = selectedFriends.has(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleMember(m.id)}
                    style={{ position: 'relative', height: '73px', flexShrink: 0, cursor: 'pointer' }}
                  >
                    {/* 아바타 — Figma 51:2349 left=27, top=0 */}
                    <img src={m.img} alt={m.name}
                      style={{
                        position: 'absolute', left: '27px', top: '0',
                        width: '51px', height: '51px',
                        borderRadius: '50%', objectFit: 'cover', display: 'block',
                      }}
                    />
                    {/* 이름 — left=98, top=15 */}
                    <p style={{
                      ...P, position: 'absolute', left: '98px', top: '15px',
                      fontWeight: 400, fontSize: '18px', lineHeight: '21.976px',
                      letterSpacing: '-0.0887px', color: '#222', whiteSpace: 'nowrap',
                    }}>
                      {m.name}
                    </p>
                    {/* 체크 아이콘: 선택=노랑(ON), 미선택=회색(OFF) — 항상 표시 */}
                    <img
                      src={checked ? IMG_CHECK_ON : IMG_CHECK_OFF}
                      alt=""
                      style={{
                        position: 'absolute', right: '38px', top: '10px',
                        width: '32px', height: '32px', display: 'block',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* CTA "선택" — 확정 후 닫기 */}
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: '375px', height: '113.55px', background: 'white' }}>
              <button
                onClick={closeSheet}
                style={{
                  position: 'absolute',
                  left: 'calc(50% - 171.278px)', top: '20px',
                  width: '342.557px', height: '55.344px',
                  borderRadius: '13.359px',
                  background: '#ffe200', border: 'none',
                  fontFamily: 'Pretendard, sans-serif', fontWeight: 600,
                  fontSize: '16.221px', lineHeight: 1, letterSpacing: '-0.4771px',
                  color: '#222', cursor: 'pointer',
                }}
              >
                선택
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
