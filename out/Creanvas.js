var f=f||{};f.a=f.a||{};window.CreJs=f;f.Creanvas=f.a;(function(){var a=f.r=f.r||{};a.s=function(e,c,d){var h=this;this.w=e;this.A=c;this.S=d||0;this.fb=function(a,d,b,e){a.lineWidth=5;a.strokeStyle=e;a.beginPath();a.moveTo(d,b);a.lineTo(d+100*h.w,b+100*h.A);a.stroke();a.lineWidth=1;a.strokeStyle="#000"};this.xa=function(d){return{L:a.la(h,d.L),u:a.la(h,d.u),Ea:a.la(h,d.Ea)}}};Object.defineProperty(a.s.prototype,"x",{get:function(){return this.w},set:function(a){this.w=a}});Object.defineProperty(a.s.prototype,"y",{get:function(){return this.A},set:function(a){this.A=
a}});Object.defineProperty(a.s.prototype,"z",{get:function(){return this.S},set:function(a){this.S=a}});a.Ta=function(e,c,d,h){e=d-e;c=h-c;h=Math.sqrt(e*e+c*c);return{L:new a.s(e/h,c/h,0),u:new a.s(-c/h,e/h,0),Ea:new a.s(0,0,0)}};a.hb=function(a,c,d,h,k){a.lineWidth=5;a.strokeStyle=k;a.beginPath();a.moveTo(c,d);a.lineTo(c+100*h.L.w,d+100*h.L.A);a.moveTo(c,d);a.lineTo(c+50*h.u.w,d+50*h.u.A);a.stroke();a.lineWidth=1;a.strokeStyle="#000"};a.gb=function(a,c,d,h,k,g,b){a.lineWidth=5;a.strokeStyle=b;a.beginPath();
a.moveTo(c,d);a.lineTo(c+100*k*h.L.w,d+100*k*h.L.A);a.lineTo(c+100*k*h.L.w+100*g*h.u.w,d+100*k*h.L.A+100*g*h.u.A);a.stroke();a.lineWidth=1;a.strokeStyle="#000"};a.la=function(a,c){return a.w*c.w+a.A*c.A};a.ea=function(e,c){return new a.s(e.A*c.S-e.S*c.A,e.S*c.w-e.w*c.S,e.w*c.A-e.A*c.w)};f.Core=f.r;f.r.Vector=f.r.s})();f.a.Fa=function(a){function e(){return a.elements.filter(function(a){return a.q})}function c(a,d,g){var b,l,e,c,s,m;b=g.eb;c=new f.r.s(g.x-a.h,g.y-a.i);s=f.r.ea(c,b.u).z;m=new f.r.s(g.x-d.h,g.y-d.i);g=f.r.ea(m,b.u).z;var r=f.r.ea(c,b.u),q=f.r.ea(m,b.u);l=new f.r.s(a.b.f.x,a.b.f.y);e=new f.r.s(d.b.f.x,d.b.f.y);a.v&&(l.x+=c.x*a.v.x,l.y+=c.y*a.v.y);d.v&&(e.x+=m.x*d.v.x,e.y+=m.y*d.v.y);c=a.q.ua?Infinity:a.q.V;m=d.q.ua?Infinity:d.q.V;var t=a.q.fixed?Infinity:a.ya(),u=d.q.fixed?Infinity:d.ya();l=a.q.qa*
d.q.qa*2*(e.xa(b).u-l.xa(b).u+d.b.B*q.z-a.b.B*r.z)/(1/m+1/c+q.z*q.z/u+r.z*r.z/t);a.b.f.x+=l/c*b.u.x;a.b.f.y+=l/c*b.u.y;d.b.f.x-=l/m*b.u.x;d.b.f.y-=l/m*b.u.y;a.b.B+=l*s/t;d.b.B-=l*g/u}function d(a,d){var g,b,e,c,n,s,m;c=a.wa();n=d.wa();g=Math.max(c.G,n.G)-1;b=Math.min(c.da,n.da)+1;e=Math.max(c.C,n.C)-1;c=Math.min(c.X,n.X)+1;if(!(0>=b-g||0>=c-e)){g=a.k.getImageData(0,0,a.j,a.p);a.k.scale(1/(a.g||1),1/(a.n||1));a.k.rotate(-(a.l||0));a.k.translate(d.h*a.c.d-a.h*a.c.d,d.i*a.c.d-a.i*a.c.d);a.k.rotate(d.l||
0);a.k.scale(d.g||1,d.n||1);a.k.globalCompositeOperation="destination-out";a.k.drawImage(d.O.canvas,0,0,d.j,d.p,d.G,d.C,d.j,d.p);a.k.scale(1/(d.g||1),1/(d.n||1));a.k.rotate(-d.l||0);a.k.translate(-d.h*a.c.d+a.h*a.c.d,-d.i*a.c.d+a.i*a.c.d);a.k.rotate(a.l||0);a.k.scale(a.g||1,a.n||1);s=a.k.getImageData(0,0,a.j,a.p);a.k.globalCompositeOperation="source-over";a.k.putImageData(g,0,0);m=[];a.sa.forEach(function(b){90>s.data[b.y*a.j*4+4*b.x+3]&&m.push(b)});if(2>m.length)return null;var r;e=b=0;g=m.length-
1;for(c=1;c<m.length;c++)for(n=c+1;n<m.length;n++){r=m[c].x-m[n].x;var q=m[c].y-m[n].y;r=Math.sqrt(r*r+q*q);r>b&&(b=r,e=c,g=n)}b=a.$(m[e].x+a.left,m[e].y+a.C);g=a.$(m[g].x+a.left,m[g].y+a.C);return b.x==g.x&&b.y==g.y?null:{x:(b.x+g.x)/2,y:(b.y+g.y)/2,eb:f.r.Ta(b.x,b.y,g.x,g.y)}}}this.ab=function(a){var k=e(),g,b,l;g=a.va();k=k.filter(function(b){var d;if(b.ja===a.ja||!(b.b.f.x||b.b.f.y||a.b.f.x||a.b.f.y||b.v||a.v||a.b.B||b.b.B))return!1;d=b.va();return Math.sqrt((g.x-d.x)*(g.x-d.x)+(g.y-d.y)*(g.y-
d.y))>a.za()+b.za()?!1:!0});if(0==k.length)return!0;b=null;k.forEach(function(c){b||(b=d(a,c))&&(l=c)});if(!b)return!0;c(a,l,b);a.m.o("collision").M({element:l,La:b});l.m.o("collision").M({element:a,La:b});return!1}};f.a.Ga=function(a){var e,c,d,h,k,g,b=this;e=a.canvas;g=a.timeScale||1;this.d=a.lengthScale||e.height/a.realHeight||e.width/a.realWidth||1;a.jb?(k=Date.now(),this.getTime=function(){return(Date.now()-k)*g/1E3}):(h=0,setInterval(function(){h+=10*g/1E3},10),this.getTime=function(){return h});this.N=function(b){a.log&&a.log(b)};b.F=e.getContext("2d");b.F.setTransform(1,0,0,1,0,0);c=!0;isDrawing=!1;d=a.refreshTime||50;this.ma=function(a,d){var c=!1;b.elements.filter(function(b){return b.Ka(a)}).sort(function(a,
b){return b.R||0-a.R||0}).forEach(function(b){!c&&b.Wa(d.x,d.y)&&(b.m.o(a).M(d),c=!0)})};this.Da=function(a,d){b.elements.forEach(function(b){b.t==d.t&&b.m.o(a).M(d)})};this.ka=function(a,d){e.addEventListener(a,function(a){setTimeout(function(){if(a.changedTouches)for(var c=0;c<a.changedTouches.length;c++){var e=a.changedTouches[c].identifier,g=b.aa(a.changedTouches[c]);g.t=e;b.ma(d,g)}else c=b.aa(a),c.t=-1,b.ma(d,c)})})};this.ca=function(a,d){e.addEventListener(a,function(a){setTimeout(function(){if(a.changedTouches)for(var c=
0;c<a.changedTouches.length;c++){var e=a.changedTouches[c].identifier,g=b.aa(a.changedTouches[c]);g.t=e;b.Da(d,g)}else c=b.aa(a),c.t=-1,b.Da(d,c)})})};this.m=new f.T.ga;this.ka("click","click");this.ka("mousedown","pointerDown");this.ka("touchstart","pointerDown");this.ca("mousemove","pointerMove");this.ca("touchmove","pointerMove");this.ca("mouseup","pointerUp");this.ca("touchend","pointerUp");this.bb=function(){b.m.o("deactivate").M();b.elements=[]};this.D=function(){c=!0};this.aa=function(a){var d=
e.getBoundingClientRect();b.N("ClientXY: ("+a.clientX+","+a.clientY+")");d={x:(a.clientX-d.left)*e.width/d.width/b.d,y:(a.clientY-d.top)*e.height/d.height/b.d};b.N("WebAppXY: ("+d.x+","+d.y+")");"click"==a.type&&b.N("Click on ! WebAppXY: ("+d.x+","+d.y+")");return d};b.elements=[];this.add=function(){var a=[].slice.call(arguments),d=a.filter(function(a){return a&&"name"==a[0]})[0]||["name","Unknown"],c=a.filter(function(a){return a&&"image"==a[0]})[0],e=a.filter(function(a){return a&&"position"==
a[0]})[0],d=new f.a.Ia(b,d,c,e),a=a.filter(function(a){return a&&"name"!=a[0]&&"position"!=a[0]&&"image"!=a[0]});0<a.length&&f.a.e&&d.oa.apply(d,a);b.elements.push(d);return d};b.N("Adding background");this.add(["name","background"],["image",{left:0,width:e.width/b.d,top:0,height:e.height/b.d,draw:a.drawBackground||function(d){d.fillStyle=a.backgroundStyle||"#FFF";d.fillRect(0,0,e.width/b.d,e.height/b.d)}}],["position",{z:-Infinity}]);setInterval(function(){c&&!isDrawing?(isDrawing=!0,b.elements.sort(function(a,
b){return(a.R||0)-(b.R||0)}).forEach(function(a){b.F.translate(a.h*b.d,a.i*b.d);b.F.rotate(a.l||0);b.F.scale(a.g||1,a.n||1);b.F.drawImage(a.K.canvas,0,0,a.j,a.p,a.G,a.C,a.j,a.p);b.F.scale(1/(a.g||1),1/a.n||1);b.F.rotate(-(a.l||0));b.F.translate(-a.h*b.d,-a.i*b.d)}),isDrawing=!1):b.N("No redraw")},d);this.addElement=this.add;this.redraw=this.D;this.stop=this.bb};f.a.Controller=f.a.Ga;(function(){function a(a,c){a.h=c.x||0;a.i=c.y||0;a.R=c.z||0;a.l=c.angle||0}function e(a,c){var e=c.width,g=c.height;a.top=0==c.top?0:c.top||-g/2;a.left=0==c.left?0:c.left||-e/2;a.bottom=0==c.bottom?0:c.bottom||a.top+g;a.right=0==c.right?0:c.right||a.left+e;a.J=e||a.right-a.left;a.Q=g||a.bottom-a.top;a.C=Math.round(a.top*a.c.d);a.G=Math.round(a.left*a.c.d);a.X=Math.round(a.bottom*a.c.d);a.da=Math.round(a.right*a.c.d);a.j=Math.round(a.J*a.c.d);a.p=Math.round(a.Q*a.c.d);e=a.c.F.canvas.ownerDocument.createElement("canvas");
a.K=e.getContext("2d");a.g=c.scaleX||1;a.n=c.scaleY||1;c.rawImage?(a.U=c.rawImage,a.K.putImageData(a.U,0,0)):(g=c.draw,e.width=a.j,e.height=a.p,a.K.beginPath(),a.K.translate(-a.G,-a.C),a.K.scale(a.c.d,a.c.d),g.call(a,a.K),a.U=a.K.getImageData(0,0,a.j,a.p))}function c(a,c){a.Z=c;a.ja=f.fa.Ja()}f.a.Ia=function(d,h,k,g){var b=this;b.c=d;var l=[],p=[];c(b,h[1]);e(b,k[1]);a(b,g[1]);p.push(h);p.push(k);p.push(g);b.m=new f.T.ga;b.Wa=function(a,c){var d=b.Sa(a,c),e=d.x-b.G,d=d.y-b.C;return 0<=e&&e<=b.j&&
0<=d&&d<=b.p&&0<b.U.data[4*d*b.j+4*e+3]};b.pa=function(a){var c=a?p.filter(function(b){return a.every(function(a){return a!=b[0]})}):p;return b.c.add.apply(b.c,c)};b.Ka=function(a){return"click"==a||"pointerDown"==a||b.m.Va(a)};b.Ma=function(){b.K=null};b.c.m.o("deactivate").addListener(function(){b.Ma()});b.D=function(){b.c.D()};b.$=function(a,c){return{x:b.h+(a*b.g*Math.cos(b.l)-c*b.n*Math.sin(b.l))/b.c.d,y:b.i+(a*b.g*Math.sin(b.l)+c*b.n*Math.cos(b.l))/b.c.d}};b.Sa=function(a,c){return{x:Math.round(((a-
b.h)*b.c.d*Math.cos(b.l)+(c-b.i)*b.c.d*Math.sin(b.l))/b.g),y:Math.round(((c-b.i)*b.c.d*Math.cos(b.l)-(a-b.h)*b.c.d*Math.sin(b.l))/b.n)}};b.va=function(){return b.$(b.G+b.j/2,b.C+b.p/2)};var n=[];n.push({x:b.G,y:b.C});n.push({x:b.da,y:b.C});n.push({x:b.da,y:b.X});n.push({x:b.G,y:b.X});b.Qa=function(){return n.map(function(a){return b.$(a.x,a.y)})};b.Pa=function(){var a=b.h+""+b.i+""+b.l+""+b.g+""+b.g;if(l.getClientCorners&&l.getClientCorners.key==a)return l.getClientCorners.value;var c=b.Qa();l.getClientCorners=
{key:a,value:c};return c};b.Ra=function(){var a=b.Pa();return{top:a.reduce(function(a,b){return Math.min(a,b.y)},Infinity),bottom:a.reduce(function(a,b){return Math.max(a,b.y)},-Infinity),left:a.reduce(function(a,b){return Math.min(a,b.x)},Infinity),right:a.reduce(function(a,b){return Math.max(a,b.x)},-Infinity)}};b.wa=function(){var a=b.h+""+b.i+""+b.l+""+b.g+""+b.g;if(l.getClientRect&&l.getClientRect.key==a)return l.getClientRect.value;var c=b.Ra();l.getClientRect={key:a,value:c};return c};b.oa=
function(){var a=this,b=[].slice.apply(arguments);p=p.concat(b);b.forEach(function(b){a.ia(b[0],b[1])})};b.ia=function(a,b){var c=f.a.e[a];c&&c.I(this,b)};Object.defineProperty(b,"name",{get:function(){return this.Z},set:function(a){this.Z=a}});Object.defineProperty(b,"width",{get:function(){return this.J},set:function(a){this.J=a}});Object.defineProperty(b,"height",{get:function(){return this.Q},set:function(a){this.Q=a}});Object.defineProperty(b,"scaleX",{get:function(){return this.g},set:function(a){this.g=
a}});Object.defineProperty(b,"scaleY",{get:function(){return this.n},set:function(a){this.n=a}});Object.defineProperty(b,"x",{get:function(){return this.h},set:function(a){this.h=a}});Object.defineProperty(b,"y",{get:function(){return this.i},set:function(a){this.i=a}});Object.defineProperty(b,"z",{get:function(){return this.R},set:function(a){this.R=a}});Object.defineProperty(b,"angle",{get:function(){return this.l},set:function(a){this.l=a}});Object.defineProperty(b,"id",{get:function(){return this.ja}});
Object.defineProperty(b,"image",{get:function(){return this.U}});Object.defineProperty(b,"events",{get:function(){return this.m}});b.clone=b.pa;b.applyDecorator=b.ia;b.applyDecorators=b.oa}})();f=f||{};f.a=f.a||{};f.a.e=f.a.e||[];f.a.e.clickable={I:function(a,e){var c=e.onclick;c&&(a.$a=function(d){c.call(a,d);a.D()},a.m.o("click").addListener(a.$a));var d=!1;this.t=null;var h=e.ondown,k=e.onup;a.m.o("pointerDown").addListener(function(c){a.t=c.t;d=!0;h&&(h.call(a,event),a.D())});a.m.o("pointerUp").addListener(function(c){d&&a.t==c.t&&(d=!1,k&&(k.call(a,event),a.D()))})}};f=f||{};f.a=f.a||{};f.a.e=f.a.e||[];f.a.e.customTimer={I:function(a,e){setInterval(function(){e.action.call(a)},e.time)}};f=f||{};f.a=f.a||{};f.a.e=f.a.e||[];f.a.e.droppable={I:function(a,e){var c=e.dropZone;a.Ya=!0;a.ta=c;Object.defineProperty(a,"dropZone",{get:function(){return this.ta},set:function(a){this.ta=a}})}};f=f||{};f.a=f.a||{};f.a.e=f.a.e||[];f.a.e.dropzone={I:function(a,e){var c=e.availableSpots,d=e.dropX,h=e.dropY;a.Y=[];a.m.o("drop").addListener(function(e){0>=c||(c--,e.H.x=d||a.h,e.H.y=h||a.i,e.H.P=a,a.Y.push(e.H),e.H.m.o("dropped").M({P:a,H:e.H}),a.m.o("droppedIn").M({P:a,H:e.H}),a.D())});a.Na=function(d){d.P=null;c++;a.Y.splice(a.Y.indexOf(d),1);a.D()};Object.defineProperty(a,"droppedElements",{get:function(){return this.Y}})}};f=f||{};f.a=f.a||{};f.a.e=f.a.e||[];f.a.e.duplicable={I:function(a,e){var c=e.isBlocked,d=e.generatorCount||Infinity,h=!1;a.m.o("pointerDown").addListener(function(e){0<=e.t&&(h=!0);if(!(h&&0>e.t||c&&c()||0>=d)){d--;var g=a.pa(["duplicable"]);g.Z+=" (duplicate)";g.ia("movable",{Xa:c});g.Ca(e);a.D()}})}};f.a.e=f.a.e||[];f.a.elementDecorators=f.a.e;f=f||{};f.a=f.a||{};f.a.e=f.a.e||[];
f.a.e.movable={I:function(a,e){var c=!1,d=this.t=null,h=e.Xa;a.Ca=function(e){c=!0;a.t=e.t;d={x:e.x,y:e.y};a.P&&(a.P.Na(a),a.P=null)};a.Za=function(e){c=!1;d=null;a.Ya&&a.c.ma("drop",{x:e.x,y:e.y,H:a})};a.m.o("pointerDown").addListener(function(c){h&&h()||a.Ca(c)});var k=!1;a.m.o("pointerMove").addListener(function(e){!c||h&&h()||(k||(k=!0),a.h+=e.x-d.x,a.i+=e.y-d.y,d={x:e.x,y:e.y},a.D())});a.m.o("pointerUp").addListener(function(e){!c||h&&h()||(a.h+=e.x-d.x,a.i+=e.y-d.y,a.Za(e),a.t=null,k=!1,a.D())})}};f=f||{};f.a=f.a||{};f.a.e=f.a.e||[];
f.a.e.moving={type:"moving",I:function(a,e){var c,d,h,k,g,b=e.vx,l=e.vy,p=e.ax,n=e.ay,s=e.rotationSpeed,m,r,q;a.b=a.b||{};a.b.f=new f.r.s(b||0,l||0);a.b.W=new f.r.s(p||0,n||0);a.b.B=s||0;m=a.c.getTime();setInterval(function(){r=a.c.getTime();q=r-m;if(!(.001>q)&&(m=r,a.b.f.x+=a.b.W.x*q,a.b.f.y+=a.b.W.y*q,0!=a.b.f.x||0!=a.b.f.y||0!=a.b.B||a.v&&(0!=a.v.x||0!=a.v.y))){c=a.h;d=a.i;h=a.l;k=a.g;g=a.n;a.h+=a.b.f.x*q;a.i+=a.b.f.y*q;a.l+=a.b.B*q;a.v&&(a.g+=a.v.x*q,a.n+=a.v.y*q);var b=!0;a.ba&&a.ba.forEach(function(c){b&&
(c.call(a)||(b=!1))});b||(a.h=c,a.i=d,a.l=h,a.g=k,a.n=g)}},20);Object.defineProperty(a,"moving",{get:function(){return this.b},set:function(a){this.b=a}});Object.defineProperty(a.b,"speed",{get:function(){return this.f},set:function(a){this.f=a}});Object.defineProperty(a.b,"acceleration",{get:function(){return this.W},set:function(a){this.W=a}});Object.defineProperty(a.b,"rotationSpeed",{get:function(){return this.B},set:function(a){this.B=a}});Object.defineProperty(a,"scaleSpeed",{get:function(){return this.v},
set:function(a){this.v=a}})}};f=f||{};f.a=f.a||{};f.a.e=f.a.e||[];
f.a.e.solid={I:function(a,e){var c=[];a.q={};a.q.V=e.mass||1;var d=e.onCollision,h=e.coefficient;a.q.fixed=e.fixed||!1;a.q.ua=a.q.fixed||e.fixedPoint||!1;a.c.ra=a.c.ra||new f.a.Fa(a.c);a.q.qa=h||0===h?h:1;a.b=a.b||{f:new f.r.s(0,0),W:new f.r.s(0,0),B:0};a.m.o("collision").addListener(function(b){d&&d.call(a,b)});a.ba=this.ba||[];a.ba.push(function(){return a.c.ra.ab(a)});a.ya=function(){return a.q.V/12*(a.j*a.g*a.j*a.g+a.p*a.n*a.p*a.n)};a.Oa=function(){return Math.sqrt(a.J*a.J*a.g*a.g+a.Q*a.Q*a.n*
a.n)/2};a.za=function(){var b=a.J+""+a.Q+""+a.g+""+a.n;if(c.getRadius&&c.getRadius.key==b)return c.getRadius.cb;var d=a.Oa();c.geRadius={ib:b,cb:d};return d};var k=a.c.F.canvas,h=k.ownerDocument.createElement("canvas"),k=k.ownerDocument.createElement("canvas");h.width=k.width=a.j;h.height=k.height=a.p;a.O=k.getContext("2d");a.O.putImageData(a.U,0,0);a.O.globalCompositeOperation="source-atop";a.O.fillStyle="#000";a.O.fillRect(0,0,a.j,a.p);a.k=h.getContext("2d");a.k.globalCompositeOperation="source-over";
a.k.drawImage(a.O.canvas,0,0);h=a.k.getImageData(0,0,a.j,a.p);k=a.k.createImageData(a.j,a.p);a.sa=[];for(var g=0;g<a.j;g++)for(var b=0;b<a.p;b++)if(!(200>h.data[b*a.j*4+4*g+3])){for(var l=!1,p=-1;2>p;p++)for(var n=-1;2>n;n++)if(0>b+p||0>g+n||b+p>a.p-1||g+p>a.J-1||100>h.data[(b+p)*a.J*4+4*(g+n)+3])l=!0,n=p=2;a.k.putImageData(k,0,0);l&&(a.sa.push({x:g,y:b}),k.data[b*a.j*4+4*g]=0,k.data[b*a.j*4+4*g+1]=0,k.data[b*a.j*4+4*g+2]=0,k.data[b*a.j*4+4*g+3]=255)}a.k.putImageData(k,0,0);a.k.translate(-a.G,-a.C);
Object.defineProperty(a,"solid",{get:function(){return this.q},set:function(a){this.q=a}});Object.defineProperty(a.q,"mass",{get:function(){return this.V},set:function(a){this.V=a}})}};(function(){var a=f.T=f.T||{};a.na=function(){var a=0;helpers=f.fa;var c=[];this.M=function(a){var e=c.length;c.forEach(function(c){setTimeout(function(){c.handleEvent(a);e--})})};this.addListener=function(d,h){var k=a++;c.push({Ua:k,handleEvent:d,Aa:h});c=c.sort(function(a,b){return(a.Aa||Infinity)-(b.Aa||Infinity)});return k};this.removeListener=function(a){c=c.filter(function(c){return c.Ua!=a})};this.addListener=this.addListener;this.removeListener=this.removeListener};f.Creevents=a;a.Event=a.na})();(function(){var a=f.T=f.T||{};a.ga=function(){var e={};this.Va=function(a){return void 0!=e[a]};this.getEvent=this.o=function(c){e[c]||(e[c]=new a.na);return e[c]}};a.EventContainer=a.ga})();(function(){var a=f.fa=f.fa||{};a.Ja=function(){var e=Date.now().toString(16),e=a.Ba("x",15-e.length)+e;return("xxxxxxxx-xxxx-4xxx-y"+e.slice(0,3)+"-"+e.slice(3)).replace(/[xy]/g,function(a){var d=16*Math.random()|0;return("x"==a?d:d&3|8).toString(16)})};a.Ba=function(e,c){return 0>=c?"":e+a.Ba(e,c-1)}})();(function(){var a=f.Ha=f.Ha||{};a.ha=function(){this.N=function(a){console.log(a)}};f.Crelog=a;a.Logger=a.ha;a.ha.log=a.ha.N})();
