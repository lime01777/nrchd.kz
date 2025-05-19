import{R as m,j as e}from"./app-DXC_C2vs.js";import{H as d,F as f}from"./Footer-Dd3ZPOdM.js";/* empty css             */function x({img:r,h1:i,useGif:t=!1,useVideo:a=!1,overlay:l=!0,videoFormat:o="mp4"}){let s="";a?s=`/img/HeroVideos/${r}.${o}`:t?s=`/img/HeroGifs/${r}.gif`:s=`/img/HeroImg/${r}.png`,m.useEffect(()=>{if((t||a)&&!document.getElementById("hero-media-styles")){const c=document.createElement("style");c.id="hero-media-styles",c.textContent=`
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
        `,document.head.appendChild(c)}return()=>{}},[t,a]);const n=t||a?"text-white":"text-gray-900";return e.jsx("section",{className:"text-gray-600 body-font relative hero-section",children:e.jsx("div",{className:"container h-screen my-auto mx-auto flex px-5 py-24 md:flex-row flex-col items-center",children:e.jsxs("div",{className:"w-full h-full",children:[a?e.jsxs("video",{className:"hero-video-background",autoPlay:!0,muted:!0,loop:!0,playsInline:!0,poster:`/img/HeroImg/${r}.png`,preload:"auto",style:{willChange:"transform",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"},children:[e.jsx("source",{src:s,type:`video/${o}`}),"Ваш браузер не поддерживает видеотег."]}):e.jsx("img",{className:`absolute inset-0 w-full h-full object-cover ${t?"hero-gif-background":""}`,alt:"hero background",src:s,style:{willChange:"opacity",imageRendering:"high-quality",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"}}),l&&(t||a)&&e.jsx("div",{className:"absolute inset-0 bg-black bg-opacity-30 z-0"}),e.jsx("div",{className:"relative h-full z-10 lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center",children:e.jsx("h1",{className:`title-font text-4xl my-auto font-semibold ${n} text-shadow-lg`,children:i})})]})})})}function y({children:r,img:i,h1:t,useGif:a=!1,useVideo:l=!1,videoFormat:o="mp4",overlay:s=!0}){const n=l?!1:a;return e.jsxs(e.Fragment,{children:[e.jsx(d,{}),e.jsx(x,{img:i,h1:t,useGif:n,useVideo:l,videoFormat:o,overlay:s}),e.jsx("section",{className:"text-gray-600 body-font",children:r}),e.jsx(f,{})]})}export{y as L};
