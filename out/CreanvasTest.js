var TEST = !0, DEBUG = !1, CreJs = CreJs || {};
CreJs.Creanvas = CreJs.Creanvas || {};
window.CreJs = CreJs;
CreJs.Creanvas = CreJs.Creanvas;
TEST && (CreJs.Test = CreJs.Test || {}, CreJs.Test = CreJs.Test);
(function() {
  var a = CreJs.Core = CreJs.Core || {};
  a.Vector = function(f, g, h) {
    var e = this;
    this.vectorX = f;
    this.vectorY = g;
    this.vectorZ = h || 0;
    this.draw = function(a, d, b, f) {
      a.lineWidth = 5;
      a.strokeStyle = f;
      a.beginPath();
      a.moveTo(d, b);
      a.lineTo(d + 100 * e.vectorX, b + 100 * e.vectorY);
      a.stroke();
      a.lineWidth = 1;
      a.strokeStyle = "#000";
    };
    this.getCoordinates = function(c) {
      return{u:a.scalarProduct(e, c.u), v:a.scalarProduct(e, c.v), w:a.scalarProduct(e, c.w)};
    };
    this.setCoordinates = function(a, d, b, f) {
      f = f || 0;
      e.vectorX = d * a.u.vectorX + b * a.v.vectorX + f * a.w.vectorX;
      e.vectorY = d * a.u.vectorY + b * a.v.vectorY + f * a.w.vectorY;
      e.vectorZ = d * a.u.vectorZ + b * a.v.vectorZ + f * a.w.vectorZ;
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
  a.getUnitVectors = function(f, g, h, e) {
    f = h - f;
    g = e - g;
    e = Math.sqrt(f * f + g * g);
    return{u:new a.Vector(f / e, g / e, 0), v:new a.Vector(-g / e, f / e, 0), w:new a.Vector(0, 0, 0)};
  };
  a.drawUnitVectors = function(a, g, h, e, c) {
    a.lineWidth = 5;
    a.strokeStyle = c;
    a.beginPath();
    a.moveTo(g, h);
    a.lineTo(g + 100 * e.u.vectorX, h + 100 * e.u.vectorY);
    a.moveTo(g, h);
    a.lineTo(g + 50 * e.v.vectorX, h + 50 * e.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.drawCoordinateVector = function(a, g, h, e, c, d, b) {
    a.lineWidth = 5;
    a.strokeStyle = b;
    a.beginPath();
    a.moveTo(g, h);
    a.lineTo(g + 100 * c * e.u.vectorX, h + 100 * c * e.u.vectorY);
    a.lineTo(g + 100 * c * e.u.vectorX + 100 * d * e.v.vectorX, h + 100 * c * e.u.vectorY + 100 * d * e.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.scalarProduct = function(a, g) {
    return a.vectorX * g.vectorX + a.vectorY * g.vectorY;
  };
  a.vectorProduct = function(f, g) {
    return new a.Vector(f.vectorY * g.vectorZ - f.vectorZ * g.vectorY, f.vectorZ * g.vectorX - f.vectorX * g.vectorZ, f.vectorX * g.vectorY - f.vectorY * g.vectorX);
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
    var f = function(a, c) {
      var d, b, h, k, f, q, g;
      k = a.getClientRect();
      f = c.getClientRect();
      d = Math.max(k.left, f.left) - 1;
      b = Math.min(k.right, f.right) + 1;
      h = Math.max(k.top, f.top) - 1;
      k = Math.min(k.bottom, f.bottom) + 1;
      if (!(0 >= b - d || 0 >= k - h)) {
        d = a.collisionContext.getImageData(0, 0, a.elementWidth, a.elementHeight);
        a.collisionContext.scale(1 / (a.elementScaleX || 1), 1 / (a.elementScaleY || 1));
        a.collisionContext.rotate(-(a.elementAngle || 0));
        a.collisionContext.translate(c.elementX - a.elementX, c.elementY - a.elementY);
        a.collisionContext.rotate(c.elementAngle || 0);
        a.collisionContext.scale(c.elementScaleX || 1, c.elementScaleY || 1);
        a.collisionContext.globalCompositeOperation = "destination-out";
        a.collisionContext.drawImage(c.collidedContext.canvas, 0, 0, c.elementWidth, c.elementHeight, c.left, c.top, c.elementWidth, c.elementHeight);
        a.collisionContext.scale(1 / (c.elementScaleX || 1), 1 / (c.elementScaleY || 1));
        a.collisionContext.rotate(-c.elementAngle || 0);
        a.collisionContext.translate(-c.elementX + a.elementX, -c.elementY + a.elementY);
        a.collisionContext.rotate(a.elementAngle || 0);
        a.collisionContext.scale(a.elementScaleX || 1, a.elementScaleY || 1);
        q = a.collisionContext.getImageData(0, 0, a.elementWidth, a.elementHeight);
        a.collisionContext.globalCompositeOperation = "source-over";
        a.collisionContext.putImageData(d, 0, 0);
        g = [];
        a.edges.forEach(function(b) {
          90 > q.data[b.y * a.elementWidth * 4 + 4 * b.x + 3] && g.push(b);
        });
        if (2 > g.length) {
          return null;
        }
        var n;
        h = b = 0;
        d = g.length - 1;
        for (k = 1;k < g.length;k++) {
          for (f = k + 1;f < g.length;f++) {
            n = g[k].x - g[f].x;
            var m = g[k].y - g[f].y;
            n = Math.sqrt(n * n + m * m);
            n > b && (b = n, h = k, d = f);
          }
        }
        b = a.getCanvasXY(g[h].x + a.left, g[h].y + a.top);
        d = a.getCanvasXY(g[d].x + a.left, g[d].y + a.top);
        return b.x == d.x && b.y == d.y ? null : {x:Math.round((b.x + d.x) / 2), y:Math.round((b.y + d.y) / 2), vectors:CreJs.Core.getUnitVectors(b.x, b.y, d.x, d.y)};
      }
    }, g = function(a, c, d) {
      var b, h, k, g, q, f, n;
      b = d.vectors;
      g = new CreJs.Core.Vector(d.x - a.elementX, d.y - a.elementY);
      f = CreJs.Core.vectorProduct(g, b.v).z;
      n = new CreJs.Core.Vector(d.x - c.elementX, d.y - c.elementY);
      d = CreJs.Core.vectorProduct(n, b.v).z;
      var m = CreJs.Core.vectorProduct(g, b.v), s = CreJs.Core.vectorProduct(n, b.v);
      h = new CreJs.Core.Vector(a.elementMoving.movingSpeed.x, a.elementMoving.movingSpeed.y);
      k = new CreJs.Core.Vector(c.elementMoving.movingSpeed.x, c.elementMoving.movingSpeed.y);
      a.elementScaleSpeed && (h.x += g.x * a.elementScaleSpeed.x, h.y += g.y * a.elementScaleSpeed.y);
      c.elementScaleSpeed && (k.x += n.x * c.elementScaleSpeed.x, k.y += n.y * c.elementScaleSpeed.y);
      g = h.getCoordinates(b);
      q = k.getCoordinates(b);
      k = a.solidData.fixedPoint ? Infinity : a.solidData.elementMass;
      h = c.solidData.fixedPoint ? Infinity : c.solidData.elementMass;
      n = a.solidData.fixed ? Infinity : a.getMomentOfInertia();
      var t = c.solidData.fixed ? Infinity : c.getMomentOfInertia(), m = a.solidData.coefficient * c.solidData.coefficient * 2 * (q.v - g.v + c.elementMoving.omega * s.z - a.elementMoving.omega * m.z) / (1 / h + 1 / k + s.z * s.z / t + m.z * m.z / n);
      a.elementMoving.movingSpeed.x += m / k * b.v.x;
      a.elementMoving.movingSpeed.y += m / k * b.v.y;
      c.elementMoving.movingSpeed.x -= m / h * b.v.x;
      c.elementMoving.movingSpeed.y -= m / h * b.v.y;
      a.elementMoving.omega += m * f / n;
      c.elementMoving.omega -= m * d / t;
    }, h = function() {
      return a.elements.filter(function(a) {
        return a.solidData;
      });
    };
    this.solveCollision = function(a) {
      var c = h(), d, b, l;
      d = a.getCenter();
      c = c.filter(function(b) {
        var c;
        if (b.elementId === a.elementId || !(b.elementMoving.movingSpeed.x || b.elementMoving.movingSpeed.y || a.elementMoving.movingSpeed.x || a.elementMoving.movingSpeed.y || b.elementScaleSpeed || a.elementScaleSpeed || a.elementMoving.omega || b.elementMoving.omega)) {
          return!1;
        }
        c = b.getCenter();
        return Math.sqrt((d.x - c.x) * (d.x - c.x) + (d.y - c.y) * (d.y - c.y)) > a.getRadius() + b.getRadius() ? !1 : !0;
      });
      if (0 == c.length) {
        return!0;
      }
      b = null;
      c.forEach(function(c) {
        b || (b = f(a, c)) && (l = c);
      });
      if (!b) {
        return!0;
      }
      g(a, l, b);
      a.elementEvents.dispatch("collision", {element:l, collisionPoint:b});
      l.elementEvents.dispatch("collision", {element:a, collisionPoint:b});
      return!1;
    };
  };
})();
(function() {
  CreJs.Creanvas.Controller = function(a) {
    var f, g, h, e, c, d, b, l;
    e = this;
    f = a.canvas;
    b = a.timeScale || 1;
    l = a.meterPerPoint || 1;
    a.realTime ? (d = Date.now(), this.getTime = function() {
      return(Date.now() - d) * b;
    }) : (c = 0, setInterval(function() {
      c += 10 * b;
    }, 10), this.getTime = function() {
      return c;
    });
    this.logMessage = function(b) {
      a.log && a.log(b);
    };
    DEBUG && this.logMessage("Starting controller");
    e.context = f.getContext("2d");
    e.context.setTransform(1, 0, 0, 1, 0, 0);
    e.context.scale(1 / l, 1 / l);
    g = !0;
    isDrawing = !1;
    h = a.refreshTime || 50;
    this.triggerPointedElementEvent = function(a, b) {
      var c = !1;
      e.elements.filter(function(b) {
        return b.canHandle(a);
      }).sort(function(a, b) {
        return b.elementZ || 0 - a.elementZ || 0;
      }).forEach(function(h) {
        !c && h.hit(b.x, b.y) && (h.elementEvents.dispatch(a, b), c = !0);
      });
    };
    this.triggerElementEventByIdentifier = function(a, b) {
      e.elements.forEach(function(c) {
        c.touchIdentifier == b.touchIdentifier && c.elementEvents.dispatch(a, b);
      });
    };
    this.registerCanvasPointerEvent = function(a, b) {
      f.addEventListener(a, function(c) {
        setTimeout(function() {
          var h = function(c, h) {
            DEBUG && e.logMessage("Canvas event " + a + " with touchIdentifier " + h);
            var d = e.getCanvasXYFromClientXY(c);
            d.touchIdentifier = h;
            e.triggerPointedElementEvent(b, d);
          };
          if (c.changedTouches) {
            for (var d = 0;d < c.changedTouches.length;d++) {
              h(c.changedTouches[d], c.changedTouches[d].identifier);
            }
          } else {
            h(c, -1);
          }
        });
      });
    };
    this.registerTouchIdentifierEvent = function(a, b) {
      f.addEventListener(a, function(c) {
        setTimeout(function() {
          var h = function(c, h) {
            DEBUG && e.logMessage("Canvas event " + a + " with touchIdentifier " + h);
            var d = e.getCanvasXYFromClientXY(c);
            d.touchIdentifier = h;
            e.triggerElementEventByIdentifier(b, d);
          };
          if (c.changedTouches) {
            for (var d = 0;d < c.changedTouches.length;d++) {
              h(c.changedTouches[d], c.changedTouches[d].identifier);
            }
          } else {
            h(c, -1);
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
      e.elementEvents.dispatch("deactivate");
      e.elements = [];
    };
    this.triggerRedraw = function() {
      g = !0;
    };
    this.getCanvasXYFromClientXY = function(a) {
      var b = f.getBoundingClientRect();
      e.logMessage("ClientXY: (" + a.clientX + "," + a.clientY + ")");
      b = {x:Math.round((a.clientX - b.left) * f.width / b.width * l), y:Math.round((a.clientY - b.top) * f.height / b.height * l)};
      e.logMessage("canvasXY: (" + b.x + "," + b.y + ")");
      "click" == a.type && e.logMessage("Click on ! canvasXY: (" + b.x + "," + b.y + ")");
      return b;
    };
    e.elements = [];
    this.add = function() {
      DEBUG && e.logMessage("Controller.addElement: Adding element - args:" + arguments.length);
      var a = [].slice.call(arguments), b = a.filter(function(a) {
        return a && "name" == a[0];
      })[0] || ["name", "Unknown"], c = a.filter(function(a) {
        return a && "image" == a[0];
      })[0], h = a.filter(function(a) {
        return a && "position" == a[0];
      })[0], b = new CreJs.Creanvas.Element(e, b, c, h), a = a.filter(function(a) {
        return a && "name" != a[0] && "position" != a[0] && "image" != a[0];
      });
      0 < a.length && CreJs.Creanvas.elementDecorators && (DEBUG && b.debug("New element", "apply " + a.length + " decorators"), b.applyElementDecorators.apply(b, a));
      e.elements.push(b);
      return b;
    };
    e.logMessage("Adding background");
    this.add(["name", "background"], ["image", {left:0, width:f.width, top:0, height:f.height, draw:a.drawBackground || function(b) {
      b.fillStyle = a.backgroundStyle || "#FFF";
      b.fillRect(0, 0, this.elementWidth, this.elementHeight);
    }}], ["position", {z:-Infinity}]);
    setInterval(function() {
      g && !isDrawing ? (isDrawing = !0, e.elements.sort(function(a, b) {
        return(a.elementZ || 0) - (b.elementZ || 0);
      }).forEach(function(a) {
        e.context.translate(a.elementX, a.elementY);
        e.context.rotate(a.elementAngle || 0);
        e.context.scale(a.elementScaleX || 1, a.elementScaleY || 1);
        e.context.drawImage(a.temporaryRenderingContext.canvas, 0, 0, a.elementWidth, a.elementHeight, a.left, a.top, a.elementWidth, a.elementHeight);
        e.context.scale(1 / (a.elementScaleX || 1), 1 / a.elementScaleY || 1);
        e.context.rotate(-(a.elementAngle || 0));
        e.context.translate(-a.elementX, -a.elementY);
      }), isDrawing = !1) : e.logMessage("No redraw");
    }, h);
    this.addElement = this.add;
    this.redraw = this.triggerRedraw;
    this.stop = this.stopController;
  };
  CreJs.Creanvas.Controller = CreJs.Creanvas.Controller;
})();
(function() {
  var a = function(a, e) {
    a.elementName = e;
    a.elementId = CreJs.CreHelpers.GetGuid();
  }, f = function(a, e) {
    var c = e.width, d = e.height;
    a.top = 0 == e.top ? 0 : e.top || -d / 2;
    a.left = 0 == e.left ? 0 : e.left || -c / 2;
    a.bottom = 0 == e.bottom ? 0 : e.bottom || a.top + d;
    a.right = 0 == e.right ? 0 : e.right || a.left + c;
    a.elementWidth = c || a.right - a.left;
    a.elementHeight = d || a.bottom - a.top;
    c = a.controller.context.canvas.ownerDocument.createElement("canvas");
    a.temporaryRenderingContext = c.getContext("2d");
    a.elementScaleX = e.scaleX || 1;
    a.elementScaleY = e.scaleY || 1;
    e.rawImage ? (a.elementImage = e.rawImage, a.temporaryRenderingContext.putImageData(a.elementImage, 0, 0)) : (d = e.draw, c.width = a.elementWidth, c.height = a.elementHeight, a.temporaryRenderingContext.beginPath(), a.temporaryRenderingContext.translate(-a.left, -a.top), d.call(a, a.temporaryRenderingContext), a.elementImage = a.temporaryRenderingContext.getImageData(0, 0, a.elementWidth, a.elementHeight));
  }, g = function(a, e) {
    a.elementX = e.x || 0;
    a.elementY = e.y || 0;
    a.elementZ = e.z || 0;
    a.elementAngle = e.angle || 0;
  };
  CreJs.Creanvas.Element = function(h, e, c, d) {
    var b = this;
    b.controller = h;
    var l = [], k = [];
    a(b, e[1]);
    f(b, c[1]);
    g(b, d[1]);
    k.push(e);
    k.push(c);
    k.push(d);
    DEBUG && (b.debug = function(a, c) {
      b.controller.logMessage("Element." + a + ": " + c + ". Element: " + b.elementName + "/" + b.elementId);
    });
    b.elementEvents = new CreJs.Creevents.EventContainer;
    b.isPointInPath = function(a) {
      a = b.controller.getCanvasXYFromClientXY(a);
      return b.controller.noDrawContext.isPointInPath(b, draw, a);
    };
    b.hit = function(a, c) {
      var d = Math.round(a - b.elementX - b.left), e = Math.round(c - b.elementY - b.top), d = 0 <= d && d <= b.elementWidth && 0 <= e && e <= b.elementHeight && 0 < b.elementImage.data[4 * e * b.elementWidth + 4 * d + 3];
      DEBUG && b.debug("hit", d ? "hit" : "no hit");
      return d;
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
    b.getCanvasXY = function(a, c) {
      return{x:Math.round(b.elementX + a * b.elementScaleX * Math.cos(b.elementAngle) - c * b.elementScaleY * Math.sin(b.elementAngle)), y:Math.round(b.elementY + a * b.elementScaleX * Math.sin(b.elementAngle) + c * b.elementScaleY * Math.cos(b.elementAngle))};
    };
    b.getCanvasXYNoRounding = function(a, c) {
      return{x:b.elementX + a * b.elementScaleX * Math.cos(b.elementAngle) - c * b.elementScaleY * Math.sin(b.elementAngle), y:b.elementY + a * b.elementScaleX * Math.sin(b.elementAngle) + c * b.elementScaleY * Math.cos(b.elementAngle)};
    };
    b.getElementXY = function(a, c) {
      return{x:Math.round(((a - b.elementX) * Math.cos(b.elementAngle) + (c - b.elementY) * Math.sin(b.elementAngle)) / b.elementScaleX), y:Math.round(((c - b.elementY) * Math.cos(b.elementAngle) - (a - b.elementX) * Math.sin(b.elementAngle)) / b.elementScaleY)};
    };
    b.getCenter = function() {
      return b.getCanvasXY(b.left + b.elementWidth / 2, b.top + b.elementHeight / 2);
    };
    var p = [];
    p.push({x:b.left, y:b.top});
    p.push({x:b.right, y:b.top});
    p.push({x:b.right, y:b.bottom});
    p.push({x:b.left, y:b.bottom});
    b.getClientCornersCache = function() {
      return p.map(function(a) {
        return b.getCanvasXY(a.x, a.y);
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
    b.removeDecorator = b.removeElementDecorator;
  };
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.clickable = {applyTo:function(a, f) {
    var g = f.onclick;
    a.onClick = function(f) {
      DEBUG && a.debug("onClick", g);
      g.call(a, f);
      a.triggerRedraw();
    };
    a.elementEvents.addEventListenerX({eventId:"click", handleEvent:a.onClick});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.customTimer = {applyTo:function(a, f) {
    setInterval(function() {
      f.action.call(a);
    }, f.time);
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.droppable = {applyTo:function(a, f) {
    var g = f.dropZone;
    a.isDroppable = !0;
    a.elementDropZone = g;
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
  CreJs.Creanvas.elementDecorators.dropzone = {applyTo:function(a, f) {
    var g = f.availableSpots, h = f.dropX, e = f.dropY;
    a.droppedElementsList = [];
    a.elementEvents.addEventListenerX({eventGroupType:"dropzone", eventId:"drop", handleEvent:function(c) {
      0 >= g || (DEBUG && a.controller.logMessage("drop event on dropzone " + a.elementId + ", dropped " + c.droppedElement.id), g--, c.droppedElement.x = h || a.elementX, c.droppedElement.y = e || a.elementY, c.droppedElement.dropZone = a, a.droppedElementsList.push(c.droppedElement), c.droppedElement.elementEvents.dispatch("dropped", {dropZone:a, droppedElement:c.droppedElement}), a.elementEvents.dispatch("droppedIn", {dropZone:a, droppedElement:c.droppedElement}), a.triggerRedraw());
    }, listenerId:a.elementId});
    a.drag = function(c) {
      DEBUG && a.controller.logMessage("dragging from dropzone " + a.elementId + ", dragged " + c.id);
      c.dropZone = null;
      g++;
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
  CreJs.Creanvas.elementDecorators.duplicable = {applyTo:function(a, f) {
    var g = f.isBlocked, h = f.generatorCount || Infinity;
    DEBUG && a.debug("duplicable.applyTo", "generatorCount is " + h);
    var e = !1;
    a.elementEvents.addEventListenerX({eventGroupType:"duplicable", eventId:"pointerDown", handleEvent:function(c) {
      0 <= c.touchIdentifier && (e = !0);
      if (!(e && 0 > c.touchIdentifier || g && g() || (DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount was: " + h), 0 >= h))) {
        h--;
        DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount is now: " + h);
        var d = a.cloneElement(["duplicable"]);
        d.elementName += " (duplicate)";
        d.applyElementDecorator("movable", {isBlocked:g});
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
  CreJs.Creanvas.elementDecorators.movable = {applyTo:function(a, f) {
    var g = !1, h = this.touchIdentifier = null, e = f.isBlocked;
    a.startMoving = function(c) {
      DEBUG && a.controller.logMessage("Starting moving - identifier: " + c.touchIdentifier);
      g = !0;
      a.touchIdentifier = c.touchIdentifier;
      h = {x:c.x, y:c.y};
      a.dropZone && (a.dropZone.drag(a), a.dropZone = null);
    };
    a.moveCompleted = function(c) {
      DEBUG && a.controller.logMessage("Completed move - identifier: " + c.touchIdentifier);
      g = !1;
      h = null;
      a.isDroppable && (DEBUG && a.controller.logMessage("Trigger drop - identifier: " + c.touchIdentifier), a.controller.triggerPointedElementEvent("drop", {x:c.x, y:c.y, droppedElement:a}));
    };
    a.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerDown", handleEvent:function(c) {
      e && e() || a.startMoving(c);
    }, listenerId:a.elementId});
    var c = !1;
    a.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerMove", handleEvent:function(d) {
      !g || e && e() || (c || (c = !0, DEBUG && a.controller.logMessage("pointereMove event on movable " + a.elementId + " (" + a.touchIdentifier + ")")), a.elementX += d.x - h.x, a.elementY += d.y - h.y, h = {x:d.x, y:d.y}, a.triggerRedraw());
    }, listenerId:a.elementId});
    a.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerUp", handleEvent:function(d) {
      !g || e && e() || (DEBUG && a.controller.logMessage("End detected for touch " + a.touchIdentifier), a.controller.getCanvasXYFromClientXY(d), a.elementX += d.x - h.x, a.elementY += d.y - h.y, a.moveCompleted(d), a.touchIdentifier = null, c = !1, a.triggerRedraw());
    }, listenerId:a.elementId});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.moving = {type:"moving", applyTo:function(a, f) {
    var g, h, e, c, d, b = f.vx, l = f.vy, k = f.ax, p = f.ay, q = f.rotationSpeed;
    DEBUG && a.controller.logMessage("Applying moving decorator to " + a.elementName + "-" + a.elementId);
    var r, n, m;
    a.elementMoving = a.elementMoving || {};
    a.elementMoving.movingSpeed = new CreJs.Core.Vector(b || 0, l || 0);
    a.elementMoving.movingAcceleration = new CreJs.Core.Vector(k || 0, p || 0);
    a.elementMoving.omega = q || 0;
    r = a.controller.getTime();
    setInterval(function() {
      n = a.controller.getTime();
      m = n - r;
      if (!(1 > m) && (r = n, a.elementMoving.movingSpeed.x += a.elementMoving.movingAcceleration.x * m, a.elementMoving.movingSpeed.y += a.elementMoving.movingAcceleration.y * m, 0 != a.elementMoving.movingSpeed.x || 0 != a.elementMoving.movingSpeed.y || 0 != a.elementMoving.omega || a.elementScaleSpeed && (0 != a.elementScaleSpeed.x || 0 != a.elementScaleSpeed.y))) {
        g = a.elementX;
        h = a.elementY;
        e = a.elementAngle;
        c = a.elementScaleX;
        d = a.elementScaleY;
        a.elementX += a.elementMoving.movingSpeed.x * m;
        a.elementY += a.elementMoving.movingSpeed.y * m;
        a.elementAngle += a.elementMoving.omega * m;
        a.elementScaleSpeed && (a.elementScaleX += a.elementScaleSpeed.x * m, a.elementScaleY += a.elementScaleSpeed.y * m);
        var b = !0;
        a.preMove && a.preMove.forEach(function(c) {
          b && (c.call(a) || (b = !1));
        });
        b || (a.elementX = g, a.elementY = h, a.elementAngle = e, a.elementScaleX = c, a.elementScaleY = d);
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
  CreJs.Creanvas.elementDecorators.solid = {applyTo:function(a, f) {
    var g = [];
    a.solidData = {};
    a.solidData.elementMass = f.mass || 1;
    var h = f.onCollision, e = f.coefficient;
    a.solidData.fixed = f.fixed || !1;
    a.solidData.fixedPoint = a.solidData.fixed || f.fixedPoint || !1;
    a.controller.collisionSolver = a.controller.collisionSolver || new CreJs.Creanvas.CollisionSolver(a.controller);
    a.solidData.coefficient = e || 0 === e ? e : 1;
    a.elementMoving = a.elementMoving || {movingSpeed:new CreJs.Core.Vector(0, 0), movingAcceleration:new CreJs.Core.Vector(0, 0), omega:0};
    a.elementEvents.addEventListenerX({eventId:"collision", handleEvent:function(b) {
      h && h.call(a, b);
    }});
    a.preMove = this.preMove || [];
    a.preMove.push(function() {
      return a.controller.collisionSolver.solveCollision(a);
    });
    a.getMomentOfInertia = function() {
      return a.solidData.elementMass / 12 * (a.elementWidth * a.elementScaleX * a.elementWidth * a.elementScaleX + a.elementHeight * a.elementScaleY * a.elementHeight * a.elementScaleY);
    };
    a.geRadiusCache = function() {
      return Math.sqrt(a.elementWidth * a.elementWidth * a.elementScaleX * a.elementScaleX + a.elementHeight * a.elementHeight * a.elementScaleY * a.elementScaleY) / 2;
    };
    a.getRadius = function() {
      var b = a.elementWidth + "" + a.elementHeight + "" + a.elementScaleX + "" + a.elementScaleY;
      if (g.getRadius && g.getRadius.key == b) {
        return g.getRadius.value_;
      }
      var c = a.geRadiusCache();
      g.geRadius = {kevectorY:b, value_:c};
      return c;
    };
    var c = a.controller.context.canvas, e = c.ownerDocument.createElement("canvas"), c = c.ownerDocument.createElement("canvas");
    e.width = c.width = a.elementWidth;
    e.height = c.height = a.elementHeight;
    a.collidedContext = c.getContext("2d");
    a.collidedContext.putImageData(a.elementImage, 0, 0);
    a.collidedContext.globalCompositeOperation = "source-atop";
    a.collidedContext.fillStyle = "#000";
    a.collidedContext.fillRect(0, 0, a.elementWidth, a.elementHeight);
    a.collisionContext = e.getContext("2d");
    a.collisionContext.globalCompositeOperation = "source-over";
    a.collisionContext.drawImage(a.collidedContext.canvas, 0, 0);
    e = a.collisionContext.getImageData(0, 0, a.elementWidth, a.elementHeight);
    c = a.collisionContext.createImageData(a.elementWidth, a.elementHeight);
    a.edges = [];
    for (var d = 0;d < a.elementWidth;d++) {
      for (var b = 0;b < a.elementHeight;b++) {
        if (!(200 > e.data[b * a.elementWidth * 4 + 4 * d + 3])) {
          for (var l = !1, k = -1;2 > k;k++) {
            for (var p = -1;2 > p;p++) {
              if (0 > b + k || 0 > d + p || b + k > a.elementHeight - 1 || d + k > a.elementWidth - 1 || 100 > e.data[(b + k) * a.elementWidth * 4 + 4 * (d + p) + 3]) {
                l = !0, p = k = 2;
              }
            }
          }
          a.collisionContext.putImageData(c, 0, 0);
          l && (a.edges.push({x:d, y:b}), c.data[b * a.elementWidth * 4 + 4 * d] = 0, c.data[b * a.elementWidth * 4 + 4 * d + 1] = 0, c.data[b * a.elementWidth * 4 + 4 * d + 2] = 0, c.data[b * a.elementWidth * 4 + 4 * d + 3] = 255);
        }
      }
    }
    a.collisionContext.putImageData(c, 0, 0);
    a.collisionContext.translate(-a.left, -a.top);
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
  var a = CreJs.Creevents = CreJs.Creevents || {}, f;
  a.Event = function(a) {
    this.eventId = a;
    f = CreJs.CreHelpers;
    var h = [], e = new CreJs.Crelog.Logger;
    this.dispatch = function(c, d) {
      var b = f.GetGuid(), l = h.length;
      DEBUG && c && "pointerMove" != c.eventId && "drag" != c.eventId && "drop" != c.eventId && e.logMessage("Dispatching " + l + " " + c.eventId + ". (" + b + ")");
      h.forEach(function(f) {
        f.debugEvent = a;
        setTimeout(function() {
          DEBUG && c && "pointerMove" != c.eventId && e.logMessage("Actually handling " + c.eventId + ". (" + b + ")");
          f.handleEvent(c);
          l--;
          0 == l && d && d();
        });
      });
    };
    this.addEventListenerX = function(a) {
      a.handleEvent = a.handleEvent || a.handleEvent;
      a.rank = a.rank || a.rank;
      a.listenerId = a.listenerId || a.listenerId;
      a.eventGroupType = a.eventGroupType || a.eventGroupType;
      var d = f.GetGuid();
      h.push({handlerGuid:d, handleEvent:a.handleEvent, rank:a.rank, listenerId:a.listenerId, eventGroupType:a.eventGroupType});
      h = h.sort(function(a, c) {
        return(a.rank || Infinity) - (c.rank || Infinity);
      });
      return d;
    };
    this.removeEventListener = function(a) {
      h = h.filter(function(d) {
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
    var f = this, g = {}, h = [];
    this.hasEvent = function(a) {
      return void 0 != g[a];
    };
    var e = function(c) {
      h.push(c);
      g[c] = new a.Event(c);
    };
    this.addEventListenerX = function(a) {
      var d = a.eventId || a.eventId;
      g[d] || e(d);
      return g[d].addEventListenerX(a);
    };
    this.dispatch = function(a, d, b) {
      g[a] && (d && (d.eventId = a), g[a].dispatch(d, b));
    };
    this.removeEventListener = function(a) {
      g[a.eventId] ? g[a.eventId].removeEventListener(a) : h.forEach(function(d) {
        g[d].removeEventListener(a);
      });
    };
    this.registerControlEvent = function(a, d, b) {
      g[b] || e(b);
      a.addEventListenerX(d, function(a) {
        a.preventDefault();
        setTimeout(function() {
          f.dispatch(b, a);
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
    var f = Date.now().toString(16), f = a.repeatString("x", 15 - f.length) + f;
    return("xxxxxxxx-xxxx-4xxx-y" + f.slice(0, 3) + "-" + f.slice(3)).replace(/[xy]/g, function(a) {
      var f = 16 * Math.random() | 0;
      return("x" == a ? f : f & 3 | 8).toString(16);
    });
  };
  a.repeatString = function(f, g) {
    return 0 >= g ? "" : f + a.repeatString(f, g - 1);
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

