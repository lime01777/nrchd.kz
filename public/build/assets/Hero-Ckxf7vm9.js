import{r as i,j as e}from"./app-Lo3qLtpL.js";function f({img:l,h1:g,useGif:s=!1,useVideo:r=!1,overlay:d=!0,videoFormat:m="mp4",branchFolder:n=null,overlayColor:u="black"}){const t=i.useRef(null),c={Abay:"Abay.jpg",Akmola:"Akmola.jpg",Aktobe:"Aktobe.jpg",Almaty:"almaty.jpg",AlmatyRegion:"almaty.jpg",Astana:"Astana.jpeg",Atyrau:"Atyrau.png",East:"vko.jpg",Karaganda:"karaganda.jpg",Kostanay:"kostanay.jpg",Kyzylorda:"kyzylorda.jpg",Mangistau:"Aktau.jpeg",North:"sko.jpg",Pavlodar:"Pavlodar.jpg",Shymkent:"shymkent.jpeg",Turkestan:"turkestan.jpeg",Ulytau:"ulytau.jpg",West:"zko.jpeg",Zhambyl:"Taraz.jpg",Zhetisu:"zhetysu.jpeg"};let a="";return n&&c[n]?a=`/img/BranchImg/${c[n]}`:r?a=`/img/HeroVideos/${l}.${m}`:s?a=`/img/HeroGifs/${l}.gif`:a=`/img/HeroImg/${l}.png`,i.useEffect(()=>{if(r&&t.current)return t.current.load(),t.current.play(),()=>{t.current&&(t.current.pause(),t.current.src="",t.current.load())}},[r,a]),i.useEffect(()=>{if((s||r)&&!document.getElementById("hero-media-styles")){const o=document.createElement("style");o.id="hero-media-styles",o.textContent=`
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
        `,document.head.appendChild(o)}return()=>{}},[s,r]),e.jsx("section",{className:"text-gray-600 body-font relative hero-section",children:e.jsx("div",{className:"container min-h-screen sm:h-screen my-auto mx-auto flex px-5 py-12 sm:py-24 md:flex-row flex-col items-center",children:e.jsxs("div",{className:"w-full h-full min-h-[400px] sm:min-h-screen",children:[r?e.jsxs("video",{ref:t,className:"hero-video-background",autoPlay:!0,muted:!0,loop:!0,playsInline:!0,poster:`/img/HeroImg/${l}.png`,preload:"auto",style:{willChange:"transform",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"},children:[e.jsx("source",{src:a,type:`video/${m}`}),"Ваш браузер не поддерживает видеотег."]},a):e.jsx("img",{className:`absolute inset-0 w-full h-full object-cover ${s?"hero-gif-background":""}`,alt:"hero background",src:a,style:{willChange:"opacity",imageRendering:"high-quality",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"}}),d&&(n?e.jsx("div",{className:"absolute inset-0 bg-purple-900 bg-opacity-40 z-0"}):s||r?e.jsx("div",{className:"absolute inset-0 bg-black bg-opacity-30 z-0"}):null),e.jsx("div",{className:"relative h-full z-10 lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center",children:e.jsx("h1",{className:"title-font text-4xl my-auto font-semibold text-gray-900 text-shadow-lg","data-translate":!0,children:g})})]})})})}export{f as H};
