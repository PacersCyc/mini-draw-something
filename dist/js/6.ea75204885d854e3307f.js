(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{242:function(e,a,t){"use strict";t.r(a);t(248);var n=t(249),r=t.n(n),s=(t(122),t(79)),i=t.n(s),c=t(83),m=t.n(c),l=(t(123),t(124)),o=t.n(l),p=(t(250),t(251)),u=t.n(p),f=t(77),d=t.n(f),y=t(78),g=t.n(y),h=t(0),_=t.n(h),v=t(16),O=t.n(v),w=t(244),I=t(46),E=t(289),N=t.n(E),k=t(80),R=function(e){var a,t=e.uid,n=e.username,r=e.isMaster,s=e.isSelf,i=O()(N.a.player,(a={},g()(a,N.a.master,r),g()(a,N.a.self,s),g()(a,N.a.empty,!t),a));return _.a.createElement("div",{className:i},_.a.createElement("div",{className:N.a.playerHeader},n?n[0]:"空"),_.a.createElement("div",{className:N.a.playerName},n||"等待加入"))};a.default=function(e){var a=Object(h.useContext)(I.a),t=a.state,n=a.dispatch,s=Object(h.useState)(""),c=d()(s,2),l=c[0],p=c[1],f=Object(h.useState)([]),y=d()(f,2),v=y[0],E=y[1],b=t.roomData,W=t.socket,F=t.username,G=t.uid,M=e.match.params.id,S=b.find((function(e){return e.id===M})),A=S.master.uid===G,C=S.players.length,J=C>=8?S.players:S.players.concat(new Array(8-C).fill({})),x=C>=2,D=v.filter((function(e,a){return a<=7}));return Object(h.useEffect)((function(){W.on("chatMessage",(function(e){var a=e.player,t=e.msg,n={message:"".concat(a.username,":  ").concat(t),isMe:a.uid===G};E((function(e){return[n].concat(e)}))})),W.on("leftRoom",(function(a){n({type:"delete_roomId"}),e.history.push("/")})),W.on("startGame",(function(a){n({type:"update_game_info",payload:a}),e.history.push("/game/".concat(M))})),Object(w.a)(W)}),[]),_.a.createElement("div",{className:N.a.roomWrapper},_.a.createElement(k.a,{title:S.name,left:_.a.createElement(o.a,{type:"left",onClick:function(){W.emit("leftRoom",{player:{username:F,uid:G},socketRoom:S.socketRoom,roomId:M})}}),right:"房间号: ".concat(M)}),_.a.createElement("div",{className:N.a.playersList},J.map((function(e,a){return _.a.createElement(R,m()({key:e.uid||a,isMaster:e.uid===S.master.uid,isSelf:e.uid===G},e))}))),A&&_.a.createElement(i.a,{type:"primary",disabled:!x,style:{marginTop:20},onClick:function(){x&&W.emit("startGame",S)}},x?"开始游戏":"至少两人才能开始游戏"),_.a.createElement("div",{className:N.a.chatWrapper},_.a.createElement(r.a,{clear:!0,placeholder:"您说点什么",value:l,className:N.a.chatInput,onChange:function(e){p(e)}}),_.a.createElement(i.a,{type:"primary",inline:!0,style:{borderRadius:0,height:44,lineHeight:"44px"},onClick:function(){if(!l.trim())return u.a.info("不能为空哦～",1);W.emit("chatMessage",{player:{username:F,uid:G},msg:l}),p("")}},"发送")),_.a.createElement("div",{className:N.a.msgWrapper},v.length>0&&_.a.createElement("div",{className:N.a.msgList},D.map((function(e,a){return _.a.createElement("div",{className:O()(N.a.msgItem,g()({},N.a.me,e.isMe)),key:a},e.message)})))))}},244:function(e,a,t){"use strict";t.d(a,"a",(function(){return s}));t(245);var n=t(246),r=t.n(n),s=function(e){e.on("disconnect",(function(){r.a.alert("阿欧","服务器宕机了，老铁～",[{text:"刷新试试吧",onPress:function(){window.location.href="/"}}])}))}},289:function(e,a,t){e.exports={"room-wrapper":"_2KsGA5vXCRR_gal8lR0Jby",roomWrapper:"_2KsGA5vXCRR_gal8lR0Jby","players-list":"_2On8bTEsNKN56YiQpIfPTZ",playersList:"_2On8bTEsNKN56YiQpIfPTZ",player:"_3Wnd-cjOpOMOuAPR_Gg1Qg",empty:"_3nWPOi2e6f052Tww1BNjAL","player-header":"_3727Rr51Ytedr_YaU5Z5Oa",playerHeader:"_3727Rr51Ytedr_YaU5Z5Oa",master:"_8tUfk3utG3TWcnRPR6Jf6",self:"fzlM0UZsEsnnkD2Fg4FWH","player-name":"_2pmAOGgW4-rxLO8mvp1qr7",playerName:"_2pmAOGgW4-rxLO8mvp1qr7","chat-wrapper":"_2DnvI6qZ5JsVwxBUfM6-IS",chatWrapper:"_2DnvI6qZ5JsVwxBUfM6-IS","chat-input":"_3KGfIrsDF4Ok09Dvy9CvHy",chatInput:"_3KGfIrsDF4Ok09Dvy9CvHy","msg-wrapper":"_2i8XaI2LdkFpKPF1rZA6e",msgWrapper:"_2i8XaI2LdkFpKPF1rZA6e","msg-list":"JIFbDWQsSVGylwyxSIFSw",msgList:"JIFbDWQsSVGylwyxSIFSw","msg-item":"_3JO5f3tVNXfQdihMuCqQ6A",msgItem:"_3JO5f3tVNXfQdihMuCqQ6A",me:"_2hkcaOhGBuUMc0s8k0aZYF"}}}]);