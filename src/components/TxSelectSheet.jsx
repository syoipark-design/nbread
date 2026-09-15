import { useState, useRef, useEffect } from 'react';
import sheetAiIcon from '../assets/sheet-ai-icon.png';
import sheetCheckSelected from '../assets/sheet-check-selected.svg';
import sheetCheckUnselected from '../assets/sheet-check-unselected.svg';

const COMPACT_TOP = 292;
const EXPANDED_TOP = 78;
const SCREEN_H = 812;
// 고정 헤더: drag handle(y=9) + 내 거래내역(y=35) + 이채윤의 통장(y=74) — AI 문구 이후는 스크롤
const HEADER_H = 100;
const CTA_H = 114;

// scroll-relative positions = y_frame - 292 (sheet top) - 100 (header) = y_frame - 392
// AI icon: 418-392=26 / AI text: 420-392=28
// AI rows: first store 470-392=78, row height 62.5px
// Divider: 663-392=271
// MORE rows: first store 691-392=299, row height 65px
const AI_ROW_START = 78;
const AI_ROW_H = 62.5;
const DIVIDER_SCROLL_TOP = 271;
const MORE_ROW_START = 299;
const MORE_ROW_H = 65;
const SCROLL_CONTENT_H = 950;

const AI_ITEMS = [
  { id: 1, store: '손에손잡고 판교직영점', date: '2026.09.11', amount: '-168,000원', raw: 168000 },
  { id: 2, store: '커피미학 판교점',       date: '2026.09.11', amount: '-31,000원',  raw: 31000  },
  { id: 3, store: '세븐스타코인노래연습장', date: '2026.09.11', amount: '-25,000원',  raw: 25000  },
];

const MORE_ITEMS = [
  { id: 5,  store: '카카오T',           date: '2026.09.11', amount: '-18,400원', raw: 18400 },
  { id: 6,  store: 'GS25 판교역점',     date: '2026.09.11', amount: '-6,800원',  raw: 6800  },
  { id: 7,  store: '네이버페이',         date: '2026.09.11', amount: '-12,900원', raw: 12900 },
  { id: 8,  store: '올리브영 신촌역점',  date: '2026.09.10', amount: '-18,600원', raw: 18600 },
  { id: 9,  store: '박서현',            date: '2026.09.10', amount: '-9,700원',  raw: 9700  },
  { id: 10, store: 'CU 왕십리역점',     date: '2026.09.10', amount: '-2,800원',  raw: 2800  },
  { id: 11, store: '최애적금(0113)',     date: '2026.09.10', amount: '-10,000원', raw: 10000 },
  { id: 12, store: '카카오페이',         date: '2026.09.09', amount: '-24,430원', raw: 24430 },
  { id: 13, store: '장유나',            date: '2026.09.09', amount: '-15,800원', raw: 15800 },
  { id: 14, store: '네이버페이충전',     date: '2026.09.09', amount: '-10,000원', raw: 10000 },
];

const P = {
  fontFamily: 'Pretendard, sans-serif',
  fontStyle: 'normal',
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
  margin: 0,
};

// Figma row layout (모든 좌표는 row 내 relative):
//   store:  left=26, top=0,  Regular 15px #222
//   date:   left=26, top=25, Regular 12.6px #8d8d8d
//   amount: right=67px (=375-308, Figma -translate-x-full left-[308px]), top=11, Bold 15px #222
//   check:  left=322, top=7, 27×27
function TxRow({ tx, isSelected, onClick, rowTop, rowH }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute', left: 0, top: `${rowTop}px`,
        width: '375px', height: `${rowH}px`,
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        display: 'block',
      }}
    >
      <p style={{ ...P, position: 'absolute', left: '26px', top: 0,
        fontWeight: 400, fontSize: '15px', color: '#222' }}>{tx.store}</p>
      <p style={{ ...P, position: 'absolute', left: '26px', top: '25px',
        fontWeight: 400, fontSize: '12.6px', color: '#8d8d8d' }}>{tx.date}</p>
      <p style={{ ...P, position: 'absolute', right: '67px', top: '11px',
        fontWeight: 700, fontSize: '15px', color: '#222', textAlign: 'right' }}>{tx.amount}</p>
      <img
        src={isSelected ? sheetCheckSelected : sheetCheckUnselected}
        alt=""
        style={{ position: 'absolute', left: '322px', top: '7px', width: '27px', height: '27px', display: 'block' }}
      />
    </button>
  );
}

