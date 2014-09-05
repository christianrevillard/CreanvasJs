var g = g || {};
g.a = g.a || {};
window.CreJs = g;
g.Creanvas = g.a;
(function() {
  var a = g.p = g.p || {};
  a.s = function(e, d, h) {
    var f = this;
    this.A = e;
    this.B = d;
    this.V = h || 0;
    this.Da = function(b) {
      return{Q:a.qa(f, b.Q), t:a.qa(f, b.t), Ma:a.qa(f, b.Ma)};
    };
  };
  Object.defineProperty(a.s.prototype, "x", {get:function() {
    return this.A;
  }, set:function(a) {
    this.A = a;
  }});
  Object.defineProperty(a.s.prototype, "y", {get:function() {
    return this.B;
  }, set:function(a) {
    this.B = a;
  }});
  Object.defineProperty(a.s.prototype, "z", {get:function() {
    return this.V;
  }, set:function(a) {
    this.V = a;
  }});
  a.Ya = function(e, d, h, f) {
    e = h - e;
    d = f - d;
    f = Math.sqrt(e * e + d * d);
    return{Q:new a.s(e / f, d / f, 0), t:new a.s(-d / f, e / f, 0), Ma:new a.s(0, 0, 0)};
  };
  a.rb = function(a, d, h, f, b) {
    a.lineWidth = 5;
    a.strokeStyle = b;
    a.beginPath();
    a.moveTo(d, h);
    a.lineTo(d + 100 * f.Q.A, h + 100 * f.Q.B);
    a.moveTo(d, h);
    a.lineTo(d + 50 * f.t.A, h + 50 * f.t.B);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.qb = function(a, d, h, f, b, k, m) {
    a.lineWidth = 5;
    a.strokeStyle = m;
    a.beginPath();
    a.moveTo(d, h);
    a.lineTo(d + 100 * b * f.Q.A, h + 100 * b * f.Q.B);
    a.lineTo(d + 100 * b * f.Q.A + 100 * k * f.t.A, h + 100 * b * f.Q.B + 100 * k * f.t.B);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.qa = function(a, d) {
    return a.A * d.A + a.B * d.B;
  };
  a.ja = function(e, d) {
    return new a.s(e.B * d.V - e.V * d.B, e.V * d.A - e.A * d.V, e.A * d.B - e.B * d.A);
  };
  g.Core = g.p;
  g.p.Vector = g.p.s;
})();
g.a.Na = function(a) {
  function e() {
    return a.elements.filter(function(a) {
      return a.ca;
    });
  }
  function d(a, b, k) {
    var d, c, n, l, e, h;
    d = k.nb;
    l = new g.p.s(k.x - a.j, k.y - a.k);
    e = g.p.ja(l, d.t).z;
    h = new g.p.s(k.x - b.j, k.y - b.k);
    k = g.p.ja(h, d.t).z;
    var r = g.p.ja(l, d.t), q = g.p.ja(h, d.t);
    c = new g.p.s(a.b.d.x, a.b.d.y);
    n = new g.p.s(b.b.d.x, b.b.d.y);
    a.u && (c.x += l.x * a.u.x, c.y += l.y * a.u.y);
    b.u && (n.x += h.x * b.u.x, n.y += h.y * b.u.y);
    l = a.ca.wa * b.ca.wa * 2 * (n.Da(d).t - c.Da(d).t + b.b.H * q.z - a.b.H * r.z) / (1 / b.O + 1 / a.O + q.z * q.z / b.ga() + r.z * r.z / a.ga());
    a.b.d.x += l / a.O * d.t.x;
    a.b.d.y += l / a.O * d.t.y;
    b.b.d.x -= l / b.O * d.t.x;
    b.b.d.y -= l / b.O * d.t.y;
    a.b.H += l * e / a.ga();
    b.b.H -= l * k / b.ga();
  }
  function h(a, b) {
    var d, e, c, n, l, h, p;
    n = a.Ca();
    l = b.Ca();
    d = Math.max(n.left, l.left) - 1;
    e = Math.min(n.right, l.right) + 1;
    c = Math.max(n.top, l.top) - 1;
    n = Math.min(n.bottom, l.bottom) + 1;
    if (!(0 >= e - d || 0 >= n - c)) {
      d = a.g.getImageData(0, 0, a.c, a.h);
      a.g.scale(1 / (a.i || 1), 1 / (a.n || 1));
      a.g.rotate(-(a.o || 0));
      a.g.translate(b.j - a.j, b.k - a.k);
      a.g.rotate(b.o || 0);
      a.g.scale(b.i || 1, b.n || 1);
      a.g.globalCompositeOperation = "destination-out";
      a.g.drawImage(b.S.canvas, 0, 0, b.c, b.h, -b.C, -b.D, b.c, b.h);
      a.g.scale(1 / (b.i || 1), 1 / (b.n || 1));
      a.g.rotate(-b.o || 0);
      a.g.translate(-b.j + a.j, -b.k + a.k);
      a.g.rotate(a.o || 0);
      a.g.scale(a.i || 1, a.n || 1);
      h = a.g.getImageData(0, 0, a.c, a.h);
      a.g.globalCompositeOperation = "source-over";
      a.g.putImageData(d, 0, 0);
      p = [];
      a.ya.forEach(function(c) {
        90 > h.data[c.y * a.c * 4 + 4 * c.x + 3] && p.push(c);
      });
      if (2 > p.length) {
        return null;
      }
      var r;
      c = e = 0;
      d = p.length - 1;
      for (n = 1;n < p.length;n++) {
        for (l = n + 1;l < p.length;l++) {
          r = p[n].x - p[l].x;
          var q = p[n].y - p[l].y;
          r = Math.sqrt(r * r + q * q);
          r > e && (e = r, c = n, d = l);
        }
      }
      e = a.ea(p[c].x - a.C, p[c].y - a.D);
      d = a.ea(p[d].x - a.C, p[d].y - a.D);
      return e.x == d.x && e.y == d.y ? null : {x:Math.round((e.x + d.x) / 2), y:Math.round((e.y + d.y) / 2), nb:g.p.Ya(e.x, e.y, d.x, d.y)};
    }
  }
  this.jb = function(a) {
    var b = e(), k, m, c;
    k = a.Ba();
    b = b.filter(function(c) {
      var b;
      if (c.q === a.q || !(c.b.d.x || c.b.d.y || a.b.d.x || a.b.d.y || c.u || a.u)) {
        return!1;
      }
      b = c.Ba();
      return Math.sqrt((k.x - b.x) * (k.x - b.x) + (k.y - b.y) * (k.y - b.y)) > a.Ea() + c.Ea() ? !1 : !0;
    });
    if (0 == b.length) {
      return!0;
    }
    m = null;
    b.forEach(function(b) {
      m || (m = h(a, b)) && (c = b);
    });
    if (!m) {
      return!0;
    }
    d(a, c, m);
    a.m.M("collision", {element:c, Ra:m});
    c.m.M("collision", {element:a, Ra:m});
    return!1;
  };
};
g.a.Oa = function(a) {
  var e, d, h, f, b, k, m;
  f = this;
  e = a.canvas;
  m = a.Ab || 1;
  a.yb ? (k = Date.now(), this.getTime = function() {
    return(Date.now() - k) * m;
  }) : (b = 0, setInterval(function() {
    b += 10 * m;
  }, 10), this.getTime = function() {
    return b;
  });
  this.l = function(c) {
    a.log && a.log(c);
  };
  this.l("Starting controller");
  f.I = e.getContext("2d");
  d = !0;
  isDrawing = !1;
  h = a.zb || 50;
  this.La = function(a, b) {
    var l = !1;
    f.elements.filter(function(b) {
      return b.Qa(a);
    }).sort(function(a, c) {
      return c.U || 0 - a.U || 0;
    }).forEach(function(d) {
      !l && d.$a(b.x, b.y) && (d.m.M(a, b), l = !0);
    });
  };
  this.lb = function(a, b) {
    f.elements.forEach(function(d) {
      d.v == b.v && d.m.M(a, b);
    });
  };
  this.pa = function(a, b) {
    e.addEventListener(a, function(d) {
      setTimeout(function() {
        function e(d, l) {
          f.l("Canvas event " + a + " with touchIdentifier " + l);
          var h = f.fa(d);
          h.v = l;
          f.La(b, h);
        }
        if (d.changedTouches) {
          for (var h = 0;h < d.changedTouches.length;h++) {
            e(d.changedTouches[h], d.changedTouches[h].identifier);
          }
        } else {
          e(d, -1);
        }
      });
    });
  };
  this.ia = function(a, b) {
    e.addEventListener(a, function(d) {
      setTimeout(function() {
        function e(d, l) {
          f.l("Canvas event " + a + " with touchIdentifier " + l);
          var h = f.fa(d);
          h.v = l;
          f.lb(b, h);
        }
        if (d.changedTouches) {
          for (var h = 0;h < d.changedTouches.length;h++) {
            e(d.changedTouches[h], d.changedTouches[h].identifier);
          }
        } else {
          e(d, -1);
        }
      });
    });
  };
  this.m = new g.W.la;
  this.pa("click", "click");
  this.pa("mousedown", "pointerDown");
  this.pa("touchstart", "pointerDown");
  this.ia("mousemove", "pointerMove");
  this.ia("touchmove", "pointerMove");
  this.ia("mouseup", "pointerUp");
  this.ia("touchend", "pointerUp");
  this.kb = function() {
    f.m.M("deactivate");
    f.elements = [];
  };
  this.L = function() {
    d = !0;
  };
  this.fa = function(a) {
    var b = e.getBoundingClientRect();
    return{x:Math.round((a.clientX - b.left) * e.width / b.width), y:Math.round((a.clientY - b.top) * e.height / b.height)};
  };
  f.elements = [];
  this.add = function() {
    f.l("Controller.addElement: Adding element - args:" + arguments.length);
    var a = [].slice.call(arguments), b = new g.a.Pa(f, a[0]);
    f.l("Controller.addElement: Created element: " + b.K + "-" + b.q);
    1 < a.length ? (f.l("Controller.addElement: Applying " + (a.length - 1) + " decorators"), b.ba.apply(b, a.slice(1))) : f.l("Controller.addElement: No decorator to apply");
    f.elements.push(b);
    return b;
  };
  f.l("Adding background");
  this.add({K:"background", N:{Y:e.width, X:e.height, Ga:{ra:0, sa:0}, Fa:a.drawBackground || function(c) {
    c.fillStyle = a.ob || "#FFF";
    c.fillRect(0, 0, e.width, e.height);
  }}, Aa:{Ha:-Infinity}});
  setInterval(function() {
    d && !isDrawing ? (isDrawing = !0, f.elements.sort(function(a, b) {
      return(a.U || 0) - (b.U || 0);
    }).forEach(function(a) {
      f.I.translate(a.j, a.k);
      f.I.rotate(a.o || 0);
      f.I.scale(a.i || 1, a.n || 1);
      f.I.drawImage(a.P.canvas, 0, 0, a.c, a.h, -a.C, -a.D, a.c, a.h);
      f.I.scale(1 / (a.i || 1), 1 / a.n || 1);
      f.I.rotate(-(a.o || 0));
      f.I.translate(-a.j, -a.k);
    }), isDrawing = !1) : f.l("No redraw");
  }, h);
  this.addElement = function() {
    var a = [].slice.call(arguments), b = a[0];
    a[0] = {K:b.name, N:b.image ? {Y:b.image.width, X:b.image.height, Fa:b.image.draw, Ga:b.image.translate ? {ra:b.image.translate.dx || 0, sa:b.image.translate.dy || 0} : null} : null, Aa:b.position ? {fb:b.position.x, gb:b.position.y, Ha:b.position.z} : null, rules:b.rules};
    return this.add.apply(this, a);
  };
  this.redraw = this.L;
  this.stop = this.kb;
};
g.a.Controller = g.a.Oa;
g.a.Pa = function(a, e) {
  this.K = e.K;
  var d = e.N, h = d.Fa, f = e.Aa, b = e.rules, k = [].slice.apply(arguments).slice(2), m = [];
  this.e = a;
  this.q = g.ka.ma();
  this.c = d.Y;
  this.h = d.X;
  this.j = f.fb || 0;
  this.k = f.gb || 0;
  this.U = f.Ha || 0;
  this.o = f.xb || 0;
  this.i = d.tb || 1;
  this.n = d.ub || 1;
  this.O = 1;
  f = d.Ga || {ra:d.Y / 2, sa:d.X / 2};
  this.C = f.ra;
  this.D = f.sa;
  d.hb ? (this.N = d.hb, f = this.e.I.canvas, f = f.ownerDocument.createElement("canvas"), this.P = f.getContext("2d"), this.P.putImageData(this.N, 0, 0)) : (f = this.e.I.canvas, f = f.ownerDocument.createElement("canvas"), f.width = d.Y, f.height = d.X, this.P = f.getContext("2d"), this.P.beginPath(), this.P.translate(this.C, this.D), h(this.P), this.N = this.P.getImageData(0, 0, d.Y, d.X));
  var c = this;
  c.debug = function(a, b) {
    c.e.l("Element." + a + ": " + b + ". Element: " + c.K + "/" + c.q);
  };
  b && (c.rules = [], b.forEach(function(a) {
    var b = c.rules.length;
    c.rules.push(a);
    setInterval(function() {
      c.rules[b].rule.call(c);
      c.L();
    }, a.checkTime);
  }));
  this.m = new g.W.la;
  this.isPointInPath = function(a) {
    a = c.e.fa(a);
    return c.e.wb.isPointInPath(c, h, a);
  };
  0 < k.length && g.a.f && (a.l("New element " + elementName + " : apply " + k.length + " decorators"), c.ba(k));
  this.$a = function(a, b) {
    var d = Math.round(a - c.j + c.C), f = Math.round(b - c.k + c.D), d = 0 <= d && d <= c.c && 0 <= f && f <= c.h && 0 < c.N.data[4 * f * c.c + 4 * d + 3];
    c.debug("hit", d ? "hit" : "no hit");
    return d;
  };
  this.va = function(a) {
    d.sb = c.N;
    c.debug("cloneElement", "start cloning");
    var b = c.e.add(e), f = a ? k.filter(function(b) {
      return a.every(function(a) {
        return a != b[0];
      });
    }) : k;
    c.debug("cloneElement", "apply " + f.length + " decorators");
    b.ba.apply(b, f);
    return b;
  };
  this.ib = function(a) {
    c.debug("removeElementDecorator", a);
    var b = g.a.f[a];
    b && b.Ia ? b.Ia(c) : c.debug("removeElementDecorator", "Cannot remove: " + a);
  };
  this.Qa = function(a) {
    return "click" == a || "pointerDown" == a || c.m.Za(a);
  };
  this.Sa = function() {
    c.e.m.removeEventListener({w:c.q});
    c.P = null;
  };
  c.e.m.G({eventId:"deactivate", listenerId:c.q, handleEvent:function() {
    c.Sa();
  }});
  this.L = function() {
    c.e.L();
  };
  this.ea = function(a, b) {
    return{x:Math.round(c.j + a * c.i * Math.cos(c.o) - b * c.n * Math.sin(c.o)), y:Math.round(c.k + a * c.i * Math.sin(c.o) + b * c.n * Math.cos(c.o))};
  };
  this.Ba = function() {
    return c.ea(-c.C + c.c / 2, -c.D + c.h / 2);
  };
  var n = [];
  n.push({x:-c.C, y:-c.D});
  n.push({x:-c.C + c.c, y:-c.D});
  n.push({x:-c.C + c.c, y:-c.D + c.h});
  n.push({x:-c.C, y:-c.D + c.h});
  this.Wa = function() {
    return n.map(function(a) {
      return c.ea(a.x, a.y);
    });
  };
  this.Va = function() {
    var a = c.j + "" + c.k + "" + c.o + "" + c.i + "" + c.i;
    if (m.getClientCorners && m.getClientCorners.key == a) {
      return m.getClientCorners.value;
    }
    var b = c.Wa();
    m.getClientCorners = {key:a, value:b};
    return b;
  };
  this.Xa = function() {
    var a = c.Va();
    return{top:a.reduce(function(a, b) {
      return Math.min(a, b.y);
    }, Infinity), bottom:a.reduce(function(a, b) {
      return Math.max(a, b.y);
    }, -Infinity), left:a.reduce(function(a, b) {
      return Math.min(a, b.x);
    }, Infinity), right:a.reduce(function(a, b) {
      return Math.max(a, b.x);
    }, -Infinity)};
  };
  this.Ca = function() {
    var a = c.j + "" + c.k + "" + c.o + "" + c.i + "" + c.i;
    if (m.getClientRect && m.getClientRect.key == a) {
      return m.getClientRect.value;
    }
    var b = c.Xa();
    m.getClientRect = {key:a, value:b};
    return b;
  };
  this.ba = function() {
    var a = this, b = [].slice.apply(arguments);
    k = k.concat(b);
    b.forEach(function(b) {
      a.na(b[0], b[1]);
    });
  };
  this.na = function(a, b) {
    this.debug("applyElementDecorator", a);
    var c = g.a.f[a];
    c ? c.R(this, b) : this.debug("applyElementDecorator", "Not found: " + a);
  };
  Object.defineProperty(c, "name", {get:function() {
    return this.K;
  }, set:function(a) {
    this.K = a;
  }});
  Object.defineProperty(c, "width", {get:function() {
    return this.c;
  }, set:function(a) {
    this.c = a;
  }});
  Object.defineProperty(c, "height", {get:function() {
    return this.h;
  }, set:function(a) {
    this.h = a;
  }});
  Object.defineProperty(c, "scaleX", {get:function() {
    return this.i;
  }, set:function(a) {
    this.i = a;
  }});
  Object.defineProperty(c, "scaleY", {get:function() {
    return this.n;
  }, set:function(a) {
    this.n = a;
  }});
  Object.defineProperty(c, "x", {get:function() {
    return this.j;
  }, set:function(a) {
    this.j = a;
  }});
  Object.defineProperty(c, "y", {get:function() {
    return this.k;
  }, set:function(a) {
    this.k = a;
  }});
  Object.defineProperty(c, "z", {get:function() {
    return this.U;
  }, set:function(a) {
    this.U = a;
  }});
  Object.defineProperty(c, "angle", {get:function() {
    return this.o;
  }, set:function(a) {
    this.o = a;
  }});
  Object.defineProperty(c, "mass", {get:function() {
    return this.O;
  }, set:function(a) {
    this.O = a;
  }});
  Object.defineProperty(c, "id", {get:function() {
    return this.q;
  }});
  Object.defineProperty(c, "image", {get:function() {
    return this.N;
  }});
  Object.defineProperty(c, "events", {get:function() {
    return this.m;
  }});
  c.clone = c.va;
  c.applyDecorator = c.na;
  c.applyDecorators = c.ba;
  c.removeDecorator = c.ib;
};
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.clickable = {R:function(a, e) {
  var d = e.onclick;
  a.eb = function(e) {
    a.debug("onClick", d);
    d.call(a, e);
    a.L();
  };
  a.m.G({r:"click", handleEvent:a.eb});
}};
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.collidable = {R:function(a, e) {
  var d = [];
  a.ca = {};
  var h = e.onCollision, f = e.coefficient;
  a.e.xa = a.e.xa || new g.a.Na(a.e);
  a.ca.wa = f || 0 === f ? f : 1;
  a.b = a.b || {d:new g.p.s(0, 0), Z:new g.p.s(0, 0), H:0};
  a.m.G({r:"collision", handleEvent:function(b) {
    h && h.call(a, b);
  }});
  a.ha = this.ha || [];
  a.ha.push(function() {
    return a.e.xa.jb(a);
  });
  a.ga = function() {
    return a.O / 12 * (a.c * a.i * a.c * a.i + a.h * a.n * a.h * a.n);
  };
  a.Ua = function() {
    return Math.sqrt(a.c * a.c * a.i * a.i + a.h * a.h * a.n * a.n) / 2;
  };
  a.Ea = function() {
    var b = a.c + "" + a.h + "" + a.i + "" + a.n;
    if (d.getRadius && d.getRadius.key == b) {
      return d.getRadius.mb;
    }
    var c = a.Ua();
    d.geRadius = {vb:b, mb:c};
    return c;
  };
  var b = a.e.I.canvas, f = b.ownerDocument.createElement("canvas"), b = b.ownerDocument.createElement("canvas");
  f.width = b.width = a.c;
  f.height = b.height = a.h;
  a.S = b.getContext("2d");
  a.S.putImageData(a.N, 0, 0);
  a.S.globalCompositeOperation = "source-atop";
  a.S.fillStyle = "#000";
  a.S.fillRect(0, 0, a.c, a.h);
  a.g = f.getContext("2d");
  a.g.globalCompositeOperation = "source-over";
  a.g.drawImage(a.S.canvas, 0, 0);
  f = a.g.getImageData(0, 0, a.c, a.h);
  b = a.g.createImageData(a.c, a.h);
  a.ya = [];
  for (var k = 0;k < a.c;k++) {
    for (var m = 0;m < a.h;m++) {
      if (!(200 > f.data[m * a.c * 4 + 4 * k + 3])) {
        for (var c = !1, n = -1;2 > n;n++) {
          for (var l = -1;2 > l;l++) {
            if (0 > m + n || 0 > k + l || m + n > a.h - 1 || k + n > a.c - 1 || 100 > f.data[(m + n) * a.c * 4 + 4 * (k + l) + 3]) {
              c = !0, l = n = 2;
            }
          }
        }
        a.g.putImageData(b, 0, 0);
        c && (a.ya.push({x:k, y:m}), b.data[m * a.c * 4 + 4 * k] = 0, b.data[m * a.c * 4 + 4 * k + 1] = 0, b.data[m * a.c * 4 + 4 * k + 2] = 0, b.data[m * a.c * 4 + 4 * k + 3] = 255);
      }
    }
  }
  a.g.putImageData(b, 0, 0);
  a.g.translate(a.C, a.D);
}};
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.droppable = {R:function(a, e) {
  var d = e.dropZone;
  a.bb = !0;
  a.za = d;
  a.debug("droppable.applyTo", "Now droppable");
  Object.defineProperty(a, "dropZone", {get:function() {
    return this.za;
  }, set:function(a) {
    this.za = a;
  }});
}};
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.dropzone = {R:function(a, e) {
  var d = e.availableSpots, h = e.dropX, f = e.dropY;
  a.da = [];
  a.m.G({F:"dropzone", r:"drop", handleEvent:function(b) {
    0 >= d || (a.e.l("drop event on dropzone " + a.q + ", dropped " + b.J.id), d--, b.J.x = h || a.j, b.J.y = f || a.k, b.J.T = a, a.da.push(b.J), b.J.m.M("dropped", {T:a, J:b.J}), a.m.M("droppedIn", {T:a, J:b.J}), a.L());
  }, w:a.q});
  a.Ta = function(b) {
    a.e.l("dragging from dropzone " + a.q + ", dragged " + b.id);
    b.T = null;
    d++;
    a.da.splice(a.da.indexOf(b), 1);
    a.L();
  };
  Object.defineProperty(a, "droppedElements", {get:function() {
    return this.da;
  }});
}};
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.duplicable = {R:function(a, e) {
  var d = e.isBlocked, h = e.generatorCount || Infinity;
  a.debug("duplicable.applyTo", "generatorCount is " + h);
  var f = !1;
  a.m.G({F:"duplicable", r:"pointerDown", handleEvent:function(b) {
    0 <= b.v && (f = !0);
    if (!(f && 0 > b.v || d && d() || (a.debug("duplicable.makeCopy", "GeneratorCount was: " + h), 0 >= h))) {
      h--;
      a.debug("duplicable.makeCopy", "GeneratorCount is now: " + h);
      var e = a.va(["duplicable"]);
      e.K += " (duplicate)";
      e.na("movable", {ab:d});
      e.Ka(b);
      a.L();
    }
  }, w:a.q});
}, Ia:function(a) {
  a.m.removeEventListener({F:"duplicable", w:a.q});
}};
g.a.f = g.a.f || [];
g.a.elementDecorators = g.a.f;
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.movable = {R:function(a, e) {
  var d = !1, h = this.v = null, f = e.ab;
  a.Ka = function(b) {
    a.e.l("Starting moving - identifier: " + b.v);
    d = !0;
    a.v = b.v;
    h = {x:b.x, y:b.y};
    a.T && (a.T.Ta(a), a.T = null);
  };
  a.cb = function(b) {
    a.e.l("Completed move - identifier: " + b.v);
    d = !1;
    h = null;
    a.bb && (a.e.l("Trigger drop - identifier: " + b.v), a.e.La("drop", {x:b.x, y:b.y, J:a}));
  };
  a.m.G({F:"movable", r:"pointerDown", handleEvent:function(b) {
    f && f() || a.Ka(b);
  }, w:a.q});
  var b = !1;
  a.m.G({F:"movable", r:"pointerMove", handleEvent:function(e) {
    !d || f && f() || (b || (b = !0, a.e.l("pointereMove event on movable " + a.q + " (" + a.v + ")")), a.j += e.x - h.x, a.k += e.y - h.y, h = {x:e.x, y:e.y}, a.L());
  }, w:a.q});
  a.m.G({F:"movable", r:"pointerUp", handleEvent:function(e) {
    !d || f && f() || (a.e.l("End detected for touch " + a.v), a.e.fa(e), a.j += e.x - h.x, a.k += e.y - h.y, a.cb(e), a.v = null, b = !1, a.L());
  }, w:a.q});
}};
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.moving = {type:"moving", R:function(a, e) {
  var d, h, f, b, k, m = e.vx, c = e.vy, n = e.ax, l = e.ay, s = e.rotationSpeed;
  a.e.l("Applying moving decorator to " + a.K + "-" + a.q);
  var p, r, q;
  a.b = a.b || {};
  a.b.d = new g.p.s(m || 0, c || 0);
  a.b.Z = new g.p.s(n || 0, l || 0);
  a.b.H = s || 0;
  p = a.e.getTime();
  setInterval(function() {
    r = a.e.getTime();
    q = r - p;
    if (!(1 > q) && (p = r, a.b.d.x += a.b.Z.x * q, a.b.d.y += a.b.Z.y * q, 0 != a.b.d.x || 0 != a.b.d.y || 0 != a.b.H || a.u && (0 != a.u.x || 0 != a.u.y))) {
      d = a.j;
      h = a.k;
      f = a.o;
      b = a.i;
      k = a.n;
      a.j += a.b.d.x * q;
      a.k += a.b.d.y * q;
      a.o += a.b.H * q;
      a.u && (a.i += a.u.x * q, a.n += a.u.y * q);
      var c = !0;
      a.ha && a.ha.forEach(function(b) {
        c && (b.call(a) || (c = !1));
      });
      c || (a.j = d, a.k = h, a.o = f, a.i = b, a.n = k);
    }
  }, 20);
  Object.defineProperty(a, "moving", {get:function() {
    return this.b;
  }, set:function(a) {
    this.b = a;
  }});
  Object.defineProperty(a.b, "speed", {get:function() {
    return this.d;
  }, set:function(a) {
    this.d = a;
  }});
  Object.defineProperty(a.b, "acceleration", {get:function() {
    return this.Z;
  }, set:function(a) {
    this.Z = a;
  }});
  Object.defineProperty(a.b, "rotationSpeed", {get:function() {
    return this.H;
  }, set:function(a) {
    this.H = a;
  }});
  Object.defineProperty(a, "scaleSpeed", {get:function() {
    return this.u;
  }, set:function(a) {
    this.u = a;
  }});
}};
(function() {
  var a = g.W = g.W || {}, e;
  a.ua = function(a) {
    this.r = a;
    e = g.ka;
    var h = [], f = new g.ta.aa;
    this.M = function(b, k) {
      var m = e.ma(), c = h.length;
      b && "pointerMove" != b.r && "drag" != b.r && "drop" != b.r && f.l("Dispatching " + c + " " + b.r + ". (" + m + ")");
      h.forEach(function(e) {
        e.pb = a;
        setTimeout(function() {
          b && "pointerMove" != b.r && f.l("Actually handling " + b.r + ". (" + m + ")");
          e.handleEvent(b);
          c--;
          0 == c && k && k();
        });
      });
    };
    this.G = function(a) {
      a.handleEvent = a.handleEvent || a.handleEvent;
      a.$ = a.$ || a.rank;
      a.w = a.w || a.listenerId;
      a.F = a.F || a.eventGroupType;
      var d = e.ma();
      h.push({oa:d, handleEvent:a.handleEvent, $:a.$, w:a.w, F:a.F});
      h = h.sort(function(a, b) {
        return(a.$ || Infinity) - (b.$ || Infinity);
      });
      return d;
    };
    this.removeEventListener = function(a) {
      h = h.filter(function(d) {
        return Boolean(a.oa) && d.oa != a.oa || Boolean(a.w) && d.w != a.w || Boolean(a.F) && d.F != a.F;
      });
    };
  };
  g.Creevents = a;
  a.Event = a.ua;
})();
(function() {
  var a = g.W = g.W || {};
  a.la = function() {
    var e = {}, d = [];
    this.Za = function(a) {
      return void 0 != e[a];
    };
    this.G = function(h) {
      var f = h.r || h.eventId;
      e[f] || (d.push(f), e[f] = new a.ua(f));
      return e[f].G(h);
    };
    this.M = function(a, d, b) {
      e[a] && (d && (d.r = a), e[a].M(d, b));
    };
    this.removeEventListener = function(a) {
      e[a.r] ? e[a.r].removeEventListener(a) : d.forEach(function(d) {
        e[d].removeEventListener(a);
      });
    };
    this.addEventListener = this.G;
  };
  a.EventContainer = a.la;
})();
(function() {
  var a = g.ka = g.ka || {};
  a.ma = function() {
    var e = Date.now().toString(16), e = a.Ja("x", 15 - e.length) + e;
    return("xxxxxxxx-xxxx-4xxx-y" + e.slice(0, 3) + "-" + e.slice(3)).replace(/[xy]/g, function(a) {
      var e = 16 * Math.random() | 0;
      return("x" == a ? e : e & 3 | 8).toString(16);
    });
  };
  a.Ja = function(e, d) {
    return 0 >= d ? "" : e + a.Ja(e, d - 1);
  };
})();
(function() {
  var a = g.ta = g.ta || {};
  a.aa = function() {
    this.l = function(a) {
      console.log(a);
    };
  };
  g.Crelog = a;
  a.Logger = a.aa;
  a.aa.log = a.aa.l;
})();

