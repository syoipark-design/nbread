import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAmountInput } from '../hooks/useAmountInput';
import TxSelectSheet from '../components/TxSelectSheet';
import StatusBar from '../components/StatusBar';
import splitBackArrow from '../assets/split-back-arrow.svg';
import alTabPlus from '../assets/al-tab-plus.svg';
import alMoreArrow from '../assets/al-more-arrow.svg';
import nudgeXIcon from '../assets/nudge-x-icon.svg';
import splitDropdownTriangle from '../assets/split-dropdown-triangle.svg';
import splitKeypadBackspace from '../assets/split-keypad-backspace.svg';

const DIGIT_ROWS = [['1','2','3'],['4','5','6'],['7','8','9']];
const ROW_TOPS  = [551, 603, 655, 707];
const COL_LEFTS = [7, 130, 252];
const PANEL_TOP = 519;

const KEY_STYLE = {
  width: '116px', height: '47px', borderRadius: '9px',
  border: 'none', background: 'white',
  fontFamily: 'Pretendard, sans-serif',
  fontWeight: 400, fontSize: '20px',
  lineHeight: '1', letterSpacing: '-0.1182px', color: '#000',
  cursor: 'pointer',
};

const NEXT_BTN_BASE = {
  left: 'calc(50% - 171.28px)',
  width: '342.557px', height: '55.344px',
  borderRadius: '13.359px',
  fontSize: '16.221px', lineHeight: '1', letterSpacing: '-0.4771px', color: '#222',
  border: 'none',
};

const xBtnHandlers = {
  onMouseEnter: (e) => { e.currentTarget.style.filter = 'brightness(0.84)'; },
  onMouseLeave: (e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'scale(1)'; },
  onMouseDown:  (e) => { e.currentTarget.style.filter = 'brightness(0.7)'; e.currentTarget.style.transform = 'scale(0.88)'; },
  onMouseUp:    (e) => { e.currentTarget.style.filter = 'brightness(0.84)'; e.currentTarget.style.transform = 'scale(1)'; },
};

// 홈 넛지에서 진입 시 기본 칩 — TX_DATA id=1과 동일 항목
const INITIAL_TX = { id: 1, store: '손에손잡고 판교직영점', amount: '-168,000원', raw: 168000 };

