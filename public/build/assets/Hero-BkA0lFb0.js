import{r as i,j as e}from"./app-BQ3qogJL.js";function y({img:s,h1:g,useGif:l=!1,useVideo:r=!1,overlay:d=!0,videoFormat:c="mp4",branchFolder:o=null,overlayColor:u="black"}){const t=i.useRef(null),m={Abay:"Abay.jpg",Akmola:"Akmola.jpg",Aktobe:"Aktobe.jpg",Almaty:"almaty.jpg",AlmatyRegion:"almaty.jpg",Astana:"Astana.jpeg",Atyrau:"Atyrau.png",East:"vko.jpg",Karaganda:"karaganda.jpg",Kostanay:"kostanay.jpg",Kyzylorda:"kyzylorda.jpg",Mangistau:"Aktau.jpeg",North:"sko.jpg",Pavlodar:"Pavlodar.jpg",Shymkent:"shymkent.jpeg",Turkestan:"turkestan.jpeg",Ulytau:"ulytau.jpg",West:"zko.jpeg",Zhambyl:"Taraz.jpg",Zhetisu:"zhetysu.jpeg"};let a="";return o&&m[o]?a=`/img/BranchImg/${m[o]}`:r?a=`/img/HeroVideos/${s}.${c}`:l?a=`/img/HeroGifs/${s}.gif`:a=`/img/HeroImg/${s}.png`,i.useEffect(()=>{if(r&&t.current)return t.current.load(),t.current.play(),()=>{t.current&&(t.current.pause(),t.current.src="",t.current.load())}},[r,a]),i.useEffect(()=>{if((l||r)&&!document.getElementById("hero-media-styles")){const n=document.createElement("style");n.id="hero-media-styles",n.textContent=`
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
        `,document.head.appendChild(n)}return()=>{}},[l,r]),e.jsx("section",{className:"text-gray-600 body-font relative hero-section",children:e.jsx("div",{className:"container h-screen my-auto mx-auto flex px-5 py-24 md:flex-row flex-col items-center",children:e.jsxs("div",{className:"w-full h-full",children:[r?e.jsxs("video",{ref:t,className:"hero-video-background",autoPlay:!0,muted:!0,loop:!0,playsInline:!0,poster:`/img/HeroImg/${s}.png`,preload:"auto",style:{willChange:"transform",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"},children:[e.jsx("source",{src:a,type:`video/${c}`}),"Ваш браузер не поддерживает видеотег."]},a):e.jsx("img",{className:`absolute inset-0 w-full h-full object-cover ${l?"hero-gif-background":""}`,alt:"hero background",src:a,style:{willChange:"opacity",imageRendering:"high-quality",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"}}),d&&(o?e.jsx("div",{className:"absolute inset-0 bg-purple-900 bg-opacity-40 z-0"}):l||r?e.jsx("div",{className:"absolute inset-0 bg-black bg-opacity-30 z-0"}):null),e.jsx("div",{className:"relative h-full z-10 lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center",children:e.jsx("h1",{className:"title-font text-4xl my-auto font-semibold text-gray-900 text-shadow-lg","data-translate":!0,children:g})})]})})})}export{y as H};