export default function TxSelectSheet({ open, onClose, onSelect, initialSelectedIds }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [expanded, setExpanded] = useState(false);
  const dragRef = useRef({ startY: 0 });

  useEffect(() => {
    if (open) setSelectedIds(new Set(initialSelectedIds));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setExpanded(false), 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  const sheetTop = expanded ? EXPANDED_TOP : COMPACT_TOP;
  const sheetH = SCREEN_H - sheetTop;
  const allTx = [...AI_ITEMS, ...MORE_ITEMS];
  const selectedTxArray = allTx.filter(t => selectedIds.has(t.id));
  const selectedSum = selectedTxArray.reduce((acc, t) => acc + t.raw, 0);

  function handleToggle(tx) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(tx.id)) next.delete(tx.id); else next.add(tx.id);
      return next;
    });
  }

  function handleConfirm() {
    if (selectedIds.size === 0) return;
    onSelect(selectedTxArray);
  }

  function handlePointerDown(e) { dragRef.current.startY = e.clientY; }
  function handlePointerUp(e) {
    const delta = e.clientY - dragRef.current.startY;
    if (expanded) {
      if (delta > 60) setExpanded(false);
    } else {
      if (delta < -60) setExpanded(true);
      else if (delta > 60) onClose();
    }
  }

  return (
    <>
      {/* 딤 오버레이 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.6)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
          zIndex: 30,
        }}
        onClick={onClose}
      />

      {/* 시트 패널 */}
      <div
        className="absolute left-0 bg-white"
        style={{
          top: `${sheetTop}px`,
          width: '375px',
          height: `${sheetH}px`,
          borderRadius: '28.626px 28.626px 0 0',
          transform: open ? 'translateY(0)' : `translateY(${SCREEN_H}px)`,
          transition: [
            'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
            'top 0.35s cubic-bezier(0.16,1,0.3,1)',
            'height 0.35s cubic-bezier(0.16,1,0.3,1)',
          ].join(', '),
          zIndex: 31,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 고정 헤더 — Figma 13:1280, 13:1282, 13:1281 */}
        <div style={{ position: 'relative', flexShrink: 0, height: `${HEADER_H}px` }}>
          {/* drag handle — Figma: left=170.8, top=301-292=9 */}
          <div
            style={{
              position: 'absolute',
              left: '170.8px', top: '9px',
              width: '34.351px', height: '4.771px',
              background: '#eaebef', borderRadius: '95.42px',
              cursor: 'grab',
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          />
          {/* 내 거래내역 — Figma: left=68, top=327-292=35, translateX(-50%), SemiBold 18.498px */}
          <p style={{
            ...P,
            position: 'absolute', left: '68px', top: '35px',
            transform: 'translateX(-50%)',
            fontWeight: 600, fontSize: '18.498px',
            lineHeight: '30.112px', letterSpacing: '-0.1215px',
            color: '#000', textAlign: 'center',
          }}>내 거래내역</p>
          {/* 이채윤의 통장 — Figma: left=26, top=366-292=74, Regular 14px #555 */}
          <p style={{
            ...P,
            position: 'absolute', left: '26px', top: '74px',
            fontWeight: 400, fontSize: '14px', color: '#555',
          }}>이채윤의 통장</p>
        </div>

        {/* 스크롤 영역 */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
          <div style={{ position: 'relative', height: `${SCROLL_CONTENT_H}px` }}>

            {/* AI 아이콘 + 문구 — 거래내역 행 left=26 기준 정렬 */}
            <div style={{ position: 'absolute', left: '26px', top: '26px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={sheetAiIcon} alt="" style={{ display: 'block', width: '23px', height: '23px', objectFit: 'cover', pointerEvents: 'none', flexShrink: 0 }} />
              <p style={{
                ...P,
                fontWeight: 600, fontSize: '16px', color: '#00CCFF',
              }}>정산이 필요할 것 같은 내역을 모아봤어요.</p>
            </div>

            {/* AI 추천 거래내역 3개 — row start y=78, height=62.5 */}
            {AI_ITEMS.map((tx, i) => (
              <TxRow
                key={tx.id}
                tx={tx}
                isSelected={selectedIds.has(tx.id)}
                onClick={() => handleToggle(tx)}
                rowTop={AI_ROW_START + i * AI_ROW_H}
                rowH={AI_ROW_H}
              />
            ))}

            {/* 구분선 — Figma 13:1392: centered 323px, top=663-392=271 */}
            <div style={{
              position: 'absolute', left: '26px', top: `${DIVIDER_SCROLL_TOP}px`,
              width: '323px', height: '1px', background: '#ebebeb',
            }} />

            {/* 나머지 거래내역 — row start y=299, height=65 */}
            {MORE_ITEMS.map((tx, i) => (
              <TxRow
                key={tx.id}
                tx={tx}
                isSelected={selectedIds.has(tx.id)}
                onClick={() => handleToggle(tx)}
                rowTop={MORE_ROW_START + i * MORE_ROW_H}
                rowH={MORE_ROW_H}
              />
            ))}
          </div>
        </div>

        {/* 고정 CTA — Figma 8:628~632: bg #e5e5e6 비활성, #ffe200 활성 */}
        <div style={{
          flexShrink: 0, height: `${CTA_H}px`, background: '#fff',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          paddingTop: '20px',
        }}>
          <button
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
            style={{
              width: '342.557px', height: '55.344px',
              borderRadius: '13.359px',
              background: selectedIds.size > 0 ? '#ffe200' : '#e5e6e6',
              border: 'none',
              fontFamily: 'Pretendard, sans-serif',
              fontWeight: 600, fontSize: '16.221px',
              lineHeight: 1, letterSpacing: '-0.4771px',
              color: selectedIds.size > 0 ? '#222' : '#999',
              cursor: selectedIds.size > 0 ? 'pointer' : 'default',
              transition: 'background 0.2s ease',
            }}
          >
            {selectedIds.size > 0
              ? `총 ${selectedSum.toLocaleString('ko-KR')}원 나누기`
              : '총 0원 나누기'}
          </button>
        </div>
      </div>
    </>
  );
}
