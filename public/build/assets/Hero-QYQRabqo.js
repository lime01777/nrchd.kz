import{R as n,j as e}from"./app-CBlk0nkr.js";/* empty css             */function h({img:a,h1:i,useGif:r=!1,useVideo:l=!1,overlay:m=!0,videoFormat:o="mp4"}){let t="";return l?t=`/img/HeroVideos/${a}.${o}`:r?t=`/img/HeroGifs/${a}.gif`:t=`/img/HeroImg/${a}.png`,n.useEffect(()=>{if((r||l)&&!document.getElementById("hero-media-styles")){const s=document.createElement("style");s.id="hero-media-styles",s.textContent=`
          .hero-gif-background {
            animation: hero-media-fade 0.1s ease-in-out infinite;
            transform-style: preserve-3d;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          
          .hero-video-background {
            object-fit: cover;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
          }
          
          @keyframes hero-media-fade {
            0%, 100% { opacity: 1; }
          }
        `,document.head.appendChild(s)}return()=>{}},[r,l]),e.jsx("section",{className:"text-gray-600 body-font relative hero-section",children:e.jsx("div",{className:"container h-screen my-auto mx-auto flex px-5 py-24 md:flex-row flex-col items-center",children:e.jsxs("div",{className:"w-full h-full",children:[l?e.jsxs("video",{className:"hero-video-background",autoPlay:!0,muted:!0,loop:!0,playsInline:!0,poster:`/img/HeroImg/${a}.png`,preload:"auto",style:{willChange:"transform",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"},children:[e.jsx("source",{src:t,type:`video/${o}`}),"Ваш браузер не поддерживает видеотег."]}):e.jsx("img",{className:`absolute inset-0 w-full h-full object-cover ${r?"hero-gif-background":""}`,alt:"hero background",src:t,style:{willChange:"opacity",imageRendering:"high-quality",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"}}),!1,e.jsx("div",{className:"relative h-full z-10 lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center",children:e.jsx("h1",{className:"title-font text-4xl my-auto font-semibold text-gray-900 text-shadow-lg",children:i})})]})})})}export{h as H};
