(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{234:function(e,n,t){"use strict";t.r(n);t(121);var a=t(79),o=t.n(a),c=(t(246),t(250)),i=t.n(c),u=(t(241),t(242)),r=t.n(u),l=(t(122),t(123)),m=t.n(l),s=(t(243),t(244)),f=t.n(s),d=t(77),p=t.n(d),b=(t(274),t(277)),v=t.n(b),h=t(0),E=t.n(h),k=t(237),w=t(46),y=(t(281),t(80)),g=v.a.RadioItem,j=[{value:0,label:"公开"},{value:1,label:"私人(不在大厅显示)"}],O=Object(h.memo)((function(e){var n=e.history,t=Object(h.useContext)(w.a),a=t.state,c=(t.dispatch,a.socket),u=a.username,l=a.uid,s=Object(h.useState)("".concat(u,"的房间")),d=p()(s,2),b=d[0],v=d[1],O=Object(h.useState)(0),C=p()(O,2),R=C[0],x=C[1],J=Object(h.useCallback)((function(){n.goBack()}),[n]);return Object(h.useEffect)((function(){l&&c.emit("login",{uid:l,username:u}),c.on("enterRoom",(function(n){f.a.hide(),e.history.push("/room/".concat(n.id))})),Object(k.a)(c)}),[]),E.a.createElement("div",null,E.a.createElement(y.a,{title:"创建房间",left:E.a.createElement(m.a,{type:"left",onClick:J})}),E.a.createElement("div",null,E.a.createElement(r.a,{autoFocus:!0,clear:!0,placeholder:"请输入房间名",value:b,onChange:function(e){v(e)}},"房间名称:")),E.a.createElement("div",null,E.a.createElement(i.a,{renderHeader:function(){return"房间类型"}},j.map((function(e){return E.a.createElement(g,{key:e.value,checked:e.value===R,onChange:function(n){x(e.value)}},e.label)})))),E.a.createElement(o.a,{type:"primary",onClick:function(){b.trim()?(f.a.loading("loading...",0),c.emit("createRoom",{roomName:b,roomType:R,master:{username:u,uid:l}})):f.a.info("请输入房间名哦～",1)},style:{marginTop:40}},"完成"))}));n.default=O},237:function(e,n,t){"use strict";t.d(n,"a",(function(){return c}));t(238);var a=t(239),o=t.n(a),c=function(e){e.on("disconnect",(function(){o.a.alert("阿欧","服务器宕机了，老铁～",[{text:"刷新试试吧",onPress:function(){window.location.href="/"}}])}))}},281:function(e,n,t){}}]);
//# sourceMappingURL=6.48e56796061aeffd5331.js.map