import React, { useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Error404Page = () => {
  const navigate = useNavigate();


  useEffect(() => {
    toast.error('Page not found');
  }, []);
  
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');
        
        :root {
          /* New theme colors based on #7494ec */
          --c0: #9cbaff; /* Lighter shade for background */
          --c1: #7494ec; /* Your target main color */
          --c2: #5c7ee0; /* Slightly darker */
          --c3: #5270d4; /* Darker */
          --c4: #3f5aa7; /* Even darker */
          --c5: #2e437c; /* Darker blue */
          --c6: #1e2c52; /* Darkest blue */

          --clr: 1; /* change color from 1 to 12 */
          --hue: calc(30deg - (30deg * var(--clr))); 
        }

        body {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000vmin;
          font-family: 'Varela Round', Arial, Helvetica, serif;
          background: var(--c0); /* This will now be #9cbaff */
        }

        body * {
          transform-style: preserve-3d;
        }

        .cuboid {
          --size: 250;
          --height: var(--size);
          --width: var(--size);
          --depth: var(--size);
          height: calc(var(--size) * 1vmin);
          width: calc(var(--size) * 1vmin);
          position: absolute;
          transform: rotateX(50deg) rotate(45deg);
          pointer-events: none;
        }

        .cuboid .side {
          position: absolute;
          top: 50%;
          left: 50%;
          height: 100%;
          width: 100%;
          border-radius: 2px;
          box-shadow: 0vmin 0vmin 0.5vmin 0 var(--c0) inset, 0 0 5vmin 0 var(--c0);
        }

        .cuboid .side:nth-of-type(1) {
          transform: translate3d(-50%, -50%, calc(var(--size) * -0.5vmin)) rotateY(180deg);
          background: radial-gradient(circle at 100% 0%, var(--c4), #fff0 45vmin),radial-gradient(circle at 100% 0%, var(--c1), var(--c4));
        }
         
        .cuboid .side:nth-of-type(2) {
          width: calc(var(--size) * 1vmin);
          transform: translate(-50%, -50%) rotateY(-90deg) translate3d(0, 0, calc(var(--size) * 0.5vmin));
          background: radial-gradient(circle at 0% 0%, var(--c4), #fff0 45vmin),radial-gradient(circle at 0% 0%, var(--c2), var(--c5));
        }

        .cuboid .side:nth-of-type(3) {
          height: calc(var(--size) * 1vmin);
          transform: translate(-50%, -50%) rotateX(90deg) translate3d(0, 0, calc(var(--size) * 0.5vmin));
          background: radial-gradient(circle at 0% 0%, var(--c4), #fff0 45vmin), radial-gradient(circle at 0% 0%, var(--c1), var(--c6));
        }

        .room {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          filter: hue-rotate(var(--hue));
        }

        .oops {
          width: 100%;
          text-align: center;
          font-size: 2.25vmin;
          transform: rotateX(21deg);
          transform-origin: 100% 50%;
          top: 10%;
          position: absolute;
          left: 0;
        }

        .oops h2 {
          color: #fff2;
          float: left;
          transform-origin: 100% 50%;
          transform: rotateY(-60deg) scaleX(1.5);
          margin: -5vmin 0 0 -5vmin;
          font-size: 14vmin;
          width: 50%;
          /* Updated text-shadow to reflect new colors */
          text-shadow: 0px 2px 1px #b7caff, -1px 1px 2px #b7caff80, -1px -1px 2px var(--c4), -2px -2px 2px var(--c4), -3px -3px 2px var(--c4), -4px -4px 2px var(--c4), -5px -5px 2px var(--c4), -6px -6px 2px var(--c4), -7px -7px 2px var(--c4), -8px -8px 2px var(--c4), -9px -9px 2px var(--c4), -10px -10px 2px var(--c4), -11px -11px 2px var(--c4), -12px -12px 2px var(--c4), -13px -13px 2px var(--c4), -14px -14px 2px var(--c4), -15px -15px 2px var(--c4), -16px -16px 2px var(--c4), -16px -16px 2px var(--c6), -10px -10px 8px var(--c6), -6px -15px 13px var(--c6);
        }

        .oops p {
          float: right;
          color: #fff4;
          transform-origin: 0% 50%;
          transform: rotateY(60deg) scaleX(1.5);
          margin-top: -4vmin;
          margin-right: -2vmin;
          font-size: 5vmin;
          max-width: 50vmin;
          width: 50%;
          /* Updated text-shadow to reflect new colors */
          text-shadow: 0px 2px 1px #b7caff, -1px 1px 2px #b7caff80, 1px -1px 2px var(--c4), 2px -2px 2px var(--c4), 3px -3px 2px var(--c4), 4px -4px 2px var(--c4), 5px -5px 2px var(--c4), 6px -6px 2px var(--c4), 7px -7px 2px var(--c4), 8px -8px 2px var(--c4), 6px -6px 7px var(--c6), 6px -6px 7px var(--c6);
        }

        .center-line {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .hole {
          width: 28vmin;
          height: 20vmin;
          background: 
            radial-gradient(circle at 50% 0%, var(--c2), #fff0 45%), 
            radial-gradient(circle at 30% 100%, #152d5e, #fff0 77%), /* Adjusted this dark blue */
            radial-gradient(circle at 20% 100%, var(--c3), var(--c2), var(--c2));
          border-radius: 100%;
          box-shadow: 0 -2px 4px -2px #fffc, 0 2px 3px -3px #fffc inset, 0 2px 6px -4px #000;
          overflow: hidden;
          position: relative;
          margin-top: 30vmin;
        }

        .ladder,
        .ladder-shadow {
          --shadow: #0008;
          background: 
            linear-gradient(180deg, #fff0 33%, var(--shadow), #000), 
            linear-gradient(90deg, #cec3b9 0 1.2vmin, #b3aba2 0 1.5vmin, #fff0 0 100%), 
            linear-gradient(90deg, #cec3b9 0 1.2vmin, #b3aba2 0 1.75vmin, #fff0 0 calc(100% - 1.75vmin)), 
            repeating-linear-gradient(0deg, #cec3b9 0 1.2vmin, #e7dbcf 0 1.75vmin, #fff0 0 6.75vmin), 
            linear-gradient(90deg, #cec3b9 0 1.2vmin, #b3aba2 0 1.75vmin, #fff0 0 calc(100% - 1.75vmin));
          width: 10vmin;
          height: 30vmin;
          margin-left: 14vmin;
          position: absolute;
          top: 0vmin;
          transform: rotate3d(4, 1, 1, 45deg) skew(0deg, 20deg);
          background-position: 0 0, 0 0, 8.25vmin 0, 0 -3.25vmin, 0 0;
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }

        .ladder-shadow {
          filter: invert(1) blur(1px) opacity(0.4) contrast(5);
          transform: rotate3d(2, 1, 1, 45deg) rotate(-10deg) translate(1.15vmin, 1.9vmin) skew(0deg, 20deg);
          --shadow: #0000;
        }

        .ladder:before, 
        .ladder:after {
          content: "";
          position: absolute;
          background: linear-gradient(210deg, #fff0 0.4vmin, #e7dbcf calc(0.35vmin + 1px) 1.45vmin, #b3aba2 calc(1.4vmin + 1px) 100%);
          width: 0.85vmin;
          height: 1.75vmin;
          transform-origin: 0 1%;
          transform: rotate(-90deg);
          top: 1px;
        }

        .ladder:after {
          left: 8.25vmin;
        }

        .four {
          font-size: 45vmin;
          font-weight: bold;
          font-family: Arial, Helvetica, serif;
          position: absolute;
          margin-left: -58vmin;
          margin-top: 27vmin;
          transform: rotate(22deg) scale(0.8, 0.85) rotateX(40deg) rotateY(-10deg) rotateZ(-5deg);
          /* Updated text-shadow to reflect new colors */
          text-shadow: 0px 2px 1px #b7caff, -1px 1px 2px #b7caff80, 1px 2px 2px var(--c3), 2px 4px 2px var(--c3), 4px 6px 2px var(--c3), 5px 8px 2px var(--c3), 6px 10px 2px var(--c3), 7px 12px 2px var(--c3), 8px 14px 2px var(--c3), 9px 16px 2px var(--c3), 10px 18px 2px var(--c3), 11px 20px 3px var(--c3), 12px 22px 3px var(--c3), 13px 22px 10px var(--c6), 18px 14px 15px var(--c6);
          color: var(--c1); /* This will now be #7494ec */
          filter: drop-shadow(10px -4px 10px var(--c4));
        }

        .four + .four {
          margin-left: 43vmin;
          margin-top: 15vmin;
          transform: scale(0.95, 0.75) rotateX(5deg) rotateY(35deg) rotateZ(30deg) translateZ(18vmin);
          /* Updated text-shadow to reflect new colors */
          text-shadow: 1px 0px 2px #b7caff, 3px 0px 2px #b7caff80, 1px 0px 0px var(--c3), 2px 0px 2px var(--c3), 4px 0px 2px var(--c3), 5px 0px 2px var(--c3), 6px 0px 2px var(--c3), 7px 0px 2px var(--c3), 8px 0px 2px var(--c3), 9px 0px 2px var(--c3), 10px 0px 2px var(--c3), 11px 0px 3px var(--c3), 12px 0px 3px var(--c3), 20px 0px 3px var(--c3), 13px 0px 5px var(--c6), 18px -6px 15px var(--c6);
        }

        .four + .four:before,
        .four + .four:after {
          content: "4";
          color: var(--c6);
          position: absolute;
          transform-origin: 60% 0%;
          transform: rotateX(27deg) rotate(-20deg) translate(-0.5vmin, 0.5vmin) skew(0deg, 20deg);
          transform-style: preserve-3d;
          text-shadow: none;
          z-index: -1;
          clip-path: polygon(0 0, 100% 0, 100% 50%, 0 46%, 0 0);
          filter: blur(5px);
          opacity: 0.4;
        }

        .four + .four:after {
          transform-origin: 50% 100%;
          transform: rotatex(12deg) rotate(-13deg) translate(-27.5vmin, -5.5vmin) skew(-32deg, 6deg) scaleX(1.1);
          clip-path: polygon(0 39.75%, 100% 49.25%, 100% 100%, 0 100%, 0 50%);
        }

        .btn {
          position: absolute;
          bottom: -15vmin;
          transform-origin: 50% 0%;
          transform: rotateX(15deg);
        }

        .btn a {
          border-radius: 0.2vmin;
          padding: 1.5vmin 2.5vmin;
          background: #7494ec; /* Directly set the button background to your target color */
          text-decoration: none;
          color: #fff9;
          top: 0;
          font-size: 3vmin;
          /* Updated text-shadow to reflect new colors */
          text-shadow: 0px -2px 2px var(--c0), 0px 1px 3px var(--c6);
          position: relative;
          transition: all 0.25s linear 0s;
          box-shadow: 1px 0px 1px #b7caff, 0px 2px 2px #b7caff80, 0px 1px 2px var(--c3), 0px 4px 2px var(--c3), 0px 6px 2px var(--c3), 0px 8px 2px var(--c3), 0px 10px 2px var(--c3), 0px 12px 2px var(--c3), 0px 14px 2px var(--c3), 0px 16px 2px var(--c3), 0px 18px 2px var(--c3), 0px 20px 3px var(--c3), 2px 22px 3px var(--c3), 0px 23px 3px var(--c6), 0px 3px 15px var(--c6);
        }

        .btn a:hover {
          top: 16px;
          color: var(--c6);
          /* Updated box-shadow to reflect new colors */
          box-shadow: 1px 0px 1px #b7caff, 0px 2px 2px #b7caff80, 0px 1px 2px var(--c3), 0px 1px 2px var(--c3), 0px 2px 2px var(--c3), 0px 2px 2px var(--c3), 0px 2px 2px var(--c3), 0px 2px 2px var(--c3), 0px 2px 3px var(--c3), 0px 2px 3px var(--c3), 0px 2px 2px var(--c3), 0px 2px 3px var(--c3), 2px 2px 3px var(--c3), 0px 4px 3px var(--c6), 2px 5px 6px var(--c6);
        } 

        .btn::after {
          content: "";
          position: absolute;
          background: var(--c4);
          width: 100%;
          height: 300%;
          left: 0;
          top: 0;
          transform: translateZ(-2vmin) skew(-10deg, 0deg) translateY(-4.5vmin) translateX(1vmin);
          filter: blur(5px);
          transition: all 0.5s ease 0s;
          opacity: 0.35;
        }

        .btn:hover::after {
          background: #0000;
          width: 100%;
          height: 20%;
          left: 0;
          top: 0;
          transform: translateZ(-2vmin) skew(-0deg, 0deg) translateY(0vmin) translateX(0vmin);
        } 

        @media screen and (orientation: portrait) {
          .oops p { 
            line-height: 10vmin; 
            font-size: 6.5vmin; 
          }
        }
      `}</style>
      
      <div className="room">
        <div className="cuboid">
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
        </div>
        <div className="oops">
          <h2>OOPS!</h2>
          <p>We can't find the page that you're looking for :(</p>
        </div>
        <div className="center-line">
          <div className="hole">
            <div className="ladder-shadow"></div>
            <div className="ladder"></div>
          </div>
          <div className="four">4</div>
          <div className="four">4</div>
          <div className="btn">
            <a href="#" onClick={(e) => {
              e.preventDefault();
              navigate('/home'); 
            }}>
              BACK TO HOME
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error404Page;