import { useNavigate } from 'react-router-dom';
import nudgeBreadIcon from '../assets/nudge-bread-icon.png';
import nudgeXIcon from '../assets/nudge-x-icon.svg';
import nudgeRainbowMask from '../assets/nudge-rainbow-mask.svg';
import nudgeRainbowBg from '../assets/nudge-rainbow-bg.svg';

export default function AiNudgeCard({ onClose, visible }) {
  const navigate = useNavigate();
  return (
    <div
      className="relative w-[345px] h-[198px] rounded-[24px] bg-white overflow-hidden"
      style={{
        border: '0.6px solid #ffdd01',
        boxShadow:
          '0px 6px 18px 0px rgba(115,184,229,0.1), 0px 4px 16px 0px rgba(229,209,89,0.16)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-12px)',
        transition: visible
          ? 'opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s'
          : 'opacity 0.25s ease-in, transform 0.25s ease-in',
      }}
    >
      {/* 무지개 데코 — node 1:190: card-relative left=3, top=33, w=336, h=103 */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '3px',
          top: '33px',
          width: '336px',
          height: '103px',
          maskImage: `url(${nudgeRainbowMask})`,
          WebkitMaskImage: `url(${nudgeRainbowMask})`,
          maskMode: 'alpha',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
          maskClip: 'no-clip',
          maskRepeat: 'no-repeat',
          maskPosition: '-21px -45px',
          maskSize: '381px 234px',
        }}
      >
        <div className="absolute" style={{ inset: '-97.09% -35.54% -115.92% -29.76%' }}>
          <img alt="" className="block max-w-none size-full" src={nudgeRainbowBg} />
        </div>
      </div>

      {/* 식빵 아이콘 — node 1:193: card-relative left=23, top=26, size=23 */}
      <div className="absolute overflow-hidden" style={{ left: '23px', top: '26px', width: '23px', height: '23px' }}>
        <img
          alt=""
          className="absolute max-w-none"
          style={{ height: '106.3%', left: '-2.34%', top: '-6.3%', width: '104.82%' }}
          src={nudgeBreadIcon}
        />
      </div>

      {/* 제목 — node 1:194: card-relative left=64, top=28, SemiBold 16px #222 */}
      <p
        className="absolute font-sans font-semibold text-[16px] leading-[normal] text-[#222] whitespace-nowrap"
        style={{ left: '62px', top: '28px' }}
      >
        오늘 저녁, 친구들과 함께 하셨나요?
      </p>

      {/* X 버튼 — node 1:195: card-relative left=311, top=33, size=9 */}
      <button
        onClick={onClose}
        className="absolute"
        style={{ left: '311px', top: '33px', width: '9px', height: '9px' }}
        aria-label="닫기"
      >
        <div className="absolute" style={{ inset: '-6.67%' }}>
          <img alt="" className="block max-w-none size-full" src={nudgeXIcon} />
        </div>
      </button>

      {/* 결제 내역 박스 — node 1:201: card-relative left=18, top=68, w=309, h=56 */}
      <div
        className="absolute bg-white rounded-[11px]"
        style={{ left: '18px', top: '68px', width: '309px', height: '56px' }}
      >
        {/* 가게명 — node 1:202: box-relative left=22, top=19 */}
        <p
          className="absolute font-sans font-normal text-[15.16px] leading-[normal] text-[#222] whitespace-nowrap"
          style={{ left: '22px', top: '19px' }}
        >
          손에손잡고 판교직영점
        </p>
        {/* 금액 — node 1:203: box-relative left=208, top=19 */}
        <p
          className="absolute font-sans font-semibold text-[15.158px] leading-[normal] text-[#222] whitespace-nowrap"
          style={{ left: '208px', top: '19px' }}
        >
          -163,800원
        </p>
      </div>

      {/* 1/N빵 나누기 버튼 — node 1:198: card-relative left=18, top=136, w=309, h=44 */}
      <button
        onClick={() => navigate('/split')}
        className="absolute flex items-center justify-center rounded-[12px]"
        style={{ left: '18px', top: '136px', width: '309px', height: '44px', background: '#ffe200', border: 'none', cursor: 'pointer' }}
      >
        <p className="font-sans font-semibold text-[15px] leading-[normal] text-[#26282b] tracking-[-0.2px] whitespace-nowrap">
          1/N빵 나누기
        </p>
      </button>
    </div>
  );
}
