var TEST = !0, DEBUG = !1, CreJs = CreJs || {};
CreJs.Creanvas = CreJs.Creanvas || {};
window.CreJs = CreJs;
CreJs.Creanvas = CreJs.Creanvas;
TEST && (CreJs.Test = CreJs.Test || {}, CreJs.Test = CreJs.Test);
(function() {
  var a = CreJs.Core = CreJs.Core || {};
  a.Vector = function(d, b, c) {
    var g = this;
    this.vectorX = d;
    this.vectorY = b;
    this.vectorZ = c || 0;
    this.draw = function(a, c, b, d) {
      a.lineWidth = 5;
      a.strokeStyle = d;
      a.beginPath();
      a.moveTo(c, b);
      a.lineTo(c + 100 * g.vectorX, b + 100 * g.vectorY);
      a.stroke();
      a.lineWidth = 1;
      a.strokeStyle = "#000";
    };
    this.getCoordinates = function(f) {
      return{u:a.scalarProduct(g, f.u), v:a.scalarProduct(g, f.v), w:a.scalarProduct(g, f.w)};
    };
    this.setCoordinates = function(a, c, b, d) {
      d = d || 0;
      g.vectorX = c * a.u.vectorX + b * a.v.vectorX + d * a.w.vectorX;
      g.vectorY = c * a.u.vectorY + b * a.v.vectorY + d * a.w.vectorY;
      g.vectorZ = c * a.u.vectorZ + b * a.v.vectorZ + d * a.w.vectorZ;
    };
  };
  Object.defineProperty(a.Vector.prototype, "x", {get:function() {
    return this.vectorX;
  }, set:function(a) {
    this.vectorX = a;
  }});
  Object.defineProperty(a.Vector.prototype, "y", {get:function() {
    return this.vectorY;
  }, set:function(a) {
    this.vectorY = a;
  }});
  Object.defineProperty(a.Vector.prototype, "z", {get:function() {
    return this.vectorZ;
  }, set:function(a) {
    this.vectorZ = a;
  }});
  a.getUnitVectors = function(d, b, c, g) {
    d = c - d;
    b = g - b;
    g = Math.sqrt(d * d + b * b);
    return{u:new a.Vector(d / g, b / g, 0), v:new a.Vector(-b / g, d / g, 0), w:new a.Vector(0, 0, 0)};
  };
  a.drawUnitVectors = function(a, b, c, g, f) {
    a.lineWidth = 5;
    a.strokeStyle = f;
    a.beginPath();
    a.moveTo(b, c);
    a.lineTo(b + 100 * g.u.vectorX, c + 100 * g.u.vectorY);
    a.moveTo(b, c);
    a.lineTo(b + 50 * g.v.vectorX, c + 50 * g.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.drawCoordinateVector = function(a, b, c, g, f, e, k) {
    a.lineWidth = 5;
    a.strokeStyle = k;
    a.beginPath();
    a.moveTo(b, c);
    a.lineTo(b + 100 * f * g.u.vectorX, c + 100 * f * g.u.vectorY);
    a.lineTo(b + 100 * f * g.u.vectorX + 100 * e * g.v.vectorX, c + 100 * f * g.u.vectorY + 100 * e * g.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.scalarProduct = function(a, b) {
    return a.vectorX * b.vectorX + a.vectorY * b.vectorY;
  };
  a.vectorProduct = function(d, b) {
    return new a.Vector(d.vectorY * b.vectorZ - d.vectorZ * b.vectorY, d.vectorZ * b.vectorX - d.vectorX * b.vectorZ, d.vectorX * b.vectorY - d.vectorY * b.vectorX);
  };
  CreJs.Core = CreJs.Core;
  CreJs.Core.Vector = CreJs.Core.Vector;
})();
TEST && function() {
  (CreJs.Test.Core = CreJs.Test.Core || {}).test_Vector_constructor = function() {
    var a = new CreJs.Core.Vector(1, 2, 3);
    return 1 != a.vectorX ? "FAILED! vector.x: Expected 1, was " + a.vectorX : 2 != a.vectorY ? "FAILED! vector.y: Expected 2, was " + a.vectorY : 3 != a.vectorZ ? "FAILED! vector.z: Expected 3, was " + a.vectorZ : "OK";
  };
}();
(function() {
  CreJs.Creanvas.CollisionSolver = function(a) {
    var d = function(a, c) {
      var e, b, d, h, n, r, p;
      h = a.getClientRect();
      n = c.getClientRect();
      e = Math.max(h.leftInPoints, n.leftInPoints) - 1;
      b = Math.min(h.rightInPoints, n.rightInPoints) + 1;
      d = Math.max(h.topInPoints, n.topInPoints) - 1;
      h = Math.min(h.bottomInPoints, n.bottomInPoints) + 1;
      if (!(0 >= b - e || 0 >= h - d)) {
        e = a.collisionContext.getImageData(0, 0, a.widthInPoints, a.heightInPoints);
        a.collisionContext.scale(1 / (a.elementScaleX || 1), 1 / (a.elementScaleY || 1));
        a.collisionContext.rotate(-(a.elementAngle || 0));
        a.collisionContext.translate(c.elementX * a.controller.lengthScale - a.elementX * a.controller.lengthScale, c.elementY * a.controller.lengthScale - a.elementY * a.controller.lengthScale);
        a.collisionContext.rotate(c.elementAngle || 0);
        a.collisionContext.scale(c.elementScaleX || 1, c.elementScaleY || 1);
        a.collisionContext.globalCompositeOperation = "destination-out";
        a.collisionContext.drawImage(c.collidedContext.canvas, 0, 0, c.widthInPoints, c.heightInPoints, c.leftInPoints, c.topInPoints, c.widthInPoints, c.heightInPoints);
        a.collisionContext.scale(1 / (c.elementScaleX || 1), 1 / (c.elementScaleY || 1));
        a.collisionContext.rotate(-c.elementAngle || 0);
        a.collisionContext.translate(-c.elementX * a.controller.lengthScale + a.elementX * a.controller.lengthScale, -c.elementY * a.controller.lengthScale + a.elementY * a.controller.lengthScale);
        a.collisionContext.rotate(a.elementAngle || 0);
        a.collisionContext.scale(a.elementScaleX || 1, a.elementScaleY || 1);
        r = a.collisionContext.getImageData(0, 0, a.widthInPoints, a.heightInPoints);
        a.collisionContext.globalCompositeOperation = "source-over";
        a.collisionContext.putImageData(e, 0, 0);
        p = [];
        a.edges.forEach(function(c) {
          90 > r.data[c.y * a.widthInPoints * 4 + 4 * c.x + 3] && p.push(c);
        });
        if (2 > p.length) {
          return null;
        }
        var q;
        d = b = 0;
        e = p.length - 1;
        for (h = 1;h < p.length;h++) {
          for (n = h + 1;n < p.length;n++) {
            q = p[h].x - p[n].x;
            var l = p[h].y - p[n].y;
            q = Math.sqrt(q * q + l * l);
            q > b && (b = q, d = h, e = n);
          }
        }
        b = a.getWebappXY(p[d].x + a.left, p[d].y + a.topInPoints);
        e = a.getWebappXY(p[e].x + a.left, p[e].y + a.topInPoints);
        return b.x == e.x && b.y == e.y ? null : {x:(b.x + e.x) / 2, y:(b.y + e.y) / 2, vectors:CreJs.Core.getUnitVectors(b.x, b.y, e.x, e.y)};
      }
    }, b = function(a, c, e) {
      var b, d, h, n, r, p, q;
      b = e.vectors;
      n = new CreJs.Core.Vector(e.x - a.elementX, e.y - a.elementY);
      p = CreJs.Core.vectorProduct(n, b.v).z;
      q = new CreJs.Core.Vector(e.x - c.elementX, e.y - c.elementY);
      e = CreJs.Core.vectorProduct(q, b.v).z;
      var l = CreJs.Core.vectorProduct(n, b.v), s = CreJs.Core.vectorProduct(q, b.v);
      d = new CreJs.Core.Vector(a.movingSpeed.x, a.movingSpeed.y);
      h = new CreJs.Core.Vector(c.movingSpeed.x, c.movingSpeed.y);
      a.elementScaleSpeed && (d.x += n.x * a.elementScaleSpeed.x, d.y += n.y * a.elementScaleSpeed.y);
      c.elementScaleSpeed && (h.x += q.x * c.elementScaleSpeed.x, h.y += q.y * c.elementScaleSpeed.y);
      n = d.getCoordinates(b);
      r = h.getCoordinates(b);
      h = a.fixedPoint ? Infinity : a.elementMass;
      d = c.fixedPoint ? Infinity : c.elementMass;
      q = a.fixed ? Infinity : a.getMomentOfInertia();
      var t = c.fixed ? Infinity : c.getMomentOfInertia(), l = a.collisionCoefficient * c.collisionCoefficient * 2 * (r.v - n.v + c.omega * s.z - a.omega * l.z) / (1 / d + 1 / h + s.z * s.z / t + l.z * l.z / q);
      a.movingSpeed.x += l / h * b.v.x;
      a.movingSpeed.y += l / h * b.v.y;
      c.movingSpeed.x -= l / d * b.v.x;
      c.movingSpeed.y -= l / d * b.v.y;
      a.omega += l * p / q;
      c.omega -= l * e / t;
    }, c = function() {
      return a.elements.filter(function(a) {
        return a.isSolid;
      });
    };
    this.solveCollision = function(a) {
      var f = c(), e, k, m = null;
      e = a.getCenter();
      f = f.filter(function(c) {
        var b;
        if (c.elementId === a.elementId || !(c.movingSpeed.x || c.movingSpeed.y || a.movingSpeed.x || a.movingSpeed.y || c.elementScaleSpeed || a.elementScaleSpeed || a.omega || c.omega)) {
          return!1;
        }
        b = c.getCenter();
        return Math.sqrt((e.x - b.x) * (e.x - b.x) + (e.y - b.y) * (e.y - b.y)) > a.getRadius() + c.getRadius() ? !1 : !0;
      });
      if (0 == f.length) {
        return!0;
      }
      k = null;
      f.forEach(function(c) {
        k || (k = d(a, c)) && (m = c);
      });
      if (!k) {
        return!0;
      }
      b(a, m, k);
      a.elementEvents.getEvent("collision").dispatch({element:m, collisionPoint:k});
      m.elementEvents.getEvent("collision").dispatch({element:a, collisionPoint:k});
      return!1;
    };
  };
})();
(function() {
  var a = CreJs.Creanvas;
  a.Controller = function(c) {
    var f = c.canvas;
    this.logger = c.log;
    this.lengthScale = c.lengthScale || f.height / c.realHeight || f.width / c.realWidth || 1;
    timeScale = c.timeScale || 1;
    var e = 0;
    setInterval(function() {
      e += 10 * timeScale / 1E3;
    }, 10);
    this.getTime = function() {
      return e;
    };
    DEBUG && this.logMessage("Starting controller");
    this.needRedraw = !0;
    this.isDrawing = !1;
    this.refreshTime = c["controller.refreshTime"] || a.Controller.DEFAULT_REFRESH_TIME;
    this.elements = [];
    this.elementEvents = new CreJs.Creevents.EventContainer;
    this.context = f.getContext("2d");
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.registerCanvasPointerEvent("click", "click");
    this.registerCanvasPointerEvent("mousedown", "pointerDown");
    this.registerCanvasPointerEvent("touchstart", "pointerDown");
    this.registerTouchIdentifierEvent("mousemove", "pointerMove");
    this.registerTouchIdentifierEvent("touchmove", "pointerMove");
    this.registerTouchIdentifierEvent("mouseup", "pointerUp");
    this.registerTouchIdentifierEvent("touchend", "pointerUp");
    d.call(this, c.drawBackground, c.backgroundStyle);
    b.call(this);
  };
  var d = function(c, b) {
    var e = this;
    DEBUG && e.logMessage("Adding background");
    e.add(["name", "background"], ["image", {left:0, top:0, width:e.context.canvas.width / e.lengthScale, height:e.context.canvas.height / e.lengthScale, draw:c || function(c) {
      c.fillStyle = b || a.Controller.DEFAULT_BACKGROUND_COLOUR;
      c.fillRect(0, 0, e.context.canvas.width / e.lengthScale, e.context.canvas.height / e.lengthScale);
    }}], ["position", {z:-Infinity}]);
  }, b = function() {
    var a = this;
    setInterval(function() {
      a.needRedraw && !a.isDrawing ? (a.isDrawing = !0, a.elements.sort(function(a, c) {
        return(a.elementZ || 0) - (c.elementZ || 0);
      }).forEach(function(b) {
        c.call(a, b);
      }), a.isDrawing = !1) : DEBUG && a.logMessage("No redraw");
    }, a.refreshTime);
  }, c = function(a) {
    this.context.translate(a.elementX * this.lengthScale, a.elementY * this.lengthScale);
    this.context.rotate(a.elementAngle || 0);
    this.context.scale(a.elementScaleX || 1, a.elementScaleY || 1);
    this.context.drawImage(a.temporaryRenderingContext.canvas, 0, 0, a.widthInPoints, a.heightInPoints, a.leftInPoints, a.topInPoints, a.widthInPoints, a.heightInPoints);
    this.context.scale(1 / (a.elementScaleX || 1), 1 / a.elementScaleY || 1);
    this.context.rotate(-(a.elementAngle || 0));
    this.context.translate(-a.elementX * this.lengthScale, -a.elementY * this.lengthScale);
  };
  a.Controller.prototype.logMessage = function(a) {
    this.logger && this.logger(a);
  };
  a.Controller.prototype.triggerPointedElementEvent = function(a, c) {
    var b = !1;
    this.elements.filter(function(c) {
      return c.canHandleEvent(a);
    }).sort(function(a, c) {
      return c.elementZ || 0 - a.elementZ || 0;
    }).forEach(function(d) {
      !b && d.hit(c.x, c.y) && (d.elementEvents.getEvent(a).dispatch(c), b = !0);
    });
  };
  a.Controller.prototype.triggerElementEventByIdentifier = function(a, c) {
    this.elements.forEach(function(b) {
      b.touchIdentifier == c.touchIdentifier && b.elementEvents.getEvent(a).dispatch(c);
    });
  };
  a.Controller.prototype.registerCanvasPointerEvent = function(a, c) {
    var b = this;
    b.context.canvas.addEventListener(a, function(d) {
      setTimeout(function() {
        var m = function(d, k) {
          DEBUG && b.logMessage("Canvas event " + a + " with touchIdentifier " + k);
          var h = b.getWebappXYFromClientXY(d);
          h.touchIdentifier = k;
          b.triggerPointedElementEvent(c, h);
        };
        if (d.changedTouches) {
          for (var h = 0;h < d.changedTouches.length;h++) {
            m(d.changedTouches[h], d.changedTouches[h].identifier);
          }
        } else {
          m(d, -1);
        }
      });
    });
  };
  a.Controller.prototype.registerTouchIdentifierEvent = function(a, c) {
    var b = this;
    this.context.canvas.addEventListener(a, function(d) {
      setTimeout(function() {
        var m = function(d, h) {
          DEBUG && b.logMessage("Canvas event " + a + " with touchIdentifier " + h);
          var m = b.getWebappXYFromClientXY(d);
          m.touchIdentifier = h;
          b.triggerElementEventByIdentifier(c, m);
        };
        if (d.changedTouches) {
          for (var h = 0;h < d.changedTouches.length;h++) {
            m(d.changedTouches[h], d.changedTouches[h].identifier);
          }
        } else {
          m(d, -1);
        }
      });
    });
  };
  a.Controller.prototype.stopController = function() {
    this.elementEvents.getEvent("deactivate").dispatch();
    this.elements = [];
  };
  a.Controller.prototype.triggerRedraw = function() {
    this.needRedraw = !0;
  };
  a.Controller.prototype.getWebappXYFromClientXY = function(a) {
    var c = this.context.canvas.getBoundingClientRect(), c = {x:(a.clientX - c.left) * this.context.canvas.width / c.width / this.lengthScale, y:(a.clientY - c.top) * this.context.canvas.height / c.height / this.lengthScale};
    DEBUG && this.logMessage("ClientXY: (" + a.clientX + "," + a.clientY + ") - WebAppXY: (" + c.x + "," + c.y + ")");
    return c;
  };
  a.Controller.prototype.add = function() {
    DEBUG && this.logMessage("Controller.addElement: Adding element - args:" + arguments.length);
    var a = [].slice.call(arguments), c = a.filter(function(a) {
      return a && "name" == a[0];
    })[0] || ["name", "Unknown"], b = a.filter(function(a) {
      return a && "image" == a[0];
    })[0], d = a.filter(function(a) {
      return a && "position" == a[0];
    })[0], c = new CreJs.Creanvas.Element(this, c, b, d);
    c.elementId = 0 == this.elements.length ? 0 : this.elements[this.elements.length - 1].elementId + 1;
    a = a.filter(function(a) {
      return a && "name" != a[0] && "position" != a[0] && "image" != a[0];
    });
    0 < a.length && CreJs.Creanvas.elementDecorators && (DEBUG && c.debug("New element", "apply " + a.length + " decorators"), c.applyElementDecorators.apply(c, a));
    this.elements.push(c);
    return c;
  };
  a.Controller.DEFAULT_REFRESH_TIME = 50;
  a.Controller.DEFAULT_BACKGROUND_COLOUR = "#FFF";
  a.Controller = a.Controller;
  a.Controller.prototype.addElement = a.Controller.prototype.add;
  a.Controller.prototype.redraw = a.Controller.prototype.triggerRedraw;
  a.Controller.prototype.stop = a.Controller.prototype.stopController;
})();
(function() {
  var a = CreJs.Creanvas;
  a.Element = function(a, g, f, e) {
    var k = this;
    this.controller = a;
    this.cachedValues = [];
    this.clonerData = [];
    this.elementEvents = this.elementEvents || new CreJs.Creevents.EventContainer;
    k.elementName = g[1];
    d(k, f[1]);
    b(k, e[1]);
    this.clonerData.push(g);
    this.clonerData.push(f);
    this.clonerData.push(e);
    k.controller.elementEvents.getEvent("deactivate").addListener(function(a) {
      k.deactivate();
    });
  };
  var d = function(a, b) {
    var f = b.width, e = b.height;
    a.top = 0 == b.top ? 0 : b.top || -e / 2;
    a.left = 0 == b.left ? 0 : b.left || -f / 2;
    a.bottom = 0 == b.bottom ? 0 : b.bottom || a.top + e;
    a.right = 0 == b.right ? 0 : b.right || a.left + f;
    a.elementWidth = f || a.right - a.left;
    a.elementHeight = e || a.bottom - a.top;
    a.topInPoints = Math.round(a.top * a.controller.lengthScale);
    a.leftInPoints = Math.round(a.left * a.controller.lengthScale);
    a.bottomInPoints = Math.round(a.bottom * a.controller.lengthScale);
    a.rightInPoints = Math.round(a.right * a.controller.lengthScale);
    a.widthInPoints = Math.round(a.elementWidth * a.controller.lengthScale);
    a.heightInPoints = Math.round(a.elementHeight * a.controller.lengthScale);
    f = a.controller.context.canvas.ownerDocument.createElement("canvas");
    a.temporaryRenderingContext = f.getContext("2d");
    a.elementScaleX = b.scaleX || 1;
    a.elementScaleY = b.scaleY || 1;
    b.rawImage ? (a.elementImage = b.rawImage, a.temporaryRenderingContext.putImageData(a.elementImage, 0, 0)) : (e = b.draw, f.width = a.widthInPoints, f.height = a.heightInPoints, a.temporaryRenderingContext.beginPath(), a.temporaryRenderingContext.translate(-a.leftInPoints, -a.topInPoints), a.temporaryRenderingContext.scale(a.controller.lengthScale, a.controller.lengthScale), e.call(a, a.temporaryRenderingContext), a.elementImage = a.temporaryRenderingContext.getImageData(0, 0, a.widthInPoints, 
    a.heightInPoints));
  }, b = function(a, b) {
    a.elementX = b.x || 0;
    a.elementY = b.y || 0;
    a.elementZ = b.z || 0;
    a.elementAngle = b.angle || 0;
  };
  a.Element.prototype.hit = function(a, b) {
    var f = this.getElementXY(a, b), e = f.x - this.leftInPoints, f = f.y - this.topInPoints;
    return 0 <= e && e <= this.widthInPoints && 0 <= f && f <= this.heightInPoints && 0 < this.elementImage.data[4 * f * this.widthInPoints + 4 * e + 3];
  };
  a.Element.prototype.applyElementDecorator = function(a, b) {
    DEBUG && this.debug("applyElementDecorator", a);
    var f = CreJs.Creanvas.elementDecorators[a];
    f ? (this.clonerData.push([a, b]), f.applyTo(this, b)) : DEBUG && this.debug("applyElementDecorator", "Not found: " + a);
  };
  a.Element.prototype.getCacheableValue = function(a, b, f) {
    if (this.cachedValues[a] && this.cachedValues[a].key == b) {
      return this.cachedValues[a].value;
    }
    f = f.call(this);
    this.cachedValues[a] = {key:b, value:f};
    return f;
  };
  a.Element.prototype.cloneElement = function(a) {
    DEBUG && this.debug("cloneElement", "start cloning");
    var b = a ? this.clonerData.filter(function(b) {
      return a.every(function(a) {
        return a != b[0];
      });
    }) : this.clonerData;
    DEBUG && this.debug("cloneElement", "apply " + b.length + " stuff");
    return this.controller.add.apply(this.controller, b);
  };
  a.Element.prototype.canHandleEvent = function(a) {
    return "click" == a || "pointerDown" == a || this.elementEvents.hasEvent(a);
  };
  a.Element.prototype.deactivate = function() {
    this.temporaryRenderingContext = null;
  };
  a.Element.prototype.triggerRedraw = function() {
    this.controller.triggerRedraw();
  };
  a.Element.prototype.getWebappXY = function(a, b) {
    return{x:this.elementX + (a * this.elementScaleX * Math.cos(this.elementAngle) - b * this.elementScaleY * Math.sin(this.elementAngle)) / this.controller.lengthScale, y:this.elementY + (a * this.elementScaleX * Math.sin(this.elementAngle) + b * this.elementScaleY * Math.cos(this.elementAngle)) / this.controller.lengthScale};
  };
  a.Element.prototype.getElementXY = function(a, b) {
    return{x:Math.round(((a - this.elementX) * this.controller.lengthScale * Math.cos(this.elementAngle) + (b - this.elementY) * this.controller.lengthScale * Math.sin(this.elementAngle)) / this.elementScaleX), y:Math.round(((b - this.elementY) * this.controller.lengthScale * Math.cos(this.elementAngle) - (a - this.elementX) * this.controller.lengthScale * Math.sin(this.elementAngle)) / this.elementScaleY)};
  };
  a.Element.prototype.getCenter = function() {
    return this.getWebappXY(this.leftInPoints + this.widthInPoints / 2, this.topInPoints + this.heightInPoints / 2);
  };
  a.Element.prototype.getClientCorners = function() {
    var a = this;
    return this.getCacheableValue("getClientCorners", a.elementX + "" + a.elementY + "" + a.elementAngle + "" + a.elementScaleX + "" + a.elementScaleX, function() {
      var b = [];
      b.push({x:a.leftInPoints, y:a.topInPoints});
      b.push({x:a.rightInPoints, y:a.topInPoints});
      b.push({x:a.rightInPoints, y:a.bottomInPoints});
      b.push({x:a.leftInPoints, y:a.bottomInPoints});
      return b.map(function(b) {
        return a.getWebappXY(b.x, b.y);
      });
    });
  };
  a.Element.prototype.getClientRect = function() {
    var a = this;
    return this.getCacheableValue("getClientRect", a.elementX + "" + a.elementY + "" + a.elementAngle + "" + a.elementScaleX + "" + a.elementScaleX, function() {
      var b = a.getClientCorners();
      return{top:b.reduce(function(a, b) {
        return Math.min(a, b.y);
      }, Infinity), bottom:b.reduce(function(a, b) {
        return Math.max(a, b.y);
      }, -Infinity), left:b.reduce(function(a, b) {
        return Math.min(a, b.x);
      }, Infinity), right:b.reduce(function(a, b) {
        return Math.max(a, b.x);
      }, -Infinity)};
    });
  };
  a.Element.prototype.applyElementDecorators = function() {
    var a = this;
    [].slice.apply(arguments).forEach(function(b) {
      a.applyElementDecorator(b[0], b[1]);
    });
  };
  DEBUG && (a.Element.prototype.debug = function(a, b) {
    this.controller.logMessage("Element." + a + ": " + b + ". Element: " + this.elementName + "/" + this.elementId);
  });
  a.Element.prototype.clone = a.Element.prototype.cloneElement;
  a.Element.prototype.applyDecorator = a.Element.prototype.applyElementDecorator;
  a.Element.prototype.applyDecorators = a.Element.prototype.applyElementDecorators;
  Object.defineProperty(a.Element.prototype, "width", {get:function() {
    return this.elementWidth;
  }, set:function(a) {
    this.elementWidth = a;
  }});
  Object.defineProperty(a.Element.prototype, "height", {get:function() {
    return this.elementHeight;
  }, set:function(a) {
    this.elementHeight = a;
  }});
  Object.defineProperty(a.Element.prototype, "scaleX", {get:function() {
    return this.elementScaleX;
  }, set:function(a) {
    this.elementScaleX = a;
  }});
  Object.defineProperty(a.Element.prototype, "scaleY", {get:function() {
    return this.elementScaleY;
  }, set:function(a) {
    this.elementScaleY = a;
  }});
  Object.defineProperty(a.Element.prototype, "x", {get:function() {
    return this.elementX;
  }, set:function(a) {
    this.elementX = a;
  }});
  Object.defineProperty(a.Element.prototype, "y", {get:function() {
    return this.elementY;
  }, set:function(a) {
    this.elementY = a;
  }});
  Object.defineProperty(a.Element.prototype, "z", {get:function() {
    return this.elementZ;
  }, set:function(a) {
    this.elementZ = a;
  }});
  Object.defineProperty(a.Element.prototype, "angle", {get:function() {
    return this.elementAngle;
  }, set:function(a) {
    this.elementAngle = a;
  }});
  Object.defineProperty(a.Element.prototype, "name", {get:function() {
    return this.elementName;
  }});
  Object.defineProperty(a.Element.prototype, "id", {get:function() {
    return this.elementId;
  }});
  Object.defineProperty(a.Element.prototype, "image", {get:function() {
    return this.elementImage;
  }});
  Object.defineProperty(a.Element.prototype, "events", {get:function() {
    return this.elementEvents;
  }});
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.clickable = {applyTo:function(a, d) {
    var b = !1, c = d.ondown, g = d.onup, f = d.onclick;
    this.touchIdentifier = null;
    f && a.elementEvents.getEvent("click").addListener(function(b) {
      DEBUG && a.debug("Clickable", "onclick");
      f.call(a, b);
      a.triggerRedraw();
    });
    c && a.elementEvents.getEvent("pointerDown").addListener(function(e) {
      DEBUG && a.debug("Clickable", "onDown: Identifier: " + e.touchIdentifier);
      a.touchIdentifier = e.touchIdentifier;
      b = !0;
      c.call(a, event);
      a.triggerRedraw();
    });
    g && a.elementEvents.getEvent("pointerUp").addListener(function(c) {
      b && a.touchIdentifier == c.touchIdentifier && (DEBUG && a.debug("Clickable", "onUp: Identifier: " + c.touchIdentifier), b = !1, g.call(a, event), a.triggerRedraw());
    });
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.customTimer = {applyTo:function(a, d) {
    setInterval(function() {
      d.action.call(a);
    }, d.time);
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.droppable = {applyTo:function(a, d) {
    a.isDroppable = !0;
    a.elementDropZone = d.dropZone;
    DEBUG && a.debug("droppable.applyTo", "Now droppable");
    Object.defineProperty(a, "dropZone", {get:function() {
      return this.elementDropZone;
    }, set:function(a) {
      this.elementDropZone = a;
    }});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.dropzone = {applyTo:function(a, d) {
    var b = d.availableSpots, c = d.dropX, g = d.dropY;
    a.droppedElementsList = [];
    a.elementEvents.getEvent("drop").addListener(function(d) {
      0 >= b || (DEBUG && a.debug("dropzone.drop", "dropping: " + d.droppedElement.id), b--, d.droppedElement.x = c || a.elementX, d.droppedElement.y = g || a.elementY, d.droppedElement.dropZone = a, a.droppedElementsList.push(d.droppedElement), d.droppedElement.elementEvents.getEvent("dropped").dispatch({dropZone:a, droppedElement:d.droppedElement}), a.elementEvents.getEvent("droppedIn").dispatch({dropZone:a, droppedElement:d.droppedElement}), a.triggerRedraw());
    });
    a.drag = function(c) {
      DEBUG && a.debug("dropzone.drag", "dragging  " + c.id);
      c.dropZone = null;
      b++;
      a.droppedElementsList.splice(a.droppedElementsList.indexOf(c), 1);
      a.triggerRedraw();
    };
    Object.defineProperty(a, "droppedElements", {get:function() {
      return a.droppedElementsList;
    }});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.duplicable = {applyTo:function(a, d) {
    var b = d.isBlocked, c = d.generatorCount || Infinity;
    DEBUG && a.debug("duplicable.applyTo", "generatorCount is " + c);
    var g = !1;
    a.elementEvents.getEvent("pointerDown").addListener(function(d) {
      0 <= d.touchIdentifier && (g = !0);
      if (!(g && 0 > d.touchIdentifier || b && b() || (DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount was: " + c), 0 >= c))) {
        c--;
        DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount is now: " + c);
        var e = a.cloneElement(["duplicable"]);
        e.elementName += " (duplicate)";
        e.applyElementDecorator("movable", {isBlocked:b});
        e.startMoving(d);
        a.triggerRedraw();
      }
    });
  }};
})();
(function() {
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators;
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.movable = {applyTo:function(a, d) {
    var b = !1, c = this.touchIdentifier = null, g = d.isBlocked;
    a.startMoving = function(d) {
      DEBUG && a.debug("movable.startMoving", "identifier: " + d.touchIdentifier);
      b = !0;
      a.touchIdentifier = d.touchIdentifier;
      c = {x:d.x, y:d.y};
      a.dropZone && (a.dropZone.drag(a), a.dropZone = null);
    };
    a.moveCompleted = function(d) {
      DEBUG && a.debug("movable.moveCompleted", "identifier: " + d.touchIdentifier);
      b = !1;
      c = null;
      a.isDroppable && (DEBUG && a.debug("movable.moveCompleted", "trigger drop - identifier: " + d.touchIdentifier), a.controller.triggerPointedElementEvent("drop", {x:d.x, y:d.y, droppedElement:a}));
    };
    a.elementEvents.getEvent("pointerDown").addListener(function(b) {
      g && g() || a.startMoving(b);
    });
    var f = !1;
    a.elementEvents.getEvent("pointerMove").addListener(function(d) {
      !b || g && g() || (f || (f = !0, DEBUG && a.debug("movable.move", "identifier: " + a.touchIdentifier)), a.elementX += d.x - c.x, a.elementY += d.y - c.y, c = {x:d.x, y:d.y}, a.triggerRedraw());
    });
    a.elementEvents.getEvent("pointerUp").addListener(function(d) {
      !b || g && g() || (DEBUG && a.debug("movable.moveend", "identifier: " + a.touchIdentifier), a.elementX += d.x - c.x, a.elementY += d.y - c.y, a.moveCompleted(d), a.touchIdentifier = null, f = !1, a.triggerRedraw());
    });
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.moving = {type:"moving", applyTo:function(a, d) {
    var b, c, g, f, e, k = d.vx, m = d.vy, h = d.ax, n = d.ay, r = d.rotationSpeed;
    DEBUG && a.debug("moving", "applyTo");
    var p, q, l;
    a.movingSpeed = new CreJs.Core.Vector(k || 0, m || 0);
    a.movingAcceleration = new CreJs.Core.Vector(h || 0, n || 0);
    a.omega = r || 0;
    p = a.controller.getTime();
    setInterval(function() {
      q = a.controller.getTime();
      l = q - p;
      if (!(.001 > l) && (p = q, a.movingSpeed.x += a.movingAcceleration.x * l, a.movingSpeed.y += a.movingAcceleration.y * l, 0 != a.movingSpeed.x || 0 != a.movingSpeed.y || 0 != a.omega || a.elementScaleSpeed && (0 != a.elementScaleSpeed.x || 0 != a.elementScaleSpeed.y))) {
        b = a.elementX;
        c = a.elementY;
        g = a.elementAngle;
        f = a.elementScaleX;
        e = a.elementScaleY;
        a.elementX += a.movingSpeed.x * l;
        a.elementY += a.movingSpeed.y * l;
        a.elementAngle += a.omega * l;
        a.elementScaleSpeed && (a.elementScaleX += a.elementScaleSpeed.x * l, a.elementScaleY += a.elementScaleSpeed.y * l);
        var d = !0;
        a.preMove && a.preMove.forEach(function(b) {
          d && (b.call(a) || (d = !1));
        });
        d || (a.elementX = b, a.elementY = c, a.elementAngle = g, a.elementScaleX = f, a.elementScaleY = e);
      }
    }, 20);
    Object.defineProperty(a, "speed", {get:function() {
      return this.movingSpeed;
    }, set:function(a) {
      this.movingSpeed = a;
    }});
    Object.defineProperty(a, "acceleration", {get:function() {
      return this.movingAcceleration;
    }, set:function(a) {
      this.movingAcceleration = a;
    }});
    Object.defineProperty(a, "rotationSpeed", {get:function() {
      return this.omega;
    }, set:function(a) {
      this.omega = a;
    }});
    Object.defineProperty(a, "scaleSpeed", {get:function() {
      return this.elementScaleSpeed;
    }, set:function(a) {
      this.elementScaleSpeed = a;
    }});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.solid = {applyTo:function(b, c) {
    b.isSolid = !0;
    b.elementMass = c.mass || 1;
    var g = c.onCollision, f = c.coefficient;
    b.fixed = c.fixed || !1;
    b.fixedPoint = b.fixed || c.fixedPoint || !1;
    b.controller.collisionSolver = b.controller.collisionSolver || new CreJs.Creanvas.CollisionSolver(b.controller);
    b.collisionCoefficient = f || 0 === f ? f : 1;
    b.movingSpeed = b.movingSpeed || new CreJs.Core.Vector(0, 0);
    b.movingAcceleration = b.movingAcceleration || new CreJs.Core.Vector(0, 0);
    b.omega = b.omega || 0;
    b.elementEvents.getEvent("collision").addListener(function(a) {
      g && g.call(b, a);
    });
    b.preMove = this.preMove || [];
    b.preMove.push(function() {
      return b.controller.collisionSolver.solveCollision(b);
    });
    a.call(b);
    d.call(b);
    b.getMomentOfInertia = function() {
      return b.elementMass / 12 * (b.widthInPoints * b.elementScaleX * b.widthInPoints * b.elementScaleX + b.heightInPoints * b.elementScaleY * b.heightInPoints * b.elementScaleY);
    };
    b.getRadius = function() {
      return this.getCacheableValue("getRadius", b.elementWidth + "" + b.elementHeight + "" + b.elementScaleX + "" + b.elementScaleY, function() {
        return Math.sqrt(this.elementWidth * this.elementWidth * this.elementScaleX * this.elementScaleX + this.elementHeight * this.elementHeight * this.elementScaleY * this.elementScaleY) / 2;
      });
    };
    Object.defineProperty(b, "mass", {get:function() {
      return this.elementMass;
    }, set:function(a) {
      this.elementMass = a;
    }});
  }};
  var a = function() {
    var a = this.controller.context.canvas.ownerDocument.createElement("canvas");
    a.width = this.widthInPoints;
    a.height = this.heightInPoints;
    this.collidedContext = a.getContext("2d");
    this.collidedContext.putImageData(this.elementImage, 0, 0);
    this.collidedContext.globalCompositeOperation = "source-atop";
    this.collidedContext.fillStyle = "#000";
    this.collidedContext.fillRect(0, 0, this.widthInPoints, this.heightInPoints);
  }, d = function() {
    var a = this.controller.context.canvas.ownerDocument.createElement("canvas");
    a.width = this.widthInPoints;
    a.height = this.heightInPoints;
    this.collisionContext = a.getContext("2d");
    this.collisionContext.globalCompositeOperation = "source-over";
    this.collisionContext.drawImage(this.collidedContext.canvas, 0, 0);
    var a = this.collisionContext.getImageData(0, 0, this.widthInPoints, this.heightInPoints), c = this.collisionContext.createImageData(this.widthInPoints, this.heightInPoints);
    this.edges = [];
    for (var d = 0;d < this.widthInPoints;d++) {
      for (var f = 0;f < this.heightInPoints;f++) {
        if (!(200 > a.data[f * this.widthInPoints * 4 + 4 * d + 3])) {
          for (var e = !1, k = -1;2 > k;k++) {
            for (var m = -1;2 > m;m++) {
              if (0 > f + k || 0 > d + m || f + k > this.heightInPoints - 1 || d + k > this.elementWidth - 1 || 100 > a.data[(f + k) * this.elementWidth * 4 + 4 * (d + m) + 3]) {
                e = !0, m = k = 2;
              }
            }
          }
          this.collisionContext.putImageData(c, 0, 0);
          e && (this.edges.push({x:d, y:f}), c.data[f * this.widthInPoints * 4 + 4 * d] = 0, c.data[f * this.widthInPoints * 4 + 4 * d + 1] = 0, c.data[f * this.widthInPoints * 4 + 4 * d + 2] = 0, c.data[f * this.widthInPoints * 4 + 4 * d + 3] = 255);
        }
      }
    }
    this.collisionContext.putImageData(c, 0, 0);
    this.collisionContext.translate(-this.leftInPoints, -this.topInPoints);
  };
})();
(function() {
  var a = CreJs.Creevents = CreJs.Creevents || {};
  a.Event = function(a) {
    this.eventId = a;
    var b = 0, c = [], g = new CreJs.Crelog.Logger;
    this.dispatch = function(a, b) {
      var d = c.length;
      c.forEach(function(c) {
        setTimeout(function() {
          DEBUG && a && "pointerMove" != a.eventId && g.logMessage("Handling " + a.eventId);
          c.handleEvent(a);
          d--;
          0 == d && b && b();
        });
      });
    };
    this.addListener = function(a, d) {
      var g = b++;
      c.push({handlerId:g, handleEvent:a, rank:d});
      c = c.sort(function(a, b) {
        return(a.rank || Infinity) - (b.rank || Infinity);
      });
      return g;
    };
    this.removeListener = function(a) {
      c = c.filter(function(b) {
        return b.handlerId != a;
      });
    };
    this.addEventListener = this.addListener;
    this.removeEventListener = this.removeListener;
  };
  CreJs.Creevents = a;
  a.Event = a.Event;
})();
(function() {
  var a = CreJs.Creevents = CreJs.Creevents || {};
  a.EventContainer = function() {
    var d = {};
    this.hasEvent = function(a) {
      return void 0 != d[a];
    };
    this.getEvent = this.getEvent = function(b) {
      d[b] || (d[b] = new a.Event(b));
      return d[b];
    };
  };
  a.EventContainer = a.EventContainer;
})();
(function() {
  var a = CreJs.Crelog = CreJs.Crelog || {};
  a.Logger = function() {
    this.logMessage = function(a) {
      console.log(a);
    };
  };
  CreJs.Crelog = a;
  a.Logger = a.Logger;
  a.Logger.log = a.Logger.logMessage;
})();

