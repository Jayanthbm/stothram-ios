if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,s)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let o={};const d=e=>n(e,c),t={module:{uri:c},exports:o,require:d};i[c]=Promise.all(r.map((e=>t[e]||d(e)))).then((e=>(s(...e),o)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-fv8nSdct.js",revision:null},{url:"assets/index-IQTJfeNJ.css",revision:null},{url:"index.html",revision:"b38ec8dd28032c37e4cc91fc23b73283"},{url:"registerSW.js",revision:"7976536bde3b01a00d6288a6a838d038"},{url:"favicon.ico",revision:"692817fa67c0448ae4198181ec451e16"},{url:"apple-touch-icon.png",revision:"f7efa26575e9d41773642cffc357b47f"},{url:"android-chrome-192x192.png",revision:"38e205eaf1d05c50de6b0cbd3e17e46d"},{url:"android-chrome-512x512.png",revision:"c1fffd62d247d18e82311feb7b19358c"},{url:"maskable_icon.png",revision:"8f0eedb827100e1cf2dd1cdee5067eb3"},{url:"manifest.webmanifest",revision:"34aecde192356e534296bec0e238bcb4"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
