import{E as at,U as st,N as T,a as it,I as V,Y as v,C as lt,h as ct,c as j,_ as S,j as ut,l as F,Q as dt,s as G,b as _t,u as mt,p as pt}from"./q-d80ddfc0.js";import{j as vt,c as ft,C as yt,d as ht,D as St,R as Ct,e as Et,f as wt,h as bt,i as qt,l as Q,k as K,m as gt,r as Rt,n as Z,o as W,p as tt,q as Lt,s as et,t as I,v as q,w as It,x as Pt,y as Dt}from"./q-bc4c0983.js";const At=f=>{at(j(()=>S(()=>Promise.resolve().then(()=>N),void 0),"s_RPDJAz33WLA"));const n=vt();if(!(n!=null&&n.params))throw new Error("Missing Qwik City Env Data");const y=st("url");if(!y)throw new Error("Missing Qwik URL Env Data");const C=new URL(y),s=T({url:C,params:n.params,isNavigating:!1,prevUrl:void 0},{deep:!1}),E={},i=it(T(n.response.loaders,{deep:!1})),_=V({type:"initial",dest:C,forceReload:!1,replaceState:!1,scroll:!0}),m=T(ft),w=T({headings:void 0,menu:void 0}),l=V(),o=n.response.action,b=o?n.response.loaders[o]:void 0,u=V(b?{id:o,data:n.response.formData,output:{result:b,status:n.response.status}}:void 0),g=j(()=>S(()=>Promise.resolve().then(()=>N),void 0),"s_fX0bDjeJa0E",[u,E,_,s]);return v(yt,w),v(ht,l),v(St,m),v(Ct,s),v(Et,g),v(wt,i),v(bt,u),v(qt,_),lt(j(()=>S(()=>Promise.resolve().then(()=>N),void 0),"s_02wMImzEAbk",[u,w,l,m,n,g,i,E,f,_,s])),ct(ut,null,3,"qY_0")};const M=()=>S(()=>import("./q-42ba5570.js"),["build/q-42ba5570.js","build/q-d80ddfc0.js","build/q-bc4c0983.js"]),z=[[/^\/$/,[M,()=>S(()=>import("./q-ee6d05f7.js"),["build/q-ee6d05f7.js","build/q-d80ddfc0.js"])]],[/^\/demo\/flower\/?$/,[M,()=>S(()=>import("./q-dbae133c.js"),["build/q-dbae133c.js","build/q-d80ddfc0.js"])]],[/^\/demo\/todolist\/?$/,[M,()=>S(()=>import("./q-0e69fa71.js"),["build/q-0e69fa71.js","build/q-d80ddfc0.js","build/q-bc4c0983.js"])]]],J=[];const Y=!0;const kt=({track:f})=>{const[n,y,C,s,E,i,_,m,w,l,o]=F();async function b(){var $;const[u,g]=f(()=>[l.value,n.value]),ot=dt(""),P=o.url,p=g?"form":u.type,nt=u.replaceState;let r,R,U=null,O;{r=new URL(u.dest,location),r.pathname.endsWith("/")||(r.pathname+="/");let D=Q(z,J,Y,r.pathname);O=G();const A=R=await K(r,O,!0,g);if(!A){l.untrackedValue={type:p,dest:r};return}const x=A.href,h=new URL(x,r);gt(h,r)||(r=h,D=Q(z,J,Y,r.pathname)),U=await D}if(U){const[D,A,x]=U,h=A,rt=h[h.length-1];o.prevUrl=P,o.url=r,o.params={...D},l.untrackedValue={type:p,dest:r};const L=Rt(R,o,h,ot);y.headings=rt.headings,y.menu=x,C.value=_t(h),s.links=L.links,s.meta=L.meta,s.styles=L.styles,s.title=L.title,s.frontmatter=L.frontmatter;{w.viewTransition!==!1&&(document.__q_view_transition__=!0);let B;p==="popstate"&&(B=Z()),u.scroll&&(!u.forceReload||!W(r,P))&&(p==="link"||p==="popstate")&&(document.__q_scroll_restore__=()=>tt(p,r,P,B));const X=R==null?void 0:R.loaders,t=window;if(X&&Object.assign(_,X),Lt.clear(),!t._qCitySPA){if(t._qCitySPA=!0,history.scrollRestoration="manual",t.addEventListener("popstate",()=>{t._qCityScrollEnabled=!1,clearTimeout(t._qCityScrollDebounce),i(location.href,{type:"popstate"})}),t.removeEventListener("popstate",t._qCityInitPopstate),t._qCityInitPopstate=void 0,!t._qCityHistoryPatch){t._qCityHistoryPatch=!0;const a=history.pushState,d=history.replaceState,k=e=>(e===null||typeof e>"u"?e={}:(e==null?void 0:e.constructor)!==Object&&(e={_data:e}),e._qCityScroll=e._qCityScroll||q(document.documentElement),e);history.pushState=(e,c,H)=>(e=k(e),a.call(history,e,c,H)),history.replaceState=(e,c,H)=>(e=k(e),d.call(history,e,c,H))}document.body.addEventListener("click",a=>{if(a.defaultPrevented)return;const d=a.target.closest("a[href]");if(d&&!d.hasAttribute("preventdefault:click")){const k=d.getAttribute("href"),e=new URL(location.href),c=new URL(k,e);if(et(c,e)&&W(c,e)){if(a.preventDefault(),!c.hash&&!c.href.endsWith("#")){c.href!==e.href&&history.pushState(null,"",c),t._qCityScrollEnabled=!1,clearTimeout(t._qCityScrollDebounce),I({...q(document.documentElement),x:0,y:0}),location.reload();return}i(d.getAttribute("href"))}}}),document.body.removeEventListener("click",t._qCityInitAnchors),t._qCityInitAnchors=void 0,window.navigation||(document.addEventListener("visibilitychange",()=>{if(t._qCityScrollEnabled&&document.visibilityState==="hidden"){const a=q(document.documentElement);I(a)}},{passive:!0}),document.removeEventListener("visibilitychange",t._qCityInitVisibility),t._qCityInitVisibility=void 0),t.addEventListener("scroll",()=>{t._qCityScrollEnabled&&(clearTimeout(t._qCityScrollDebounce),t._qCityScrollDebounce=setTimeout(()=>{const a=q(document.documentElement);I(a),t._qCityScrollDebounce=void 0},200))},{passive:!0}),removeEventListener("scroll",t._qCityInitScroll),t._qCityInitScroll=void 0,($=t._qCityBootstrap)==null||$.remove(),t._qCityBootstrap=void 0,It.resolve()}if(p!=="popstate"){t._qCityScrollEnabled=!1,clearTimeout(t._qCityScrollDebounce);const a=q(document.documentElement);I(a)}Pt(window,p,P,r,nt),mt(O).then(()=>{var d;const a=q(document.documentElement);I(a),t._qCityScrollEnabled=!0,o.isNavigating=!1,(d=m.r)==null||d.call(m)})}}}b()},Tt=":root{view-transition-name:none}",Ut=async(f,n)=>{const[y,C,s,E]=F(),{type:i="link",forceReload:_=f===void 0,replaceState:m=!1,scroll:w=!0}=typeof n=="object"?n:{forceReload:n},l=s.value.dest,o=f===void 0?l:Dt(f,E.url);if(!et(o,l)){location.href=o.href;return}if(!_&&W(o,l)){i==="link"&&o.href!==location.href&&history.pushState(null,"",o),tt(i,o,new URL(location.href),Z()),i==="popstate"&&(window._qCityScrollEnabled=!0);return}return s.value={type:i,dest:o,forceReload:_,replaceState:m,scroll:w},K(o,G()),Q(z,J,Y,o.pathname),y.value=void 0,E.isNavigating=!0,new Promise(b=>{C.r=b})},N=Object.freeze(Object.defineProperty({__proto__:null,_hW:pt,s_02wMImzEAbk:kt,s_RPDJAz33WLA:Tt,s_TxCFOy819ag:At,s_fX0bDjeJa0E:Ut},Symbol.toStringTag,{value:"Module"}));export{pt as _hW,kt as s_02wMImzEAbk,Tt as s_RPDJAz33WLA,At as s_TxCFOy819ag,Ut as s_fX0bDjeJa0E};
