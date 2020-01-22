(function(e){function t(t){for(var o,a,c=t[0],u=t[1],s=t[2],l=0,p=[];l<c.length;l++)a=c[l],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&p.push(r[a][0]),r[a]=0;for(o in u)Object.prototype.hasOwnProperty.call(u,o)&&(e[o]=u[o]);f&&f(t);while(p.length)p.shift()();return i.push.apply(i,s||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],o=!0,a=1;a<n.length;a++){var u=n[a];0!==r[u]&&(o=!1)}o&&(i.splice(t--,1),e=c(c.s=n[0]))}return e}var o={},r={app:0},i=[];function a(e){return c.p+"js/"+({about:"about"}[e]||e)+"."+{about:"934c124e"}[e]+".js"}function c(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.e=function(e){var t=[],n=r[e];if(0!==n)if(n)t.push(n[2]);else{var o=new Promise((function(t,o){n=r[e]=[t,o]}));t.push(n[2]=o);var i,u=document.createElement("script");u.charset="utf-8",u.timeout=120,c.nc&&u.setAttribute("nonce",c.nc),u.src=a(e);var s=new Error;i=function(t){u.onerror=u.onload=null,clearTimeout(l);var n=r[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;s.message="Loading chunk "+e+" failed.\n("+o+": "+i+")",s.name="ChunkLoadError",s.type=o,s.request=i,n[1](s)}r[e]=void 0}};var l=setTimeout((function(){i({type:"timeout",target:u})}),12e4);u.onerror=u.onload=i,document.head.appendChild(u)}return Promise.all(t)},c.m=e,c.c=o,c.d=function(e,t,n){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)c.d(n,o,function(t){return e[t]}.bind(null,o));return n},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="",c.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],s=u.push.bind(u);u.push=t,u=u.slice();for(var l=0;l<u.length;l++)t(u[l]);var f=s;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var o=n("2b0e"),r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},i=[],a=(n("5c0b"),n("2877")),c={},u=Object(a["a"])(c,r,i,!1,null,null,null),s=u.exports,l=n("9483");Object(l["a"])("".concat("","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});n("d3b7");var f=n("8c4f"),p=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},d=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"mapWrap"},[n("canvas",{attrs:{id:"map"}})])}],h={data:function(){return{unitSize:0,divs:10,cols:0,rows:0,$map:null}},mounted:function(){this.initDatas(),this.createMap(this.$map,this.unitSize,this.cols,this.rows)},methods:{initDatas:function(){this.$map=document.getElementById("map");var e=document.documentElement.clientWidth,t=document.documentElement.clientHeight;console.log(e,t),this.$map.width=2*e,this.$map.height=1.5*t,this.unitSize=parseInt(t/this.divs),this.cols=parseInt(this.$map.width/this.unitSize),this.rows=parseInt(this.$map.height/this.unitSize)},createMap:function(e,t,n,o){var r=e.getContext("2d");r.strokeStyle="#fff",r.lineWidth=1;for(var i=0;i<n;i++)r.beginPath(),r.moveTo(t*i+.5,0),r.lineTo(t*i+.5,t*o+.5),r.stroke();for(var a=0;a<o;a++)r.beginPath(),r.moveTo(0,t*a+.5),r.lineTo(t*n+.5,t*a+.5),r.stroke();r.moveTo(0,t*o-.5),r.lineTo(t*n-.5,t*o-.5),r.stroke(),r.moveTo(t*n-.5,0),r.lineTo(t*n-.5,t*o-.5),r.stroke()}},components:{}},m=h,v=(n("cccb"),Object(a["a"])(m,p,d,!1,null,null,null)),b=v.exports;o["a"].use(f["a"]);var g=[{path:"/",name:"home",meta:{title:"Home"},component:b},{path:"/about",name:"about",meta:{title:"About"},component:function(){return n.e("about").then(n.bind(null,"f820"))}}],w=new f["a"]({routes:g}),y=w,j=n("2f62");o["a"].use(j["a"]);var k=new j["a"].Store({state:{},mutations:{},actions:{},modules:{}});o["a"].config.productionTip=!1,y.beforeEach((function(e,t,n){e.meta.title&&(document.title=e.meta.title),n()})),new o["a"]({router:y,store:k,render:function(e){return e(s)}}).$mount("#app")},"5c0b":function(e,t,n){"use strict";var o=n("9c0c"),r=n.n(o);r.a},"5ced":function(e,t,n){},"9c0c":function(e,t,n){},cccb:function(e,t,n){"use strict";var o=n("5ced"),r=n.n(o);r.a}});
//# sourceMappingURL=app.feabf09d.js.map