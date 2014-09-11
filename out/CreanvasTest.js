var TEST = !0, DEBUG = !1, CreJs = CreJs || {};
CreJs.Creanvas = CreJs.Creanvas || {};
window.CreJs = CreJs;
CreJs.Creanvas = CreJs.Creanvas;
TEST && (CreJs.Test = CreJs.Test || {}, CreJs.Test = CreJs.Test);
(function() {
  var a = CreJs.Core = CreJs.Core || {};
  a.Vector = function(c, f, d) {
    var e = this;
    this.vectorX = c;
    this.vectorY = f;
    this.vectorZ = d || 0;
    this.draw = function(a, d, b, c) {
      a.lineWidth = 5;
      a.strokeStyle = c;
      a.beginPath();
      a.moveTo(d, b);
      a.lineTo(d + 100 * e.vectorX, b + 100 * e.vectorY);
      a.stroke();
      a.lineWidth = 1;
      a.strokeStyle = "#000";
    };
    this.getCoordinates = function(g) {
      return{u:a.scalarProduct(e, g.u), v:a.scalarProduct(e, g.v), w:a.scalarProduct(e, g.w)};
    };
    this.setCoordinates = function(a, d, b, c) {
      c = c || 0;
      e.vectorX = d * a.u.vectorX + b * a.v.vectorX + c * a.w.vectorX;
      e.vectorY = d * a.u.vectorY + b * a.v.vectorY + c * a.w.vectorY;
      e.vectorZ = d * a.u.vectorZ + b * a.v.vectorZ + c * a.w.vectorZ;
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
  a.getUnitVectors = function(c, f, d, e) {
    c = d - c;
    f = e - f;
    e = Math.sqrt(c * c + f * f);
    return{u:new a.Vector(c / e, f / e, 0), v:new a.Vector(-f / e, c / e, 0), w:new a.Vector(0, 0, 0)};
  };
  a.drawUnitVectors = function(a, f, d, e, g) {
    a.lineWidth = 5;
    a.strokeStyle = g;
    a.beginPath();
    a.moveTo(f, d);
    a.lineTo(f + 100 * e.u.vectorX, d + 100 * e.u.vectorY);
    a.moveTo(f, d);
    a.lineTo(f + 50 * e.v.vectorX, d + 50 * e.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.drawCoordinateVector = function(a, f, d, e, g, h, b) {
    a.lineWidth = 5;
    a.strokeStyle = b;
    a.beginPath();
    a.moveTo(f, d);
    a.lineTo(f + 100 * g * e.u.vectorX, d + 100 * g * e.u.vectorY);
    a.lineTo(f + 100 * g * e.u.vectorX + 100 * h * e.v.vectorX, d + 100 * g * e.u.vectorY + 100 * h * e.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.scalarProduct = function(a, f) {
    return a.vectorX * f.vectorX + a.vectorY * f.vectorY;
  };
  a.vectorProduct = function(c, f) {
    return new a.Vector(c.vectorY * f.vectorZ - c.vectorZ * f.vectorY, c.vectorZ * f.vectorX - c.vectorX * f.vectorZ, c.vectorX * f.vectorY - c.vectorY * f.vectorX);
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
      var h, b, c, k, f, r, n;
      k = a.getClientRect();
      f = d.getClientRect();
      h = Math.max(k.leftInPoints, f.leftInPoints) - 1;
      b = Math.min(k.rightInPoints, f.rightInPoints) + 1;
      c = Math.max(k.topInPoints, f.topInPoints) - 1;
      k = Math.min(k.bottomInPoints, f.bottomInPoints) + 1;
      if (!(0 >= b - h || 0 >= k - c)) {
        h = a.collisionContext.getImageData(0, 0, a.widthInPoints, a.heightInPoints);
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
        a.collisionContext.putImageData(h, 0, 0);
        n = [];
        a.edges.forEach(function(b) {
          90 > r.data[b.y * a.widthInPoints * 4 + 4 * b.x + 3] && n.push(b);
        });
        if (2 > n.length) {
          return null;
        }
        var p;
        c = b = 0;
        h = n.length - 1;
        for (k = 1;k < n.length;k++) {
          for (f = k + 1;f < n.length;f++) {
            p = n[k].x - n[f].x;
            var m = n[k].y - n[f].y;
            p = Math.sqrt(p * p + m * m);
            p > b && (b = p, c = k, h = f);
          }
        }
        b = a.getWebappXY(n[c].x + a.left, n[c].y + a.topInPoints);
        h = a.getWebappXY(n[h].x + a.left, n[h].y + a.topInPoints);
        return b.x == h.x && b.y == h.y ? null : {x:(b.x + h.x) / 2, y:(b.y + h.y) / 2, vectors:CreJs.Core.getUnitVectors(b.x, b.y, h.x, h.y)};
      }
    }, f = function(a, d, c) {
      var b, l, k, f, r, n, p;
      b = c.vectors;
      f = new CreJs.Core.Vector(c.x - a.elementX, c.y - a.elementY);
      n = CreJs.Core.vectorProduct(f, b.v).z;
      p = new CreJs.Core.Vector(c.x - d.elementX, c.y - d.elementY);
      c = CreJs.Core.vectorProduct(p, b.v).z;
      var m = CreJs.Core.vectorProduct(f, b.v), s = CreJs.Core.vectorProduct(p, b.v);
      l = new CreJs.Core.Vector(a.elementMoving.movingSpeed.x, a.elementMoving.movingSpeed.y);
      k = new CreJs.Core.Vector(d.elementMoving.movingSpeed.x, d.elementMoving.movingSpeed.y);
      a.elementScaleSpeed && (l.x += f.x * a.elementScaleSpeed.x, l.y += f.y * a.elementScaleSpeed.y);
      d.elementScaleSpeed && (k.x += p.x * d.elementScaleSpeed.x, k.y += p.y * d.elementScaleSpeed.y);
      f = l.getCoordinates(b);
      r = k.getCoordinates(b);
      k = a.solidData.fixedPoint ? Infinity : a.solidData.elementMass;
      l = d.solidData.fixedPoint ? Infinity : d.solidData.elementMass;
      p = a.solidData.fixed ? Infinity : a.getMomentOfInertia();
      var t = d.solidData.fixed ? Infinity : d.getMomentOfInertia(), m = a.solidData.coefficient * d.solidData.coefficient * 2 * (r.v - f.v + d.elementMoving.omega * s.z - a.elementMoving.omega * m.z) / (1 / l + 1 / k + s.z * s.z / t + m.z * m.z / p);
      a.elementMoving.movingSpeed.x += m / k * b.v.x;
      a.elementMoving.movingSpeed.y += m / k * b.v.y;
      d.elementMoving.movingSpeed.x -= m / l * b.v.x;
      d.elementMoving.movingSpeed.y -= m / l * b.v.y;
      a.elementMoving.omega += m * n / p;
      d.elementMoving.omega -= m * c / t;
    }, d = function() {
      return a.elements.filter(function(a) {
        return a.solidData;
      });
    };
    this.solveCollision = function(a) {
      var g = d(), h, b, l;
      h = a.getCenter();
      g = g.filter(function(b) {
        var d;
        if (b.elementId === a.elementId || !(b.elementMoving.movingSpeed.x || b.elementMoving.movingSpeed.y || a.elementMoving.movingSpeed.x || a.elementMoving.movingSpeed.y || b.elementScaleSpeed || a.elementScaleSpeed || a.elementMoving.omega || b.elementMoving.omega)) {
          return!1;
        }
        d = b.getCenter();
        return Math.sqrt((h.x - d.x) * (h.x - d.x) + (h.y - d.y) * (h.y - d.y)) > a.getRadius() + b.getRadius() ? !1 : !0;
      });
      if (0 == g.length) {
        return!0;
      }
      b = null;
      g.forEach(function(d) {
        b || (b = c(a, d)) && (l = d);
      });
      if (!b) {
        return!0;
      }
      f(a, l, b);
      a.elementEvents.dispatch("collision", {element:l, collisionPoint:b});
      l.elementEvents.dispatch("collision", {element:a, collisionPoint:b});
      return!1;
    };
  };
})();
(function() {
  CreJs.Creanvas.Controller = function(a) {
    var c, f, d, e, g, h, b = this;
    c = a.canvas;
    h = a.timeScale || 1;
    this.lengthScale = a.lengthScale || c.height / a.realHeight || c.width / a.realWidth || 1;
    a.realTime ? (g = Date.now(), this.getTime = function() {
      return(Date.now() - g) * h / 1E3;
    }) : (e = 0, setInterval(function() {
      e += 10 * h / 1E3;
    }, 10), this.getTime = function() {
      return e;
    });
    this.logMessage = function(b) {
      a.log && a.log(b);
    };
    DEBUG && this.logMessage("Starting controller");
    b.context = c.getContext("2d");
    b.context.setTransform(1, 0, 0, 1, 0, 0);
    f = !0;
    isDrawing = !1;
    d = a.refreshTime || 50;
    this.triggerPointedElementEvent = function(a, d) {
      var c = !1;
      b.elements.filter(function(b) {
        return b.canHandle(a);
      }).sort(function(a, b) {
        return b.elementZ || 0 - a.elementZ || 0;
      }).forEach(function(b) {
        !c && b.hit(d.x, d.y) && (b.elementEvents.dispatch(a, d), c = !0);
      });
    };
    this.triggerElementEventByIdentifier = function(a, d) {
      b.elements.forEach(function(b) {
        b.touchIdentifier == d.touchIdentifier && b.elementEvents.dispatch(a, d);
      });
    };
    this.registerCanvasPointerEvent = function(a, d) {
      c.addEventListener(a, function(c) {
        setTimeout(function() {
          var g = function(c, g) {
            DEBUG && b.logMessage("Canvas event " + a + " with touchIdentifier " + g);
            var e = b.getWebappXYFromClientXY(c);
            e.touchIdentifier = g;
            b.triggerPointedElementEvent(d, e);
          };
          if (c.changedTouches) {
            for (var e = 0;e < c.changedTouches.length;e++) {
              g(c.changedTouches[e], c.changedTouches[e].identifier);
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
          var g = function(c, e) {
            DEBUG && b.logMessage("Canvas event " + a + " with touchIdentifier " + e);
            var g = b.getWebappXYFromClientXY(c);
            g.touchIdentifier = e;
            b.triggerElementEventByIdentifier(d, g);
          };
          if (c.changedTouches) {
            for (var e = 0;e < c.changedTouches.length;e++) {
              g(c.changedTouches[e], c.changedTouches[e].identifier);
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
      b.elementEvents.dispatch("deactivate");
      b.elements = [];
    };
    this.triggerRedraw = function() {
      f = !0;
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
      f && !isDrawing ? (isDrawing = !0, b.elements.sort(function(a, b) {
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
    var g = c.width, h = c.height;
    a.top = 0 == c.top ? 0 : c.top || -h / 2;
    a.left = 0 == c.left ? 0 : c.left || -g / 2;
    a.bottom = 0 == c.bottom ? 0 : c.bottom || a.top + h;
    a.right = 0 == c.right ? 0 : c.right || a.left + g;
    a.elementWidth = g || a.right - a.left;
    a.elementHeight = h || a.bottom - a.top;
    a.topInPoints = Math.round(a.top * a.controller.lengthScale);
    a.leftInPoints = Math.round(a.left * a.controller.lengthScale);
    a.bottomInPoints = Math.round(a.bottom * a.controller.lengthScale);
    a.rightInPoints = Math.round(a.right * a.controller.lengthScale);
    a.widthInPoints = Math.round(a.elementWidth * a.controller.lengthScale);
    a.heightInPoints = Math.round(a.elementHeight * a.controller.lengthScale);
    g = a.controller.context.canvas.ownerDocument.createElement("canvas");
    a.temporaryRenderingContext = g.getContext("2d");
    a.elementScaleX = c.scaleX || 1;
    a.elementScaleY = c.scaleY || 1;
    c.rawImage ? (a.elementImage = c.rawImage, a.temporaryRenderingContext.putImageData(a.elementImage, 0, 0)) : (h = c.draw, g.width = a.widthInPoints, g.height = a.heightInPoints, a.temporaryRenderingContext.beginPath(), a.temporaryRenderingContext.translate(-a.leftInPoints, -a.topInPoints), a.temporaryRenderingContext.scale(a.controller.lengthScale, a.controller.lengthScale), h.call(a, a.temporaryRenderingContext), a.elementImage = a.temporaryRenderingContext.getImageData(0, 0, a.widthInPoints, 
    a.heightInPoints));
  }, f = function(a, c) {
    a.elementX = c.x || 0;
    a.elementY = c.y || 0;
    a.elementZ = c.z || 0;
    a.elementAngle = c.angle || 0;
  };
  CreJs.Creanvas.Element = function(d, e, g, h) {
    var b = this;
    b.controller = d;
    var l = [], k = [];
    a(b, e[1]);
    c(b, g[1]);
    f(b, h[1]);
    k.push(e);
    k.push(g);
    k.push(h);
    DEBUG && (b.debug = function(a, d) {
      b.controller.logMessage("Element." + a + ": " + d + ". Element: " + b.elementName + "/" + b.elementId);
    });
    b.elementEvents = new CreJs.Creevents.EventContainer;
    b.hit = function(a, d) {
      var c = b.getElementXY(a, d), g = c.x - b.leftInPoints, c = c.y - b.topInPoints, g = 0 <= g && g <= b.widthInPoints && 0 <= c && c <= b.heightInPoints && 0 < b.elementImage.data[4 * c * b.widthInPoints + 4 * g + 3];
      DEBUG && b.debug("hit", g ? "hit" : "no hit");
      return g;
    };
    b.cloneElement = function(a) {
      DEBUG && b.debug("cloneElement", "start cloning");
      var d = a ? k.filter(function(b) {
        return a.every(function(a) {
          return a != b[0];
        });
      }) : k;
      DEBUG && b.debug("cloneElement", "apply " + d.length + " stuff");
      return b.controller.add.apply(b.controller, d);
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
    b.getWebappXY = function(a, d) {
      return{x:b.elementX + (a * b.elementScaleX * Math.cos(b.elementAngle) - d * b.elementScaleY * Math.sin(b.elementAngle)) / b.controller.lengthScale, y:b.elementY + (a * b.elementScaleX * Math.sin(b.elementAngle) + d * b.elementScaleY * Math.cos(b.elementAngle)) / b.controller.lengthScale};
    };
    b.getElementXY = function(a, d) {
      return{x:Math.round(((a - b.elementX) * b.controller.lengthScale * Math.cos(b.elementAngle) + (d - b.elementY) * b.controller.lengthScale * Math.sin(b.elementAngle)) / b.elementScaleX), y:Math.round(((d - b.elementY) * b.controller.lengthScale * Math.cos(b.elementAngle) - (a - b.elementX) * b.controller.lengthScale * Math.sin(b.elementAngle)) / b.elementScaleY)};
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
      if (l.getClientCorners && l.getClientCorners.key == a) {
        return l.getClientCorners.value;
      }
      var d = b.getClientCornersCache();
      l.getClientCorners = {key:a, value:d};
      return d;
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
      var d = b.getClientRectCache();
      l.getClientRect = {key:a, value:d};
      return d;
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
      var d = CreJs.Creanvas.elementDecorators[a];
      d ? d.applyTo(this, b) : DEBUG && this.debug("applyElementDecorator", "Not found: " + a);
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
    var f = c.onclick;
    f && (a.onClick = function(d) {
      DEBUG && a.debug("onClick", f);
      f.call(a, d);
      a.triggerRedraw();
    }, a.elementEvents.getEvent("click").addListener({handleEvent:a.onClick}));
    var d = !1;
    this.touchIdentifier = null;
    var e = c.ondown, g = c.onup;
    a.elementEvents.getEvent("pointerDown").addListener({handleEvent:function(c) {
      DEBUG && a.controller.logMessage("Registered down - identifier: " + c.touchIdentifier);
      a.touchIdentifier = c.touchIdentifier;
      d = !0;
      e && (DEBUG && a.debug("onDown", e), e.call(a, event), a.triggerRedraw());
    }, listenerId:a.elementId});
    a.elementEvents.getEvent("pointerUp").addListener({handleEvent:function(c) {
      d && a.touchIdentifier == c.touchIdentifier && (DEBUG && a.controller.logMessage("registerd up - identifier: " + c.touchIdentifier), d = !1, g && (DEBUG && a.debug("onUp", g), g.call(a, event), a.triggerRedraw()));
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
    var f = c.dropZone;
    a.isDroppable = !0;
    a.elementDropZone = f;
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
    var f = c.availableSpots, d = c.dropX, e = c.dropY;
    a.droppedElementsList = [];
    a.elementEvents.getEvent("drop").addListener({handleEvent:function(c) {
      0 >= f || (DEBUG && a.controller.logMessage("drop event on dropzone " + a.elementId + ", dropped " + c.droppedElement.id), f--, c.droppedElement.x = d || a.elementX, c.droppedElement.y = e || a.elementY, c.droppedElement.dropZone = a, a.droppedElementsList.push(c.droppedElement), c.droppedElement.elementEvents.dispatch("dropped", {dropZone:a, droppedElement:c.droppedElement}), a.elementEvents.dispatch("droppedIn", {dropZone:a, droppedElement:c.droppedElement}), a.triggerRedraw());
    }, listenerId:a.elementId});
    a.drag = function(d) {
      DEBUG && a.controller.logMessage("dragging from dropzone " + a.elementId + ", dragged " + d.id);
      d.dropZone = null;
      f++;
      a.droppedElementsList.splice(a.droppedElementsList.indexOf(d), 1);
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
    var f = c.isBlocked, d = c.generatorCount || Infinity;
    DEBUG && a.debug("duplicable.applyTo", "generatorCount is " + d);
    var e = !1;
    a.elementEvents.getEvent("pointerDown").addListener({handleEvent:function(c) {
      0 <= c.touchIdentifier && (e = !0);
      if (!(e && 0 > c.touchIdentifier || f && f() || (DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount was: " + d), 0 >= d))) {
        d--;
        DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount is now: " + d);
        var h = a.cloneElement(["duplicable"]);
        h.elementName += " (duplicate)";
        h.applyElementDecorator("movable", {isBlocked:f});
        h.startMoving(c);
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
    var f = !1, d = this.touchIdentifier = null, e = c.isBlocked;
    a.startMoving = function(c) {
      DEBUG && a.controller.logMessage("Starting moving - identifier: " + c.touchIdentifier);
      f = !0;
      a.touchIdentifier = c.touchIdentifier;
      d = {x:c.x, y:c.y};
      a.dropZone && (a.dropZone.drag(a), a.dropZone = null);
    };
    a.moveCompleted = function(c) {
      DEBUG && a.controller.logMessage("Completed move - identifier: " + c.touchIdentifier);
      f = !1;
      d = null;
      a.isDroppable && (DEBUG && a.controller.logMessage("Trigger drop - identifier: " + c.touchIdentifier), a.controller.triggerPointedElementEvent("drop", {x:c.x, y:c.y, droppedElement:a}));
    };
    a.elementEvents.getEvent("pointerDown").addListener({handleEvent:function(c) {
      e && e() || a.startMoving(c);
    }, listenerId:a.elementId});
    var g = !1;
    a.elementEvents.getEvent("pointerMove").addListener({handleEvent:function(c) {
      !f || e && e() || (g || (g = !0, DEBUG && a.controller.logMessage("pointereMove event on movable " + a.elementId + " (" + a.touchIdentifier + ")")), a.elementX += c.x - d.x, a.elementY += c.y - d.y, d = {x:c.x, y:c.y}, a.triggerRedraw());
    }, listenerId:a.elementId});
    a.elementEvents.getEvent("pointerUp").addListener({handleEvent:function(c) {
      !f || e && e() || (DEBUG && a.controller.logMessage("End detected for touch " + a.touchIdentifier), a.elementX += c.x - d.x, a.elementY += c.y - d.y, a.moveCompleted(c), a.touchIdentifier = null, g = !1, a.triggerRedraw());
    }, listenerId:a.elementId});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.moving = {type:"moving", applyTo:function(a, c) {
    var f, d, e, g, h, b = c.vx, l = c.vy, k = c.ax, q = c.ay, r = c.rotationSpeed;
    DEBUG && a.controller.logMessage("Applying moving decorator to " + a.elementName + "-" + a.elementId);
    var n, p, m;
    a.elementMoving = a.elementMoving || {};
    a.elementMoving.movingSpeed = new CreJs.Core.Vector(b || 0, l || 0);
    a.elementMoving.movingAcceleration = new CreJs.Core.Vector(k || 0, q || 0);
    a.elementMoving.omega = r || 0;
    n = a.controller.getTime();
    setInterval(function() {
      p = a.controller.getTime();
      m = p - n;
      if (!(.001 > m) && (n = p, a.elementMoving.movingSpeed.x += a.elementMoving.movingAcceleration.x * m, a.elementMoving.movingSpeed.y += a.elementMoving.movingAcceleration.y * m, 0 != a.elementMoving.movingSpeed.x || 0 != a.elementMoving.movingSpeed.y || 0 != a.elementMoving.omega || a.elementScaleSpeed && (0 != a.elementScaleSpeed.x || 0 != a.elementScaleSpeed.y))) {
        f = a.elementX;
        d = a.elementY;
        e = a.elementAngle;
        g = a.elementScaleX;
        h = a.elementScaleY;
        a.elementX += a.elementMoving.movingSpeed.x * m;
        a.elementY += a.elementMoving.movingSpeed.y * m;
        a.elementAngle += a.elementMoving.omega * m;
        a.elementScaleSpeed && (a.elementScaleX += a.elementScaleSpeed.x * m, a.elementScaleY += a.elementScaleSpeed.y * m);
        var b = !0;
        a.preMove && a.preMove.forEach(function(c) {
          b && (c.call(a) || (b = !1));
        });
        b || (a.elementX = f, a.elementY = d, a.elementAngle = e, a.elementScaleX = g, a.elementScaleY = h);
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
    var f = [];
    a.solidData = {};
    a.solidData.elementMass = c.mass || 1;
    var d = c.onCollision, e = c.coefficient;
    a.solidData.fixed = c.fixed || !1;
    a.solidData.fixedPoint = a.solidData.fixed || c.fixedPoint || !1;
    a.controller.collisionSolver = a.controller.collisionSolver || new CreJs.Creanvas.CollisionSolver(a.controller);
    a.solidData.coefficient = e || 0 === e ? e : 1;
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
      if (f.getRadius && f.getRadius.key == b) {
        return f.getRadius.value_;
      }
      var c = a.geRadiusCache();
      f.geRadius = {kevectorY:b, value_:c};
      return c;
    };
    var g = a.controller.context.canvas, e = g.ownerDocument.createElement("canvas"), g = g.ownerDocument.createElement("canvas");
    e.width = g.width = a.widthInPoints;
    e.height = g.height = a.heightInPoints;
    a.collidedContext = g.getContext("2d");
    a.collidedContext.putImageData(a.elementImage, 0, 0);
    a.collidedContext.globalCompositeOperation = "source-atop";
    a.collidedContext.fillStyle = "#000";
    a.collidedContext.fillRect(0, 0, a.widthInPoints, a.heightInPoints);
    a.collisionContext = e.getContext("2d");
    a.collisionContext.globalCompositeOperation = "source-over";
    a.collisionContext.drawImage(a.collidedContext.canvas, 0, 0);
    e = a.collisionContext.getImageData(0, 0, a.widthInPoints, a.heightInPoints);
    g = a.collisionContext.createImageData(a.widthInPoints, a.heightInPoints);
    a.edges = [];
    for (var h = 0;h < a.widthInPoints;h++) {
      for (var b = 0;b < a.heightInPoints;b++) {
        if (!(200 > e.data[b * a.widthInPoints * 4 + 4 * h + 3])) {
          for (var l = !1, k = -1;2 > k;k++) {
            for (var q = -1;2 > q;q++) {
              if (0 > b + k || 0 > h + q || b + k > a.heightInPoints - 1 || h + k > a.elementWidth - 1 || 100 > e.data[(b + k) * a.elementWidth * 4 + 4 * (h + q) + 3]) {
                l = !0, q = k = 2;
              }
            }
          }
          a.collisionContext.putImageData(g, 0, 0);
          l && (a.edges.push({x:h, y:b}), g.data[b * a.widthInPoints * 4 + 4 * h] = 0, g.data[b * a.widthInPoints * 4 + 4 * h + 1] = 0, g.data[b * a.widthInPoints * 4 + 4 * h + 2] = 0, g.data[b * a.widthInPoints * 4 + 4 * h + 3] = 255);
        }
      }
    }
    a.collisionContext.putImageData(g, 0, 0);
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
    var d = [], e = new CreJs.Crelog.Logger;
    this.dispatch = function(g, h) {
      var b = c.GetGuid(), l = d.length;
      DEBUG && g && "pointerMove" != g.eventId && "drag" != g.eventId && "drop" != g.eventId && e.logMessage("Dispatching " + l + " " + g.eventId + ". (" + b + ")");
      d.forEach(function(c) {
        c.debugEvent = a;
        setTimeout(function() {
          DEBUG && g && "pointerMove" != g.eventId && e.logMessage("Actually handling " + g.eventId + ". (" + b + ")");
          c.handleEvent(g);
          l--;
          0 == l && h && h();
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
    var c = {}, f = [];
    this.hasEvent = function(a) {
      return void 0 != c[a];
    };
    this.getEvent = function(d) {
      c[d] || (f.push(d), c[d] = new a.Event(d));
      return c[d];
    };
    this.dispatch = function(a, e, f) {
      c[a] && (e && (e.eventId = a), c[a].dispatch(e, f));
    };
    this.removeEventListener = function(a) {
      c[a.eventId] ? c[a.eventId].removeEventListener(a) : f.forEach(function(e) {
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
  a.repeatString = function(c, f) {
    return 0 >= f ? "" : c + a.repeatString(c, f - 1);
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

