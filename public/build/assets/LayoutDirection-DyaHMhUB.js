import{R as c,j as e}from"./app-DaKYHH4p.js";import{H as d,F as f}from"./Footer-xfQQhh3f.js";/* empty css             */function x({img:a,h1:l,useGif:s=!1,useVideo:r=!1,overlay:i=!0,videoFormat:o="mp4"}){let t="";return r?t=`/img/HeroVideos/${a}.${o}`:s?t=`/img/HeroGifs/${a}.gif`:t=`/img/HeroImg/${a}.png`,c.useEffect(()=>{if((s||r)&&!document.getElementById("hero-media-styles")){const n=document.createElement("style");n.id="hero-media-styles",n.textContent=`
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
        `,document.head.appendChild(n)}return()=>{}},[s,r]),e.jsx("section",{className:"text-gray-600 body-font relative hero-section",children:e.jsx("div",{className:"container h-screen my-auto mx-auto flex px-5 py-24 md:flex-row flex-col items-center",children:e.jsxs("div",{className:"w-full h-full",children:[r?e.jsxs("video",{className:"hero-video-background",autoPlay:!0,muted:!0,loop:!0,playsInline:!0,poster:`/img/HeroImg/${a}.png`,preload:"auto",style:{willChange:"transform",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"},children:[e.jsx("source",{src:t,type:`video/${o}`}),"Ваш браузер не поддерживает видеотег."]}):e.jsx("img",{className:`absolute inset-0 w-full h-full object-cover ${s?"hero-gif-background":""}`,alt:"hero background",src:t,style:{willChange:"opacity",imageRendering:"high-quality",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"}}),!1,e.jsx("div",{className:"relative h-full z-10 lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center",children:e.jsx("h1",{className:"title-font text-4xl my-auto font-semibold text-gray-900 text-shadow-lg",children:l})})]})})})}function y({children:a,img:l,h1:s,useGif:r=!1,useVideo:i=!1,videoFormat:o="mp4",overlay:t=!0}){const m=i?!1:r;return e.jsxs(e.Fragment,{children:[e.jsx(d,{}),e.jsx(x,{img:l,h1:s,useGif:m,useVideo:i,videoFormat:o,overlay:t}),e.jsx("section",{className:"text-gray-600 body-font",children:a}),e.jsx(f,{})]})}export{y as L};
