var e=e||{};e.a=e.a||{};window.CreJs=e;e.Creanvas=e.a;(function(){var a=e.r=e.r||{};a.s=function(c,f,d){var g=this;this.w=c;this.A=f;this.U=d||0;this.ib=function(a,d,b,c){a.lineWidth=5;a.strokeStyle=c;a.beginPath();a.moveTo(d,b);a.lineTo(d+100*g.w,b+100*g.A);a.stroke();a.lineWidth=1;a.strokeStyle="#000"};this.Ca=function(d){return{N:a.pa(g,d.N),u:a.pa(g,d.u),Ia:a.pa(g,d.Ia)}}};Object.defineProperty(a.s.prototype,"x",{get:function(){return this.w},set:function(a){this.w=a}});Object.defineProperty(a.s.prototype,"y",{get:function(){return this.A},set:function(a){this.A=
a}});Object.defineProperty(a.s.prototype,"z",{get:function(){return this.U},set:function(a){this.U=a}});a.Wa=function(c,f,d,g){c=d-c;f=g-f;g=Math.sqrt(c*c+f*f);return{N:new a.s(c/g,f/g,0),u:new a.s(-f/g,c/g,0),Ia:new a.s(0,0,0)}};a.kb=function(a,f,d,g,k){a.lineWidth=5;a.strokeStyle=k;a.beginPath();a.moveTo(f,d);a.lineTo(f+100*g.N.w,d+100*g.N.A);a.moveTo(f,d);a.lineTo(f+50*g.u.w,d+50*g.u.A);a.stroke();a.lineWidth=1;a.strokeStyle="#000"};a.jb=function(a,f,d,g,k,h,b){a.lineWidth=5;a.strokeStyle=b;a.beginPath();
a.moveTo(f,d);a.lineTo(f+100*k*g.N.w,d+100*k*g.N.A);a.lineTo(f+100*k*g.N.w+100*h*g.u.w,d+100*k*g.N.A+100*h*g.u.A);a.stroke();a.lineWidth=1;a.strokeStyle="#000"};a.pa=function(a,f){return a.w*f.w+a.A*f.A};a.ha=function(c,f){return new a.s(c.A*f.U-c.U*f.A,c.U*f.w-c.w*f.U,c.w*f.A-c.A*f.w)};e.Core=e.r;e.r.Vector=e.r.s})();e.a.Ja=function(a){function c(){return a.elements.filter(function(a){return a.q})}function f(a,d,h){var b,c,l,f,s,m;b=h.gb;f=new e.r.s(h.x-a.h,h.y-a.i);s=e.r.ha(f,b.u).z;m=new e.r.s(h.x-d.h,h.y-d.i);h=e.r.ha(m,b.u).z;var r=e.r.ha(f,b.u),q=e.r.ha(m,b.u);c=new e.r.s(a.b.f.x,a.b.f.y);l=new e.r.s(d.b.f.x,d.b.f.y);a.v&&(c.x+=f.x*a.v.x,c.y+=f.y*a.v.y);d.v&&(l.x+=m.x*d.v.x,l.y+=m.y*d.v.y);f=a.q.za?Infinity:a.q.X;m=d.q.za?Infinity:d.q.X;var t=a.q.fixed?Infinity:a.Da(),u=d.q.fixed?Infinity:d.Da();c=a.q.ua*
d.q.ua*2*(l.Ca(b).u-c.Ca(b).u+d.b.C*q.z-a.b.C*r.z)/(1/m+1/f+q.z*q.z/u+r.z*r.z/t);a.b.f.x+=c/f*b.u.x;a.b.f.y+=c/f*b.u.y;d.b.f.x-=c/m*b.u.x;d.b.f.y-=c/m*b.u.y;a.b.C+=c*s/t;d.b.C-=c*h/u}function d(a,d){var c,b,f,l,n,s,m;l=a.Ba();n=d.Ba();c=Math.max(l.I,n.I)-1;b=Math.min(l.ga,n.ga)+1;f=Math.max(l.F,n.F)-1;l=Math.min(l.$,n.$)+1;if(!(0>=b-c||0>=l-f)){c=a.k.getImageData(0,0,a.j,a.p);a.k.scale(1/(a.g||1),1/(a.n||1));a.k.rotate(-(a.l||0));a.k.translate(d.h*a.c.d-a.h*a.c.d,d.i*a.c.d-a.i*a.c.d);a.k.rotate(d.l||
0);a.k.scale(d.g||1,d.n||1);a.k.globalCompositeOperation="destination-out";a.k.drawImage(d.Q.canvas,0,0,d.j,d.p,d.I,d.F,d.j,d.p);a.k.scale(1/(d.g||1),1/(d.n||1));a.k.rotate(-d.l||0);a.k.translate(-d.h*a.c.d+a.h*a.c.d,-d.i*a.c.d+a.i*a.c.d);a.k.rotate(a.l||0);a.k.scale(a.g||1,a.n||1);s=a.k.getImageData(0,0,a.j,a.p);a.k.globalCompositeOperation="source-over";a.k.putImageData(c,0,0);m=[];a.wa.forEach(function(b){90>s.data[b.y*a.j*4+4*b.x+3]&&m.push(b)});if(2>m.length)return null;var r;f=b=0;c=m.length-
1;for(l=1;l<m.length;l++)for(n=l+1;n<m.length;n++){r=m[l].x-m[n].x;var q=m[l].y-m[n].y;r=Math.sqrt(r*r+q*q);r>b&&(b=r,f=l,c=n)}b=a.ca(m[f].x+a.left,m[f].y+a.F);c=a.ca(m[c].x+a.left,m[c].y+a.F);return b.x==c.x&&b.y==c.y?null:{x:(b.x+c.x)/2,y:(b.y+c.y)/2,gb:e.r.Wa(b.x,b.y,c.x,c.y)}}}this.cb=function(a){var k=c(),h,b,p;h=a.Aa();k=k.filter(function(b){var d;if(b.D===a.D||!(b.b.f.x||b.b.f.y||a.b.f.x||a.b.f.y||b.v||a.v||a.b.C||b.b.C))return!1;d=b.Aa();return Math.sqrt((h.x-d.x)*(h.x-d.x)+(h.y-d.y)*(h.y-
d.y))>a.Ea()+b.Ea()?!1:!0});if(0==k.length)return!0;b=null;k.forEach(function(c){b||(b=d(a,c))&&(p=c)});if(!b)return!0;f(a,p,b);a.m.o("collision").O({element:p,Oa:b});p.m.o("collision").O({element:a,Oa:b});return!1}};e.a.Ka=function(a){var c,f,d,g,k,h,b=this;c=a.canvas;h=a.timeScale||1;this.d=a.lengthScale||c.height/a.realHeight||c.width/a.realWidth||1;a.mb?(k=Date.now(),this.getTime=function(){return(Date.now()-k)*h/1E3}):(g=0,setInterval(function(){g+=10*h/1E3},10),this.getTime=function(){return g});this.P=function(b){a.log&&a.log(b)};b.H=c.getContext("2d");b.H.setTransform(1,0,0,1,0,0);f=!0;isDrawing=!1;d=a.refreshTime||50;this.qa=function(a,d){var c=!1;b.elements.filter(function(b){return b.Na(a)}).sort(function(a,
b){return b.T||0-a.T||0}).forEach(function(b){!c&&b.Ya(d.x,d.y)&&(b.m.o(a).O(d),c=!0)})};this.Ha=function(a,d){b.elements.forEach(function(b){b.t==d.t&&b.m.o(a).O(d)})};this.oa=function(a,d){c.addEventListener(a,function(a){setTimeout(function(){if(a.changedTouches)for(var c=0;c<a.changedTouches.length;c++){var g=a.changedTouches[c].identifier,f=b.da(a.changedTouches[c]);f.t=g;b.qa(d,f)}else c=b.da(a),c.t=-1,b.qa(d,c)})})};this.fa=function(a,d){c.addEventListener(a,function(a){setTimeout(function(){if(a.changedTouches)for(var c=
0;c<a.changedTouches.length;c++){var g=a.changedTouches[c].identifier,f=b.da(a.changedTouches[c]);f.t=g;b.Ha(d,f)}else c=b.da(a),c.t=-1,b.Ha(d,c)})})};this.m=new e.V.ja;this.oa("click","click");this.oa("mousedown","pointerDown");this.oa("touchstart","pointerDown");this.fa("mousemove","pointerMove");this.fa("touchmove","pointerMove");this.fa("mouseup","pointerUp");this.fa("touchend","pointerUp");this.eb=function(){b.m.o("deactivate").O();b.elements=[]};this.G=function(){f=!0};this.da=function(a){var d=
c.getBoundingClientRect();b.P("ClientXY: ("+a.clientX+","+a.clientY+")");d={x:(a.clientX-d.left)*c.width/d.width/b.d,y:(a.clientY-d.top)*c.height/d.height/b.d};b.P("WebAppXY: ("+d.x+","+d.y+")");"click"==a.type&&b.P("Click on ! WebAppXY: ("+d.x+","+d.y+")");return d};b.elements=[];this.add=function(){var a=[].slice.call(arguments),d=a.filter(function(a){return a&&"name"==a[0]})[0]||["name","Unknown"],c=a.filter(function(a){return a&&"image"==a[0]})[0],g=a.filter(function(a){return a&&"position"==
a[0]})[0],d=new e.a.Ma(b,d,c,g),a=a.filter(function(a){return a&&"name"!=a[0]&&"position"!=a[0]&&"image"!=a[0]});0<a.length&&e.a.e&&d.sa.apply(d,a);b.elements.push(d);return d};b.P("Adding background");this.add(["name","background"],["image",{left:0,width:c.width/b.d,top:0,height:c.height/b.d,draw:a.drawBackground||function(d){d.fillStyle=a.backgroundStyle||"#FFF";d.fillRect(0,0,c.width/b.d,c.height/b.d)}}],["position",{z:-Infinity}]);setInterval(function(){f&&!isDrawing?(isDrawing=!0,b.elements.sort(function(a,
b){return(a.T||0)-(b.T||0)}).forEach(function(a){b.H.translate(a.h*b.d,a.i*b.d);b.H.rotate(a.l||0);b.H.scale(a.g||1,a.n||1);b.H.drawImage(a.M.canvas,0,0,a.j,a.p,a.I,a.F,a.j,a.p);b.H.scale(1/(a.g||1),1/a.n||1);b.H.rotate(-(a.l||0));b.H.translate(-a.h*b.d,-a.i*b.d)}),isDrawing=!1):b.P("No redraw")},d);this.addElement=this.add;this.redraw=this.G;this.stop=this.eb};e.a.Controller=e.a.Ka;(function(){function a(a,c){a.h=c.x||0;a.i=c.y||0;a.T=c.z||0;a.l=c.angle||0}function c(a,c){var f=c.width,h=c.height;a.top=0==c.top?0:c.top||-h/2;a.left=0==c.left?0:c.left||-f/2;a.bottom=0==c.bottom?0:c.bottom||a.top+h;a.right=0==c.right?0:c.right||a.left+f;a.L=f||a.right-a.left;a.S=h||a.bottom-a.top;a.F=Math.round(a.top*a.c.d);a.I=Math.round(a.left*a.c.d);a.$=Math.round(a.bottom*a.c.d);a.ga=Math.round(a.right*a.c.d);a.j=Math.round(a.L*a.c.d);a.p=Math.round(a.S*a.c.d);f=a.c.H.canvas.ownerDocument.createElement("canvas");
a.M=f.getContext("2d");a.g=c.scaleX||1;a.n=c.scaleY||1;c.rawImage?(a.W=c.rawImage,a.M.putImageData(a.W,0,0)):(h=c.draw,f.width=a.j,f.height=a.p,a.M.beginPath(),a.M.translate(-a.I,-a.F),a.M.scale(a.c.d,a.c.d),h.call(a,a.M),a.W=a.M.getImageData(0,0,a.j,a.p))}function f(a,c){a.ba=c;a.D=e.ia.ka()}e.a.Ma=function(d,g,k,h){var b=this;b.c=d;var p=[],l=[];f(b,g[1]);c(b,k[1]);a(b,h[1]);l.push(g);l.push(k);l.push(h);b.m=new e.V.ja;b.Ya=function(a,c){var d=b.Va(a,c),f=d.x-b.I,d=d.y-b.F;return 0<=f&&f<=b.j&&
0<=d&&d<=b.p&&0<b.W.data[4*d*b.j+4*f+3]};b.ta=function(a){var c=a?l.filter(function(b){return a.every(function(a){return a!=b[0]})}):l;return b.c.add.apply(b.c,c)};b.Na=function(a){return"click"==a||"pointerDown"==a||b.m.Xa(a)};b.Pa=function(){b.c.m.removeEventListener(b.D);b.M=null};b.c.m.o("deactivate").addListener({listenerId:b.D,handleEvent:function(){b.Pa()}});b.G=function(){b.c.G()};b.ca=function(a,c){return{x:b.h+(a*b.g*Math.cos(b.l)-c*b.n*Math.sin(b.l))/b.c.d,y:b.i+(a*b.g*Math.sin(b.l)+c*
b.n*Math.cos(b.l))/b.c.d}};b.Va=function(a,c){return{x:Math.round(((a-b.h)*b.c.d*Math.cos(b.l)+(c-b.i)*b.c.d*Math.sin(b.l))/b.g),y:Math.round(((c-b.i)*b.c.d*Math.cos(b.l)-(a-b.h)*b.c.d*Math.sin(b.l))/b.n)}};b.Aa=function(){return b.ca(b.I+b.j/2,b.F+b.p/2)};var n=[];n.push({x:b.I,y:b.F});n.push({x:b.ga,y:b.F});n.push({x:b.ga,y:b.$});n.push({x:b.I,y:b.$});b.Ta=function(){return n.map(function(a){return b.ca(a.x,a.y)})};b.Sa=function(){var a=b.h+""+b.i+""+b.l+""+b.g+""+b.g;if(p.getClientCorners&&p.getClientCorners.key==
a)return p.getClientCorners.value;var c=b.Ta();p.getClientCorners={key:a,value:c};return c};b.Ua=function(){var a=b.Sa();return{top:a.reduce(function(a,b){return Math.min(a,b.y)},Infinity),bottom:a.reduce(function(a,b){return Math.max(a,b.y)},-Infinity),left:a.reduce(function(a,b){return Math.min(a,b.x)},Infinity),right:a.reduce(function(a,b){return Math.max(a,b.x)},-Infinity)}};b.Ba=function(){var a=b.h+""+b.i+""+b.l+""+b.g+""+b.g;if(p.getClientRect&&p.getClientRect.key==a)return p.getClientRect.value;
var c=b.Ua();p.getClientRect={key:a,value:c};return c};b.sa=function(){var a=this,b=[].slice.apply(arguments);l=l.concat(b);b.forEach(function(b){a.ma(b[0],b[1])})};b.ma=function(a,b){var c=e.a.e[a];c&&c.K(this,b)};Object.defineProperty(b,"name",{get:function(){return this.ba},set:function(a){this.ba=a}});Object.defineProperty(b,"width",{get:function(){return this.L},set:function(a){this.L=a}});Object.defineProperty(b,"height",{get:function(){return this.S},set:function(a){this.S=a}});Object.defineProperty(b,
"scaleX",{get:function(){return this.g},set:function(a){this.g=a}});Object.defineProperty(b,"scaleY",{get:function(){return this.n},set:function(a){this.n=a}});Object.defineProperty(b,"x",{get:function(){return this.h},set:function(a){this.h=a}});Object.defineProperty(b,"y",{get:function(){return this.i},set:function(a){this.i=a}});Object.defineProperty(b,"z",{get:function(){return this.T},set:function(a){this.T=a}});Object.defineProperty(b,"angle",{get:function(){return this.l},set:function(a){this.l=
a}});Object.defineProperty(b,"id",{get:function(){return this.D}});Object.defineProperty(b,"image",{get:function(){return this.W}});Object.defineProperty(b,"events",{get:function(){return this.m}});b.clone=b.ta;b.applyDecorator=b.ma;b.applyDecorators=b.sa}})();e=e||{};e.a=e.a||{};e.a.e=e.a.e||[];e.a.e.clickable={K:function(a,c){var f=c.onclick;f&&(a.bb=function(c){f.call(a,c);a.G()},a.m.o("click").addListener({handleEvent:a.bb}));var d=!1;this.t=null;var g=c.ondown,k=c.onup;a.m.o("pointerDown").addListener({handleEvent:function(c){a.t=c.t;d=!0;g&&(g.call(a,event),a.G())},B:a.D});a.m.o("pointerUp").addListener({handleEvent:function(c){d&&a.t==c.t&&(d=!1,k&&(k.call(a,event),a.G()))},B:a.D})}};e=e||{};e.a=e.a||{};e.a.e=e.a.e||[];e.a.e.customTimer={K:function(a,c){setInterval(function(){c.action.call(a)},c.time)}};e=e||{};e.a=e.a||{};e.a.e=e.a.e||[];e.a.e.droppable={K:function(a,c){var f=c.dropZone;a.$a=!0;a.xa=f;Object.defineProperty(a,"dropZone",{get:function(){return this.xa},set:function(a){this.xa=a}})}};e=e||{};e.a=e.a||{};e.a.e=e.a.e||[];e.a.e.dropzone={K:function(a,c){var f=c.availableSpots,d=c.dropX,g=c.dropY;a.aa=[];a.m.o("drop").addListener({handleEvent:function(c){0>=f||(f--,c.J.x=d||a.h,c.J.y=g||a.i,c.J.R=a,a.aa.push(c.J),c.J.m.o("dropped").O({R:a,J:c.J}),a.m.o("droppedIn").O({R:a,J:c.J}),a.G())},B:a.D});a.Qa=function(c){c.R=null;f++;a.aa.splice(a.aa.indexOf(c),1);a.G()};Object.defineProperty(a,"droppedElements",{get:function(){return this.aa}})}};e=e||{};e.a=e.a||{};e.a.e=e.a.e||[];e.a.e.duplicable={K:function(a,c){var f=c.isBlocked,d=c.generatorCount||Infinity,g=!1;a.m.o("pointerDown").addListener({handleEvent:function(c){0<=c.t&&(g=!0);if(!(g&&0>c.t||f&&f()||0>=d)){d--;var h=a.ta(["duplicable"]);h.ba+=" (duplicate)";h.ma("movable",{Za:f});h.Ga(c);a.G()}},B:a.D})}};e.a.e=e.a.e||[];e.a.elementDecorators=e.a.e;e=e||{};e.a=e.a||{};e.a.e=e.a.e||[];
e.a.e.movable={K:function(a,c){var f=!1,d=this.t=null,g=c.Za;a.Ga=function(c){f=!0;a.t=c.t;d={x:c.x,y:c.y};a.R&&(a.R.Qa(a),a.R=null)};a.ab=function(c){f=!1;d=null;a.$a&&a.c.qa("drop",{x:c.x,y:c.y,J:a})};a.m.o("pointerDown").addListener({handleEvent:function(c){g&&g()||a.Ga(c)},B:a.D});var k=!1;a.m.o("pointerMove").addListener({handleEvent:function(c){!f||g&&g()||(k||(k=!0),a.h+=c.x-d.x,a.i+=c.y-d.y,d={x:c.x,y:c.y},a.G())},B:a.D});a.m.o("pointerUp").addListener({handleEvent:function(c){!f||g&&g()||
(a.h+=c.x-d.x,a.i+=c.y-d.y,a.ab(c),a.t=null,k=!1,a.G())},B:a.D})}};e=e||{};e.a=e.a||{};e.a.e=e.a.e||[];
e.a.e.moving={type:"moving",K:function(a,c){var f,d,g,k,h,b=c.vx,p=c.vy,l=c.ax,n=c.ay,s=c.rotationSpeed,m,r,q;a.b=a.b||{};a.b.f=new e.r.s(b||0,p||0);a.b.Y=new e.r.s(l||0,n||0);a.b.C=s||0;m=a.c.getTime();setInterval(function(){r=a.c.getTime();q=r-m;if(!(.001>q)&&(m=r,a.b.f.x+=a.b.Y.x*q,a.b.f.y+=a.b.Y.y*q,0!=a.b.f.x||0!=a.b.f.y||0!=a.b.C||a.v&&(0!=a.v.x||0!=a.v.y))){f=a.h;d=a.i;g=a.l;k=a.g;h=a.n;a.h+=a.b.f.x*q;a.i+=a.b.f.y*q;a.l+=a.b.C*q;a.v&&(a.g+=a.v.x*q,a.n+=a.v.y*q);var b=!0;a.ea&&a.ea.forEach(function(c){b&&
(c.call(a)||(b=!1))});b||(a.h=f,a.i=d,a.l=g,a.g=k,a.n=h)}},20);Object.defineProperty(a,"moving",{get:function(){return this.b},set:function(a){this.b=a}});Object.defineProperty(a.b,"speed",{get:function(){return this.f},set:function(a){this.f=a}});Object.defineProperty(a.b,"acceleration",{get:function(){return this.Y},set:function(a){this.Y=a}});Object.defineProperty(a.b,"rotationSpeed",{get:function(){return this.C},set:function(a){this.C=a}});Object.defineProperty(a,"scaleSpeed",{get:function(){return this.v},
set:function(a){this.v=a}})}};e=e||{};e.a=e.a||{};e.a.e=e.a.e||[];
e.a.e.solid={K:function(a,c){var f=[];a.q={};a.q.X=c.mass||1;var d=c.onCollision,g=c.coefficient;a.q.fixed=c.fixed||!1;a.q.za=a.q.fixed||c.fixedPoint||!1;a.c.va=a.c.va||new e.a.Ja(a.c);a.q.ua=g||0===g?g:1;a.b=a.b||{f:new e.r.s(0,0),Y:new e.r.s(0,0),C:0};a.m.o("collision").addListener({handleEvent:function(b){d&&d.call(a,b)}});a.ea=this.ea||[];a.ea.push(function(){return a.c.va.cb(a)});a.Da=function(){return a.q.X/12*(a.j*a.g*a.j*a.g+a.p*a.n*a.p*a.n)};a.Ra=function(){return Math.sqrt(a.L*a.L*a.g*a.g+
a.S*a.S*a.n*a.n)/2};a.Ea=function(){var b=a.L+""+a.S+""+a.g+""+a.n;if(f.getRadius&&f.getRadius.key==b)return f.getRadius.fb;var c=a.Ra();f.geRadius={lb:b,fb:c};return c};var k=a.c.H.canvas,g=k.ownerDocument.createElement("canvas"),k=k.ownerDocument.createElement("canvas");g.width=k.width=a.j;g.height=k.height=a.p;a.Q=k.getContext("2d");a.Q.putImageData(a.W,0,0);a.Q.globalCompositeOperation="source-atop";a.Q.fillStyle="#000";a.Q.fillRect(0,0,a.j,a.p);a.k=g.getContext("2d");a.k.globalCompositeOperation=
"source-over";a.k.drawImage(a.Q.canvas,0,0);g=a.k.getImageData(0,0,a.j,a.p);k=a.k.createImageData(a.j,a.p);a.wa=[];for(var h=0;h<a.j;h++)for(var b=0;b<a.p;b++)if(!(200>g.data[b*a.j*4+4*h+3])){for(var p=!1,l=-1;2>l;l++)for(var n=-1;2>n;n++)if(0>b+l||0>h+n||b+l>a.p-1||h+l>a.L-1||100>g.data[(b+l)*a.L*4+4*(h+n)+3])p=!0,n=l=2;a.k.putImageData(k,0,0);p&&(a.wa.push({x:h,y:b}),k.data[b*a.j*4+4*h]=0,k.data[b*a.j*4+4*h+1]=0,k.data[b*a.j*4+4*h+2]=0,k.data[b*a.j*4+4*h+3]=255)}a.k.putImageData(k,0,0);a.k.translate(-a.I,
-a.F);Object.defineProperty(a,"solid",{get:function(){return this.q},set:function(a){this.q=a}});Object.defineProperty(a.q,"mass",{get:function(){return this.X},set:function(a){this.X=a}})}};(function(){var a=e.V=e.V||{},c;a.ra=function(a){this.ya=a;c=e.ia;var d=[];this.O=function(g){c.ka();var k=d.length;d.forEach(function(c){c.hb=a;setTimeout(function(){c.handleEvent(g);k--})})};this.addListener=function(a){a.handleEvent=a.handleEvent||a.handleEvent;a.Z=a.Z||a.rank;a.B=a.B||a.listenerId;var f=c.ka();d.push({na:f,handleEvent:a.handleEvent,Z:a.Z,B:a.B});d=d.sort(function(a,b){return(a.Z||Infinity)-(b.Z||Infinity)});return f};this.removeEventListener=function(a){d=d.filter(function(c){return Boolean(a.na)&&
c.na!=a.na||Boolean(a.B)&&c.B!=a.B})}};e.Creevents=a;a.Event=a.ra})();(function(){var a=e.V=e.V||{};a.ja=function(){var c={},f=[];this.Xa=function(a){return void 0!=c[a]};this.o=function(d){c[d]||(f.push(d),c[d]=new a.ra(d));return c[d]};this.removeEventListener=function(a){c[a.ya]?c[a.ya].removeEventListener(a):f.forEach(function(f){c[f].removeEventListener(a)})};this.getEvent=this.o};a.EventContainer=a.ja})();(function(){var a=e.ia=e.ia||{};a.ka=function(){var c=Date.now().toString(16),c=a.Fa("x",15-c.length)+c;return("xxxxxxxx-xxxx-4xxx-y"+c.slice(0,3)+"-"+c.slice(3)).replace(/[xy]/g,function(a){var c=16*Math.random()|0;return("x"==a?c:c&3|8).toString(16)})};a.Fa=function(c,f){return 0>=f?"":c+a.Fa(c,f-1)}})();(function(){var a=e.La=e.La||{};a.la=function(){this.P=function(a){console.log(a)}};e.Crelog=a;a.Logger=a.la;a.la.log=a.la.P})();
