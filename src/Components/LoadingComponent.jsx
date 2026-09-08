export default function LoadingComponent ({ text = 'Loading...' }) {
  return (
    <div className='truck-loader'>
      <div className='truck-animation'>
        {/* Motion lines */}
        <span className='motion-line line-1' />
        <span className='motion-line line-2' />

        {/* Truck */}
        <div className='truck'>
          <div className='cargo'>
            <div className='cargo-lines' />
            <div className='logo'>RM</div>
          </div>

          <div className='cab'>
            <div className='roof' />
            <div className='window' />
            <div className='door-handle' />
            <div className='headlight' />
          </div>

          <div className='chassis' />

          <div className='wheel wheel-back'>
            <div className='wheel-center' />
          </div>

          <div className='wheel wheel-front'>
            <div className='wheel-center' />
          </div>
        </div>

        {/* Road */}
        <div className='road'>
          <div className='road-lines'>
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>

      {text && <div className='truck-loader-text'>{text}</div>}

      <style>{`
        .truck-loader {
          display: inline-flex;
          flex-direction: column;
          align-items: center;

          width: 260px;
          padding: 12px 16px;

          box-sizing: border-box;
        }

        .truck-animation {
          position: relative;

          width: 230px;
          height: 95px;

          overflow: hidden;
        }

        /* =====================
           TRUCK
        ===================== */

        .truck {
          position: absolute;

          left: 42px;
          bottom: 20px;

          width: 155px;
          height: 66px;

          animation: truckBounce .55s ease-in-out infinite alternate;
        }

        /* Cargo */

        .cargo {
          position: absolute;

          left: 0;
          top: 3px;

          width: 92px;
          height: 48px;

          background: #fff;

          border: 2.5px solid #111c2f;
          border-radius: 5px 4px 2px 2px;

          box-sizing: border-box;
        }

        .cargo::after {
          content: "";

          position: absolute;

          left: 0;
          bottom: 5px;

          width: 100%;
          height: 2px;

          background: #111c2f;
        }

        .cargo-lines {
          position: absolute;

          left: 10px;
          top: 12px;

          width: 19px;
          height: 2px;

          background: #cbd5e1;

          box-shadow: 0 6px 0 #cbd5e1;
        }

        .logo {
          position: absolute;

          right: 8px;
          top: 10px;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 24px;
          height: 24px;

          border-radius: 5px;

          background: #111c2f;
          color: white;

          font-size: 8px;
          font-weight: 700;
        }

        /* =====================
           CAB
        ===================== */

        .cab {
          position: absolute;

          left: 90px;
          top: 21px;

          width: 54px;
          height: 31px;

          background: #fff;

          border: 2.5px solid #111c2f;

          border-radius: 2px 9px 4px 2px;

          box-sizing: border-box;
        }

        .roof {
          position: absolute;

          left: 5px;
          top: -17px;

          width: 31px;
          height: 18px;

          background: #fff;

          border-left: 2.5px solid #111c2f;
          border-top: 2.5px solid #111c2f;

          border-radius: 4px 7px 0 0;

          transform: skewX(17deg);
        }

        .window {
          position: absolute;

          left: 11px;
          top: -13px;

          width: 20px;
          height: 13px;

          background: #e8edf4;

          border: 2px solid #111c2f;

          border-radius: 2px 5px 1px 1px;

          transform: skewX(16deg);
        }

        .door-handle {
          position: absolute;

          left: 14px;
          top: 8px;

          width: 7px;
          height: 2px;

          background: #111c2f;

          border-radius: 3px;
        }

        .headlight {
          position: absolute;

          right: -4px;
          bottom: 6px;

          width: 5px;
          height: 6px;

          background: #fff;

          border: 2px solid #111c2f;

          border-radius: 2px;
        }

        /* =====================
           CHASSIS
        ===================== */

        .chassis {
          position: absolute;

          left: 0;
          bottom: 13px;

          width: 150px;
          height: 4px;

          background: #111c2f;

          border-radius: 4px;
        }

        /* =====================
           WHEELS
        ===================== */

        .wheel {
          position: absolute;

          bottom: 0;

          width: 25px;
          height: 25px;

          box-sizing: border-box;

          background: #fff;

          border: 3px solid #111c2f;
          border-radius: 50%;

          animation: wheelSpin .65s linear infinite;
        }

        .wheel-back {
          left: 20px;
        }

        .wheel-front {
          right: 16px;
        }

        .wheel-center {
          position: absolute;

          inset: 5px;

          border: 2px solid #64748b;
          border-radius: 50%;
        }

        .wheel-center::after {
          content: "";

          position: absolute;

          left: 50%;
          top: -4px;

          width: 2px;
          height: 12px;

          background: #64748b;

          transform: translateX(-50%);
        }

        /* =====================
           ROAD
        ===================== */

        .road {
          position: absolute;

          left: 10px;
          right: 10px;
          bottom: 13px;

          height: 2px;

          background: #cbd5e1;

          overflow: hidden;
        }

        .road-lines {
          position: absolute;

          left: -50px;
          top: 0;

          display: flex;
          gap: 20px;

          width: 400px;

          animation: roadMove .7s linear infinite;
        }

        .road-lines i {
          display: block;

          width: 26px;
          height: 2px;

          flex-shrink: 0;

          background: #111c2f;
        }

        /* =====================
           MOTION LINES
        ===================== */

        .motion-line {
          position: absolute;

          left: 14px;

          height: 2px;

          background: #94a3b8;

          border-radius: 10px;

          animation: motionLine .8s ease-out infinite;
        }

        .line-1 {
          top: 41px;
          width: 22px;
        }

        .line-2 {
          top: 50px;
          width: 13px;

          animation-delay: .15s;
        }

        /* =====================
           TEXT
        ===================== */

        .truck-loader-text {
          margin-top: 2px;

          color: #64748b;

          font-size: 13px;
          font-weight: 500;
          line-height: 18px;
        }

        /* =====================
           ANIMATION
        ===================== */

        @keyframes wheelSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes roadMove {
          to {
            transform: translateX(-46px);
          }
        }

        @keyframes truckBounce {
          from {
            transform: translateY(0);
          }

          to {
            transform: translateY(-1.5px);
          }
        }

        @keyframes motionLine {
          0% {
            opacity: 0;
            transform: translateX(12px);
          }

          40% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translateX(-10px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .truck,
          .wheel,
          .road-lines,
          .motion-line {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
