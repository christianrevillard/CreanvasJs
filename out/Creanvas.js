var f = f || {};
f.a = f.a || {};
window.CreJs = f;
f.Creanvas = f.a;
(function() {
  var a = f.S = f.S || {};
  a.t = function(a, e, h) {
    this.Ba = a;
    this.Ca = e;
    this.Da = h || 0;
  };
  Object.defineProperty(a.t.prototype, "x", {get:function() {
    return this.Ba;
  }, set:function(a) {
    this.Ba = a;
  }});
  Object.defineProperty(a.t.prototype, "y", {get:function() {
    return this.Ca;
  }, set:function(a) {
    this.Ca = a;
  }});
  Object.defineProperty(a.t.prototype, "z", {get:function() {
    return this.Da;
  }, set:function(a) {
    this.Da = a;
  }});
  a.ib = function(d, e, h, b) {
    d = h - d;
    e = b - e;
    b = Math.sqrt(d * d + e * e);
    return{R:new a.t(d / b, e / b), ea:new a.t(-e / b, d / b), xb:0};
  };
  a.eb = function(a, e, h, b, g) {
    a.lineWidth = 5;
    a.strokeStyle = g;
    a.beginPath();
    a.moveTo(e, h);
    a.lineTo(e + 100 * b.R.A, h + 100 * b.R.B);
    a.moveTo(e, h);
    a.lineTo(e + 50 * b.ea.A, h + 50 * b.ea.B);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.cb = function(a, e, h, b, g, k, c) {
    a.lineWidth = 5;
    a.strokeStyle = c;
    a.beginPath();
    a.moveTo(e, h);
    a.lineTo(e + 100 * g * b.R.A, h + 100 * g * b.R.B);
    a.lineTo(e + 100 * g * b.R.A + 100 * k * b.ea.A, h + 100 * g * b.R.B + 100 * k * b.ea.B);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.tb = function(a, e) {
    return a.A * e.A + a.B * e.B;
  };
  a.wb = function(d, e) {
    return new a.t(d.B * e.oa - d.oa * e.B, d.oa * e.A - d.A * e.oa, d.A * e.B - d.B * e.A);
  };
})();
f.a.Ea = function() {
};
f.a.Fa = function(a) {
  var d, e, h, b, g, k, c;
  b = this;
  d = a.canvas;
  c = a.vb || 1;
  a.rb ? (k = Date.now(), this.getTime = function() {
    return(Date.now() - k) * c;
  }) : (g = 0, setInterval(function() {
    g += 10 * c;
  }, 10), this.getTime = function() {
    return g;
  });
  this.f = function(b) {
    a.log && a.log(b);
  };
  this.f("Starting controller");
  b.u = d.getContext("2d");
  e = !0;
  isDrawing = !1;
  h = a.sb || 50;
  this.Aa = function(a, e) {
    var c = !1;
    b.elements.filter(function(b) {
      return b.Ha(a);
    }).sort(function(a, b) {
      return b.O || 0 - a.O || 0;
    }).forEach(function(b) {
      !c && b.Pa(e.x, e.y) && (b.h.K(a, e), c = !0);
    });
  };
  this.Ya = function(a, e) {
    b.elements.forEach(function(b) {
      b.m == e.m && b.h.K(a, e);
    });
  };
  this.la = function(a, e) {
    d.addEventListener(a, function(c) {
      setTimeout(function() {
        function g(c, d) {
          b.f("Canvas event " + a + " with touchIdentifier " + d);
          var h = b.ba(c);
          h.m = d;
          b.Aa(e, h);
        }
        if (c.changedTouches) {
          for (var d = 0;d < c.changedTouches.length;d++) {
            g(c.changedTouches[d], c.changedTouches[d].identifier);
          }
        } else {
          g(c, -1);
        }
      });
    });
  };
  this.da = function(a, e) {
    d.addEventListener(a, function(c) {
      setTimeout(function() {
        function g(c, d) {
          b.f("Canvas event " + a + " with touchIdentifier " + d);
          var h = b.ba(c);
          h.m = d;
          b.Ya(e, h);
        }
        if (c.changedTouches) {
          for (var d = 0;d < c.changedTouches.length;d++) {
            g(c.changedTouches[d], c.changedTouches[d].identifier);
          }
        } else {
          g(c, -1);
        }
      });
    });
  };
  this.h = new f.T.ga;
  this.la("click", "click");
  this.la("mousedown", "pointerDown");
  this.la("touchstart", "pointerDown");
  this.da("mousemove", "pointerMove");
  this.da("touchmove", "pointerMove");
  this.da("mouseup", "pointerUp");
  this.da("touchend", "pointerUp");
  this.Xa = function() {
    b.h.K("deactivate");
    b.elements = [];
  };
  this.w = function() {
    e = !0;
  };
  this.ba = function(a) {
    var b = d.getBoundingClientRect();
    return{x:Math.round((a.clientX - b.left) * d.width / b.width), y:Math.round((a.clientY - b.top) * d.height / b.height)};
  };
  b.elements = [];
  this.add = function() {
    b.f("Controller.addElement: Adding element - args:" + arguments.length);
    var a = [].slice.call(arguments), c = new f.a.Ga(b, a[0]);
    b.f("Controller.addElement: Created element: " + c.C + "-" + c.j);
    1 < a.length ? (b.f("Controller.addElement: Applying " + (a.length - 1) + " decorators"), c.$.apply(c, a.slice(1))) : b.f("Controller.addElement: No decorator to apply");
    b.elements.push(c);
    return c;
  };
  b.f("Adding background");
  this.add({C:"background", L:{Q:d.width, P:d.height, M:{ma:0, na:0}, Qa:a.drawBackground || function(b) {
    b.fillStyle = a.$a || "#FFF";
    b.fillRect(0, 0, this.d, this.g);
  }}, Ma:{ka:-Infinity}});
  setInterval(function() {
    e && !isDrawing ? (isDrawing = !0, b.elements.sort(function(a, b) {
      return(a.O || 0) - (b.O || 0);
    }).forEach(function(a) {
      b.u.translate(a.k, a.l);
      b.u.rotate(a.G || 0);
      b.u.scale(a.n || 1, a.o || 1);
      b.u.drawImage(a.H.canvas, 0, 0, a.d, a.g, -a.D, -a.F, a.d, a.g);
      b.u.scale(1 / (a.n || 1), 1 / a.o || 1);
      b.u.rotate(-(a.G || 0));
      b.u.translate(-a.k, -a.l);
    }), isDrawing = !1) : b.f("No redraw");
  }, h);
  this.addElement = this.add;
  this.redraw = this.w;
  this.stop = this.Xa;
};
f.a.Controller = f.a.Fa;
f.a.Ga = function(a, d) {
  this.C = d.C || d.name;
  var e = d.L || d.image || {};
  e.Q = e.Q || e.width;
  e.P = e.P || e.height;
  var h = e.Qa || e.draw;
  e.M = e.M || e.translate;
  e.translate && (e.M.ma = e.M.dx || 0, e.M.na = e.M.dy || 0);
  var b = d.Ma || d.position;
  b.va = b.va || b.x;
  b.wa = b.wa || b.y;
  b.ka = b.ka || b.z;
  var g = d.rules, k = [].slice.apply(arguments).slice(2);
  this.e = a;
  this.j = f.fa.ha();
  this.d = e.Q;
  this.g = e.P;
  this.k = b.va || 0;
  this.l = b.wa || 0;
  this.O = b.ka || 0;
  this.G = b.qb || 0;
  this.n = e.kb || 1;
  this.o = e.lb || 1;
  this.ua = 1;
  b = e.M || {ma:e.Q / 2, na:e.P / 2};
  this.D = b.ma;
  this.F = b.na;
  e.Va ? (this.L = e.Va, b = this.e.u.canvas, b = b.ownerDocument.createElement("canvas"), this.H = b.getContext("2d"), this.H.putImageData(this.L, 0, 0)) : (b = this.e.u.canvas, b = b.ownerDocument.createElement("canvas"), b.width = e.Q, b.height = e.P, this.H = b.getContext("2d"), this.H.beginPath(), this.H.translate(this.D, this.F), h(this.H), this.L = this.H.getImageData(0, 0, e.Q, e.P));
  var c = this;
  c.debug = function(a, b) {
    c.e.f("Element." + a + ": " + b + ". Element: " + c.C + "/" + c.j);
  };
  g && (c.rules = [], g.forEach(function(a) {
    var b = c.rules.length;
    c.rules.push(a);
    setInterval(function() {
      c.rules[b].rule.call(c);
      c.w();
    }, a.checkTime);
  }));
  this.h = new f.T.ga;
  this.isPointInPath = function(a) {
    a = c.e.ba(a);
    return c.e.pb.isPointInPath(c, h, a);
  };
  0 < k.length && f.a.c && (a.f("New element " + elementName + " : apply " + k.length + " decorators"), c.$(k));
  this.Pa = function(a, b) {
    var e = Math.round(a - c.k + c.D), g = Math.round(b - c.l + c.F), e = 0 <= e && e <= c.d && 0 <= g && g <= c.g && 0 < c.L.data[4 * g * c.d + 4 * e + 3];
    c.debug("hit", e ? "hit" : "no hit");
    return e;
  };
  this.ra = function(a) {
    e.jb = c.L;
    c.debug("cloneElement", "start cloning");
    var b = c.e.add(d), g = a ? k.filter(function(b) {
      return a.every(function(a) {
        return a != b[0];
      });
    }) : k;
    c.debug("cloneElement", "apply " + g.length + " decorators");
    b.$.apply(b, g);
    return b;
  };
  this.Wa = function(a) {
    c.debug("removeElementDecorator", a);
    var b = f.a.c[a];
    b && b.xa ? b.xa(c) : c.debug("removeElementDecorator", "Cannot remove: " + a);
  };
  this.Ha = function(a) {
    return "click" == a || "pointerDown" == a || c.h.Oa(a);
  };
  this.Ja = function() {
    c.e.h.removeEventListener({p:c.j});
    c.H = null;
  };
  c.e.h.r({eventId:"deactivate", listenerId:c.j, handleEvent:function() {
    c.Ja();
  }});
  this.w = function() {
    c.e.w();
  };
  g = [];
  g.push({x:-c.D, y:-c.F});
  g.push({x:-c.D + c.d, y:-c.F});
  g.push({x:-c.D + c.d, y:-c.F + c.g});
  g.push({x:-c.D, y:-c.F + c.g});
  this.$ = function() {
    var a = this, b = [].slice.apply(arguments);
    k = k.concat(b);
    b.forEach(function(b) {
      a.ia(b[0], b[1]);
    });
  };
  this.ia = function(a, b) {
    this.debug("applyElementDecorator", a);
    var c = f.a.c[a];
    c ? c.I(this, b) : this.debug("applyElementDecorator", "Not found: " + a);
  };
  Object.defineProperty(c, "name", {get:function() {
    return this.C;
  }, set:function(a) {
    this.C = a;
  }});
  Object.defineProperty(c, "width", {get:function() {
    return this.d;
  }, set:function(a) {
    this.d = a;
  }});
  Object.defineProperty(c, "height", {get:function() {
    return this.g;
  }, set:function(a) {
    this.g = a;
  }});
  Object.defineProperty(c, "scaleX", {get:function() {
    return this.n;
  }, set:function(a) {
    this.n = a;
  }});
  Object.defineProperty(c, "scaleY", {get:function() {
    return this.o;
  }, set:function(a) {
    this.o = a;
  }});
  Object.defineProperty(c, "x", {get:function() {
    return this.k;
  }, set:function(a) {
    this.k = a;
  }});
  Object.defineProperty(c, "y", {get:function() {
    return this.l;
  }, set:function(a) {
    this.l = a;
  }});
  Object.defineProperty(c, "z", {get:function() {
    return this.O;
  }, set:function(a) {
    this.O = a;
  }});
  Object.defineProperty(c, "angle", {get:function() {
    return this.G;
  }, set:function(a) {
    this.G = a;
  }});
  Object.defineProperty(c, "mass", {get:function() {
    return this.ua;
  }, set:function(a) {
    this.ua = a;
  }});
  Object.defineProperty(c, "id", {get:function() {
    return this.j;
  }});
  Object.defineProperty(c, "image", {get:function() {
    return this.L;
  }});
  Object.defineProperty(c, "events", {get:function() {
    return this.h;
  }});
  c.clone = c.ra;
  c.applyDecorator = c.ia;
  c.applyDecorators = c.$;
  c.removeDecorator = c.Wa;
};
f = f || {};
f.a = f.a || {};
f.a.c = f.a.c || [];
f.a.c.clickable = {I:function(a, d) {
  var e = d.onclick;
  a.Ua = function(d) {
    a.debug("onClick", e);
    e.call(a, d);
    a.w();
  };
  a.h.r({i:"click", handleEvent:a.Ua});
}};
f = f || {};
f.a = f.a || {};
f.a.c = f.a.c || [];
f.a.c.collidable = {I:function(a, d) {
  var e = [];
  a.Ia = {};
  var h = d.onCollision, b = d.coefficient;
  a.e.sa = a.e.sa || new f.a.Ea;
  a.Ia.ab = b || 0 === b ? b : 1;
  a.b = a.b || {s:new f.S.t(0, 0), V:new f.S.t(0, 0), W:0};
  a.h.r({i:"collision", handleEvent:function(b) {
    h && h.call(a, b);
  }});
  a.ca = this.ca || [];
  a.ca.push(function() {
    return a.e.sa.ub(a);
  });
  a.gb = function() {
    return a.nb / 12 * (a.d * a.n * a.d * a.n + a.g * a.o * a.g * a.o);
  };
  a.Na = function() {
    return Math.sqrt(a.d * a.d * a.n * a.n + a.g * a.g * a.o * a.o) / 2;
  };
  a.hb = function() {
    var b = a.d + "" + a.g + "" + a.n + "" + a.o;
    if (e.getRadius && e.getRadius.key == b) {
      return e.getRadius.Za;
    }
    var c = a.Na();
    e.geRadius = {mb:b, Za:c};
    return c;
  };
  var g = a.e.u.canvas, b = g.ownerDocument.createElement("canvas"), g = g.ownerDocument.createElement("canvas");
  b.width = g.width = a.d;
  b.height = g.height = a.g;
  a.U = g.getContext("2d");
  a.U.putImageData(a.fb, 0, 0);
  a.U.globalCompositeOperation = "source-atop";
  a.U.fillStyle = "#000";
  a.U.fillRect(0, 0, a.d, a.g);
  a.J = b.getContext("2d");
  a.J.globalCompositeOperation = "source-over";
  a.J.drawImage(a.U.canvas, 0, 0);
  b = a.J.getImageData(0, 0, a.d, a.g);
  g = a.J.createImageData(a.d, a.g);
  a.La = [];
  for (var k = 0;k < a.d;k++) {
    for (var c = 0;c < a.g;c++) {
      if (!(200 > b.data[c * a.d * 4 + 4 * k + 3])) {
        for (var n = !1, l = -1;2 > l;l++) {
          for (var p = -1;2 > p;p++) {
            if (0 > c + l || 0 > k + p || c + l > a.g - 1 || k + l > a.d - 1 || 100 > b.data[(c + l) * a.d * 4 + 4 * (k + p) + 3]) {
              n = !0, p = l = 2;
            }
          }
        }
        a.J.putImageData(g, 0, 0);
        n && (a.La.push({x:k, y:c}), g.data[c * a.d * 4 + 4 * k] = 0, g.data[c * a.d * 4 + 4 * k + 1] = 0, g.data[c * a.d * 4 + 4 * k + 2] = 0, g.data[c * a.d * 4 + 4 * k + 3] = 255);
      }
    }
  }
  a.J.putImageData(g, 0, 0);
  a.J.translate(a.D, a.F);
}};
f = f || {};
f.a = f.a || {};
f.a.c = f.a.c || [];
f.a.c.droppable = {I:function(a, d) {
  var e = d.dropZone;
  a.Sa = !0;
  a.ta = e;
  a.debug("droppable.applyTo", "Now droppable");
  Object.defineProperty(a, "dropZone", {get:function() {
    return this.ta;
  }, set:function(a) {
    this.ta = a;
  }});
}};
f = f || {};
f.a = f.a || {};
f.a.c = f.a.c || [];
f.a.c.dropzone = {I:function(a, d) {
  var e = d.availableSpots, h = d.dropX, b = d.dropY;
  a.aa = [];
  a.h.r({q:"dropzone", i:"drop", handleEvent:function(g) {
    0 >= e || (a.e.f("drop event on dropzone " + a.j + ", dropped " + g.v.id), e--, g.v.x = h || a.k, g.v.y = b || a.l, g.v.N = a, a.aa.push(g.v), g.v.h.K("dropped", {N:a, v:g.v}), a.h.K("droppedIn", {N:a, v:g.v}), a.w());
  }, p:a.j});
  a.Ka = function(b) {
    a.e.f("dragging from dropzone " + a.j + ", dragged " + b.id);
    b.N = null;
    e++;
    a.aa.splice(a.aa.indexOf(b), 1);
    a.w();
  };
  Object.defineProperty(a, "droppedElements", {get:function() {
    return this.aa;
  }});
}};
f = f || {};
f.a = f.a || {};
f.a.c = f.a.c || [];
f.a.c.duplicable = {I:function(a, d) {
  var e = d.isBlocked, h = d.generatorCount || Infinity;
  a.debug("duplicable.applyTo", "generatorCount is " + h);
  var b = !1;
  a.h.r({q:"duplicable", i:"pointerDown", handleEvent:function(g) {
    0 <= g.m && (b = !0);
    if (!(b && 0 > g.m || e && e() || (a.debug("duplicable.makeCopy", "GeneratorCount was: " + h), 0 >= h))) {
      h--;
      a.debug("duplicable.makeCopy", "GeneratorCount is now: " + h);
      var d = a.ra(["duplicable"]);
      d.C += " (duplicate)";
      d.ia("movable", {Ra:e});
      d.za(g);
      a.w();
    }
  }, p:a.j});
}, xa:function(a) {
  a.h.removeEventListener({q:"duplicable", p:a.j});
}};
f.a.c = f.a.c || [];
f.a.elementDecorators = f.a.c;
f = f || {};
f.a = f.a || {};
f.a.c = f.a.c || [];
f.a.c.movable = {I:function(a, d) {
  var e = !1, h = this.m = null, b = d.Ra;
  a.za = function(b) {
    a.e.f("Starting moving - identifier: " + b.m);
    e = !0;
    a.m = b.m;
    h = {x:b.x, y:b.y};
    a.N && (a.N.Ka(a), a.N = null);
  };
  a.Ta = function(b) {
    a.e.f("Completed move - identifier: " + b.m);
    e = !1;
    h = null;
    a.Sa && (a.e.f("Trigger drop - identifier: " + b.m), a.e.Aa("drop", {x:b.x, y:b.y, v:a}));
  };
  a.h.r({q:"movable", i:"pointerDown", handleEvent:function(e) {
    b && b() || a.za(e);
  }, p:a.j});
  var g = !1;
  a.h.r({q:"movable", i:"pointerMove", handleEvent:function(d) {
    !e || b && b() || (g || (g = !0, a.e.f("pointereMove event on movable " + a.j + " (" + a.m + ")")), a.k += d.x - h.x, a.l += d.y - h.y, h = {x:d.x, y:d.y}, a.w());
  }, p:a.j});
  a.h.r({q:"movable", i:"pointerUp", handleEvent:function(d) {
    !e || b && b() || (a.e.f("End detected for touch " + a.m), a.e.ba(d), a.k += d.x - h.x, a.l += d.y - h.y, a.Ta(d), a.m = null, g = !1, a.w());
  }, p:a.j});
}};
f = f || {};
f.a = f.a || {};
f.a.c = f.a.c || [];
f.a.c.moving = {type:"moving", I:function(a, d) {
  var e, h, b, g, k, c = d.vx, n = d.vy, l = d.ax, p = d.ay, s = d.omega;
  a.e.f("Applying moving decorator to " + a.C + "-" + a.j);
  var q, r, m;
  a.b = a.b || {};
  a.b.s = new f.S.t(c || 0, n || 0);
  a.b.V = new f.S.t(l || 0, p || 0);
  a.b.W = s || 0;
  q = a.e.getTime();
  setInterval(function() {
    r = a.e.getTime();
    m = r - q;
    if (!(1 > m) && (q = r, a.b.s.x += a.b.V.x * m, a.b.s.y += a.b.V.y * m, 0 != a.b.s.x || 0 != a.b.s.y || 0 != a.ob.W || a.Y && (0 != a.Y.x || 0 != a.Y.y))) {
      e = a.k;
      h = a.l;
      b = a.G;
      g = a.n;
      k = a.o;
      a.k += a.b.s.x * m;
      a.l += a.b.s.y * m;
      a.G += a.b.W * m;
      a.Y && (a.n += a.Y.x * m, a.o += a.Y.y * m);
      var c = !0;
      a.ca && a.ca.forEach(function(b) {
        c && (b.call(a) || (c = !1));
      });
      c || (a.k = e, a.l = h, a.G = b, a.n = g, a.o = k);
    }
  }, 20);
  Object.defineProperty(a, "moving", {get:function() {
    return this.b;
  }, set:function(a) {
    this.b = a;
  }});
  Object.defineProperty(a.b, "speed", {get:function() {
    return this.b.s;
  }, set:function(a) {
    this.b.s = a;
  }});
  Object.defineProperty(a.b, "acceleration", {get:function() {
    return this.b.V;
  }, set:function(a) {
    this.b.V = a;
  }});
  Object.defineProperty(a.b, "rotationSpeed", {get:function() {
    return this.b.W;
  }, set:function(a) {
    this.b.W = a;
  }});
}};
(function() {
  var a = f.T = f.T || {}, d;
  a.qa = function(a) {
    this.i = a;
    d = f.fa;
    var h = [], b = new f.pa.Z;
    this.K = function(g, k) {
      var c = d.ha(), n = h.length;
      g && "pointerMove" != g.i && "drag" != g.i && "drop" != g.i && b.f("Dispatching " + n + " " + g.i + ". (" + c + ")");
      h.forEach(function(d) {
        d.bb = a;
        setTimeout(function() {
          g && "pointerMove" != g.i && b.f("Actually handling " + g.i + ". (" + c + ")");
          d.handleEvent(g);
          n--;
          0 == n && k && k();
        });
      });
    };
    this.r = function(a) {
      a.handleEvent = a.handleEvent || a.handleEvent;
      a.X = a.X || a.rank;
      a.p = a.p || a.listenerId;
      a.q = a.q || a.eventGroupType;
      var b = d.ha();
      h.push({ja:b, handleEvent:a.handleEvent, X:a.X, p:a.p, q:a.q});
      h = h.sort(function(a, b) {
        return(a.X || Infinity) - (b.X || Infinity);
      });
      return b;
    };
    this.removeEventListener = function(a) {
      h = h.filter(function(b) {
        return Boolean(a.ja) && b.ja != a.ja || Boolean(a.p) && b.p != a.p || Boolean(a.q) && b.q != a.q;
      });
    };
  };
  f.Creevents = a;
  a.Event = a.qa;
})();
(function() {
  var a = f.T = f.T || {};
  a.ga = function() {
    var d = {}, e = [];
    this.Oa = function(a) {
      return void 0 != d[a];
    };
    this.r = function(h) {
      var b = h.i || h.eventId;
      d[b] || (e.push(b), d[b] = new a.qa(b));
      return d[b].r(h);
    };
    this.K = function(a, b, e) {
      d[a] && (b && (b.i = a), d[a].K(b, e));
    };
    this.removeEventListener = function(a) {
      d[a.i] ? d[a.i].removeEventListener(a) : e.forEach(function(b) {
        d[b].removeEventListener(a);
      });
    };
    this.addEventListener = this.r;
  };
  a.EventContainer = a.ga;
})();
(function() {
  var a = f.fa = f.fa || {};
  a.ha = function() {
    var d = Date.now().toString(16), d = a.ya("x", 15 - d.length) + d;
    return("xxxxxxxx-xxxx-4xxx-y" + d.slice(0, 3) + "-" + d.slice(3)).replace(/[xy]/g, function(a) {
      var d = 16 * Math.random() | 0;
      return("x" == a ? d : d & 3 | 8).toString(16);
    });
  };
  a.ya = function(d, e) {
    return 0 >= e ? "" : d + a.ya(d, e - 1);
  };
})();
(function() {
  var a = f.pa = f.pa || {};
  a.Z = function() {
    this.f = function(a) {
      console.log(a);
    };
  };
  f.Crelog = a;
  a.Logger = a.Z;
  a.Z.log = a.Z.f;
})();

