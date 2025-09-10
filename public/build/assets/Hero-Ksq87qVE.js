import{r as n,j as t}from"./app-Dl-yhTez.js";/* empty css             */function h({img:l,h1:c,useGif:s=!1,useVideo:a=!1,overlay:d=!0,videoFormat:i="mp4"}){const e=n.useRef(null);let r="";return a?r=`/img/HeroVideos/${l}.${i}`:s?r=`/img/HeroGifs/${l}.gif`:r=`/img/HeroImg/${l}.png`,n.useEffect(()=>{if(a&&e.current)return e.current.load(),e.current.play(),()=>{e.current&&(e.current.pause(),e.current.src="",e.current.load())}},[a,r]),n.useEffect(()=>{if((s||a)&&!document.getElementById("hero-media-styles")){const o=document.createElement("style");o.id="hero-media-styles",o.textContent=`
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
        `,document.head.appendChild(o)}return()=>{}},[s,a]),t.jsx("section",{className:"text-gray-600 body-font relative hero-section",children:t.jsx("div",{className:"container h-screen my-auto mx-auto flex px-5 py-24 md:flex-row flex-col items-center",children:t.jsxs("div",{className:"w-full h-full",children:[a?t.jsxs("video",{ref:e,className:"hero-video-background",autoPlay:!0,muted:!0,loop:!0,playsInline:!0,poster:`/img/HeroImg/${l}.png`,preload:"auto",style:{willChange:"transform",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"},children:[t.jsx("source",{src:r,type:`video/${i}`}),"Ваш браузер не поддерживает видеотег."]},r):t.jsx("img",{className:`absolute inset-0 w-full h-full object-cover ${s?"hero-gif-background":""}`,alt:"hero background",src:r,style:{willChange:"opacity",imageRendering:"high-quality",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"}}),!1,t.jsx("div",{className:"relative h-full z-10 lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center",children:t.jsx("h1",{className:"title-font text-4xl my-auto font-semibold text-gray-900 text-shadow-lg","data-translate":!0,children:c})})]})})})}export{h as H};
