var TEST = !0, DEBUG = !1, CreJs = CreJs || {};
CreJs.Creanvas = CreJs.Creanvas || {};
window.CreJs = CreJs;
CreJs.Creanvas = CreJs.Creanvas;
TEST && (CreJs.Test = CreJs.Test || {}, CreJs.Test = CreJs.Test);
(function() {
  var a = CreJs.Core = CreJs.Core || {};
  a.Vector = function(c, e, d) {
    var g = this;
    this.vectorX = c;
    this.vectorY = e;
    this.vectorZ = d || 0;
    this.draw = function(a, d, b, c) {
      a.lineWidth = 5;
      a.strokeStyle = c;
      a.beginPath();
      a.moveTo(d, b);
      a.lineTo(d + 100 * g.vectorX, b + 100 * g.vectorY);
      a.stroke();
      a.lineWidth = 1;
      a.strokeStyle = "#000";
    };
    this.getCoordinates = function(h) {
      return{u:a.scalarProduct(g, h.u), v:a.scalarProduct(g, h.v), w:a.scalarProduct(g, h.w)};
    };
    this.setCoordinates = function(a, d, b, c) {
      c = c || 0;
      g.vectorX = d * a.u.vectorX + b * a.v.vectorX + c * a.w.vectorX;
      g.vectorY = d * a.u.vectorY + b * a.v.vectorY + c * a.w.vectorY;
      g.vectorZ = d * a.u.vectorZ + b * a.v.vectorZ + c * a.w.vectorZ;
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
  a.getUnitVectors = function(c, e, d, g) {
    c = d - c;
    e = g - e;
    g = Math.sqrt(c * c + e * e);
    return{u:new a.Vector(c / g, e / g, 0), v:new a.Vector(-e / g, c / g, 0), w:new a.Vector(0, 0, 0)};
  };
  a.drawUnitVectors = function(a, e, d, g, h) {
    a.lineWidth = 5;
    a.strokeStyle = h;
    a.beginPath();
    a.moveTo(e, d);
    a.lineTo(e + 100 * g.u.vectorX, d + 100 * g.u.vectorY);
    a.moveTo(e, d);
    a.lineTo(e + 50 * g.v.vectorX, d + 50 * g.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.drawCoordinateVector = function(a, e, d, g, h, f, b) {
    a.lineWidth = 5;
    a.strokeStyle = b;
    a.beginPath();
    a.moveTo(e, d);
    a.lineTo(e + 100 * h * g.u.vectorX, d + 100 * h * g.u.vectorY);
    a.lineTo(e + 100 * h * g.u.vectorX + 100 * f * g.v.vectorX, d + 100 * h * g.u.vectorY + 100 * f * g.v.vectorY);
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
      var f, b, k, c, e, r, n;
      c = a.getClientRect();
      e = d.getClientRect();
      f = Math.max(c.leftInPoints, e.leftInPoints) - 1;
      b = Math.min(c.rightInPoints, e.rightInPoints) + 1;
      k = Math.max(c.topInPoints, e.topInPoints) - 1;
      c = Math.min(c.bottomInPoints, e.bottomInPoints) + 1;
      if (!(0 >= b - f || 0 >= c - k)) {
        f = a.collisionContext.getImageData(0, 0, a.widthInPoints, a.heightInPoints);
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
        a.collisionContext.putImageData(f, 0, 0);
        n = [];
        a.edges.forEach(function(b) {
          90 > r.data[b.y * a.widthInPoints * 4 + 4 * b.x + 3] && n.push(b);
        });
        if (2 > n.length) {
          return null;
        }
        var p;
        k = b = 0;
        f = n.length - 1;
        for (c = 1;c < n.length;c++) {
          for (e = c + 1;e < n.length;e++) {
            p = n[c].x - n[e].x;
            var l = n[c].y - n[e].y;
            p = Math.sqrt(p * p + l * l);
            p > b && (b = p, k = c, f = e);
          }
        }
        b = a.getWebappXY(n[k].x + a.left, n[k].y + a.topInPoints);
        f = a.getWebappXY(n[f].x + a.left, n[f].y + a.topInPoints);
        return b.x == f.x && b.y == f.y ? null : {x:(b.x + f.x) / 2, y:(b.y + f.y) / 2, vectors:CreJs.Core.getUnitVectors(b.x, b.y, f.x, f.y)};
      }
    }, e = function(a, d, c) {
      var b, k, e, m, r, n, p;
      b = c.vectors;
      m = new CreJs.Core.Vector(c.x - a.elementX, c.y - a.elementY);
      n = CreJs.Core.vectorProduct(m, b.v).z;
      p = new CreJs.Core.Vector(c.x - d.elementX, c.y - d.elementY);
      c = CreJs.Core.vectorProduct(p, b.v).z;
      var l = CreJs.Core.vectorProduct(m, b.v), s = CreJs.Core.vectorProduct(p, b.v);
      k = new CreJs.Core.Vector(a.movingSpeed.x, a.movingSpeed.y);
      e = new CreJs.Core.Vector(d.movingSpeed.x, d.movingSpeed.y);
      a.elementScaleSpeed && (k.x += m.x * a.elementScaleSpeed.x, k.y += m.y * a.elementScaleSpeed.y);
      d.elementScaleSpeed && (e.x += p.x * d.elementScaleSpeed.x, e.y += p.y * d.elementScaleSpeed.y);
      m = k.getCoordinates(b);
      r = e.getCoordinates(b);
      e = a.fixedPoint ? Infinity : a.elementMass;
      k = d.fixedPoint ? Infinity : d.elementMass;
      p = a.fixed ? Infinity : a.getMomentOfInertia();
      var t = d.fixed ? Infinity : d.getMomentOfInertia(), l = a.coefficient * d.coefficient * 2 * (r.v - m.v + d.omega * s.z - a.omega * l.z) / (1 / k + 1 / e + s.z * s.z / t + l.z * l.z / p);
      a.movingSpeed.x += l / e * b.v.x;
      a.movingSpeed.y += l / e * b.v.y;
      d.movingSpeed.x -= l / k * b.v.x;
      d.movingSpeed.y -= l / k * b.v.y;
      a.omega += l * n / p;
      d.omega -= l * c / t;
    }, d = function() {
      return a.elements.filter(function(a) {
        return a.isSolid;
      });
    };
    this.solveCollision = function(a) {
      var h = d(), f, b, k;
      f = a.getCenter();
      h = h.filter(function(b) {
        var d;
        if (b.elementId === a.elementId || !(b.movingSpeed.x || b.movingSpeed.y || a.movingSpeed.x || a.movingSpeed.y || b.elementScaleSpeed || a.elementScaleSpeed || a.omega || b.omega)) {
          return!1;
        }
        d = b.getCenter();
        return Math.sqrt((f.x - d.x) * (f.x - d.x) + (f.y - d.y) * (f.y - d.y)) > a.getRadius() + b.getRadius() ? !1 : !0;
      });
      if (0 == h.length) {
        return!0;
      }
      b = null;
      h.forEach(function(d) {
        b || (b = c(a, d)) && (k = d);
      });
      if (!b) {
        return!0;
      }
      e(a, k, b);
      a.elementEvents.getEvent("collision").dispatch({element:k, collisionPoint:b});
      k.elementEvents.getEvent("collision").dispatch({element:a, collisionPoint:b});
      return!1;
    };
  };
})();
(function() {
  CreJs.Creanvas.Controller = function(a) {
    var c, e, d, g, h, f, b = this;
    c = a.canvas;
    f = a.timeScale || 1;
    this.lengthScale = a.lengthScale || c.height / a.realHeight || c.width / a.realWidth || 1;
    a.realTime ? (h = Date.now(), this.getTime = function() {
      return(Date.now() - h) * f / 1E3;
    }) : (g = 0, setInterval(function() {
      g += 10 * f / 1E3;
    }, 10), this.getTime = function() {
      return g;
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
          var e = function(c, e) {
            DEBUG && b.logMessage("Canvas event " + a + " with touchIdentifier " + e);
            var f = b.getWebappXYFromClientXY(c);
            f.touchIdentifier = e;
            b.triggerPointedElementEvent(d, f);
          };
          if (c.changedTouches) {
            for (var f = 0;f < c.changedTouches.length;f++) {
              e(c.changedTouches[f], c.changedTouches[f].identifier);
            }
          } else {
            e(c, -1);
          }
        });
      });
    };
    this.registerTouchIdentifierEvent = function(a, d) {
      c.addEventListener(a, function(c) {
        setTimeout(function() {
          var e = function(c, e) {
            DEBUG && b.logMessage("Canvas event " + a + " with touchIdentifier " + e);
            var f = b.getWebappXYFromClientXY(c);
            f.touchIdentifier = e;
            b.triggerElementEventByIdentifier(d, f);
          };
          if (c.changedTouches) {
            for (var f = 0;f < c.changedTouches.length;f++) {
              e(c.changedTouches[f], c.changedTouches[f].identifier);
            }
          } else {
            e(c, -1);
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
      })[0], e = a.filter(function(a) {
        return a && "position" == a[0];
      })[0], d = new CreJs.Creanvas.Element(b, d, c, e), a = a.filter(function(a) {
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
    var e = c.width, f = c.height;
    a.top = 0 == c.top ? 0 : c.top || -f / 2;
    a.left = 0 == c.left ? 0 : c.left || -e / 2;
    a.bottom = 0 == c.bottom ? 0 : c.bottom || a.top + f;
    a.right = 0 == c.right ? 0 : c.right || a.left + e;
    a.elementWidth = e || a.right - a.left;
    a.elementHeight = f || a.bottom - a.top;
    a.topInPoints = Math.round(a.top * a.controller.lengthScale);
    a.leftInPoints = Math.round(a.left * a.controller.lengthScale);
    a.bottomInPoints = Math.round(a.bottom * a.controller.lengthScale);
    a.rightInPoints = Math.round(a.right * a.controller.lengthScale);
    a.widthInPoints = Math.round(a.elementWidth * a.controller.lengthScale);
    a.heightInPoints = Math.round(a.elementHeight * a.controller.lengthScale);
    e = a.controller.context.canvas.ownerDocument.createElement("canvas");
    a.temporaryRenderingContext = e.getContext("2d");
    a.elementScaleX = c.scaleX || 1;
    a.elementScaleY = c.scaleY || 1;
    c.rawImage ? (a.elementImage = c.rawImage, a.temporaryRenderingContext.putImageData(a.elementImage, 0, 0)) : (f = c.draw, e.width = a.widthInPoints, e.height = a.heightInPoints, a.temporaryRenderingContext.beginPath(), a.temporaryRenderingContext.translate(-a.leftInPoints, -a.topInPoints), a.temporaryRenderingContext.scale(a.controller.lengthScale, a.controller.lengthScale), f.call(a, a.temporaryRenderingContext), a.elementImage = a.temporaryRenderingContext.getImageData(0, 0, a.widthInPoints, 
    a.heightInPoints));
  }, e = function(a, c) {
    a.elementX = c.x || 0;
    a.elementY = c.y || 0;
    a.elementZ = c.z || 0;
    a.elementAngle = c.angle || 0;
  };
  CreJs.Creanvas.Element = function(d, g, h, f) {
    var b = this;
    b.controller = d;
    var k = [], q = [];
    a(b, g[1]);
    c(b, h[1]);
    e(b, f[1]);
    q.push(g);
    q.push(h);
    q.push(f);
    DEBUG && (b.debug = function(a, c) {
      b.controller.logMessage("Element." + a + ": " + c + ". Element: " + b.elementName + "/" + b.elementId);
    });
    b.elementEvents = new CreJs.Creevents.EventContainer;
    b.hit = function(a, c) {
      var d = b.getElementXY(a, c), e = d.x - b.leftInPoints, d = d.y - b.topInPoints, e = 0 <= e && e <= b.widthInPoints && 0 <= d && d <= b.heightInPoints && 0 < b.elementImage.data[4 * d * b.widthInPoints + 4 * e + 3];
      DEBUG && b.debug("hit", e ? "hit" : "no hit");
      return e;
    };
    b.cloneElement = function(a) {
      DEBUG && b.debug("cloneElement", "start cloning");
      var c = a ? q.filter(function(b) {
        return a.every(function(a) {
          return a != b[0];
        });
      }) : q;
      DEBUG && b.debug("cloneElement", "apply " + c.length + " stuff");
      return b.controller.add.apply(b.controller, c);
    };
    b.canHandle = function(a) {
      return "click" == a || "pointerDown" == a || b.elementEvents.hasEvent(a);
    };
    b.deactivate = function() {
      b.temporaryRenderingContext = null;
    };
    b.controller.elementEvents.getEvent("deactivate").addListener(function(a) {
      b.deactivate();
    });
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
    var m = [];
    m.push({x:b.leftInPoints, y:b.topInPoints});
    m.push({x:b.rightInPoints, y:b.topInPoints});
    m.push({x:b.rightInPoints, y:b.bottomInPoints});
    m.push({x:b.leftInPoints, y:b.bottomInPoints});
    b.getClientCornersCache = function() {
      return m.map(function(a) {
        return b.getWebappXY(a.x, a.y);
      });
    };
    b.getClientCorners = function() {
      var a = b.elementX + "" + b.elementY + "" + b.elementAngle + "" + b.elementScaleX + "" + b.elementScaleX;
      if (k.getClientCorners && k.getClientCorners.key == a) {
        return k.getClientCorners.value;
      }
      var c = b.getClientCornersCache();
      k.getClientCorners = {key:a, value:c};
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
      if (k.getClientRect && k.getClientRect.key == a) {
        return k.getClientRect.value;
      }
      var c = b.getClientRectCache();
      k.getClientRect = {key:a, value:c};
      return c;
    };
    b.applyElementDecorators = function() {
      var a = this, b = [].slice.apply(arguments);
      q = q.concat(b);
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
    }, a.elementEvents.getEvent("click").addListener(a.onClick));
    var d = !1;
    this.touchIdentifier = null;
    var g = c.ondown, h = c.onup;
    a.elementEvents.getEvent("pointerDown").addListener(function(c) {
      DEBUG && a.controller.logMessage("Registered down - identifier: " + c.touchIdentifier);
      a.touchIdentifier = c.touchIdentifier;
      d = !0;
      g && (DEBUG && a.debug("onDown", g), g.call(a, event), a.triggerRedraw());
    });
    a.elementEvents.getEvent("pointerUp").addListener(function(c) {
      d && a.touchIdentifier == c.touchIdentifier && (DEBUG && a.controller.logMessage("registerd up - identifier: " + c.touchIdentifier), d = !1, h && (DEBUG && a.debug("onUp", h), h.call(a, event), a.triggerRedraw()));
    });
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
    var e = c.availableSpots, d = c.dropX, g = c.dropY;
    a.droppedElementsList = [];
    a.elementEvents.getEvent("drop").addListener(function(c) {
      0 >= e || (DEBUG && a.controller.logMessage("drop event on dropzone " + a.elementId + ", dropped " + c.droppedElement.id), e--, c.droppedElement.x = d || a.elementX, c.droppedElement.y = g || a.elementY, c.droppedElement.dropZone = a, a.droppedElementsList.push(c.droppedElement), c.droppedElement.elementEvents.getEvent("dropped").dispatch({dropZone:a, droppedElement:c.droppedElement}), a.elementEvents.getEvent("droppedIn").dispatch({dropZone:a, droppedElement:c.droppedElement}), a.triggerRedraw());
    });
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
    var g = !1;
    a.elementEvents.getEvent("pointerDown").addListener(function(c) {
      0 <= c.touchIdentifier && (g = !0);
      if (!(g && 0 > c.touchIdentifier || e && e() || (DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount was: " + d), 0 >= d))) {
        d--;
        DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount is now: " + d);
        var f = a.cloneElement(["duplicable"]);
        f.elementName += " (duplicate)";
        f.applyElementDecorator("movable", {isBlocked:e});
        f.startMoving(c);
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
  CreJs.Creanvas.elementDecorators.movable = {applyTo:function(a, c) {
    var e = !1, d = this.touchIdentifier = null, g = c.isBlocked;
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
    a.elementEvents.getEvent("pointerDown").addListener(function(c) {
      g && g() || a.startMoving(c);
    });
    var h = !1;
    a.elementEvents.getEvent("pointerMove").addListener(function(c) {
      !e || g && g() || (h || (h = !0, DEBUG && a.controller.logMessage("pointereMove event on movable " + a.elementId + " (" + a.touchIdentifier + ")")), a.elementX += c.x - d.x, a.elementY += c.y - d.y, d = {x:c.x, y:c.y}, a.triggerRedraw());
    });
    a.elementEvents.getEvent("pointerUp").addListener(function(c) {
      !e || g && g() || (DEBUG && a.controller.logMessage("End detected for touch " + a.touchIdentifier), a.elementX += c.x - d.x, a.elementY += c.y - d.y, a.moveCompleted(c), a.touchIdentifier = null, h = !1, a.triggerRedraw());
    });
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.moving = {type:"moving", applyTo:function(a, c) {
    var e, d, g, h, f, b = c.vx, k = c.vy, q = c.ax, m = c.ay, r = c.rotationSpeed;
    DEBUG && a.controller.logMessage("Applying moving decorator to " + a.elementName + "-" + a.elementId);
    var n, p, l;
    a.movingSpeed = new CreJs.Core.Vector(b || 0, k || 0);
    a.movingAcceleration = new CreJs.Core.Vector(q || 0, m || 0);
    a.omega = r || 0;
    n = a.controller.getTime();
    setInterval(function() {
      p = a.controller.getTime();
      l = p - n;
      if (!(.001 > l) && (n = p, a.movingSpeed.x += a.movingAcceleration.x * l, a.movingSpeed.y += a.movingAcceleration.y * l, 0 != a.movingSpeed.x || 0 != a.movingSpeed.y || 0 != a.omega || a.elementScaleSpeed && (0 != a.elementScaleSpeed.x || 0 != a.elementScaleSpeed.y))) {
        e = a.elementX;
        d = a.elementY;
        g = a.elementAngle;
        h = a.elementScaleX;
        f = a.elementScaleY;
        a.elementX += a.movingSpeed.x * l;
        a.elementY += a.movingSpeed.y * l;
        a.elementAngle += a.omega * l;
        a.elementScaleSpeed && (a.elementScaleX += a.elementScaleSpeed.x * l, a.elementScaleY += a.elementScaleSpeed.y * l);
        var b = !0;
        a.preMove && a.preMove.forEach(function(c) {
          b && (c.call(a) || (b = !1));
        });
        b || (a.elementX = e, a.elementY = d, a.elementAngle = g, a.elementScaleX = h, a.elementScaleY = f);
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
  CreJs.Creanvas.elementDecorators.solid = {applyTo:function(a, c) {
    a.isSolid = !0;
    var e = [];
    a.elementMass = c.mass || 1;
    var d = c.onCollision, g = c.coefficient;
    a.fixed = c.fixed || !1;
    a.fixedPoint = a.fixed || c.fixedPoint || !1;
    a.controller.collisionSolver = a.controller.collisionSolver || new CreJs.Creanvas.CollisionSolver(a.controller);
    a.coefficient = g || 0 === g ? g : 1;
    a.movingSpeed = a.movingSpeed || new CreJs.Core.Vector(0, 0);
    a.movingAcceleration = a.movingAcceleration || new CreJs.Core.Vector(0, 0);
    a.omega = a.omega || 0;
    a.elementEvents.getEvent("collision").addListener(function(b) {
      d && d.call(a, b);
    });
    a.preMove = this.preMove || [];
    a.preMove.push(function() {
      return a.controller.collisionSolver.solveCollision(a);
    });
    a.getMomentOfInertia = function() {
      return a.elementMass / 12 * (a.widthInPoints * a.elementScaleX * a.widthInPoints * a.elementScaleX + a.heightInPoints * a.elementScaleY * a.heightInPoints * a.elementScaleY);
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
    var h = a.controller.context.canvas, g = h.ownerDocument.createElement("canvas"), h = h.ownerDocument.createElement("canvas");
    g.width = h.width = a.widthInPoints;
    g.height = h.height = a.heightInPoints;
    a.collidedContext = h.getContext("2d");
    a.collidedContext.putImageData(a.elementImage, 0, 0);
    a.collidedContext.globalCompositeOperation = "source-atop";
    a.collidedContext.fillStyle = "#000";
    a.collidedContext.fillRect(0, 0, a.widthInPoints, a.heightInPoints);
    a.collisionContext = g.getContext("2d");
    a.collisionContext.globalCompositeOperation = "source-over";
    a.collisionContext.drawImage(a.collidedContext.canvas, 0, 0);
    g = a.collisionContext.getImageData(0, 0, a.widthInPoints, a.heightInPoints);
    h = a.collisionContext.createImageData(a.widthInPoints, a.heightInPoints);
    a.edges = [];
    for (var f = 0;f < a.widthInPoints;f++) {
      for (var b = 0;b < a.heightInPoints;b++) {
        if (!(200 > g.data[b * a.widthInPoints * 4 + 4 * f + 3])) {
          for (var k = !1, q = -1;2 > q;q++) {
            for (var m = -1;2 > m;m++) {
              if (0 > b + q || 0 > f + m || b + q > a.heightInPoints - 1 || f + q > a.elementWidth - 1 || 100 > g.data[(b + q) * a.elementWidth * 4 + 4 * (f + m) + 3]) {
                k = !0, m = q = 2;
              }
            }
          }
          a.collisionContext.putImageData(h, 0, 0);
          k && (a.edges.push({x:f, y:b}), h.data[b * a.widthInPoints * 4 + 4 * f] = 0, h.data[b * a.widthInPoints * 4 + 4 * f + 1] = 0, h.data[b * a.widthInPoints * 4 + 4 * f + 2] = 0, h.data[b * a.widthInPoints * 4 + 4 * f + 3] = 255);
        }
      }
    }
    a.collisionContext.putImageData(h, 0, 0);
    a.collisionContext.translate(-a.leftInPoints, -a.topInPoints);
    Object.defineProperty(a, "mass", {get:function() {
      return this.elementMass;
    }, set:function(a) {
      this.elementMass = a;
    }});
  }};
})();
(function() {
  var a = CreJs.Creevents = CreJs.Creevents || {};
  a.Event = function(a) {
    this.eventId = a;
    var e = 0;
    helpers = CreJs.CreHelpers;
    var d = [], g = new CreJs.Crelog.Logger;
    this.dispatch = function(a, c) {
      var b = d.length;
      d.forEach(function(d) {
        setTimeout(function() {
          DEBUG && a && "pointerMove" != a.eventId && g.logMessage("Handling " + a.eventId);
          d.handleEvent(a);
          b--;
          0 == b && c && c();
        });
      });
    };
    this.addListener = function(a, c) {
      var b = e++;
      d.push({handlerId:b, handleEvent:a, rank:c});
      d = d.sort(function(a, b) {
        return(a.rank || Infinity) - (b.rank || Infinity);
      });
      return b;
    };
    this.removeListener = function(a) {
      d = d.filter(function(c) {
        return c.handlerId != a;
      });
    };
    this.addListener = this.addListener;
    this.removeListener = this.removeListener;
  };
  CreJs.Creevents = a;
  a.Event = a.Event;
})();
(function() {
  var a = CreJs.Creevents = CreJs.Creevents || {};
  a.EventContainer = function() {
    var c = {};
    this.hasEvent = function(a) {
      return void 0 != c[a];
    };
    this.getEvent = this.getEvent = function(e) {
      c[e] || (c[e] = new a.Event(e));
      return c[e];
    };
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

