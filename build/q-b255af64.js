import{F as o}from"./q-bc4c0983.js";import{h as e,$ as l,M as c,v as n,x as r}from"./q-d80ddfc0.js";import{useListLoader as p,useAddToListAction as m}from"./q-0e69fa71.js";const d="_list_1ofyy_1",_="_empty_1ofyy_9",h="_input_1ofyy_22",y="_hint_1ofyy_32",t={list:d,empty:_,input:h,hint:y},A=()=>{const s=p(),i=m();return e(r,{children:[l("div",null,{class:"container container-center"},l("h1",null,null,[l("span",null,{class:"highlight"},"TODO",3,null)," List"],3,null),3,null),l("div",null,{class:"ellipsis",role:"presentation"},null,3,null),l("div",null,{class:"container container-center"},s.value.length===0?l("span",null,{class:t.empty},"No items found",3,"AP_0"):l("ul",null,{class:t.list},s.value.map((u,a)=>l("li",null,null,c(u,"text"),1,`items-${a}`)),1,null),1,null),l("div",null,{class:"container container-center"},[e(o,{action:i,children:[l("input",null,{class:t.input,name:"text",required:!0,type:"text"},null,3,null)," ",l("button",null,{class:"button-dark",type:"submit"},"Add item",3,null)],spaReset:!0,[n]:{action:n,spaReset:n}},3,"AP_1"),l("p",null,{class:t.hint},"PS: This little app works even when JavaScript is disabled.",3,null)],1,null)]},1,"AP_2")};export{A as s_J4V2qsF7Yxo};