export default function SplitAmount() {
  const navigate = useNavigate();
  const { formattedAmount, isEmpty, isValid, appendDigit, deleteDigit, setRawValue } = useAmountInput();
  const [selectedTxList, setSelectedTxList] = useState([INITIAL_TX]);
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  // 초기 진입 시 선택된 항목의 금액 반영
  useEffect(() => {
    setRawValue(INITIAL_TX.raw);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nextBg = isValid ? '#ffe200' : '#e5e5ea';
  const initialSelectedIds = new Set(selectedTxList.map(t => t.id));

  function handleChipRemove(txId) {
    const next = selectedTxList.filter(t => t.id !== txId);
    setSelectedTxList(next);
    const sum = next.reduce((acc, t) => acc + t.raw, 0);
    setRawValue(sum || 0);
  }

  function handleSheetSelect(txArray) {
    setSelectedTxList(txArray);
    const sum = txArray.reduce((acc, t) => acc + t.raw, 0);
    setRawValue(sum || 0);
    setShowSheet(false);
  }

  return (
    <div className="relative w-[375px] h-[812px] bg-white overflow-hidden flex-shrink-0">

      {/* ── 상태바 ── */}
      <StatusBar />

      {/* ── 뒤로가기 ── */}
      <button
        style={{
          position: 'absolute',
          left: '17.5px', top: '57px',
          width: '44px', height: '44px',
          border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 14,
        }}
        onClick={() => navigate('/')}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.6'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        aria-label="뒤로가기"
      >
        <img src={splitBackArrow} alt="" style={{ width: '9px', height: '18px', display: 'block' }} />
      </button>

      {/* ── 타이틀 ── */}
      <p className="absolute w-full text-center font-sans font-semibold not-italic text-black" style={{
        top: '66px', fontSize: '16px', lineHeight: '24.443px', letterSpacing: '-0.0986px',
      }}>1/N 빵나누기</p>

      {/* ── 금액 표시 — 탭 시 키패드 열기 ── */}
      <div
        className="absolute w-full flex items-baseline justify-center"
        style={{ top: '143px', cursor: 'pointer', zIndex: 12 }}
        onClick={() => setIsKeypadOpen(true)}
      >
        <span
          className="font-sans not-italic whitespace-nowrap"
          style={{
            fontWeight: 700, fontSize: '27.871px', lineHeight: '42.578px',
            letterSpacing: '-0.1718px',
            color: isEmpty ? '#bbb' : '#00bd65',
            borderBottom: '2px solid #e9eaea',
            paddingBottom: '1px',
          }}
        >
          {isEmpty ? '2' : formattedAmount}
        </span>
        <span
          className="font-sans not-italic whitespace-nowrap"
          style={{
            fontWeight: 600, fontSize: '25.596px', lineHeight: '39.102px',
            letterSpacing: '-0.1578px', color: '#222', marginLeft: '4px',
          }}
        >원을</span>
      </div>

      {/* ── 나눌게요 ── */}
      <p className="absolute w-full text-center font-sans not-italic" style={{
        top: '187px', fontWeight: 600, fontSize: '25.6px',
        lineHeight: '42.578px', letterSpacing: '-0.1718px', color: '#222',
      }}>나눌게요</p>

      {/* ── 범위 안내 ── */}
      <p className="absolute w-full text-center font-sans not-italic" style={{
        top: '240px', fontWeight: 400, fontSize: '13.5px',
        lineHeight: '21.976px', letterSpacing: '-0.0887px', color: '#888',
      }}>2원~100만원까지 입력 가능해요.</p>

      {/* ── 거래내역에서 선택하기 ── */}
      <button
        className="absolute flex items-center justify-center gap-[7px]"
        style={{
          left: 'calc(50% - 83px)', top: '296px', width: '166px', height: '42px',
          border: '0.8px solid #dfdfdf', borderRadius: '10px',
          paddingLeft: '18px', paddingRight: '15px',
          zIndex: 12, cursor: 'pointer', background: 'transparent',
          transition: 'background 0.15s ease, transform 0.1s ease',
        }}
        onClick={() => setShowSheet(true)}
        onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none'; }}
        onMouseDown={e => { e.currentTarget.style.background = '#ebebeb'; e.currentTarget.style.transform = 'scale(0.97)'; }}
        onMouseUp={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.transform = 'none'; }}
      >
        <div className="relative shrink-0 size-[7.5px]">
          <div className="absolute inset-[-8%]">
            <img alt="" className="block max-w-none size-full" src={alTabPlus} />
          </div>
        </div>
        <span className="font-sans not-italic whitespace-nowrap" style={{
          fontWeight: 600, fontSize: '13.154px', lineHeight: '21.878px',
          letterSpacing: '-0.0883px', color: '#222',
        }}>거래내역에서 선택하기</span>
      </button>

      {/* ── 결제 칩 리스트 (스크롤 가능) ── */}
      {selectedTxList.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '357px',
            left: 0,
            width: '375px',
            height: '312px', // 669(CTA 바 시작) - 357 = 312
            overflowY: 'auto',
            zIndex: 12,
          }}
        >
          {/* 첫 × 버튼이 frame top=397 에 맞도록 40px 여백 */}
          <div style={{ paddingTop: '40px' }}>
            {selectedTxList.map(tx => (
              <div key={tx.id} style={{ position: 'relative', height: '74px' }}>
                {/* 카드 배경 */}
                <div style={{
                  position: 'absolute',
                  left: 'calc(50% - 154.5px)', top: '8px',
                  width: '309px', height: '56px',
                  background: 'white', borderRadius: '11px',
                  boxShadow: '0px 0px 12.5px 0px rgba(199,201,205,0.3)',
                }} />
                {/* 가게명 */}
                <p className="absolute font-sans not-italic font-normal text-[#222] whitespace-nowrap" style={{
                  left: '55px', top: '27px', fontSize: '15.16px', lineHeight: 'normal',
                }}>{tx.store}</p>
                {/* 금액 */}
                <p className="absolute font-sans not-italic font-semibold text-[#222] whitespace-nowrap" style={{
                  left: '235px', top: '27px', fontSize: '15.158px', lineHeight: 'normal',
                }}>{tx.amount}</p>
                {/* × 버튼 */}
                <button
                  onClick={() => handleChipRemove(tx.id)}
                  {...xBtnHandlers}
                  style={{
                    position: 'absolute',
                    right: '23px', top: '0',
                    width: '27px', height: '27px',
                    border: 'none', padding: 0,
                    background: 'transparent', borderRadius: '50%',
                    cursor: 'pointer', zIndex: 13,
                    transition: 'filter 0.15s ease, transform 0.1s ease',
                  }}
                  aria-label="선택 해제"
                >
                  <img
                    src={alMoreArrow}
                    alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', left: '9.31px', top: '9.31px', width: '8.38px', height: '8.38px' }}>
                    <div className="absolute" style={{ inset: '-6.37%' }}>
                      <img alt="" className="block max-w-none size-full" src={nudgeXIcon} />
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── State B: 다음 버튼 (top=447, 키패드 위) ── */}
      <button
        disabled={!isValid}
        onClick={() => isValid && navigate('/split/friends', { state: { formattedAmount } })}
        className="absolute flex items-center justify-center font-sans not-italic font-semibold"
        style={{
          ...NEXT_BTN_BASE,
          top: '447px',
          background: nextBg,
          cursor: isValid ? 'pointer' : 'default',
          opacity: isKeypadOpen ? 1 : 0,
          pointerEvents: isKeypadOpen ? 'auto' : 'none',
          transition: isKeypadOpen
            ? 'opacity 0.2s ease 0.1s, background 0.2s ease'
            : 'opacity 0.15s ease, background 0.2s ease',
          zIndex: 12,
        }}
      >
        다음
      </button>

      {/* ── State A: 흰 배경 바 ── */}
      <div
        className="absolute bg-white"
        style={{
          left: 0, top: '669px', width: '375px', height: '143px',
          opacity: isKeypadOpen ? 0 : 1,
          pointerEvents: isKeypadOpen ? 'none' : 'auto',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* ── State A: 입금 받을 계좌 ── */}
      <div
        className="absolute flex items-center justify-center gap-[6px]"
        style={{
          left: 0, top: '684px', width: '375px',
          opacity: isKeypadOpen ? 0 : 1,
          pointerEvents: isKeypadOpen ? 'none' : 'auto',
          transition: 'opacity 0.2s ease',
        }}
      >
        <p className="font-sans not-italic font-normal text-[#666] whitespace-nowrap" style={{
          fontSize: '14px', lineHeight: '1', letterSpacing: '-0.0887px',
        }}>입금 받을 계좌: 이채윤의 통장(8837)</p>
        <div className="rotate-180 shrink-0 relative" style={{ width: '11px', height: '8.25px' }}>
          <div className="absolute" style={{ bottom: '25%', left: '11.85%', right: '11.85%', top: '4.26%' }}>
            <img alt="" className="block max-w-none size-full" src={splitDropdownTriangle} />
          </div>
        </div>
      </div>

      {/* ── State A: 다음 버튼 (top=718.99) ── */}
      <button
        disabled={!isValid}
        onClick={() => isValid && navigate('/split/friends', { state: { formattedAmount } })}
        className="absolute flex items-center justify-center font-sans not-italic font-semibold"
        style={{
          ...NEXT_BTN_BASE,
          top: '718.99px',
          background: nextBg,
          cursor: isValid ? 'pointer' : 'default',
          opacity: isKeypadOpen ? 0 : 1,
          pointerEvents: isKeypadOpen ? 'none' : 'auto',
          transition: 'opacity 0.2s ease, background 0.2s ease',
        }}
      >
        다음
      </button>

      {/* ── 투명 오버레이 — 키패드 영역 바깥 탭 시 닫기 ── */}
      {isKeypadOpen && (
        <div
          className="absolute"
          style={{ top: 0, left: 0, right: 0, bottom: '296px', zIndex: 11 }}
          onClick={() => setIsKeypadOpen(false)}
        />
      )}

      {/* ── 키패드 패널 — 슬라이드업 ── */}
      <div
        className="absolute"
        style={{
          left: 0, top: `${PANEL_TOP}px`, width: '375px', height: '296px',
          background: '#e2e4e7',
          borderRadius: '25px 25px 0 0',
          transform: isKeypadOpen ? 'translateY(0)' : 'translateY(296px)',
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
          zIndex: 20,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {DIGIT_ROWS.map((row, rowIdx) =>
          row.map((key, colIdx) => (
            <button
              key={key}
              onClick={() => appendDigit(key)}
              className="absolute flex items-center justify-center"
              style={{
                ...KEY_STYLE,
                left: `${COL_LEFTS[colIdx]}px`,
                top: `${ROW_TOPS[rowIdx] - PANEL_TOP}px`,
              }}
            >
              {key}
            </button>
          ))
        )}

        <button
          onClick={() => appendDigit('0')}
          className="absolute flex items-center justify-center"
          style={{ ...KEY_STYLE, left: `${COL_LEFTS[1]}px`, top: `${ROW_TOPS[3] - PANEL_TOP}px` }}
        >
          0
        </button>

        <button
          onClick={deleteDigit}
          className="absolute flex items-center justify-center"
          style={{
            ...KEY_STYLE,
            left: `${COL_LEFTS[2]}px`,
            top: `${ROW_TOPS[3] - PANEL_TOP}px`,
            background: 'transparent',
          }}
          aria-label="지우기"
        >
          <img src={splitKeypadBackspace} alt="" style={{ width: '23px', height: '19px' }} />
        </button>
      </div>

      {/* ── 거래내역 선택 바텀시트 ── */}
      <TxSelectSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        onSelect={handleSheetSelect}
        initialSelectedIds={initialSelectedIds}
      />

    </div>
  );
}
