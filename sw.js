if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let t={};const l=e=>s(e,o),c={module:{uri:o},exports:t,require:l};i[o]=Promise.all(n.map((e=>c[e]||l(e)))).then((e=>(r(...e),t)))}}define(["./workbox-e3490c72"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-BOpXeSXi.js",revision:null},{url:"assets/index-DFQlryFO.css",revision:null},{url:"index.html",revision:"e7d52e17b849e8d9b38b300663fd619f"},{url:"registerSW.js",revision:"7976536bde3b01a00d6288a6a838d038"},{url:"apple-touch-icon.png",revision:"f7efa26575e9d41773642cffc357b47f"},{url:"favicon.ico",revision:"692817fa67c0448ae4198181ec451e16"},{url:"manifest.webmanifest",revision:"545e39e42e1c0fcde6b86e74dd278ead"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
