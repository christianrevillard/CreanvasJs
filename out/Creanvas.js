var e=e||{};e.a=e.a||{};window.CreJs=e;e.Creanvas=e.a;(function(){var a=e.n=e.n||{};a.p=function(c,g,k){var d=this;this.u=c;this.v=g;this.X=k||0;this.Da=function(c){return{Q:a.qa(d,c.Q),q:a.qa(d,c.q),Ma:a.qa(d,c.Ma)}}};Object.defineProperty(a.p.prototype,"x",{get:function(){return this.u},set:function(a){this.u=a}});Object.defineProperty(a.p.prototype,"y",{get:function(){return this.v},set:function(a){this.v=a}});Object.defineProperty(a.p.prototype,"z",{get:function(){return this.X},set:function(a){this.X=a}});a.Za=function(c,g,k,d){c=k-c;g=d-g;d=Math.sqrt(c*
c+g*g);return{Q:new a.p(c/d,g/d,0),q:new a.p(-g/d,c/d,0),Ma:new a.p(0,0,0)}};a.qb=function(a,g,k,d,f){a.lineWidth=5;a.strokeStyle=f;a.beginPath();a.moveTo(g,k);a.lineTo(g+100*d.Q.u,k+100*d.Q.v);a.moveTo(g,k);a.lineTo(g+50*d.q.u,k+50*d.q.v);a.stroke();a.lineWidth=1;a.strokeStyle="#000"};a.pb=function(a,g,k,d,f,l,b){a.lineWidth=5;a.strokeStyle=b;a.beginPath();a.moveTo(g,k);a.lineTo(g+100*f*d.Q.u,k+100*f*d.Q.v);a.lineTo(g+100*f*d.Q.u+100*l*d.q.u,k+100*f*d.Q.v+100*l*d.q.v);a.stroke();a.lineWidth=1;a.strokeStyle=
"#000"};a.qa=function(a,g){return a.u*g.u+a.v*g.v};a.ia=function(c,g){return new a.p(c.v*g.X-c.X*g.v,c.X*g.u-c.u*g.X,c.u*g.v-c.v*g.u)};e.Core=e.n;e.n.Vector=e.n.p})();e.a.Na=function(a){function c(){return a.elements.filter(function(a){return a.s})}function g(a,f,c){var b,g,h,m,k,n;b=c.nb;m=new e.n.p(c.x-a.i,c.y-a.j);k=e.n.ia(m,b.q).z;n=new e.n.p(c.x-f.i,c.y-f.j);c=e.n.ia(n,b.q).z;var r=e.n.ia(m,b.q),q=e.n.ia(n,b.q);g=new e.n.p(a.b.e.x,a.b.e.y);h=new e.n.p(f.b.e.x,f.b.e.y);a.r&&(g.x+=m.x*a.r.x,g.y+=m.y*a.r.y);f.r&&(h.x+=n.x*f.r.x,h.y+=n.y*f.r.y);m=a.s.wa*f.s.wa*2*(h.Da(b).q-g.Da(b).q+f.b.H*q.z-a.b.H*r.z)/(1/f.s.M+1/a.s.M+q.z*q.z/f.fa()+r.z*r.z/a.fa());a.b.e.x+=
m/a.s.M*b.q.x;a.b.e.y+=m/a.s.M*b.q.y;f.b.e.x-=m/f.s.M*b.q.x;f.b.e.y-=m/f.s.M*b.q.y;a.b.H+=m*k/a.fa();f.b.H-=m*c/f.fa()}function k(a,f){var c,b,g,h,m,k,n;h=a.Ca();m=f.Ca();c=Math.max(h.left,m.left)-1;b=Math.min(h.right,m.right)+1;g=Math.max(h.top,m.top)-1;h=Math.min(h.bottom,m.bottom)+1;if(!(0>=b-c||0>=h-g)){c=a.f.getImageData(0,0,a.c,a.g);a.f.scale(1/(a.h||1),1/(a.l||1));a.f.rotate(-(a.m||0));a.f.translate(f.i-a.i,f.j-a.j);a.f.rotate(f.m||0);a.f.scale(f.h||1,f.l||1);a.f.globalCompositeOperation="destination-out";
a.f.drawImage(f.T.canvas,0,0,f.c,f.g,-f.A,-f.B,f.c,f.g);a.f.scale(1/(f.h||1),1/(f.l||1));a.f.rotate(-f.m||0);a.f.translate(-f.i+a.i,-f.j+a.j);a.f.rotate(a.m||0);a.f.scale(a.h||1,a.l||1);k=a.f.getImageData(0,0,a.c,a.g);a.f.globalCompositeOperation="source-over";a.f.putImageData(c,0,0);n=[];a.ya.forEach(function(h){90>k.data[h.y*a.c*4+4*h.x+3]&&n.push(h)});if(2>n.length)return null;var r;g=b=0;c=n.length-1;for(h=1;h<n.length;h++)for(m=h+1;m<n.length;m++){r=n[h].x-n[m].x;var q=n[h].y-n[m].y;r=Math.sqrt(r*
r+q*q);r>b&&(b=r,g=h,c=m)}b=a.ea(n[g].x-a.A,n[g].y-a.B);c=a.ea(n[c].x-a.A,n[c].y-a.B);return b.x==c.x&&b.y==c.y?null:{x:Math.round((b.x+c.x)/2),y:Math.round((b.y+c.y)/2),nb:e.n.Za(b.x,b.y,c.x,c.y)}}}this.kb=function(a){var f=c(),l,b,p;l=a.Ba();f=f.filter(function(h){var b;if(h.F===a.F||!(h.b.e.x||h.b.e.y||a.b.e.x||a.b.e.y||h.r||a.r))return!1;b=h.Ba();return Math.sqrt((l.x-b.x)*(l.x-b.x)+(l.y-b.y)*(l.y-b.y))>a.Ea()+h.Ea()?!1:!0});if(0==f.length)return!0;b=null;f.forEach(function(h){b||(b=k(a,h))&&
(p=h)});if(!b)return!0;g(a,p,b);a.k.J("collision",{element:p,Sa:b});p.k.J("collision",{element:a,Sa:b});return!1}};e.a.Oa=function(a){var c,g,k,d,f,l,b,p;d=this;c=a.canvas;b=a.timeScale||1;p=a.meterPerPoint||1;a.xb?(l=Date.now(),this.getTime=function(){return(Date.now()-l)*b}):(f=0,setInterval(function(){f+=10*b},10),this.getTime=function(){return f});this.S=function(h){a.log&&a.log(h)};d.w=c.getContext("2d");d.w.setTransform(1,0,0,1,0,0);d.w.scale(1/p,1/p);g=!0;isDrawing=!1;k=a.refreshTime||50;this.ta=function(a,b){var c=!1;d.elements.filter(function(b){return b.Ra(a)}).sort(function(a,b){return b.V||0-a.V||
0}).forEach(function(d){!c&&d.ab(b.x,b.y)&&(d.k.J(a,b),c=!0)})};this.La=function(a,b){d.elements.forEach(function(d){d.I==b.I&&d.k.J(a,b)})};this.pa=function(a,b){c.addEventListener(a,function(a){setTimeout(function(){if(a.changedTouches)for(var h=0;h<a.changedTouches.length;h++){var c=a.changedTouches[h].identifier,f=d.W(a.changedTouches[h]);f.I=c;d.ta(b,f)}else h=d.W(a),h.I=-1,d.ta(b,h)})})};this.ha=function(a,b){c.addEventListener(a,function(a){setTimeout(function(){if(a.changedTouches)for(var h=
0;h<a.changedTouches.length;h++){var c=a.changedTouches[h].identifier,f=d.W(a.changedTouches[h]);f.I=c;d.La(b,f)}else h=d.W(a),h.I=-1,d.La(b,h)})})};this.k=new e.Y.ka;this.pa("click","click");this.pa("mousedown","pointerDown");this.pa("touchstart","pointerDown");this.ha("mousemove","pointerMove");this.ha("touchmove","pointerMove");this.ha("mouseup","pointerUp");this.ha("touchend","pointerUp");this.lb=function(){d.k.J("deactivate");d.elements=[]};this.N=function(){g=!0};this.W=function(a){var b=c.getBoundingClientRect();
d.S("ClientXY: ("+a.clientX+","+a.clientY+")");b={x:Math.round((a.clientX-b.left)*c.width/b.width*p),y:Math.round((a.clientY-b.top)*c.height/b.height*p)};d.S("canvasXY: ("+b.x+","+b.y+")");"click"==a.type&&d.S("Click on ! canvasXY: ("+b.x+","+b.y+")");return b};d.elements=[];this.add=function(){var a=[].slice.call(arguments),b=new e.a.Qa(d,a[0]);1<a.length&&b.ca.apply(b,a.slice(1));d.elements.push(b);return b};d.S("Adding background");this.add({R:"background",L:{$:c.width,Z:c.height,Ga:{ra:0,sa:0},
Fa:a.drawBackground||function(b){b.fillStyle=a.backgroundStyle||"#FFF";b.fillRect(0,0,c.width,c.height)}},Aa:{Ha:-Infinity}});setInterval(function(){g&&!isDrawing?(isDrawing=!0,d.elements.sort(function(a,b){return(a.V||0)-(b.V||0)}).forEach(function(a){d.w.translate(a.i,a.j);d.w.rotate(a.m||0);d.w.scale(a.h||1,a.l||1);d.w.drawImage(a.P.canvas,0,0,a.c,a.g,-a.A,-a.B,a.c,a.g);d.w.scale(1/(a.h||1),1/a.l||1);d.w.rotate(-(a.m||0));d.w.translate(-a.i,-a.j)}),isDrawing=!1):d.S("No redraw")},k);this.addElement=
function(){var a=[].slice.call(arguments),b=a[0];a[0]={R:b.name,L:b.image?{$:b.image.width,Z:b.image.height,Fa:b.image.draw,Ga:b.image.translate?{ra:b.image.translate.dx,sa:b.image.translate.dy}:null}:null,Aa:b.position?{gb:b.position.x||0,hb:b.position.y||0,Ha:b.position.z||0}:null};return this.add.apply(this,a)};this.redraw=this.N;this.stop=this.lb};e.a.Controller=e.a.Oa;e.a.Qa=function(a,c){this.R=c.R;var g=c.L,k=g.Fa,d=c.Aa,f=[].slice.apply(arguments).slice(2),l=[];this.o=a;this.F=e.ja.la();this.c=g.$;this.g=g.Z;this.i=d.gb||0;this.j=d.hb||0;this.V=d.Ha||0;this.m=d.wb||0;this.h=g.sb||1;this.l=g.tb||1;d=g.Ga||{ra:g.$/2,sa:g.Z/2};this.A=d.ra;this.B=d.sa;g.ib?(this.L=g.ib,d=this.o.w.canvas,d=d.ownerDocument.createElement("canvas"),this.P=d.getContext("2d"),this.P.putImageData(this.L,0,0)):(d=this.o.w.canvas,d=d.ownerDocument.createElement("canvas"),d.width=g.$,d.height=
g.Z,this.P=d.getContext("2d"),this.P.beginPath(),this.P.translate(this.A,this.B),k(this.P),this.L=this.P.getImageData(0,0,g.$,g.Z));var b=this;this.k=new e.Y.ka;this.isPointInPath=function(a){a=b.o.W(a);return b.o.vb.isPointInPath(b,k,a)};0<f.length&&e.a.d&&b.ca(f);this.ab=function(a,d){var c=Math.round(a-b.i+b.A),f=Math.round(d-b.j+b.B);return 0<=c&&c<=b.c&&0<=f&&f<=b.g&&0<b.L.data[4*f*b.c+4*c+3]};this.va=function(a){g.rb=b.L;var d=b.o.add(c),k=a?f.filter(function(b){return a.every(function(a){return a!=
b[0]})}):f;d.ca.apply(d,k);return d};this.jb=function(a){(a=e.a.d[a])&&a.Ia&&a.Ia(b)};this.Ra=function(a){return"click"==a||"pointerDown"==a||b.k.$a(a)};this.Ta=function(){b.o.k.removeEventListener({t:b.F});b.P=null};b.o.k.D({eventId:"deactivate",listenerId:b.F,handleEvent:function(){b.Ta()}});this.N=function(){b.o.N()};this.ea=function(a,d){return{x:Math.round(b.i+a*b.h*Math.cos(b.m)-d*b.l*Math.sin(b.m)),y:Math.round(b.j+a*b.h*Math.sin(b.m)+d*b.l*Math.cos(b.m))}};this.Ba=function(){return b.ea(-b.A+
b.c/2,-b.B+b.g/2)};var p=[];p.push({x:-b.A,y:-b.B});p.push({x:-b.A+b.c,y:-b.B});p.push({x:-b.A+b.c,y:-b.B+b.g});p.push({x:-b.A,y:-b.B+b.g});this.Xa=function(){return p.map(function(a){return b.ea(a.x,a.y)})};this.Wa=function(){var a=b.i+""+b.j+""+b.m+""+b.h+""+b.h;if(l.getClientCorners&&l.getClientCorners.key==a)return l.getClientCorners.value;var d=b.Xa();l.getClientCorners={key:a,value:d};return d};this.Ya=function(){var a=b.Wa();return{top:a.reduce(function(a,b){return Math.min(a,b.y)},Infinity),
bottom:a.reduce(function(a,b){return Math.max(a,b.y)},-Infinity),left:a.reduce(function(a,b){return Math.min(a,b.x)},Infinity),right:a.reduce(function(a,b){return Math.max(a,b.x)},-Infinity)}};this.Ca=function(){var a=b.i+""+b.j+""+b.m+""+b.h+""+b.h;if(l.getClientRect&&l.getClientRect.key==a)return l.getClientRect.value;var d=b.Ya();l.getClientRect={key:a,value:d};return d};this.ca=function(){var a=this,b=[].slice.apply(arguments);f=f.concat(b);b.forEach(function(b){a.na(b[0],b[1])})};this.na=function(a,
b){var d=e.a.d[a];d&&d.O(this,b)};Object.defineProperty(b,"name",{get:function(){return this.R},set:function(a){this.R=a}});Object.defineProperty(b,"width",{get:function(){return this.c},set:function(a){this.c=a}});Object.defineProperty(b,"height",{get:function(){return this.g},set:function(a){this.g=a}});Object.defineProperty(b,"scaleX",{get:function(){return this.h},set:function(a){this.h=a}});Object.defineProperty(b,"scaleY",{get:function(){return this.l},set:function(a){this.l=a}});Object.defineProperty(b,
"x",{get:function(){return this.i},set:function(a){this.i=a}});Object.defineProperty(b,"y",{get:function(){return this.j},set:function(a){this.j=a}});Object.defineProperty(b,"z",{get:function(){return this.V},set:function(a){this.V=a}});Object.defineProperty(b,"angle",{get:function(){return this.m},set:function(a){this.m=a}});Object.defineProperty(b,"id",{get:function(){return this.F}});Object.defineProperty(b,"image",{get:function(){return this.L}});Object.defineProperty(b,"events",{get:function(){return this.k}});
b.clone=b.va;b.applyDecorator=b.na;b.applyDecorators=b.ca;b.removeDecorator=b.jb};e=e||{};e.a=e.a||{};e.a.d=e.a.d||[];e.a.d.clickable={O:function(a,c){var g=c.onclick;a.fb=function(c){g.call(a,c);a.N()};a.k.D({G:"click",handleEvent:a.fb})}};e=e||{};e.a=e.a||{};e.a.d=e.a.d||[];e.a.d.customTimer={O:function(a,c){setInterval(function(){c.action.call(a)},c.time)}};e=e||{};e.a=e.a||{};e.a.d=e.a.d||[];e.a.d.droppable={O:function(a,c){var g=c.dropZone;a.cb=!0;a.za=g;Object.defineProperty(a,"dropZone",{get:function(){return this.za},set:function(a){this.za=a}})}};e=e||{};e.a=e.a||{};e.a.d=e.a.d||[];e.a.d.dropzone={O:function(a,c){var g=c.availableSpots,k=c.dropX,d=c.dropY;a.da=[];a.k.D({C:"dropzone",G:"drop",handleEvent:function(c){0>=g||(g--,c.K.x=k||a.i,c.K.y=d||a.j,c.K.U=a,a.da.push(c.K),c.K.k.J("dropped",{U:a,K:c.K}),a.k.J("droppedIn",{U:a,K:c.K}),a.N())},t:a.F});a.Ua=function(d){d.U=null;g++;a.da.splice(a.da.indexOf(d),1);a.N()};Object.defineProperty(a,"droppedElements",{get:function(){return this.da}})}};e=e||{};e.a=e.a||{};e.a.d=e.a.d||[];e.a.d.duplicable={O:function(a,c){var g=c.isBlocked,k=c.generatorCount||Infinity,d=!1;a.k.D({C:"duplicable",G:"pointerDown",handleEvent:function(c){0<=c.I&&(d=!0);if(!(d&&0>c.I||g&&g()||0>=k)){k--;var l=a.va(["duplicable"]);l.R+=" (duplicate)";l.na("movable",{bb:g});l.Ka(c);a.N()}},t:a.F})},Ia:function(a){a.k.removeEventListener({C:"duplicable",t:a.F})}};e.a.d=e.a.d||[];e.a.elementDecorators=e.a.d;e=e||{};e.a=e.a||{};e.a.d=e.a.d||[];
e.a.d.movable={O:function(a,c){var g=!1,k=this.I=null,d=c.bb;a.Ka=function(d){g=!0;a.I=d.I;k={x:d.x,y:d.y};a.U&&(a.U.Ua(a),a.U=null)};a.eb=function(d){g=!1;k=null;a.cb&&a.o.ta("drop",{x:d.x,y:d.y,K:a})};a.k.D({C:"movable",G:"pointerDown",handleEvent:function(c){d&&d()||a.Ka(c)},t:a.F});var f=!1;a.k.D({C:"movable",G:"pointerMove",handleEvent:function(c){!g||d&&d()||(f||(f=!0),a.i+=c.x-k.x,a.j+=c.y-k.y,k={x:c.x,y:c.y},a.N())},t:a.F});a.k.D({C:"movable",G:"pointerUp",handleEvent:function(c){!g||d&&d()||
(a.o.W(c),a.i+=c.x-k.x,a.j+=c.y-k.y,a.eb(c),a.I=null,f=!1,a.N())},t:a.F})}};e=e||{};e.a=e.a||{};e.a.d=e.a.d||[];
e.a.d.moving={type:"moving",O:function(a,c){var g,k,d,f,l,b=c.vx,p=c.vy,h=c.ax,m=c.ay,s=c.rotationSpeed,n,r,q;a.b=a.b||{};a.b.e=new e.n.p(b||0,p||0);a.b.aa=new e.n.p(h||0,m||0);a.b.H=s||0;n=a.o.getTime();setInterval(function(){r=a.o.getTime();q=r-n;if(!(1>q)&&(n=r,a.b.e.x+=a.b.aa.x*q,a.b.e.y+=a.b.aa.y*q,0!=a.b.e.x||0!=a.b.e.y||0!=a.b.H||a.r&&(0!=a.r.x||0!=a.r.y))){g=a.i;k=a.j;d=a.m;f=a.h;l=a.l;a.i+=a.b.e.x*q;a.j+=a.b.e.y*q;a.m+=a.b.H*q;a.r&&(a.h+=a.r.x*q,a.l+=a.r.y*q);var b=!0;a.ga&&a.ga.forEach(function(d){b&&
(d.call(a)||(b=!1))});b||(a.i=g,a.j=k,a.m=d,a.h=f,a.l=l)}},20);Object.defineProperty(a,"moving",{get:function(){return this.b},set:function(a){this.b=a}});Object.defineProperty(a.b,"speed",{get:function(){return this.e},set:function(a){this.e=a}});Object.defineProperty(a.b,"acceleration",{get:function(){return this.aa},set:function(a){this.aa=a}});Object.defineProperty(a.b,"rotationSpeed",{get:function(){return this.H},set:function(a){this.H=a}});Object.defineProperty(a,"scaleSpeed",{get:function(){return this.r},
set:function(a){this.r=a}})}};e=e||{};e.a=e.a||{};e.a.d=e.a.d||[];
e.a.d.solid={O:function(a,c){var g=[];a.s={};a.s.M=c.mass||1;var k=c.onCollision,d=c.coefficient;a.o.xa=a.o.xa||new e.a.Na(a.o);a.s.wa=d||0===d?d:1;a.b=a.b||{e:new e.n.p(0,0),aa:new e.n.p(0,0),H:0};a.k.D({G:"collision",handleEvent:function(b){k&&k.call(a,b)}});a.ga=this.ga||[];a.ga.push(function(){return a.o.xa.kb(a)});a.fa=function(){return a.s.M/12*(a.c*a.h*a.c*a.h+a.g*a.l*a.g*a.l)};a.Va=function(){return Math.sqrt(a.c*a.c*a.h*a.h+a.g*a.g*a.l*a.l)/2};a.Ea=function(){var b=a.c+""+a.g+""+a.h+""+a.l;
if(g.getRadius&&g.getRadius.key==b)return g.getRadius.mb;var d=a.Va();g.geRadius={ub:b,mb:d};return d};var f=a.o.w.canvas,d=f.ownerDocument.createElement("canvas"),f=f.ownerDocument.createElement("canvas");d.width=f.width=a.c;d.height=f.height=a.g;a.T=f.getContext("2d");a.T.putImageData(a.L,0,0);a.T.globalCompositeOperation="source-atop";a.T.fillStyle="#000";a.T.fillRect(0,0,a.c,a.g);a.f=d.getContext("2d");a.f.globalCompositeOperation="source-over";a.f.drawImage(a.T.canvas,0,0);d=a.f.getImageData(0,
0,a.c,a.g);f=a.f.createImageData(a.c,a.g);a.ya=[];for(var l=0;l<a.c;l++)for(var b=0;b<a.g;b++)if(!(200>d.data[b*a.c*4+4*l+3])){for(var p=!1,h=-1;2>h;h++)for(var m=-1;2>m;m++)if(0>b+h||0>l+m||b+h>a.g-1||l+h>a.c-1||100>d.data[(b+h)*a.c*4+4*(l+m)+3])p=!0,m=h=2;a.f.putImageData(f,0,0);p&&(a.ya.push({x:l,y:b}),f.data[b*a.c*4+4*l]=0,f.data[b*a.c*4+4*l+1]=0,f.data[b*a.c*4+4*l+2]=0,f.data[b*a.c*4+4*l+3]=255)}a.f.putImageData(f,0,0);a.f.translate(a.A,a.B);Object.defineProperty(a,"solid",{get:function(){return this.s},
set:function(a){this.s=a}});Object.defineProperty(a.s,"mass",{get:function(){return this.M},set:function(a){this.M=a}})}};(function(){var a=e.Y=e.Y||{},c;a.ua=function(a){this.G=a;c=e.ja;var k=[];this.J=function(d,f){c.la();var l=k.length;k.forEach(function(b){b.ob=a;setTimeout(function(){b.handleEvent(d);l--;0==l&&f&&f()})})};this.D=function(a){a.handleEvent=a.handleEvent||a.handleEvent;a.ba=a.ba||a.rank;a.t=a.t||a.listenerId;a.C=a.C||a.eventGroupType;var f=c.la();k.push({oa:f,handleEvent:a.handleEvent,ba:a.ba,t:a.t,C:a.C});k=k.sort(function(a,b){return(a.ba||Infinity)-(b.ba||Infinity)});return f};this.removeEventListener=
function(a){k=k.filter(function(c){return Boolean(a.oa)&&c.oa!=a.oa||Boolean(a.t)&&c.t!=a.t||Boolean(a.C)&&c.C!=a.C})}};e.Creevents=a;a.Event=a.ua})();(function(){var a=e.Y=e.Y||{};a.ka=function(){var c={},g=[];this.$a=function(a){return void 0!=c[a]};this.D=function(k){var d=k.G||k.eventId;c[d]||(g.push(d),c[d]=new a.ua(d));return c[d].D(k)};this.J=function(a,d,f){c[a]&&(d&&(d.G=a),c[a].J(d,f))};this.removeEventListener=function(a){c[a.G]?c[a.G].removeEventListener(a):g.forEach(function(d){c[d].removeEventListener(a)})};this.addEventListener=this.D};a.EventContainer=a.ka})();(function(){var a=e.ja=e.ja||{};a.la=function(){var c=Date.now().toString(16),c=a.Ja("x",15-c.length)+c;return("xxxxxxxx-xxxx-4xxx-y"+c.slice(0,3)+"-"+c.slice(3)).replace(/[xy]/g,function(a){var c=16*Math.random()|0;return("x"==a?c:c&3|8).toString(16)})};a.Ja=function(c,g){return 0>=g?"":c+a.Ja(c,g-1)}})();(function(){var a=e.Pa=e.Pa||{};a.ma=function(){this.S=function(a){console.log(a)}};e.Crelog=a;a.Logger=a.ma;a.ma.log=a.ma.S})();
