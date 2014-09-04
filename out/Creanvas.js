var g = g || {};
g.a = g.a || {};
window.CreJs = g;
g.Creanvas = g.a;
(function() {
  var a = g.s = g.s || {};
  a.t = function(e, d, h) {
    var f = this;
    this.Na = e;
    this.Oa = d;
    this.Pa = h || 0;
    this.Ea = function(b) {
      return{P:a.qa(f, b.P), r:a.qa(f, b.r), Qa:a.qa(f, b.Qa)};
    };
  };
  Object.defineProperty(a.t.prototype, "x", {get:function() {
    return this.Na;
  }, set:function(a) {
    this.Na = a;
  }});
  Object.defineProperty(a.t.prototype, "y", {get:function() {
    return this.Oa;
  }, set:function(a) {
    this.Oa = a;
  }});
  Object.defineProperty(a.t.prototype, "z", {get:function() {
    return this.Pa;
  }, set:function(a) {
    this.Pa = a;
  }});
  a.bb = function(e, d, h, f) {
    e = h - e;
    d = f - d;
    f = Math.sqrt(e * e + d * d);
    return{P:new a.t(e / f, d / f), r:new a.t(-d / f, e / f), Qa:0};
  };
  a.wb = function(a, d, h, f, b) {
    a.lineWidth = 5;
    a.strokeStyle = b;
    a.beginPath();
    a.moveTo(d, h);
    a.lineTo(d + 100 * f.P.J, h + 100 * f.P.K);
    a.moveTo(d, h);
    a.lineTo(d + 50 * f.r.J, h + 50 * f.r.K);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.vb = function(a, d, h, f, b, k, m) {
    a.lineWidth = 5;
    a.strokeStyle = m;
    a.beginPath();
    a.moveTo(d, h);
    a.lineTo(d + 100 * b * f.P.J, h + 100 * b * f.P.K);
    a.lineTo(d + 100 * b * f.P.J + 100 * k * f.r.J, h + 100 * b * f.P.K + 100 * k * f.r.K);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.qa = function(a, d) {
    return a.J * d.J + a.K * d.K;
  };
  a.ja = function(e, d) {
    return new a.t(e.K * d.ta - e.ta * d.K, e.ta * d.J - e.J * d.ta, e.J * d.K - e.K * d.J);
  };
})();
g.a.Ra = function(a) {
  function e() {
    return a.elements.filter(function(a) {
      return a.ca;
    });
  }
  function d(a, b, k) {
    var d, c, n, l, e, h;
    d = k.Ib;
    l = new g.s.t(k.x - a.i, k.y - a.j);
    e = g.s.ja(l, d.r).z;
    h = new g.s.t(k.x - b.i, k.y - b.j);
    k = g.s.ja(h, d.r).z;
    var r = g.s.ja(l, d.r), q = g.s.ja(h, d.r);
    c = new g.s.t(a.b.d.x, a.b.d.y);
    n = new g.s.t(b.b.d.x, b.b.d.y);
    a.w && (c.x += l.x * a.w.x, c.y += l.y * a.w.y);
    b.w && (n.x += h.x * b.w.x, n.y += h.y * b.w.y);
    l = a.ca.xa * b.ca.xa * 2 * (n.Ea(d).r - c.Ea(d).r + b.b.Y * q.z - a.b.Y * r.z) / (1 / b.N + 1 / a.N + q.z * q.z / b.ga() + r.z * r.z / a.ga());
    a.b.d.x += l / a.N * d.r.x;
    a.b.d.y += l / a.N * d.r.y;
    b.b.d.x -= l / b.N * d.r.x;
    b.b.d.y -= l / b.N * d.r.y;
    a.b.Y += l * e / a.ga();
    b.b.Y -= l * k / b.ga();
  }
  function h(a, b) {
    var d, e, c, n, l, h, p;
    n = a.Da();
    l = b.Da();
    d = Math.max(n.left, l.left) - 1;
    e = Math.min(n.right, l.right) + 1;
    c = Math.max(n.top, l.top) - 1;
    n = Math.min(n.bottom, l.bottom) + 1;
    if (!(0 >= e - d || 0 >= n - c)) {
      d = a.h.getImageData(0, 0, a.c, a.g);
      a.h.scale(1 / (a.l || 1), 1 / (a.o || 1));
      a.h.rotate(-(a.q || 0));
      a.h.translate(b.i - a.i, b.j - a.j);
      a.h.rotate(b.Ua || 0);
      a.h.scale(b.nb || 1, b.ob || 1);
      a.h.globalCompositeOperation = "destination-out";
      a.h.drawImage(b.R.canvas, 0, 0, b.c, b.g, -b.A, -b.B, b.c, b.g);
      a.h.scale(1 / (b.nb || 1), 1 / (b.ob || 1));
      a.h.rotate(-b.Ua || 0);
      a.h.translate(-b.i + a.i, -b.j + a.j);
      a.h.rotate(a.q || 0);
      a.h.scale(a.l || 1, a.o || 1);
      h = a.h.getImageData(0, 0, a.c, a.g);
      a.h.globalCompositeOperation = "source-over";
      a.h.putImageData(d, 0, 0);
      p = [];
      a.za.forEach(function(c) {
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
      e = a.ea(p[c].x - a.A, p[c].y - a.B);
      d = a.ea(p[d].x - a.A, p[d].y - a.B);
      return e.x == d.x && e.y == d.y ? null : {x:Math.round((e.x + d.x) / 2), y:Math.round((e.y + d.y) / 2), vectors:g.s.bb(e.x, e.y, d.x, d.y)};
    }
  }
  this.pb = function(a) {
    var b = e(), k, m, c;
    k = a.Ca();
    b = b.filter(function(c) {
      var b;
      if (c.n === a.n || !(c.b.d.x || c.b.d.y || a.b.d.x || a.b.d.y || c.w || a.w)) {
        return!1;
      }
      b = c.Ca();
      return Math.sqrt((k.x - b.x) * (k.x - b.x) + (k.y - b.y) * (k.y - b.y)) > a.Fa() + c.Fa() ? !1 : !0;
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
    a.m.L("collision", {element:c, collisionPoint:m});
    c.m.L("collision", {element:a, collisionPoint:m});
    return!1;
  };
};
g.a.Sa = function(a) {
  var e, d, h, f, b, k, m;
  f = this;
  e = a.canvas;
  m = a.Hb || 1;
  a.Fb ? (k = Date.now(), this.getTime = function() {
    return(Date.now() - k) * m;
  }) : (b = 0, setInterval(function() {
    b += 10 * m;
  }, 10), this.getTime = function() {
    return b;
  });
  this.k = function(c) {
    a.log && a.log(c);
  };
  this.k("Starting controller");
  f.F = e.getContext("2d");
  d = !0;
  isDrawing = !1;
  h = a.Gb || 50;
  this.Ma = function(a, b) {
    var l = !1;
    f.elements.filter(function(b) {
      return b.Va(a);
    }).sort(function(a, c) {
      return c.T || 0 - a.T || 0;
    }).forEach(function(d) {
      !l && d.eb(b.x, b.y) && (d.m.L(a, b), l = !0);
    });
  };
  this.rb = function(a, b) {
    f.elements.forEach(function(d) {
      d.u == b.u && d.m.L(a, b);
    });
  };
  this.pa = function(a, b) {
    e.addEventListener(a, function(d) {
      setTimeout(function() {
        function e(d, l) {
          f.k("Canvas event " + a + " with touchIdentifier " + l);
          var h = f.fa(d);
          h.u = l;
          f.Ma(b, h);
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
          f.k("Canvas event " + a + " with touchIdentifier " + l);
          var h = f.fa(d);
          h.u = l;
          f.rb(b, h);
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
  this.m = new g.U.la;
  this.pa("click", "click");
  this.pa("mousedown", "pointerDown");
  this.pa("touchstart", "pointerDown");
  this.ia("mousemove", "pointerMove");
  this.ia("touchmove", "pointerMove");
  this.ia("mouseup", "pointerUp");
  this.ia("touchend", "pointerUp");
  this.qb = function() {
    f.m.L("deactivate");
    f.elements = [];
  };
  this.I = function() {
    d = !0;
  };
  this.fa = function(a) {
    var b = e.getBoundingClientRect();
    return{x:Math.round((a.clientX - b.left) * e.width / b.width), y:Math.round((a.clientY - b.top) * e.height / b.height)};
  };
  f.elements = [];
  this.add = function() {
    f.k("Controller.addElement: Adding element - args:" + arguments.length);
    var a = [].slice.call(arguments), b = new g.a.Ta(f, a[0]);
    f.k("Controller.addElement: Created element: " + b.H + "-" + b.n);
    1 < a.length ? (f.k("Controller.addElement: Applying " + (a.length - 1) + " decorators"), b.ba.apply(b, a.slice(1))) : f.k("Controller.addElement: No decorator to apply");
    f.elements.push(b);
    return b;
  };
  f.k("Adding background");
  this.add({H:"background", M:{W:e.width, V:e.height, Ha:{ra:0, sa:0}, Ga:a.drawBackground || function(c) {
    c.fillStyle = a.tb || "#FFF";
    c.fillRect(0, 0, this.c, this.g);
  }}, Ba:{Ia:-Infinity}});
  setInterval(function() {
    d && !isDrawing ? (isDrawing = !0, f.elements.sort(function(a, b) {
      return(a.T || 0) - (b.T || 0);
    }).forEach(function(a) {
      f.F.translate(a.i, a.j);
      f.F.rotate(a.q || 0);
      f.F.scale(a.l || 1, a.o || 1);
      f.F.drawImage(a.O.canvas, 0, 0, a.c, a.g, -a.A, -a.B, a.c, a.g);
      f.F.scale(1 / (a.l || 1), 1 / a.o || 1);
      f.F.rotate(-(a.q || 0));
      f.F.translate(-a.i, -a.j);
    }), isDrawing = !1) : f.k("No redraw");
  }, h);
  this.addElement = function() {
    var a = [].slice.call(arguments), b = a[0];
    a[0] = {H:b.name, M:b.image ? {W:b.image.width, V:b.image.height, Ga:b.image.draw, Ha:b.image.translate ? {ra:b.image.translate.dx || 0, sa:b.image.translate.dy || 0} : null} : null, Ba:b.position ? {jb:b.position.x, kb:b.position.y, Ia:b.position.z} : null, rules:b.rules};
    return this.add.apply(this, a);
  };
  this.redraw = this.I;
  this.stop = this.qb;
};
g.a.Controller = g.a.Sa;
g.a.Ta = function(a, e) {
  this.H = e.H;
  var d = e.M, h = d.Ga, f = e.Ba, b = e.rules, k = [].slice.apply(arguments).slice(2), m = [];
  this.e = a;
  this.n = g.ka.ma();
  this.c = d.W;
  this.g = d.V;
  this.i = f.jb || 0;
  this.j = f.kb || 0;
  this.T = f.Ia || 0;
  this.q = f.Eb || 0;
  this.l = d.yb || 1;
  this.o = d.zb || 1;
  this.N = 1;
  f = d.Ha || {ra:d.W / 2, sa:d.V / 2};
  this.A = f.ra;
  this.B = f.sa;
  d.lb ? (this.M = d.lb, f = this.e.F.canvas, f = f.ownerDocument.createElement("canvas"), this.O = f.getContext("2d"), this.O.putImageData(this.M, 0, 0)) : (f = this.e.F.canvas, f = f.ownerDocument.createElement("canvas"), f.width = d.W, f.height = d.V, this.O = f.getContext("2d"), this.O.beginPath(), this.O.translate(this.A, this.B), h(this.O), this.M = this.O.getImageData(0, 0, d.W, d.V));
  var c = this;
  c.debug = function(a, b) {
    c.e.k("Element." + a + ": " + b + ". Element: " + c.H + "/" + c.n);
  };
  b && (c.rules = [], b.forEach(function(a) {
    var b = c.rules.length;
    c.rules.push(a);
    setInterval(function() {
      c.rules[b].rule.call(c);
      c.I();
    }, a.checkTime);
  }));
  this.m = new g.U.la;
  this.isPointInPath = function(a) {
    a = c.e.fa(a);
    return c.e.Db.isPointInPath(c, h, a);
  };
  0 < k.length && g.a.f && (a.k("New element " + elementName + " : apply " + k.length + " decorators"), c.ba(k));
  this.eb = function(a, b) {
    var d = Math.round(a - c.i + c.A), f = Math.round(b - c.j + c.B), d = 0 <= d && d <= c.c && 0 <= f && f <= c.g && 0 < c.M.data[4 * f * c.c + 4 * d + 3];
    c.debug("hit", d ? "hit" : "no hit");
    return d;
  };
  this.wa = function(a) {
    d.xb = c.M;
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
  this.mb = function(a) {
    c.debug("removeElementDecorator", a);
    var b = g.a.f[a];
    b && b.Ja ? b.Ja(c) : c.debug("removeElementDecorator", "Cannot remove: " + a);
  };
  this.Va = function(a) {
    return "click" == a || "pointerDown" == a || c.m.cb(a);
  };
  this.Wa = function() {
    c.e.m.removeEventListener({v:c.n});
    c.O = null;
  };
  c.e.m.D({eventId:"deactivate", listenerId:c.n, handleEvent:function() {
    c.Wa();
  }});
  this.I = function() {
    c.e.I();
  };
  this.ea = function(a, b) {
    return{x:Math.round(c.i + a * c.l * Math.cos(c.q) - b * c.o * Math.sin(c.q)), y:Math.round(c.j + a * c.l * Math.sin(c.q) + b * c.o * Math.cos(c.q))};
  };
  this.Ca = function() {
    return c.ea(-c.A + c.c / 2, -c.B + c.g / 2);
  };
  var n = [];
  n.push({x:-c.A, y:-c.B});
  n.push({x:-c.A + c.c, y:-c.B});
  n.push({x:-c.A + c.c, y:-c.B + c.g});
  n.push({x:-c.A, y:-c.B + c.g});
  this.$a = function() {
    return n.map(function(a) {
      return c.ea(a.x, a.y);
    });
  };
  this.Za = function() {
    var a = c.i + "" + c.j + "" + c.q + "" + c.l + "" + c.l;
    if (m.getClientCorners && m.getClientCorners.key == a) {
      return m.getClientCorners.value;
    }
    var b = c.$a();
    m.getClientCorners = {key:a, value:b};
    return b;
  };
  this.ab = function() {
    var a = c.Za();
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
  this.Da = function() {
    var a = c.i + "" + c.j + "" + c.q + "" + c.l + "" + c.l;
    if (m.getClientRect && m.getClientRect.key == a) {
      return m.getClientRect.value;
    }
    var b = c.ab();
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
    c ? c.Q(this, b) : this.debug("applyElementDecorator", "Not found: " + a);
  };
  Object.defineProperty(c, "name", {get:function() {
    return this.H;
  }, set:function(a) {
    this.H = a;
  }});
  Object.defineProperty(c, "width", {get:function() {
    return this.c;
  }, set:function(a) {
    this.c = a;
  }});
  Object.defineProperty(c, "height", {get:function() {
    return this.g;
  }, set:function(a) {
    this.g = a;
  }});
  Object.defineProperty(c, "scaleX", {get:function() {
    return this.l;
  }, set:function(a) {
    this.l = a;
  }});
  Object.defineProperty(c, "scaleY", {get:function() {
    return this.o;
  }, set:function(a) {
    this.o = a;
  }});
  Object.defineProperty(c, "x", {get:function() {
    return this.i;
  }, set:function(a) {
    this.i = a;
  }});
  Object.defineProperty(c, "y", {get:function() {
    return this.j;
  }, set:function(a) {
    this.j = a;
  }});
  Object.defineProperty(c, "z", {get:function() {
    return this.T;
  }, set:function(a) {
    this.T = a;
  }});
  Object.defineProperty(c, "angle", {get:function() {
    return this.q;
  }, set:function(a) {
    this.q = a;
  }});
  Object.defineProperty(c, "mass", {get:function() {
    return this.N;
  }, set:function(a) {
    this.N = a;
  }});
  Object.defineProperty(c, "id", {get:function() {
    return this.n;
  }});
  Object.defineProperty(c, "image", {get:function() {
    return this.M;
  }});
  Object.defineProperty(c, "events", {get:function() {
    return this.m;
  }});
  c.clone = c.wa;
  c.applyDecorator = c.na;
  c.applyDecorators = c.ba;
  c.removeDecorator = c.mb;
};
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.clickable = {Q:function(a, e) {
  var d = e.onclick;
  a.ib = function(e) {
    a.debug("onClick", d);
    d.call(a, e);
    a.I();
  };
  a.m.D({p:"click", handleEvent:a.ib});
}};
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.collidable = {Q:function(a, e) {
  var d = [];
  a.ca = {};
  var h = e.onCollision, f = e.coefficient;
  a.e.ya = a.e.ya || new g.a.Ra(a.e);
  a.ca.xa = f || 0 === f ? f : 1;
  a.b = a.b || {d:new g.s.t(0, 0), X:new g.s.t(0, 0), Z:0};
  a.m.D({p:"collision", handleEvent:function(b) {
    h && h.call(a, b);
  }});
  a.ha = this.ha || [];
  a.ha.push(function() {
    return a.e.ya.pb(a);
  });
  a.ga = function() {
    return a.Bb / 12 * (a.c * a.l * a.c * a.l + a.g * a.o * a.g * a.o);
  };
  a.Ya = function() {
    return Math.sqrt(a.c * a.c * a.l * a.l + a.g * a.g * a.o * a.o) / 2;
  };
  a.Fa = function() {
    var b = a.c + "" + a.g + "" + a.l + "" + a.o;
    if (d.getRadius && d.getRadius.key == b) {
      return d.getRadius.sb;
    }
    var c = a.Ya();
    d.geRadius = {Ab:b, sb:c};
    return c;
  };
  var b = a.e.F.canvas, f = b.ownerDocument.createElement("canvas"), b = b.ownerDocument.createElement("canvas");
  f.width = b.width = a.c;
  f.height = b.height = a.g;
  a.R = b.getContext("2d");
  a.R.putImageData(a.M, 0, 0);
  a.R.globalCompositeOperation = "source-atop";
  a.R.fillStyle = "#000";
  a.R.fillRect(0, 0, a.c, a.g);
  a.h = f.getContext("2d");
  a.h.globalCompositeOperation = "source-over";
  a.h.drawImage(a.R.canvas, 0, 0);
  f = a.h.getImageData(0, 0, a.c, a.g);
  b = a.h.createImageData(a.c, a.g);
  a.za = [];
  for (var k = 0;k < a.c;k++) {
    for (var m = 0;m < a.g;m++) {
      if (!(200 > f.data[m * a.c * 4 + 4 * k + 3])) {
        for (var c = !1, n = -1;2 > n;n++) {
          for (var l = -1;2 > l;l++) {
            if (0 > m + n || 0 > k + l || m + n > a.g - 1 || k + n > a.c - 1 || 100 > f.data[(m + n) * a.c * 4 + 4 * (k + l) + 3]) {
              c = !0, l = n = 2;
            }
          }
        }
        a.h.putImageData(b, 0, 0);
        c && (a.za.push({x:k, y:m}), b.data[m * a.c * 4 + 4 * k] = 0, b.data[m * a.c * 4 + 4 * k + 1] = 0, b.data[m * a.c * 4 + 4 * k + 2] = 0, b.data[m * a.c * 4 + 4 * k + 3] = 255);
      }
    }
  }
  a.h.putImageData(b, 0, 0);
  a.h.translate(a.A, a.B);
}};
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.droppable = {Q:function(a, e) {
  var d = e.dropZone;
  a.gb = !0;
  a.Aa = d;
  a.debug("droppable.applyTo", "Now droppable");
  Object.defineProperty(a, "dropZone", {get:function() {
    return this.Aa;
  }, set:function(a) {
    this.Aa = a;
  }});
}};
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.dropzone = {Q:function(a, e) {
  var d = e.availableSpots, h = e.dropX, f = e.dropY;
  a.da = [];
  a.m.D({C:"dropzone", p:"drop", handleEvent:function(b) {
    0 >= d || (a.e.k("drop event on dropzone " + a.n + ", dropped " + b.G.id), d--, b.G.x = h || a.i, b.G.y = f || a.j, b.G.S = a, a.da.push(b.G), b.G.m.L("dropped", {S:a, G:b.G}), a.m.L("droppedIn", {S:a, G:b.G}), a.I());
  }, v:a.n});
  a.Xa = function(b) {
    a.e.k("dragging from dropzone " + a.n + ", dragged " + b.id);
    b.S = null;
    d++;
    a.da.splice(a.da.indexOf(b), 1);
    a.I();
  };
  Object.defineProperty(a, "droppedElements", {get:function() {
    return this.da;
  }});
}};
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.duplicable = {Q:function(a, e) {
  var d = e.isBlocked, h = e.generatorCount || Infinity;
  a.debug("duplicable.applyTo", "generatorCount is " + h);
  var f = !1;
  a.m.D({C:"duplicable", p:"pointerDown", handleEvent:function(b) {
    0 <= b.u && (f = !0);
    if (!(f && 0 > b.u || d && d() || (a.debug("duplicable.makeCopy", "GeneratorCount was: " + h), 0 >= h))) {
      h--;
      a.debug("duplicable.makeCopy", "GeneratorCount is now: " + h);
      var e = a.wa(["duplicable"]);
      e.H += " (duplicate)";
      e.na("movable", {fb:d});
      e.La(b);
      a.I();
    }
  }, v:a.n});
}, Ja:function(a) {
  a.m.removeEventListener({C:"duplicable", v:a.n});
}};
g.a.f = g.a.f || [];
g.a.elementDecorators = g.a.f;
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.movable = {Q:function(a, e) {
  var d = !1, h = this.u = null, f = e.fb;
  a.La = function(b) {
    a.e.k("Starting moving - identifier: " + b.u);
    d = !0;
    a.u = b.u;
    h = {x:b.x, y:b.y};
    a.S && (a.S.Xa(a), a.S = null);
  };
  a.hb = function(b) {
    a.e.k("Completed move - identifier: " + b.u);
    d = !1;
    h = null;
    a.gb && (a.e.k("Trigger drop - identifier: " + b.u), a.e.Ma("drop", {x:b.x, y:b.y, G:a}));
  };
  a.m.D({C:"movable", p:"pointerDown", handleEvent:function(b) {
    f && f() || a.La(b);
  }, v:a.n});
  var b = !1;
  a.m.D({C:"movable", p:"pointerMove", handleEvent:function(e) {
    !d || f && f() || (b || (b = !0, a.e.k("pointereMove event on movable " + a.n + " (" + a.u + ")")), a.i += e.x - h.x, a.j += e.y - h.y, h = {x:e.x, y:e.y}, a.I());
  }, v:a.n});
  a.m.D({C:"movable", p:"pointerUp", handleEvent:function(e) {
    !d || f && f() || (a.e.k("End detected for touch " + a.u), a.e.fa(e), a.i += e.x - h.x, a.j += e.y - h.y, a.hb(e), a.u = null, b = !1, a.I());
  }, v:a.n});
}};
g = g || {};
g.a = g.a || {};
g.a.f = g.a.f || [];
g.a.f.moving = {type:"moving", Q:function(a, e) {
  var d, h, f, b, k, m = e.vx, c = e.vy, n = e.ax, l = e.ay, s = e.omega;
  a.e.k("Applying moving decorator to " + a.H + "-" + a.n);
  var p, r, q;
  a.b = a.b || {};
  a.b.d = new g.s.t(m || 0, c || 0);
  a.b.X = new g.s.t(n || 0, l || 0);
  a.b.Z = s || 0;
  p = a.e.getTime();
  setInterval(function() {
    r = a.e.getTime();
    q = r - p;
    if (!(1 > q) && (p = r, a.b.d.x += a.b.X.x * q, a.b.d.y += a.b.X.y * q, 0 != a.b.d.x || 0 != a.b.d.y || 0 != a.Cb.Z || a.w && (0 != a.w.x || 0 != a.w.y))) {
      d = a.i;
      h = a.j;
      f = a.q;
      b = a.l;
      k = a.o;
      a.i += a.b.d.x * q;
      a.j += a.b.d.y * q;
      a.q += a.b.Z * q;
      a.w && (a.l += a.w.x * q, a.o += a.w.y * q);
      var c = !0;
      a.ha && a.ha.forEach(function(b) {
        c && (b.call(a) || (c = !1));
      });
      c || (a.i = d, a.j = h, a.q = f, a.l = b, a.o = k);
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
    return this.X;
  }, set:function(a) {
    this.X = a;
  }});
  Object.defineProperty(a.b, "rotationSpeed", {get:function() {
    return this.Z;
  }, set:function(a) {
    this.Z = a;
  }});
}};
(function() {
  var a = g.U = g.U || {}, e;
  a.va = function(a) {
    this.p = a;
    e = g.ka;
    var h = [], f = new g.ua.aa;
    this.L = function(b, k) {
      var m = e.ma(), c = h.length;
      b && "pointerMove" != b.p && "drag" != b.p && "drop" != b.p && f.k("Dispatching " + c + " " + b.p + ". (" + m + ")");
      h.forEach(function(e) {
        e.ub = a;
        setTimeout(function() {
          b && "pointerMove" != b.p && f.k("Actually handling " + b.p + ". (" + m + ")");
          e.handleEvent(b);
          c--;
          0 == c && k && k();
        });
      });
    };
    this.D = function(a) {
      a.handleEvent = a.handleEvent || a.handleEvent;
      a.$ = a.$ || a.rank;
      a.v = a.v || a.listenerId;
      a.C = a.C || a.eventGroupType;
      var d = e.ma();
      h.push({oa:d, handleEvent:a.handleEvent, $:a.$, v:a.v, C:a.C});
      h = h.sort(function(a, b) {
        return(a.$ || Infinity) - (b.$ || Infinity);
      });
      return d;
    };
    this.removeEventListener = function(a) {
      h = h.filter(function(d) {
        return Boolean(a.oa) && d.oa != a.oa || Boolean(a.v) && d.v != a.v || Boolean(a.C) && d.C != a.C;
      });
    };
  };
  g.Creevents = a;
  a.Event = a.va;
})();
(function() {
  var a = g.U = g.U || {};
  a.la = function() {
    var e = {}, d = [];
    this.cb = function(a) {
      return void 0 != e[a];
    };
    this.D = function(h) {
      var f = h.p || h.eventId;
      e[f] || (d.push(f), e[f] = new a.va(f));
      return e[f].D(h);
    };
    this.L = function(a, d, b) {
      e[a] && (d && (d.p = a), e[a].L(d, b));
    };
    this.removeEventListener = function(a) {
      e[a.p] ? e[a.p].removeEventListener(a) : d.forEach(function(d) {
        e[d].removeEventListener(a);
      });
    };
    this.addEventListener = this.D;
  };
  a.EventContainer = a.la;
})();
(function() {
  var a = g.ka = g.ka || {};
  a.ma = function() {
    var e = Date.now().toString(16), e = a.Ka("x", 15 - e.length) + e;
    return("xxxxxxxx-xxxx-4xxx-y" + e.slice(0, 3) + "-" + e.slice(3)).replace(/[xy]/g, function(a) {
      var e = 16 * Math.random() | 0;
      return("x" == a ? e : e & 3 | 8).toString(16);
    });
  };
  a.Ka = function(e, d) {
    return 0 >= d ? "" : e + a.Ka(e, d - 1);
  };
})();
(function() {
  var a = g.ua = g.ua || {};
  a.aa = function() {
    this.k = function(a) {
      console.log(a);
    };
  };
  g.Crelog = a;
  a.Logger = a.aa;
  a.aa.log = a.aa.k;
})();

