if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let t={};const c=e=>s(e,o),l={module:{uri:o},exports:t,require:c};i[o]=Promise.all(n.map((e=>l[e]||c(e)))).then((e=>(r(...e),t)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-_gHxFvgo.js",revision:null},{url:"assets/index-u_b1zjZ8.css",revision:null},{url:"index.html",revision:"6b70cc04da80a4c3ff0235e72a4dd4ca"},{url:"registerSW.js",revision:"7976536bde3b01a00d6288a6a838d038"},{url:"favicon.ico",revision:"692817fa67c0448ae4198181ec451e16"},{url:"apple-touch-icon.png",revision:"f7efa26575e9d41773642cffc357b47f"},{url:"manifest.webmanifest",revision:"545e39e42e1c0fcde6b86e74dd278ead"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
