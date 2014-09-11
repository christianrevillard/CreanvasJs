var TEST = !0, DEBUG = !1, CreJs = CreJs || {};
CreJs.Creanvas = CreJs.Creanvas || {};
window.CreJs = CreJs;
CreJs.Creanvas = CreJs.Creanvas;
TEST && (CreJs.Test = CreJs.Test || {}, CreJs.Test = CreJs.Test);
(function() {
  var a = CreJs.Core = CreJs.Core || {};
  a.Vector = function(c, e, d) {
    var h = this;
    this.vectorX = c;
    this.vectorY = e;
    this.vectorZ = d || 0;
    this.draw = function(a, d, b, c) {
      a.lineWidth = 5;
      a.strokeStyle = c;
      a.beginPath();
      a.moveTo(d, b);
      a.lineTo(d + 100 * h.vectorX, b + 100 * h.vectorY);
      a.stroke();
      a.lineWidth = 1;
      a.strokeStyle = "#000";
    };
    this.getCoordinates = function(f) {
      return{u:a.scalarProduct(h, f.u), v:a.scalarProduct(h, f.v), w:a.scalarProduct(h, f.w)};
    };
    this.setCoordinates = function(a, d, b, c) {
      c = c || 0;
      h.vectorX = d * a.u.vectorX + b * a.v.vectorX + c * a.w.vectorX;
      h.vectorY = d * a.u.vectorY + b * a.v.vectorY + c * a.w.vectorY;
      h.vectorZ = d * a.u.vectorZ + b * a.v.vectorZ + c * a.w.vectorZ;
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
  a.getUnitVectors = function(c, e, d, h) {
    c = d - c;
    e = h - e;
    h = Math.sqrt(c * c + e * e);
    return{u:new a.Vector(c / h, e / h, 0), v:new a.Vector(-e / h, c / h, 0), w:new a.Vector(0, 0, 0)};
  };
  a.drawUnitVectors = function(a, e, d, h, f) {
    a.lineWidth = 5;
    a.strokeStyle = f;
    a.beginPath();
    a.moveTo(e, d);
    a.lineTo(e + 100 * h.u.vectorX, d + 100 * h.u.vectorY);
    a.moveTo(e, d);
    a.lineTo(e + 50 * h.v.vectorX, d + 50 * h.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.drawCoordinateVector = function(a, e, d, h, f, g, b) {
    a.lineWidth = 5;
    a.strokeStyle = b;
    a.beginPath();
    a.moveTo(e, d);
    a.lineTo(e + 100 * f * h.u.vectorX, d + 100 * f * h.u.vectorY);
    a.lineTo(e + 100 * f * h.u.vectorX + 100 * g * h.v.vectorX, d + 100 * f * h.u.vectorY + 100 * g * h.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.scalarProduct = function(a, e) {
    return a.vectorX * e.vectorX + a.vectorY * e.vectorY;
  };
  a.vectorProduct = function(c, e) {
    return new a.Vector(c.vectorY * e.vectorZ - c.vectorZ * e.vectorY, c.vectorZ * e.vectorX - c.vectorX * e.vectorZ, c.vectorX * e.vectorY - c.vectorY * e.vectorX);
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
    var c = function(a, d) {
      var g, b, c, k, e, r, n;
      k = a.getClientRect();
      e = d.getClientRect();
      g = Math.max(k.leftInPoints, e.leftInPoints) - 1;
      b = Math.min(k.rightInPoints, e.rightInPoints) + 1;
      c = Math.max(k.topInPoints, e.topInPoints) - 1;
      k = Math.min(k.bottomInPoints, e.bottomInPoints) + 1;
      if (!(0 >= b - g || 0 >= k - c)) {
        g = a.collisionContext.getImageData(0, 0, a.widthInPoints, a.heightInPoints);
        a.collisionContext.scale(1 / (a.elementScaleX || 1), 1 / (a.elementScaleY || 1));
        a.collisionContext.rotate(-(a.elementAngle || 0));
        a.collisionContext.translate(d.elementX * a.controller.lengthScale - a.elementX * a.controller.lengthScale, d.elementY * a.controller.lengthScale - a.elementY * a.controller.lengthScale);
        a.collisionContext.rotate(d.elementAngle || 0);
        a.collisionContext.scale(d.elementScaleX || 1, d.elementScaleY || 1);
        a.collisionContext.globalCompositeOperation = "destination-out";
        a.collisionContext.drawImage(d.collidedContext.canvas, 0, 0, d.widthInPoints, d.heightInPoints, d.leftInPoints, d.topInPoints, d.widthInPoints, d.heightInPoints);
        a.collisionContext.scale(1 / (d.elementScaleX || 1), 1 / (d.elementScaleY || 1));
        a.collisionContext.rotate(-d.elementAngle || 0);
        a.collisionContext.translate(-d.elementX * a.controller.lengthScale + a.elementX * a.controller.lengthScale, -d.elementY * a.controller.lengthScale + a.elementY * a.controller.lengthScale);
        a.collisionContext.rotate(a.elementAngle || 0);
        a.collisionContext.scale(a.elementScaleX || 1, a.elementScaleY || 1);
        r = a.collisionContext.getImageData(0, 0, a.widthInPoints, a.heightInPoints);
        a.collisionContext.globalCompositeOperation = "source-over";
        a.collisionContext.putImageData(g, 0, 0);
        n = [];
        a.edges.forEach(function(b) {
          90 > r.data[b.y * a.widthInPoints * 4 + 4 * b.x + 3] && n.push(b);
        });
        if (2 > n.length) {
          return null;
        }
        var p;
        c = b = 0;
        g = n.length - 1;
        for (k = 1;k < n.length;k++) {
          for (e = k + 1;e < n.length;e++) {
            p = n[k].x - n[e].x;
            var l = n[k].y - n[e].y;
            p = Math.sqrt(p * p + l * l);
            p > b && (b = p, c = k, g = e);
          }
        }
        b = a.getWebappXY(n[c].x + a.left, n[c].y + a.topInPoints);
        g = a.getWebappXY(n[g].x + a.left, n[g].y + a.topInPoints);
        return b.x == g.x && b.y == g.y ? null : {x:(b.x + g.x) / 2, y:(b.y + g.y) / 2, vectors:CreJs.Core.getUnitVectors(b.x, b.y, g.x, g.y)};
      }
    }, e = function(a, d, g) {
      var b, c, k, e, r, n, p;
      b = g.vectors;
      e = new CreJs.Core.Vector(g.x - a.elementX, g.y - a.elementY);
      n = CreJs.Core.vectorProduct(e, b.v).z;
      p = new CreJs.Core.Vector(g.x - d.elementX, g.y - d.elementY);
      g = CreJs.Core.vectorProduct(p, b.v).z;
      var l = CreJs.Core.vectorProduct(e, b.v), s = CreJs.Core.vectorProduct(p, b.v);
      c = new CreJs.Core.Vector(a.elementMoving.movingSpeed.x, a.elementMoving.movingSpeed.y);
      k = new CreJs.Core.Vector(d.elementMoving.movingSpeed.x, d.elementMoving.movingSpeed.y);
      a.elementScaleSpeed && (c.x += e.x * a.elementScaleSpeed.x, c.y += e.y * a.elementScaleSpeed.y);
      d.elementScaleSpeed && (k.x += p.x * d.elementScaleSpeed.x, k.y += p.y * d.elementScaleSpeed.y);
      e = c.getCoordinates(b);
      r = k.getCoordinates(b);
      k = a.solidData.fixedPoint ? Infinity : a.solidData.elementMass;
      c = d.solidData.fixedPoint ? Infinity : d.solidData.elementMass;
      p = a.solidData.fixed ? Infinity : a.getMomentOfInertia();
      var t = d.solidData.fixed ? Infinity : d.getMomentOfInertia(), l = a.solidData.coefficient * d.solidData.coefficient * 2 * (r.v - e.v + d.elementMoving.omega * s.z - a.elementMoving.omega * l.z) / (1 / c + 1 / k + s.z * s.z / t + l.z * l.z / p);
      a.elementMoving.movingSpeed.x += l / k * b.v.x;
      a.elementMoving.movingSpeed.y += l / k * b.v.y;
      d.elementMoving.movingSpeed.x -= l / c * b.v.x;
      d.elementMoving.movingSpeed.y -= l / c * b.v.y;
      a.elementMoving.omega += l * n / p;
      d.elementMoving.omega -= l * g / t;
    }, d = function() {
      return a.elements.filter(function(a) {
        return a.solidData;
      });
    };
    this.solveCollision = function(a) {
      var f = d(), g, b, m;
      g = a.getCenter();
      f = f.filter(function(b) {
        var d;
        if (b.elementId === a.elementId || !(b.elementMoving.movingSpeed.x || b.elementMoving.movingSpeed.y || a.elementMoving.movingSpeed.x || a.elementMoving.movingSpeed.y || b.elementScaleSpeed || a.elementScaleSpeed || a.elementMoving.omega || b.elementMoving.omega)) {
          return!1;
        }
        d = b.getCenter();
        return Math.sqrt((g.x - d.x) * (g.x - d.x) + (g.y - d.y) * (g.y - d.y)) > a.getRadius() + b.getRadius() ? !1 : !0;
      });
      if (0 == f.length) {
        return!0;
      }
      b = null;
      f.forEach(function(d) {
        b || (b = c(a, d)) && (m = d);
      });
      if (!b) {
        return!0;
      }
      e(a, m, b);
      a.elementEvents.getEvent("collision").dispatch({element:m, collisionPoint:b});
      m.elementEvents.getEvent("collision").dispatch({element:a, collisionPoint:b});
      return!1;
    };
  };
})();
(function() {
  CreJs.Creanvas.Controller = function(a) {
    var c, e, d, h, f, g, b = this;
    c = a.canvas;
    g = a.timeScale || 1;
    this.lengthScale = a.lengthScale || c.height / a.realHeight || c.width / a.realWidth || 1;
    a.realTime ? (f = Date.now(), this.getTime = function() {
      return(Date.now() - f) * g / 1E3;
    }) : (h = 0, setInterval(function() {
      h += 10 * g / 1E3;
    }, 10), this.getTime = function() {
      return h;
    });
    this.logMessage = function(b) {
      a.log && a.log(b);
    };
    DEBUG && this.logMessage("Starting controller");
    b.context = c.getContext("2d");
    b.context.setTransform(1, 0, 0, 1, 0, 0);
    e = !0;
    isDrawing = !1;
    d = a.refreshTime || 50;
    this.triggerPointedElementEvent = function(a, d) {
      var c = !1;
      b.elements.filter(function(b) {
        return b.canHandle(a);
      }).sort(function(a, b) {
        return b.elementZ || 0 - a.elementZ || 0;
      }).forEach(function(b) {
        !c && b.hit(d.x, d.y) && (b.elementEvents.getEvent(a).dispatch(d), c = !0);
      });
    };
    this.triggerElementEventByIdentifier = function(a, d) {
      b.elements.forEach(function(b) {
        b.touchIdentifier == d.touchIdentifier && b.elementEvents.getEvent(a).dispatch(d);
      });
    };
    this.registerCanvasPointerEvent = function(a, d) {
      c.addEventListener(a, function(c) {
        setTimeout(function() {
          var g = function(c, g) {
            DEBUG && b.logMessage("Canvas event " + a + " with touchIdentifier " + g);
            var f = b.getWebappXYFromClientXY(c);
            f.touchIdentifier = g;
            b.triggerPointedElementEvent(d, f);
          };
          if (c.changedTouches) {
            for (var f = 0;f < c.changedTouches.length;f++) {
              g(c.changedTouches[f], c.changedTouches[f].identifier);
            }
          } else {
            g(c, -1);
          }
        });
      });
    };
    this.registerTouchIdentifierEvent = function(a, d) {
      c.addEventListener(a, function(c) {
        setTimeout(function() {
          var g = function(c, f) {
            DEBUG && b.logMessage("Canvas event " + a + " with touchIdentifier " + f);
            var g = b.getWebappXYFromClientXY(c);
            g.touchIdentifier = f;
            b.triggerElementEventByIdentifier(d, g);
          };
          if (c.changedTouches) {
            for (var f = 0;f < c.changedTouches.length;f++) {
              g(c.changedTouches[f], c.changedTouches[f].identifier);
            }
          } else {
            g(c, -1);
          }
        });
      });
    };
    this.elementEvents = new CreJs.Creevents.EventContainer;
    this.registerCanvasPointerEvent("click", "click");
    this.registerCanvasPointerEvent("mousedown", "pointerDown");
    this.registerCanvasPointerEvent("touchstart", "pointerDown");
    this.registerTouchIdentifierEvent("mousemove", "pointerMove");
    this.registerTouchIdentifierEvent("touchmove", "pointerMove");
    this.registerTouchIdentifierEvent("mouseup", "pointerUp");
    this.registerTouchIdentifierEvent("touchend", "pointerUp");
    this.stopController = function() {
      b.elementEvents.getEvent("deactivate").dispatch();
      b.elements = [];
    };
    this.triggerRedraw = function() {
      e = !0;
    };
    this.getWebappXYFromClientXY = function(a) {
      var d = c.getBoundingClientRect();
      b.logMessage("ClientXY: (" + a.clientX + "," + a.clientY + ")");
      d = {x:(a.clientX - d.left) * c.width / d.width / b.lengthScale, y:(a.clientY - d.top) * c.height / d.height / b.lengthScale};
      b.logMessage("WebAppXY: (" + d.x + "," + d.y + ")");
      "click" == a.type && b.logMessage("Click on ! WebAppXY: (" + d.x + "," + d.y + ")");
      return d;
    };
    b.elements = [];
    this.add = function() {
      DEBUG && b.logMessage("Controller.addElement: Adding element - args:" + arguments.length);
      var a = [].slice.call(arguments), d = a.filter(function(a) {
        return a && "name" == a[0];
      })[0] || ["name", "Unknown"], c = a.filter(function(a) {
        return a && "image" == a[0];
      })[0], f = a.filter(function(a) {
        return a && "position" == a[0];
      })[0], d = new CreJs.Creanvas.Element(b, d, c, f), a = a.filter(function(a) {
        return a && "name" != a[0] && "position" != a[0] && "image" != a[0];
      });
      0 < a.length && CreJs.Creanvas.elementDecorators && (DEBUG && d.debug("New element", "apply " + a.length + " decorators"), d.applyElementDecorators.apply(d, a));
      b.elements.push(d);
      return d;
    };
    b.logMessage("Adding background");
    this.add(["name", "background"], ["image", {left:0, width:c.width / b.lengthScale, top:0, height:c.height / b.lengthScale, draw:a.drawBackground || function(d) {
      d.fillStyle = a.backgroundStyle || "#FFF";
      d.fillRect(0, 0, c.width / b.lengthScale, c.height / b.lengthScale);
    }}], ["position", {z:-Infinity}]);
    setInterval(function() {
      e && !isDrawing ? (isDrawing = !0, b.elements.sort(function(a, b) {
        return(a.elementZ || 0) - (b.elementZ || 0);
      }).forEach(function(a) {
        b.context.translate(a.elementX * b.lengthScale, a.elementY * b.lengthScale);
        b.context.rotate(a.elementAngle || 0);
        b.context.scale(a.elementScaleX || 1, a.elementScaleY || 1);
        b.context.drawImage(a.temporaryRenderingContext.canvas, 0, 0, a.widthInPoints, a.heightInPoints, a.leftInPoints, a.topInPoints, a.widthInPoints, a.heightInPoints);
        b.context.scale(1 / (a.elementScaleX || 1), 1 / a.elementScaleY || 1);
        b.context.rotate(-(a.elementAngle || 0));
        b.context.translate(-a.elementX * b.lengthScale, -a.elementY * b.lengthScale);
      }), isDrawing = !1) : b.logMessage("No redraw");
    }, d);
    this.addElement = this.add;
    this.redraw = this.triggerRedraw;
    this.stop = this.stopController;
  };
  CreJs.Creanvas.Controller = CreJs.Creanvas.Controller;
})();
(function() {
  var a = function(a, c) {
    a.elementName = c;
    a.elementId = CreJs.CreHelpers.GetGuid();
  }, c = function(a, c) {
    var f = c.width, g = c.height;
    a.top = 0 == c.top ? 0 : c.top || -g / 2;
    a.left = 0 == c.left ? 0 : c.left || -f / 2;
    a.bottom = 0 == c.bottom ? 0 : c.bottom || a.top + g;
    a.right = 0 == c.right ? 0 : c.right || a.left + f;
    a.elementWidth = f || a.right - a.left;
    a.elementHeight = g || a.bottom - a.top;
    a.topInPoints = Math.round(a.top * a.controller.lengthScale);
    a.leftInPoints = Math.round(a.left * a.controller.lengthScale);
    a.bottomInPoints = Math.round(a.bottom * a.controller.lengthScale);
    a.rightInPoints = Math.round(a.right * a.controller.lengthScale);
    a.widthInPoints = Math.round(a.elementWidth * a.controller.lengthScale);
    a.heightInPoints = Math.round(a.elementHeight * a.controller.lengthScale);
    f = a.controller.context.canvas.ownerDocument.createElement("canvas");
    a.temporaryRenderingContext = f.getContext("2d");
    a.elementScaleX = c.scaleX || 1;
    a.elementScaleY = c.scaleY || 1;
    c.rawImage ? (a.elementImage = c.rawImage, a.temporaryRenderingContext.putImageData(a.elementImage, 0, 0)) : (g = c.draw, f.width = a.widthInPoints, f.height = a.heightInPoints, a.temporaryRenderingContext.beginPath(), a.temporaryRenderingContext.translate(-a.leftInPoints, -a.topInPoints), a.temporaryRenderingContext.scale(a.controller.lengthScale, a.controller.lengthScale), g.call(a, a.temporaryRenderingContext), a.elementImage = a.temporaryRenderingContext.getImageData(0, 0, a.widthInPoints, 
    a.heightInPoints));
  }, e = function(a, c) {
    a.elementX = c.x || 0;
    a.elementY = c.y || 0;
    a.elementZ = c.z || 0;
    a.elementAngle = c.angle || 0;
  };
  CreJs.Creanvas.Element = function(d, h, f, g) {
    var b = this;
    b.controller = d;
    var m = [], k = [];
    a(b, h[1]);
    c(b, f[1]);
    e(b, g[1]);
    k.push(h);
    k.push(f);
    k.push(g);
    DEBUG && (b.debug = function(a, d) {
      b.controller.logMessage("Element." + a + ": " + d + ". Element: " + b.elementName + "/" + b.elementId);
    });
    b.elementEvents = new CreJs.Creevents.EventContainer;
    b.hit = function(a, d) {
      var c = b.getElementXY(a, d), f = c.x - b.leftInPoints, c = c.y - b.topInPoints, f = 0 <= f && f <= b.widthInPoints && 0 <= c && c <= b.heightInPoints && 0 < b.elementImage.data[4 * c * b.widthInPoints + 4 * f + 3];
      DEBUG && b.debug("hit", f ? "hit" : "no hit");
      return f;
    };
    b.cloneElement = function(a) {
      DEBUG && b.debug("cloneElement", "start cloning");
      var c = a ? k.filter(function(b) {
        return a.every(function(a) {
          return a != b[0];
        });
      }) : k;
      DEBUG && b.debug("cloneElement", "apply " + c.length + " stuff");
      return b.controller.add.apply(b.controller, c);
    };
    b.canHandle = function(a) {
      return "click" == a || "pointerDown" == a || b.elementEvents.hasEvent(a);
    };
    b.deactivate = function() {
      b.controller.elementEvents.removeEventListener(b.elementId);
      b.temporaryRenderingContext = null;
    };
    b.controller.elementEvents.getEvent("deactivate").addListener({listenerId:b.elementId, handleEvent:function(a) {
      b.deactivate();
    }});
    b.triggerRedraw = function() {
      b.controller.triggerRedraw();
    };
    b.getWebappXY = function(a, c) {
      return{x:b.elementX + (a * b.elementScaleX * Math.cos(b.elementAngle) - c * b.elementScaleY * Math.sin(b.elementAngle)) / b.controller.lengthScale, y:b.elementY + (a * b.elementScaleX * Math.sin(b.elementAngle) + c * b.elementScaleY * Math.cos(b.elementAngle)) / b.controller.lengthScale};
    };
    b.getElementXY = function(a, c) {
      return{x:Math.round(((a - b.elementX) * b.controller.lengthScale * Math.cos(b.elementAngle) + (c - b.elementY) * b.controller.lengthScale * Math.sin(b.elementAngle)) / b.elementScaleX), y:Math.round(((c - b.elementY) * b.controller.lengthScale * Math.cos(b.elementAngle) - (a - b.elementX) * b.controller.lengthScale * Math.sin(b.elementAngle)) / b.elementScaleY)};
    };
    b.getCenter = function() {
      return b.getWebappXY(b.leftInPoints + b.widthInPoints / 2, b.topInPoints + b.heightInPoints / 2);
    };
    var q = [];
    q.push({x:b.leftInPoints, y:b.topInPoints});
    q.push({x:b.rightInPoints, y:b.topInPoints});
    q.push({x:b.rightInPoints, y:b.bottomInPoints});
    q.push({x:b.leftInPoints, y:b.bottomInPoints});
    b.getClientCornersCache = function() {
      return q.map(function(a) {
        return b.getWebappXY(a.x, a.y);
      });
    };
    b.getClientCorners = function() {
      var a = b.elementX + "" + b.elementY + "" + b.elementAngle + "" + b.elementScaleX + "" + b.elementScaleX;
      if (m.getClientCorners && m.getClientCorners.key == a) {
        return m.getClientCorners.value;
      }
      var c = b.getClientCornersCache();
      m.getClientCorners = {key:a, value:c};
      return c;
    };
    b.getClientRectCache = function() {
      var a = b.getClientCorners();
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
    b.getClientRect = function() {
      var a = b.elementX + "" + b.elementY + "" + b.elementAngle + "" + b.elementScaleX + "" + b.elementScaleX;
      if (m.getClientRect && m.getClientRect.key == a) {
        return m.getClientRect.value;
      }
      var c = b.getClientRectCache();
      m.getClientRect = {key:a, value:c};
      return c;
    };
    b.applyElementDecorators = function() {
      var a = this, b = [].slice.apply(arguments);
      k = k.concat(b);
      b.forEach(function(b) {
        a.applyElementDecorator(b[0], b[1]);
      });
    };
    b.applyElementDecorator = function(a, b) {
      DEBUG && this.debug("applyElementDecorator", a);
      var c = CreJs.Creanvas.elementDecorators[a];
      c ? c.applyTo(this, b) : DEBUG && this.debug("applyElementDecorator", "Not found: " + a);
    };
    Object.defineProperty(b, "name", {get:function() {
      return this.elementName;
    }, set:function(a) {
      this.elementName = a;
    }});
    Object.defineProperty(b, "width", {get:function() {
      return this.elementWidth;
    }, set:function(a) {
      this.elementWidth = a;
    }});
    Object.defineProperty(b, "height", {get:function() {
      return this.elementHeight;
    }, set:function(a) {
      this.elementHeight = a;
    }});
    Object.defineProperty(b, "scaleX", {get:function() {
      return this.elementScaleX;
    }, set:function(a) {
      this.elementScaleX = a;
    }});
    Object.defineProperty(b, "scaleY", {get:function() {
      return this.elementScaleY;
    }, set:function(a) {
      this.elementScaleY = a;
    }});
    Object.defineProperty(b, "x", {get:function() {
      return this.elementX;
    }, set:function(a) {
      this.elementX = a;
    }});
    Object.defineProperty(b, "y", {get:function() {
      return this.elementY;
    }, set:function(a) {
      this.elementY = a;
    }});
    Object.defineProperty(b, "z", {get:function() {
      return this.elementZ;
    }, set:function(a) {
      this.elementZ = a;
    }});
    Object.defineProperty(b, "angle", {get:function() {
      return this.elementAngle;
    }, set:function(a) {
      this.elementAngle = a;
    }});
    Object.defineProperty(b, "id", {get:function() {
      return this.elementId;
    }});
    Object.defineProperty(b, "image", {get:function() {
      return this.elementImage;
    }});
    Object.defineProperty(b, "events", {get:function() {
      return this.elementEvents;
    }});
    b.clone = b.cloneElement;
    b.applyDecorator = b.applyElementDecorator;
    b.applyDecorators = b.applyElementDecorators;
  };
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.clickable = {applyTo:function(a, c) {
    var e = c.onclick;
    e && (a.onClick = function(c) {
      DEBUG && a.debug("onClick", e);
      e.call(a, c);
      a.triggerRedraw();
    }, a.elementEvents.getEvent("click").addListener({handleEvent:a.onClick}));
    var d = !1;
    this.touchIdentifier = null;
    var h = c.ondown, f = c.onup;
    a.elementEvents.getEvent("pointerDown").addListener({handleEvent:function(c) {
      DEBUG && a.controller.logMessage("Registered down - identifier: " + c.touchIdentifier);
      a.touchIdentifier = c.touchIdentifier;
      d = !0;
      h && (DEBUG && a.debug("onDown", h), h.call(a, event), a.triggerRedraw());
    }, listenerId:a.elementId});
    a.elementEvents.getEvent("pointerUp").addListener({handleEvent:function(c) {
      d && a.touchIdentifier == c.touchIdentifier && (DEBUG && a.controller.logMessage("registerd up - identifier: " + c.touchIdentifier), d = !1, f && (DEBUG && a.debug("onUp", f), f.call(a, event), a.triggerRedraw()));
    }, listenerId:a.elementId});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.customTimer = {applyTo:function(a, c) {
    setInterval(function() {
      c.action.call(a);
    }, c.time);
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.droppable = {applyTo:function(a, c) {
    var e = c.dropZone;
    a.isDroppable = !0;
    a.elementDropZone = e;
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
  CreJs.Creanvas.elementDecorators.dropzone = {applyTo:function(a, c) {
    var e = c.availableSpots, d = c.dropX, h = c.dropY;
    a.droppedElementsList = [];
    a.elementEvents.getEvent("drop").addListener({handleEvent:function(c) {
      0 >= e || (DEBUG && a.controller.logMessage("drop event on dropzone " + a.elementId + ", dropped " + c.droppedElement.id), e--, c.droppedElement.x = d || a.elementX, c.droppedElement.y = h || a.elementY, c.droppedElement.dropZone = a, a.droppedElementsList.push(c.droppedElement), c.droppedElement.elementEvents.getEvent("dropped").dispatch({dropZone:a, droppedElement:c.droppedElement}), a.elementEvents.getEvent("droppedIn").dispatch({dropZone:a, droppedElement:c.droppedElement}), a.triggerRedraw());
    }, listenerId:a.elementId});
    a.drag = function(c) {
      DEBUG && a.controller.logMessage("dragging from dropzone " + a.elementId + ", dragged " + c.id);
      c.dropZone = null;
      e++;
      a.droppedElementsList.splice(a.droppedElementsList.indexOf(c), 1);
      a.triggerRedraw();
    };
    Object.defineProperty(a, "droppedElements", {get:function() {
      return this.droppedElementsList;
    }});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.duplicable = {applyTo:function(a, c) {
    var e = c.isBlocked, d = c.generatorCount || Infinity;
    DEBUG && a.debug("duplicable.applyTo", "generatorCount is " + d);
    var h = !1;
    a.elementEvents.getEvent("pointerDown").addListener({handleEvent:function(c) {
      0 <= c.touchIdentifier && (h = !0);
      if (!(h && 0 > c.touchIdentifier || e && e() || (DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount was: " + d), 0 >= d))) {
        d--;
        DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount is now: " + d);
        var g = a.cloneElement(["duplicable"]);
        g.elementName += " (duplicate)";
        g.applyElementDecorator("movable", {isBlocked:e});
        g.startMoving(c);
        a.triggerRedraw();
      }
    }, listenerId:a.elementId});
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
  CreJs.Creanvas.elementDecorators.movable = {applyTo:function(a, c) {
    var e = !1, d = this.touchIdentifier = null, h = c.isBlocked;
    a.startMoving = function(c) {
      DEBUG && a.controller.logMessage("Starting moving - identifier: " + c.touchIdentifier);
      e = !0;
      a.touchIdentifier = c.touchIdentifier;
      d = {x:c.x, y:c.y};
      a.dropZone && (a.dropZone.drag(a), a.dropZone = null);
    };
    a.moveCompleted = function(c) {
      DEBUG && a.controller.logMessage("Completed move - identifier: " + c.touchIdentifier);
      e = !1;
      d = null;
      a.isDroppable && (DEBUG && a.controller.logMessage("Trigger drop - identifier: " + c.touchIdentifier), a.controller.triggerPointedElementEvent("drop", {x:c.x, y:c.y, droppedElement:a}));
    };
    a.elementEvents.getEvent("pointerDown").addListener({handleEvent:function(c) {
      h && h() || a.startMoving(c);
    }, listenerId:a.elementId});
    var f = !1;
    a.elementEvents.getEvent("pointerMove").addListener({handleEvent:function(c) {
      !e || h && h() || (f || (f = !0, DEBUG && a.controller.logMessage("pointereMove event on movable " + a.elementId + " (" + a.touchIdentifier + ")")), a.elementX += c.x - d.x, a.elementY += c.y - d.y, d = {x:c.x, y:c.y}, a.triggerRedraw());
    }, listenerId:a.elementId});
    a.elementEvents.getEvent("pointerUp").addListener({handleEvent:function(c) {
      !e || h && h() || (DEBUG && a.controller.logMessage("End detected for touch " + a.touchIdentifier), a.elementX += c.x - d.x, a.elementY += c.y - d.y, a.moveCompleted(c), a.touchIdentifier = null, f = !1, a.triggerRedraw());
    }, listenerId:a.elementId});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.moving = {type:"moving", applyTo:function(a, c) {
    var e, d, h, f, g, b = c.vx, m = c.vy, k = c.ax, q = c.ay, r = c.rotationSpeed;
    DEBUG && a.controller.logMessage("Applying moving decorator to " + a.elementName + "-" + a.elementId);
    var n, p, l;
    a.elementMoving = a.elementMoving || {};
    a.elementMoving.movingSpeed = new CreJs.Core.Vector(b || 0, m || 0);
    a.elementMoving.movingAcceleration = new CreJs.Core.Vector(k || 0, q || 0);
    a.elementMoving.omega = r || 0;
    n = a.controller.getTime();
    setInterval(function() {
      p = a.controller.getTime();
      l = p - n;
      if (!(.001 > l) && (n = p, a.elementMoving.movingSpeed.x += a.elementMoving.movingAcceleration.x * l, a.elementMoving.movingSpeed.y += a.elementMoving.movingAcceleration.y * l, 0 != a.elementMoving.movingSpeed.x || 0 != a.elementMoving.movingSpeed.y || 0 != a.elementMoving.omega || a.elementScaleSpeed && (0 != a.elementScaleSpeed.x || 0 != a.elementScaleSpeed.y))) {
        e = a.elementX;
        d = a.elementY;
        h = a.elementAngle;
        f = a.elementScaleX;
        g = a.elementScaleY;
        a.elementX += a.elementMoving.movingSpeed.x * l;
        a.elementY += a.elementMoving.movingSpeed.y * l;
        a.elementAngle += a.elementMoving.omega * l;
        a.elementScaleSpeed && (a.elementScaleX += a.elementScaleSpeed.x * l, a.elementScaleY += a.elementScaleSpeed.y * l);
        var b = !0;
        a.preMove && a.preMove.forEach(function(c) {
          b && (c.call(a) || (b = !1));
        });
        b || (a.elementX = e, a.elementY = d, a.elementAngle = h, a.elementScaleX = f, a.elementScaleY = g);
      }
    }, 20);
    Object.defineProperty(a, "moving", {get:function() {
      return this.elementMoving;
    }, set:function(a) {
      this.elementMoving = a;
    }});
    Object.defineProperty(a.elementMoving, "speed", {get:function() {
      return this.movingSpeed;
    }, set:function(a) {
      this.movingSpeed = a;
    }});
    Object.defineProperty(a.elementMoving, "acceleration", {get:function() {
      return this.movingAcceleration;
    }, set:function(a) {
      this.movingAcceleration = a;
    }});
    Object.defineProperty(a.elementMoving, "rotationSpeed", {get:function() {
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
  CreJs.Creanvas.elementDecorators.solid = {applyTo:function(a, c) {
    var e = [];
    a.solidData = {};
    a.solidData.elementMass = c.mass || 1;
    var d = c.onCollision, h = c.coefficient;
    a.solidData.fixed = c.fixed || !1;
    a.solidData.fixedPoint = a.solidData.fixed || c.fixedPoint || !1;
    a.controller.collisionSolver = a.controller.collisionSolver || new CreJs.Creanvas.CollisionSolver(a.controller);
    a.solidData.coefficient = h || 0 === h ? h : 1;
    a.elementMoving = a.elementMoving || {movingSpeed:new CreJs.Core.Vector(0, 0), movingAcceleration:new CreJs.Core.Vector(0, 0), omega:0};
    a.elementEvents.getEvent("collision").addListener({handleEvent:function(b) {
      d && d.call(a, b);
    }});
    a.preMove = this.preMove || [];
    a.preMove.push(function() {
      return a.controller.collisionSolver.solveCollision(a);
    });
    a.getMomentOfInertia = function() {
      return a.solidData.elementMass / 12 * (a.widthInPoints * a.elementScaleX * a.widthInPoints * a.elementScaleX + a.heightInPoints * a.elementScaleY * a.heightInPoints * a.elementScaleY);
    };
    a.geRadiusCache = function() {
      return Math.sqrt(a.elementWidth * a.elementWidth * a.elementScaleX * a.elementScaleX + a.elementHeight * a.elementHeight * a.elementScaleY * a.elementScaleY) / 2;
    };
    a.getRadius = function() {
      var b = a.elementWidth + "" + a.elementHeight + "" + a.elementScaleX + "" + a.elementScaleY;
      if (e.getRadius && e.getRadius.key == b) {
        return e.getRadius.value_;
      }
      var c = a.geRadiusCache();
      e.geRadius = {kevectorY:b, value_:c};
      return c;
    };
    var f = a.controller.context.canvas, h = f.ownerDocument.createElement("canvas"), f = f.ownerDocument.createElement("canvas");
    h.width = f.width = a.widthInPoints;
    h.height = f.height = a.heightInPoints;
    a.collidedContext = f.getContext("2d");
    a.collidedContext.putImageData(a.elementImage, 0, 0);
    a.collidedContext.globalCompositeOperation = "source-atop";
    a.collidedContext.fillStyle = "#000";
    a.collidedContext.fillRect(0, 0, a.widthInPoints, a.heightInPoints);
    a.collisionContext = h.getContext("2d");
    a.collisionContext.globalCompositeOperation = "source-over";
    a.collisionContext.drawImage(a.collidedContext.canvas, 0, 0);
    h = a.collisionContext.getImageData(0, 0, a.widthInPoints, a.heightInPoints);
    f = a.collisionContext.createImageData(a.widthInPoints, a.heightInPoints);
    a.edges = [];
    for (var g = 0;g < a.widthInPoints;g++) {
      for (var b = 0;b < a.heightInPoints;b++) {
        if (!(200 > h.data[b * a.widthInPoints * 4 + 4 * g + 3])) {
          for (var m = !1, k = -1;2 > k;k++) {
            for (var q = -1;2 > q;q++) {
              if (0 > b + k || 0 > g + q || b + k > a.heightInPoints - 1 || g + k > a.elementWidth - 1 || 100 > h.data[(b + k) * a.elementWidth * 4 + 4 * (g + q) + 3]) {
                m = !0, q = k = 2;
              }
            }
          }
          a.collisionContext.putImageData(f, 0, 0);
          m && (a.edges.push({x:g, y:b}), f.data[b * a.widthInPoints * 4 + 4 * g] = 0, f.data[b * a.widthInPoints * 4 + 4 * g + 1] = 0, f.data[b * a.widthInPoints * 4 + 4 * g + 2] = 0, f.data[b * a.widthInPoints * 4 + 4 * g + 3] = 255);
        }
      }
    }
    a.collisionContext.putImageData(f, 0, 0);
    a.collisionContext.translate(-a.leftInPoints, -a.topInPoints);
    Object.defineProperty(a, "solid", {get:function() {
      return this.solidData;
    }, set:function(a) {
      this.solidData = a;
    }});
    Object.defineProperty(a.solidData, "mass", {get:function() {
      return this.elementMass;
    }, set:function(a) {
      this.elementMass = a;
    }});
  }};
})();
(function() {
  var a = CreJs.Creevents = CreJs.Creevents || {}, c;
  a.Event = function(a) {
    this.eventId = a;
    c = CreJs.CreHelpers;
    var d = [], h = new CreJs.Crelog.Logger;
    this.dispatch = function(f, g) {
      var b = c.GetGuid(), m = d.length;
      DEBUG && f && "pointerMove" != f.eventId && "drag" != f.eventId && "drop" != f.eventId && h.logMessage("Dispatching " + m + " " + f.eventId + ". (" + b + ")");
      d.forEach(function(c) {
        c.debugEvent = a;
        setTimeout(function() {
          DEBUG && f && "pointerMove" != f.eventId && h.logMessage("Actually handling " + f.eventId + ". (" + b + ")");
          c.handleEvent(f);
          m--;
          0 == m && g && g();
        });
      });
    };
    this.addListener = function(a) {
      a.handleEvent = a.handleEvent || a.handleEvent;
      a.rank = a.rank || a.rank;
      a.listenerId = a.listenerId || a.listenerId;
      var e = c.GetGuid();
      d.push({handlerGuid:e, handleEvent:a.handleEvent, rank:a.rank, listenerId:a.listenerId});
      d = d.sort(function(a, c) {
        return(a.rank || Infinity) - (c.rank || Infinity);
      });
      return e;
    };
    this.removeEventListener = function(a) {
      d = d.filter(function(c) {
        return Boolean(a.handlerGuid) && c.handlerGuid != a.handlerGuid || Boolean(a.listenerId) && c.listenerId != a.listenerId;
      });
    };
  };
  CreJs.Creevents = a;
  a.Event = a.Event;
})();
(function() {
  var a = CreJs.Creevents = CreJs.Creevents || {};
  a.EventContainer = function() {
    var c = {}, e = [];
    this.hasEvent = function(a) {
      return void 0 != c[a];
    };
    this.getEvent = function(d) {
      c[d] || (e.push(d), c[d] = new a.Event(d));
      return c[d];
    };
    this.removeEventListener = function(a) {
      c[a.eventId] ? c[a.eventId].removeEventListener(a) : e.forEach(function(e) {
        c[e].removeEventListener(a);
      });
    };
    this.getEvent = this.getEvent;
  };
  a.EventContainer = a.EventContainer;
})();
(function() {
  var a = CreJs.CreHelpers = CreJs.CreHelpers || {};
  a.GetGuid = function() {
    var c = Date.now().toString(16), c = a.repeatString("x", 15 - c.length) + c;
    return("xxxxxxxx-xxxx-4xxx-y" + c.slice(0, 3) + "-" + c.slice(3)).replace(/[xy]/g, function(a) {
      var c = 16 * Math.random() | 0;
      return("x" == a ? c : c & 3 | 8).toString(16);
    });
  };
  a.repeatString = function(c, e) {
    return 0 >= e ? "" : c + a.repeatString(c, e - 1);
  };
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

