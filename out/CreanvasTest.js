var TEST = !0, DEBUG = !1, CreJs = CreJs || {};
CreJs.Creanvas = CreJs.Creanvas || {};
window.CreJs = CreJs;
CreJs.Creanvas = CreJs.Creanvas;
TEST && (CreJs.Test = CreJs.Test || {}, CreJs.Test = CreJs.Test);
(function() {
  var a = CreJs.Core = CreJs.Core || {};
  a.Vector = function(d, e, f) {
    var g = this;
    this.vectorX = d;
    this.vectorY = e;
    this.vectorZ = f || 0;
    this.draw = function(a, f, b, d) {
      a.lineWidth = 5;
      a.strokeStyle = d;
      a.beginPath();
      a.moveTo(f, b);
      a.lineTo(f + 100 * g.vectorX, b + 100 * g.vectorY);
      a.stroke();
      a.lineWidth = 1;
      a.strokeStyle = "#000";
    };
    this.getCoordinates = function(c) {
      return{u:a.scalarProduct(g, c.u), v:a.scalarProduct(g, c.v), w:a.scalarProduct(g, c.w)};
    };
    this.setCoordinates = function(a, f, b, d) {
      d = d || 0;
      g.vectorX = f * a.u.vectorX + b * a.v.vectorX + d * a.w.vectorX;
      g.vectorY = f * a.u.vectorY + b * a.v.vectorY + d * a.w.vectorY;
      g.vectorZ = f * a.u.vectorZ + b * a.v.vectorZ + d * a.w.vectorZ;
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
  a.getUnitVectors = function(d, e, f, g) {
    d = f - d;
    e = g - e;
    g = Math.sqrt(d * d + e * e);
    return{u:new a.Vector(d / g, e / g, 0), v:new a.Vector(-e / g, d / g, 0), w:new a.Vector(0, 0, 0)};
  };
  a.drawUnitVectors = function(a, e, f, g, c) {
    a.lineWidth = 5;
    a.strokeStyle = c;
    a.beginPath();
    a.moveTo(e, f);
    a.lineTo(e + 100 * g.u.vectorX, f + 100 * g.u.vectorY);
    a.moveTo(e, f);
    a.lineTo(e + 50 * g.v.vectorX, f + 50 * g.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.drawCoordinateVector = function(a, e, f, g, c, k, b) {
    a.lineWidth = 5;
    a.strokeStyle = b;
    a.beginPath();
    a.moveTo(e, f);
    a.lineTo(e + 100 * c * g.u.vectorX, f + 100 * c * g.u.vectorY);
    a.lineTo(e + 100 * c * g.u.vectorX + 100 * k * g.v.vectorX, f + 100 * c * g.u.vectorY + 100 * k * g.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.scalarProduct = function(a, e) {
    return a.vectorX * e.vectorX + a.vectorY * e.vectorY;
  };
  a.vectorProduct = function(d, e) {
    return new a.Vector(d.vectorY * e.vectorZ - d.vectorZ * e.vectorY, d.vectorZ * e.vectorX - d.vectorX * e.vectorZ, d.vectorX * e.vectorY - d.vectorY * e.vectorX);
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
      var f, b, l, h, d, r, n;
      h = a.getClientRect();
      d = c.getClientRect();
      f = Math.max(h.leftInPoints, d.leftInPoints) - 1;
      b = Math.min(h.rightInPoints, d.rightInPoints) + 1;
      l = Math.max(h.topInPoints, d.topInPoints) - 1;
      h = Math.min(h.bottomInPoints, d.bottomInPoints) + 1;
      if (!(0 >= b - f || 0 >= h - l)) {
        f = a.collisionContext.getImageData(0, 0, a.widthInPoints, a.heightInPoints);
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
        a.collisionContext.putImageData(f, 0, 0);
        n = [];
        a.edges.forEach(function(b) {
          90 > r.data[b.y * a.widthInPoints * 4 + 4 * b.x + 3] && n.push(b);
        });
        if (2 > n.length) {
          return null;
        }
        var e;
        l = b = 0;
        f = n.length - 1;
        for (h = 1;h < n.length;h++) {
          for (d = h + 1;d < n.length;d++) {
            e = n[h].x - n[d].x;
            var m = n[h].y - n[d].y;
            e = Math.sqrt(e * e + m * m);
            e > b && (b = e, l = h, f = d);
          }
        }
        b = a.getWebappXY(n[l].x + a.left, n[l].y + a.topInPoints);
        f = a.getWebappXY(n[f].x + a.left, n[f].y + a.topInPoints);
        return b.x == f.x && b.y == f.y ? null : {x:(b.x + f.x) / 2, y:(b.y + f.y) / 2, vectors:CreJs.Core.getUnitVectors(b.x, b.y, f.x, f.y)};
      }
    }, e = function(a, c, f) {
      var b, d, h, e, r, n, q;
      b = f.vectors;
      e = new CreJs.Core.Vector(f.x - a.elementX, f.y - a.elementY);
      n = CreJs.Core.vectorProduct(e, b.v).z;
      q = new CreJs.Core.Vector(f.x - c.elementX, f.y - c.elementY);
      f = CreJs.Core.vectorProduct(q, b.v).z;
      var m = CreJs.Core.vectorProduct(e, b.v), s = CreJs.Core.vectorProduct(q, b.v);
      d = new CreJs.Core.Vector(a.elementMoving.movingSpeed.x, a.elementMoving.movingSpeed.y);
      h = new CreJs.Core.Vector(c.elementMoving.movingSpeed.x, c.elementMoving.movingSpeed.y);
      a.elementScaleSpeed && (d.x += e.x * a.elementScaleSpeed.x, d.y += e.y * a.elementScaleSpeed.y);
      c.elementScaleSpeed && (h.x += q.x * c.elementScaleSpeed.x, h.y += q.y * c.elementScaleSpeed.y);
      e = d.getCoordinates(b);
      r = h.getCoordinates(b);
      h = a.solidData.fixedPoint ? Infinity : a.solidData.elementMass;
      d = c.solidData.fixedPoint ? Infinity : c.solidData.elementMass;
      q = a.solidData.fixed ? Infinity : a.getMomentOfInertia();
      var t = c.solidData.fixed ? Infinity : c.getMomentOfInertia(), m = a.solidData.coefficient * c.solidData.coefficient * 2 * (r.v - e.v + c.elementMoving.omega * s.z - a.elementMoving.omega * m.z) / (1 / d + 1 / h + s.z * s.z / t + m.z * m.z / q);
      a.elementMoving.movingSpeed.x += m / h * b.v.x;
      a.elementMoving.movingSpeed.y += m / h * b.v.y;
      c.elementMoving.movingSpeed.x -= m / d * b.v.x;
      c.elementMoving.movingSpeed.y -= m / d * b.v.y;
      a.elementMoving.omega += m * n / q;
      c.elementMoving.omega -= m * f / t;
    }, f = function() {
      return a.elements.filter(function(a) {
        return a.solidData;
      });
    };
    this.solveCollision = function(a) {
      var c = f(), k, b, l;
      k = a.getCenter();
      c = c.filter(function(b) {
        var c;
        if (b.elementId === a.elementId || !(b.elementMoving.movingSpeed.x || b.elementMoving.movingSpeed.y || a.elementMoving.movingSpeed.x || a.elementMoving.movingSpeed.y || b.elementScaleSpeed || a.elementScaleSpeed || a.elementMoving.omega || b.elementMoving.omega)) {
          return!1;
        }
        c = b.getCenter();
        return Math.sqrt((k.x - c.x) * (k.x - c.x) + (k.y - c.y) * (k.y - c.y)) > a.getRadius() + b.getRadius() ? !1 : !0;
      });
      if (0 == c.length) {
        return!0;
      }
      b = null;
      c.forEach(function(c) {
        b || (b = d(a, c)) && (l = c);
      });
      if (!b) {
        return!0;
      }
      e(a, l, b);
      a.elementEvents.dispatch("collision", {element:l, collisionPoint:b});
      l.elementEvents.dispatch("collision", {element:a, collisionPoint:b});
      return!1;
    };
  };
})();
(function() {
  CreJs.Creanvas.Controller = function(a) {
    var d, e, f, g, c, k, b = this;
    d = a.canvas;
    k = a.timeScale || 1;
    this.lengthScale = a.lengthScale || d.height / a.realHeight || d.width / a.realWidth || 1;
    a.realTime ? (c = Date.now(), this.getTime = function() {
      return(Date.now() - c) * k / 1E3;
    }) : (g = 0, setInterval(function() {
      g += 10 * k / 1E3;
    }, 10), this.getTime = function() {
      return g;
    });
    this.logMessage = function(b) {
      a.log && a.log(b);
    };
    DEBUG && this.logMessage("Starting controller");
    b.context = d.getContext("2d");
    b.context.setTransform(1, 0, 0, 1, 0, 0);
    e = !0;
    isDrawing = !1;
    f = a.refreshTime || 50;
    this.triggerPointedElementEvent = function(a, c) {
      var f = !1;
      b.elements.filter(function(b) {
        return b.canHandle(a);
      }).sort(function(a, b) {
        return b.elementZ || 0 - a.elementZ || 0;
      }).forEach(function(b) {
        !f && b.hit(c.x, c.y) && (b.elementEvents.dispatch(a, c), f = !0);
      });
    };
    this.triggerElementEventByIdentifier = function(a, c) {
      b.elements.forEach(function(b) {
        b.touchIdentifier == c.touchIdentifier && b.elementEvents.dispatch(a, c);
      });
    };
    this.registerCanvasPointerEvent = function(a, c) {
      d.addEventListener(a, function(f) {
        setTimeout(function() {
          var d = function(f, d) {
            DEBUG && b.logMessage("Canvas event " + a + " with touchIdentifier " + d);
            var e = b.getWebappXYFromClientXY(f);
            e.touchIdentifier = d;
            b.triggerPointedElementEvent(c, e);
          };
          if (f.changedTouches) {
            for (var e = 0;e < f.changedTouches.length;e++) {
              d(f.changedTouches[e], f.changedTouches[e].identifier);
            }
          } else {
            d(f, -1);
          }
        });
      });
    };
    this.registerTouchIdentifierEvent = function(a, c) {
      d.addEventListener(a, function(f) {
        setTimeout(function() {
          var d = function(f, d) {
            DEBUG && b.logMessage("Canvas event " + a + " with touchIdentifier " + d);
            var e = b.getWebappXYFromClientXY(f);
            e.touchIdentifier = d;
            b.triggerElementEventByIdentifier(c, e);
          };
          if (f.changedTouches) {
            for (var e = 0;e < f.changedTouches.length;e++) {
              d(f.changedTouches[e], f.changedTouches[e].identifier);
            }
          } else {
            d(f, -1);
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
      b.elementEvents.dispatch("deactivate");
      b.elements = [];
    };
    this.triggerRedraw = function() {
      e = !0;
    };
    this.getWebappXYFromClientXY = function(a) {
      var c = d.getBoundingClientRect();
      b.logMessage("ClientXY: (" + a.clientX + "," + a.clientY + ")");
      c = {x:(a.clientX - c.left) * d.width / c.width / b.lengthScale, y:(a.clientY - c.top) * d.height / c.height / b.lengthScale};
      b.logMessage("WebAppXY: (" + c.x + "," + c.y + ")");
      "click" == a.type && b.logMessage("Click on ! WebAppXY: (" + c.x + "," + c.y + ")");
      return c;
    };
    b.elements = [];
    this.add = function() {
      DEBUG && b.logMessage("Controller.addElement: Adding element - args:" + arguments.length);
      var a = [].slice.call(arguments), c = a.filter(function(a) {
        return a && "name" == a[0];
      })[0] || ["name", "Unknown"], f = a.filter(function(a) {
        return a && "image" == a[0];
      })[0], d = a.filter(function(a) {
        return a && "position" == a[0];
      })[0], c = new CreJs.Creanvas.Element(b, c, f, d), a = a.filter(function(a) {
        return a && "name" != a[0] && "position" != a[0] && "image" != a[0];
      });
      0 < a.length && CreJs.Creanvas.elementDecorators && (DEBUG && c.debug("New element", "apply " + a.length + " decorators"), c.applyElementDecorators.apply(c, a));
      b.elements.push(c);
      return c;
    };
    b.logMessage("Adding background");
    this.add(["name", "background"], ["image", {left:0, width:d.width / b.lengthScale, top:0, height:d.height / b.lengthScale, draw:a.drawBackground || function(c) {
      c.fillStyle = a.backgroundStyle || "#FFF";
      c.fillRect(0, 0, d.width / b.lengthScale, d.height / b.lengthScale);
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
    }, f);
    this.addElement = this.add;
    this.redraw = this.triggerRedraw;
    this.stop = this.stopController;
  };
  CreJs.Creanvas.Controller = CreJs.Creanvas.Controller;
})();
(function() {
  var a = function(a, d) {
    a.elementName = d;
    a.elementId = CreJs.CreHelpers.GetGuid();
  }, d = function(a, d) {
    var c = d.width, e = d.height;
    a.top = 0 == d.top ? 0 : d.top || -e / 2;
    a.left = 0 == d.left ? 0 : d.left || -c / 2;
    a.bottom = 0 == d.bottom ? 0 : d.bottom || a.top + e;
    a.right = 0 == d.right ? 0 : d.right || a.left + c;
    a.elementWidth = c || a.right - a.left;
    a.elementHeight = e || a.bottom - a.top;
    a.topInPoints = Math.round(a.top * a.controller.lengthScale);
    a.leftInPoints = Math.round(a.left * a.controller.lengthScale);
    a.bottomInPoints = Math.round(a.bottom * a.controller.lengthScale);
    a.rightInPoints = Math.round(a.right * a.controller.lengthScale);
    a.widthInPoints = Math.round(a.elementWidth * a.controller.lengthScale);
    a.heightInPoints = Math.round(a.elementHeight * a.controller.lengthScale);
    c = a.controller.context.canvas.ownerDocument.createElement("canvas");
    a.temporaryRenderingContext = c.getContext("2d");
    a.elementScaleX = d.scaleX || 1;
    a.elementScaleY = d.scaleY || 1;
    d.rawImage ? (a.elementImage = d.rawImage, a.temporaryRenderingContext.putImageData(a.elementImage, 0, 0)) : (e = d.draw, c.width = a.widthInPoints, c.height = a.heightInPoints, a.temporaryRenderingContext.beginPath(), a.temporaryRenderingContext.translate(-a.leftInPoints, -a.topInPoints), a.temporaryRenderingContext.scale(a.controller.lengthScale, a.controller.lengthScale), e.call(a, a.temporaryRenderingContext), a.elementImage = a.temporaryRenderingContext.getImageData(0, 0, a.widthInPoints, 
    a.heightInPoints));
  }, e = function(a, d) {
    a.elementX = d.x || 0;
    a.elementY = d.y || 0;
    a.elementZ = d.z || 0;
    a.elementAngle = d.angle || 0;
  };
  CreJs.Creanvas.Element = function(f, g, c, k) {
    var b = this;
    b.controller = f;
    var l = [], h = [];
    a(b, g[1]);
    d(b, c[1]);
    e(b, k[1]);
    h.push(g);
    h.push(c);
    h.push(k);
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
      var c = a ? h.filter(function(b) {
        return a.every(function(a) {
          return a != b[0];
        });
      }) : h;
      DEBUG && b.debug("cloneElement", "apply " + c.length + " stuff");
      return b.controller.add.apply(b.controller, c);
    };
    b.removeElementDecorator = function(a) {
      DEBUG && b.debug("removeElementDecorator", a);
      var c = CreJs.Creanvas.elementDecorators[a];
      c && c.removeFrom ? c.removeFrom(b) : DEBUG && b.debug("removeElementDecorator", "Cannot remove: " + a);
    };
    b.canHandle = function(a) {
      return "click" == a || "pointerDown" == a || b.elementEvents.hasEvent(a);
    };
    b.deactivate = function() {
      b.controller.elementEvents.removeEventListener({listenerId:b.elementId});
      b.temporaryRenderingContext = null;
    };
    b.controller.elementEvents.addEventListenerX({eventId:"deactivate", listenerId:b.elementId, handleEvent:function(a) {
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
    var p = [];
    p.push({x:b.leftInPoints, y:b.topInPoints});
    p.push({x:b.rightInPoints, y:b.topInPoints});
    p.push({x:b.rightInPoints, y:b.bottomInPoints});
    p.push({x:b.leftInPoints, y:b.bottomInPoints});
    b.getClientCornersCache = function() {
      return p.map(function(a) {
        return b.getWebappXY(a.x, a.y);
      });
    };
    b.getClientCorners = function() {
      var a = b.elementX + "" + b.elementY + "" + b.elementAngle + "" + b.elementScaleX + "" + b.elementScaleX;
      if (l.getClientCorners && l.getClientCorners.key == a) {
        return l.getClientCorners.value;
      }
      var c = b.getClientCornersCache();
      l.getClientCorners = {key:a, value:c};
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
      if (l.getClientRect && l.getClientRect.key == a) {
        return l.getClientRect.value;
      }
      var c = b.getClientRectCache();
      l.getClientRect = {key:a, value:c};
      return c;
    };
    b.applyElementDecorators = function() {
      var a = this, b = [].slice.apply(arguments);
      h = h.concat(b);
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
    b.removeDecorator = b.removeElementDecorator;
  };
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.clickable = {applyTo:function(a, d) {
    var e = d.onclick;
    a.onClick = function(d) {
      DEBUG && a.debug("onClick", e);
      e.call(a, d);
      a.triggerRedraw();
    };
    a.elementEvents.addEventListenerX({eventId:"click", handleEvent:a.onClick});
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
    var e = d.dropZone;
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
  CreJs.Creanvas.elementDecorators.dropzone = {applyTo:function(a, d) {
    var e = d.availableSpots, f = d.dropX, g = d.dropY;
    a.droppedElementsList = [];
    a.elementEvents.addEventListenerX({eventGroupType:"dropzone", eventId:"drop", handleEvent:function(c) {
      0 >= e || (DEBUG && a.controller.logMessage("drop event on dropzone " + a.elementId + ", dropped " + c.droppedElement.id), e--, c.droppedElement.x = f || a.elementX, c.droppedElement.y = g || a.elementY, c.droppedElement.dropZone = a, a.droppedElementsList.push(c.droppedElement), c.droppedElement.elementEvents.dispatch("dropped", {dropZone:a, droppedElement:c.droppedElement}), a.elementEvents.dispatch("droppedIn", {dropZone:a, droppedElement:c.droppedElement}), a.triggerRedraw());
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
  CreJs.Creanvas.elementDecorators.duplicable = {applyTo:function(a, d) {
    var e = d.isBlocked, f = d.generatorCount || Infinity;
    DEBUG && a.debug("duplicable.applyTo", "generatorCount is " + f);
    var g = !1;
    a.elementEvents.addEventListenerX({eventGroupType:"duplicable", eventId:"pointerDown", handleEvent:function(c) {
      0 <= c.touchIdentifier && (g = !0);
      if (!(g && 0 > c.touchIdentifier || e && e() || (DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount was: " + f), 0 >= f))) {
        f--;
        DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount is now: " + f);
        var d = a.cloneElement(["duplicable"]);
        d.elementName += " (duplicate)";
        d.applyElementDecorator("movable", {isBlocked:e});
        d.startMoving(c);
        a.triggerRedraw();
      }
    }, listenerId:a.elementId});
  }, removeFrom:function(a) {
    a.elementEvents.removeEventListener({eventGroupType:"duplicable", listenerId:a.elementId});
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
    var e = !1, f = this.touchIdentifier = null, g = d.isBlocked;
    a.startMoving = function(c) {
      DEBUG && a.controller.logMessage("Starting moving - identifier: " + c.touchIdentifier);
      e = !0;
      a.touchIdentifier = c.touchIdentifier;
      f = {x:c.x, y:c.y};
      a.dropZone && (a.dropZone.drag(a), a.dropZone = null);
    };
    a.moveCompleted = function(c) {
      DEBUG && a.controller.logMessage("Completed move - identifier: " + c.touchIdentifier);
      e = !1;
      f = null;
      a.isDroppable && (DEBUG && a.controller.logMessage("Trigger drop - identifier: " + c.touchIdentifier), a.controller.triggerPointedElementEvent("drop", {x:c.x, y:c.y, droppedElement:a}));
    };
    a.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerDown", handleEvent:function(c) {
      g && g() || a.startMoving(c);
    }, listenerId:a.elementId});
    var c = !1;
    a.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerMove", handleEvent:function(d) {
      !e || g && g() || (c || (c = !0, DEBUG && a.controller.logMessage("pointereMove event on movable " + a.elementId + " (" + a.touchIdentifier + ")")), a.elementX += d.x - f.x, a.elementY += d.y - f.y, f = {x:d.x, y:d.y}, a.triggerRedraw());
    }, listenerId:a.elementId});
    a.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerUp", handleEvent:function(d) {
      !e || g && g() || (DEBUG && a.controller.logMessage("End detected for touch " + a.touchIdentifier), a.elementX += d.x - f.x, a.elementY += d.y - f.y, a.moveCompleted(d), a.touchIdentifier = null, c = !1, a.triggerRedraw());
    }, listenerId:a.elementId});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.moving = {type:"moving", applyTo:function(a, d) {
    var e, f, g, c, k, b = d.vx, l = d.vy, h = d.ax, p = d.ay, r = d.rotationSpeed;
    DEBUG && a.controller.logMessage("Applying moving decorator to " + a.elementName + "-" + a.elementId);
    var n, q, m;
    a.elementMoving = a.elementMoving || {};
    a.elementMoving.movingSpeed = new CreJs.Core.Vector(b || 0, l || 0);
    a.elementMoving.movingAcceleration = new CreJs.Core.Vector(h || 0, p || 0);
    a.elementMoving.omega = r || 0;
    n = a.controller.getTime();
    setInterval(function() {
      q = a.controller.getTime();
      m = q - n;
      if (!(.001 > m) && (n = q, a.elementMoving.movingSpeed.x += a.elementMoving.movingAcceleration.x * m, a.elementMoving.movingSpeed.y += a.elementMoving.movingAcceleration.y * m, 0 != a.elementMoving.movingSpeed.x || 0 != a.elementMoving.movingSpeed.y || 0 != a.elementMoving.omega || a.elementScaleSpeed && (0 != a.elementScaleSpeed.x || 0 != a.elementScaleSpeed.y))) {
        e = a.elementX;
        f = a.elementY;
        g = a.elementAngle;
        c = a.elementScaleX;
        k = a.elementScaleY;
        a.elementX += a.elementMoving.movingSpeed.x * m;
        a.elementY += a.elementMoving.movingSpeed.y * m;
        a.elementAngle += a.elementMoving.omega * m;
        a.elementScaleSpeed && (a.elementScaleX += a.elementScaleSpeed.x * m, a.elementScaleY += a.elementScaleSpeed.y * m);
        var b = !0;
        a.preMove && a.preMove.forEach(function(c) {
          b && (c.call(a) || (b = !1));
        });
        b || (a.elementX = e, a.elementY = f, a.elementAngle = g, a.elementScaleX = c, a.elementScaleY = k);
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
  CreJs.Creanvas.elementDecorators.solid = {applyTo:function(a, d) {
    var e = [];
    a.solidData = {};
    a.solidData.elementMass = d.mass || 1;
    var f = d.onCollision, g = d.coefficient;
    a.solidData.fixed = d.fixed || !1;
    a.solidData.fixedPoint = a.solidData.fixed || d.fixedPoint || !1;
    a.controller.collisionSolver = a.controller.collisionSolver || new CreJs.Creanvas.CollisionSolver(a.controller);
    a.solidData.coefficient = g || 0 === g ? g : 1;
    a.elementMoving = a.elementMoving || {movingSpeed:new CreJs.Core.Vector(0, 0), movingAcceleration:new CreJs.Core.Vector(0, 0), omega:0};
    a.elementEvents.addEventListenerX({eventId:"collision", handleEvent:function(b) {
      f && f.call(a, b);
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
    var c = a.controller.context.canvas, g = c.ownerDocument.createElement("canvas"), c = c.ownerDocument.createElement("canvas");
    g.width = c.width = a.widthInPoints;
    g.height = c.height = a.heightInPoints;
    a.collidedContext = c.getContext("2d");
    a.collidedContext.putImageData(a.elementImage, 0, 0);
    a.collidedContext.globalCompositeOperation = "source-atop";
    a.collidedContext.fillStyle = "#000";
    a.collidedContext.fillRect(0, 0, a.widthInPoints, a.heightInPoints);
    a.collisionContext = g.getContext("2d");
    a.collisionContext.globalCompositeOperation = "source-over";
    a.collisionContext.drawImage(a.collidedContext.canvas, 0, 0);
    g = a.collisionContext.getImageData(0, 0, a.widthInPoints, a.heightInPoints);
    c = a.collisionContext.createImageData(a.widthInPoints, a.heightInPoints);
    a.edges = [];
    for (var k = 0;k < a.widthInPoints;k++) {
      for (var b = 0;b < a.heightInPoints;b++) {
        if (!(200 > g.data[b * a.widthInPoints * 4 + 4 * k + 3])) {
          for (var l = !1, h = -1;2 > h;h++) {
            for (var p = -1;2 > p;p++) {
              if (0 > b + h || 0 > k + p || b + h > a.heightInPoints - 1 || k + h > a.elementWidth - 1 || 100 > g.data[(b + h) * a.elementWidth * 4 + 4 * (k + p) + 3]) {
                l = !0, p = h = 2;
              }
            }
          }
          a.collisionContext.putImageData(c, 0, 0);
          l && (a.edges.push({x:k, y:b}), c.data[b * a.widthInPoints * 4 + 4 * k] = 0, c.data[b * a.widthInPoints * 4 + 4 * k + 1] = 0, c.data[b * a.widthInPoints * 4 + 4 * k + 2] = 0, c.data[b * a.widthInPoints * 4 + 4 * k + 3] = 255);
        }
      }
    }
    a.collisionContext.putImageData(c, 0, 0);
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
  var a = CreJs.Creevents = CreJs.Creevents || {}, d;
  a.Event = function(a) {
    this.eventId = a;
    d = CreJs.CreHelpers;
    var f = [], g = new CreJs.Crelog.Logger;
    this.dispatch = function(c, k) {
      var b = d.GetGuid(), l = f.length;
      DEBUG && c && "pointerMove" != c.eventId && "drag" != c.eventId && "drop" != c.eventId && g.logMessage("Dispatching " + l + " " + c.eventId + ". (" + b + ")");
      f.forEach(function(d) {
        d.debugEvent = a;
        setTimeout(function() {
          DEBUG && c && "pointerMove" != c.eventId && g.logMessage("Actually handling " + c.eventId + ". (" + b + ")");
          d.handleEvent(c);
          l--;
          0 == l && k && k();
        });
      });
    };
    this.addEventListenerX = function(a) {
      a.handleEvent = a.handleEvent || a.handleEvent;
      a.rank = a.rank || a.rank;
      a.listenerId = a.listenerId || a.listenerId;
      a.eventGroupType = a.eventGroupType || a.eventGroupType;
      var e = d.GetGuid();
      f.push({handlerGuid:e, handleEvent:a.handleEvent, rank:a.rank, listenerId:a.listenerId, eventGroupType:a.eventGroupType});
      f = f.sort(function(a, c) {
        return(a.rank || Infinity) - (c.rank || Infinity);
      });
      return e;
    };
    this.removeEventListener = function(a) {
      f = f.filter(function(d) {
        return Boolean(a.handlerGuid) && d.handlerGuid != a.handlerGuid || Boolean(a.listenerId) && d.listenerId != a.listenerId || Boolean(a.eventGroupType) && d.eventGroupType != a.eventGroupType;
      });
    };
  };
  CreJs.Creevents = a;
  a.Event = a.Event;
})();
(function() {
  var a = CreJs.Creevents = CreJs.Creevents || {};
  a.EventContainer = function() {
    var d = this, e = {}, f = [];
    this.hasEvent = function(a) {
      return void 0 != e[a];
    };
    var g = function(c) {
      f.push(c);
      e[c] = new a.Event(c);
    };
    this.addEventListenerX = function(a) {
      var d = a.eventId || a.eventId;
      e[d] || g(d);
      return e[d].addEventListenerX(a);
    };
    this.dispatch = function(a, d, b) {
      e[a] && (d && (d.eventId = a), e[a].dispatch(d, b));
    };
    this.removeEventListener = function(a) {
      e[a.eventId] ? e[a.eventId].removeEventListener(a) : f.forEach(function(d) {
        e[d].removeEventListener(a);
      });
    };
    this.registerControlEvent = function(a, f, b) {
      e[b] || g(b);
      a.addEventListenerX(f, function(a) {
        a.preventDefault();
        setTimeout(function() {
          d.dispatch(b, a);
        }, 0);
      });
    };
    this.addEventListener = this.addEventListenerX;
  };
  a.EventContainer = a.EventContainer;
})();
(function() {
  var a = CreJs.CreHelpers = CreJs.CreHelpers || {};
  a.GetGuid = function() {
    var d = Date.now().toString(16), d = a.repeatString("x", 15 - d.length) + d;
    return("xxxxxxxx-xxxx-4xxx-y" + d.slice(0, 3) + "-" + d.slice(3)).replace(/[xy]/g, function(a) {
      var d = 16 * Math.random() | 0;
      return("x" == a ? d : d & 3 | 8).toString(16);
    });
  };
  a.repeatString = function(d, e) {
    return 0 >= e ? "" : d + a.repeatString(d, e - 1);
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

