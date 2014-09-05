var TEST = !0, DEBUG = !1, CreJs = CreJs || {};
CreJs.Creanvas = CreJs.Creanvas || {};
window.CreJs = CreJs;
CreJs.Creanvas = CreJs.Creanvas;
TEST && (CreJs.Test = CreJs.Test || {}, CreJs.Test = CreJs.Test);
(function() {
  var a = CreJs.Core = CreJs.Core || {};
  a.Vector = function(g, e, h) {
    var f = this;
    this.vectorX = g;
    this.vectorY = e;
    this.vectorZ = h || 0;
    this.draw = function(a, d, b, g) {
      a.lineWidth = 5;
      a.strokeStyle = g;
      a.beginPath();
      a.moveTo(d, b);
      a.lineTo(d + 100 * f.vectorX, b + 100 * f.vectorY);
      a.stroke();
      a.lineWidth = 1;
      a.strokeStyle = "#000";
    };
    this.getCoordinates = function(c) {
      return{u:a.scalarProduct(f, c.u), v:a.scalarProduct(f, c.v), w:a.scalarProduct(f, c.w)};
    };
    this.setCoordinates = function(a, d, b, g) {
      g = g || 0;
      f.vectorX = d * a.u.vectorX + b * a.v.vectorX + g * a.w.vectorX;
      f.vectorY = d * a.u.vectorY + b * a.v.vectorY + g * a.w.vectorY;
      f.vectorZ = d * a.u.vectorZ + b * a.v.vectorZ + g * a.w.vectorZ;
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
  a.getUnitVectors = function(g, e, h, f) {
    g = h - g;
    e = f - e;
    f = Math.sqrt(g * g + e * e);
    return{u:new a.Vector(g / f, e / f, 0), v:new a.Vector(-e / f, g / f, 0), w:new a.Vector(0, 0, 0)};
  };
  a.drawUnitVectors = function(a, e, h, f, c) {
    a.lineWidth = 5;
    a.strokeStyle = c;
    a.beginPath();
    a.moveTo(e, h);
    a.lineTo(e + 100 * f.u.vectorX, h + 100 * f.u.vectorY);
    a.moveTo(e, h);
    a.lineTo(e + 50 * f.v.vectorX, h + 50 * f.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.drawCoordinateVector = function(a, e, h, f, c, d, b) {
    a.lineWidth = 5;
    a.strokeStyle = b;
    a.beginPath();
    a.moveTo(e, h);
    a.lineTo(e + 100 * c * f.u.vectorX, h + 100 * c * f.u.vectorY);
    a.lineTo(e + 100 * c * f.u.vectorX + 100 * d * f.v.vectorX, h + 100 * c * f.u.vectorY + 100 * d * f.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.scalarProduct = function(a, e) {
    return a.vectorX * e.vectorX + a.vectorY * e.vectorY;
  };
  a.vectorProduct = function(g, e) {
    return new a.Vector(g.vectorY * e.vectorZ - g.vectorZ * e.vectorY, g.vectorZ * e.vectorX - g.vectorX * e.vectorZ, g.vectorX * e.vectorY - g.vectorY * e.vectorX);
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
    var g = function(a, c) {
      var d, b, e, k, l, g, h;
      k = a.getClientRect();
      l = c.getClientRect();
      d = Math.max(k.left, l.left) - 1;
      b = Math.min(k.right, l.right) + 1;
      e = Math.max(k.top, l.top) - 1;
      k = Math.min(k.bottom, l.bottom) + 1;
      if (!(0 >= b - d || 0 >= k - e)) {
        d = a.collisionContext.getImageData(0, 0, a.elementWidth, a.elementHeight);
        a.collisionContext.scale(1 / (a.elementScaleX || 1), 1 / (a.elementScaleY || 1));
        a.collisionContext.rotate(-(a.elementAngle || 0));
        a.collisionContext.translate(c.elementX - a.elementX, c.elementY - a.elementY);
        a.collisionContext.rotate(c.elementAngle || 0);
        a.collisionContext.scale(c.elementScaleX || 1, c.elementScaleY || 1);
        a.collisionContext.globalCompositeOperation = "destination-out";
        a.collisionContext.drawImage(c.collidedContext.canvas, 0, 0, c.elementWidth, c.elementHeight, -c.dx, -c.dy, c.elementWidth, c.elementHeight);
        a.collisionContext.scale(1 / (c.elementScaleX || 1), 1 / (c.elementScaleY || 1));
        a.collisionContext.rotate(-c.elementAngle || 0);
        a.collisionContext.translate(-c.elementX + a.elementX, -c.elementY + a.elementY);
        a.collisionContext.rotate(a.elementAngle || 0);
        a.collisionContext.scale(a.elementScaleX || 1, a.elementScaleY || 1);
        g = a.collisionContext.getImageData(0, 0, a.elementWidth, a.elementHeight);
        a.collisionContext.globalCompositeOperation = "source-over";
        a.collisionContext.putImageData(d, 0, 0);
        h = [];
        a.edges.forEach(function(b) {
          90 > g.data[b.y * a.elementWidth * 4 + 4 * b.x + 3] && h.push(b);
        });
        if (2 > h.length) {
          return null;
        }
        var n;
        e = b = 0;
        d = h.length - 1;
        for (k = 1;k < h.length;k++) {
          for (l = k + 1;l < h.length;l++) {
            n = h[k].x - h[l].x;
            var p = h[k].y - h[l].y;
            n = Math.sqrt(n * n + p * p);
            n > b && (b = n, e = k, d = l);
          }
        }
        b = a.getCanvasXY(h[e].x - a.dx, h[e].y - a.dy);
        d = a.getCanvasXY(h[d].x - a.dx, h[d].y - a.dy);
        return b.x == d.x && b.y == d.y ? null : {x:Math.round((b.x + d.x) / 2), y:Math.round((b.y + d.y) / 2), vectors:CreJs.Core.getUnitVectors(b.x, b.y, d.x, d.y)};
      }
    }, e = function(a, c, d) {
      var b, e, k, l, g, h;
      b = d.vectors;
      l = new CreJs.Core.Vector(d.x - a.elementX, d.y - a.elementY);
      g = CreJs.Core.vectorProduct(l, b.v).z;
      h = new CreJs.Core.Vector(d.x - c.elementX, d.y - c.elementY);
      d = CreJs.Core.vectorProduct(h, b.v).z;
      var n = CreJs.Core.vectorProduct(l, b.v), p = CreJs.Core.vectorProduct(h, b.v);
      e = new CreJs.Core.Vector(a.elementMoving.movingSpeed.x, a.elementMoving.movingSpeed.y);
      k = new CreJs.Core.Vector(c.elementMoving.movingSpeed.x, c.elementMoving.movingSpeed.y);
      a.elementScaleSpeed && (e.x += l.x * a.elementScaleSpeed.x, e.y += l.y * a.elementScaleSpeed.y);
      c.elementScaleSpeed && (k.x += h.x * c.elementScaleSpeed.x, k.y += h.y * c.elementScaleSpeed.y);
      l = e.getCoordinates(b);
      k = k.getCoordinates(b);
      n = a.collidable.coefficient * c.collidable.coefficient * 2 * (k.v - l.v + c.elementMoving.omega * p.z - a.elementMoving.omega * n.z) / (1 / c.elementMass + 1 / a.elementMass + p.z * p.z / c.getMomentOfInertia() + n.z * n.z / a.getMomentOfInertia());
      a.elementMoving.movingSpeed.x += n / a.elementMass * b.v.x;
      a.elementMoving.movingSpeed.y += n / a.elementMass * b.v.y;
      c.elementMoving.movingSpeed.x -= n / c.elementMass * b.v.x;
      c.elementMoving.movingSpeed.y -= n / c.elementMass * b.v.y;
      a.elementMoving.omega += n * g / a.getMomentOfInertia();
      c.elementMoving.omega -= n * d / c.getMomentOfInertia();
    }, h = function() {
      return a.elements.filter(function(a) {
        return a.collidable;
      });
    };
    this.solveCollision = function(a) {
      var c = h(), d, b, m;
      d = a.getCenter();
      c = c.filter(function(b) {
        var c;
        if (b.elementId === a.elementId || !(b.elementMoving.movingSpeed.x || b.elementMoving.movingSpeed.y || a.elementMoving.movingSpeed.x || a.elementMoving.movingSpeed.y || b.elementScaleSpeed || a.elementScaleSpeed)) {
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
        b || (b = g(a, c)) && (m = c);
      });
      if (!b) {
        return!0;
      }
      e(a, m, b);
      a.elementEvents.dispatch("collision", {element:m, collisionPoint:b});
      m.elementEvents.dispatch("collision", {element:a, collisionPoint:b});
      return!1;
    };
  };
})();
(function() {
  CreJs.Creanvas.Controller = function(a) {
    var g, e, h, f, c, d, b, m;
    f = this;
    g = a.canvas;
    b = a.timeScale || 1;
    m = a.meterPerPoint || 1;
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
    f.context = g.getContext("2d");
    f.context.setTransform(1, 0, 0, 1, 0, 0);
    f.context.scale(1 / m, 1 / m);
    e = !0;
    isDrawing = !1;
    h = a.refreshTime || 50;
    this.triggerPointedElementEvent = function(a, b) {
      var c = !1;
      f.elements.filter(function(b) {
        return b.canHandle(a);
      }).sort(function(a, b) {
        return b.elementZ || 0 - a.elementZ || 0;
      }).forEach(function(d) {
        !c && d.hit(b.x, b.y) && (d.elementEvents.dispatch(a, b), c = !0);
      });
    };
    this.triggerElementEventByIdentifier = function(a, b) {
      f.elements.forEach(function(c) {
        c.touchIdentifier == b.touchIdentifier && c.elementEvents.dispatch(a, b);
      });
    };
    this.registerCanvasPointerEvent = function(a, b) {
      g.addEventListener(a, function(c) {
        setTimeout(function() {
          var d = function(c, d) {
            DEBUG && f.logMessage("Canvas event " + a + " with touchIdentifier " + d);
            var e = f.getCanvasXYFromClientXY(c);
            e.touchIdentifier = d;
            f.triggerPointedElementEvent(b, e);
          };
          if (c.changedTouches) {
            for (var e = 0;e < c.changedTouches.length;e++) {
              d(c.changedTouches[e], c.changedTouches[e].identifier);
            }
          } else {
            d(c, -1);
          }
        });
      });
    };
    this.registerTouchIdentifierEvent = function(a, b) {
      g.addEventListener(a, function(c) {
        setTimeout(function() {
          var d = function(c, d) {
            DEBUG && f.logMessage("Canvas event " + a + " with touchIdentifier " + d);
            var e = f.getCanvasXYFromClientXY(c);
            e.touchIdentifier = d;
            f.triggerElementEventByIdentifier(b, e);
          };
          if (c.changedTouches) {
            for (var e = 0;e < c.changedTouches.length;e++) {
              d(c.changedTouches[e], c.changedTouches[e].identifier);
            }
          } else {
            d(c, -1);
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
      f.elementEvents.dispatch("deactivate");
      f.elements = [];
    };
    this.triggerRedraw = function() {
      e = !0;
    };
    this.getCanvasXYFromClientXY = function(a) {
      var b = g.getBoundingClientRect();
      f.logMessage("ClientXY: (" + a.clientX + "," + a.clientY + ")");
      b = {x:Math.round((a.clientX - b.left) * g.width / b.width * m), y:Math.round((a.clientY - b.top) * g.height / b.height * m)};
      f.logMessage("canvasXY: (" + b.x + "," + b.y + ")");
      "click" == a.type && f.logMessage("Click on ! canvasXY: (" + b.x + "," + b.y + ")");
      return b;
    };
    f.elements = [];
    this.add = function() {
      DEBUG && f.logMessage("Controller.addElement: Adding element - args:" + arguments.length);
      var a = [].slice.call(arguments), b = new CreJs.Creanvas.Element(f, a[0]);
      DEBUG && f.logMessage("Controller.addElement: Created element: " + b.elementName + "-" + b.elementId);
      1 < a.length ? (DEBUG && f.logMessage("Controller.addElement: Applying " + (a.length - 1) + " decorators"), b.applyElementDecorators.apply(b, a.slice(1))) : DEBUG && f.logMessage("Controller.addElement: No decorator to apply");
      f.elements.push(b);
      return b;
    };
    f.logMessage("Adding background");
    this.add({elementName:"background", elementImage:{imageWidth:g.width, imageHeight:g.height, imageTranslate:{translateDx:0, translateDy:0}, imageDraw:a.drawBackground || function(b) {
      b.fillStyle = a.backgroundStyle || "#FFF";
      b.fillRect(0, 0, g.width, g.height);
    }}, elementPosition:{positionZ:-Infinity}});
    setInterval(function() {
      e && !isDrawing ? (isDrawing = !0, f.elements.sort(function(a, b) {
        return(a.elementZ || 0) - (b.elementZ || 0);
      }).forEach(function(a) {
        f.context.translate(a.elementX, a.elementY);
        f.context.rotate(a.elementAngle || 0);
        f.context.scale(a.elementScaleX || 1, a.elementScaleY || 1);
        f.context.drawImage(a.temporaryRenderingContext.canvas, 0, 0, a.elementWidth, a.elementHeight, -a.dx, -a.dy, a.elementWidth, a.elementHeight);
        f.context.scale(1 / (a.elementScaleX || 1), 1 / a.elementScaleY || 1);
        f.context.rotate(-(a.elementAngle || 0));
        f.context.translate(-a.elementX, -a.elementY);
      }), isDrawing = !1) : f.logMessage("No redraw");
    }, h);
    this.addElement = function() {
      var a = [].slice.call(arguments), b = a[0];
      a[0] = {elementName:b.name, elementImage:b.image ? {imageWidth:b.image.width, imageHeight:b.image.height, imageDraw:b.image.draw, imageTranslate:b.image.translate ? {translateDx:b.image.translate.dx, translateDy:b.image.translate.dy} : null} : null, elementPosition:b.position ? {positionX:b.position.x || 0, positionY:b.position.y || 0, positionZ:b.position.z || 0} : null};
      return this.add.apply(this, a);
    };
    this.redraw = this.triggerRedraw;
    this.stop = this.stopController;
  };
  CreJs.Creanvas.Controller = CreJs.Creanvas.Controller;
})();
(function() {
  CreJs.Creanvas.Element = function(a, g) {
    this.elementName = g.elementName;
    var e = g.elementImage, h = e.imageDraw, f = g.elementPosition, c = [].slice.apply(arguments).slice(2), d = [];
    this.controller = a;
    this.elementId = CreJs.CreHelpers.GetGuid();
    this.elementWidth = e.imageWidth;
    this.elementHeight = e.imageHeight;
    this.elementX = f.positionX || 0;
    this.elementY = f.positionY || 0;
    this.elementZ = f.positionZ || 0;
    this.elementAngle = f.positionAngle || 0;
    this.elementScaleX = e.imageScaleX || 1;
    this.elementScaleY = e.imageScaleY || 1;
    this.elementMass = 1;
    f = e.imageTranslate || {translateDx:e.imageWidth / 2, translateDy:e.imageHeight / 2};
    this.dx = f.translateDx;
    this.dy = f.translateDy;
    e.rawImage ? (this.elementImage = e.rawImage, f = this.controller.context.canvas, f = f.ownerDocument.createElement("canvas"), this.temporaryRenderingContext = f.getContext("2d"), this.temporaryRenderingContext.putImageData(this.elementImage, 0, 0)) : (f = this.controller.context.canvas, f = f.ownerDocument.createElement("canvas"), f.width = e.imageWidth, f.height = e.imageHeight, this.temporaryRenderingContext = f.getContext("2d"), this.temporaryRenderingContext.beginPath(), this.temporaryRenderingContext.translate(this.dx, 
    this.dy), h(this.temporaryRenderingContext), this.elementImage = this.temporaryRenderingContext.getImageData(0, 0, e.imageWidth, e.imageHeight));
    var b = this;
    DEBUG && (b.debug = function(a, c) {
      b.controller.logMessage("Element." + a + ": " + c + ". Element: " + b.elementName + "/" + b.elementId);
    });
    this.elementEvents = new CreJs.Creevents.EventContainer;
    this.isPointInPath = function(a) {
      a = b.controller.getCanvasXYFromClientXY(a);
      return b.controller.noDrawContext.isPointInPath(b, h, a);
    };
    0 < c.length && CreJs.Creanvas.elementDecorators && (DEBUG && a.logMessage("New element " + elementName + " : apply " + c.length + " decorators"), b.applyElementDecorators(c));
    this.hit = function(a, c) {
      var d = Math.round(a - b.elementX + b.dx), e = Math.round(c - b.elementY + b.dy), d = 0 <= d && d <= b.elementWidth && 0 <= e && e <= b.elementHeight && 0 < b.elementImage.data[4 * e * b.elementWidth + 4 * d + 3];
      DEBUG && b.debug("hit", d ? "hit" : "no hit");
      return d;
    };
    this.cloneElement = function(a) {
      e.image = b.elementImage;
      DEBUG && b.debug("cloneElement", "start cloning");
      var d = b.controller.add(g), f = a ? c.filter(function(b) {
        return a.every(function(a) {
          return a != b[0];
        });
      }) : c;
      DEBUG && b.debug("cloneElement", "apply " + f.length + " decorators");
      d.applyElementDecorators.apply(d, f);
      return d;
    };
    this.removeElementDecorator = function(a) {
      DEBUG && b.debug("removeElementDecorator", a);
      var c = CreJs.Creanvas.elementDecorators[a];
      c && c.removeFrom ? c.removeFrom(b) : DEBUG && b.debug("removeElementDecorator", "Cannot remove: " + a);
    };
    this.canHandle = function(a) {
      return "click" == a || "pointerDown" == a || b.elementEvents.hasEvent(a);
    };
    this.deactivate = function() {
      b.controller.elementEvents.removeEventListener({listenerId:b.elementId});
      b.temporaryRenderingContext = null;
    };
    b.controller.elementEvents.addEventListenerX({eventId:"deactivate", listenerId:b.elementId, handleEvent:function(a) {
      b.deactivate();
    }});
    this.triggerRedraw = function() {
      b.controller.triggerRedraw();
    };
    this.getCanvasXY = function(a, c) {
      return{x:Math.round(b.elementX + a * b.elementScaleX * Math.cos(b.elementAngle) - c * b.elementScaleY * Math.sin(b.elementAngle)), y:Math.round(b.elementY + a * b.elementScaleX * Math.sin(b.elementAngle) + c * b.elementScaleY * Math.cos(b.elementAngle))};
    };
    this.getCanvasXYNoRounding = function(a, c) {
      return{x:b.elementX + a * b.elementScaleX * Math.cos(b.elementAngle) - c * b.elementScaleY * Math.sin(b.elementAngle), y:b.elementY + a * b.elementScaleX * Math.sin(b.elementAngle) + c * b.elementScaleY * Math.cos(b.elementAngle)};
    };
    this.getElementXY = function(a, c) {
      return{x:Math.round(((a - b.elementX) * Math.cos(b.elementAngle) + (c - b.elementY) * Math.sin(b.elementAngle)) / b.elementScaleX), y:Math.round(((c - b.elementY) * Math.cos(b.elementAngle) - (a - b.elementX) * Math.sin(b.elementAngle)) / b.elementScaleY)};
    };
    this.getCenter = function() {
      return b.getCanvasXY(-b.dx + b.elementWidth / 2, -b.dy + b.elementHeight / 2);
    };
    var m = [];
    m.push({x:-b.dx, y:-b.dy});
    m.push({x:-b.dx + b.elementWidth, y:-b.dy});
    m.push({x:-b.dx + b.elementWidth, y:-b.dy + b.elementHeight});
    m.push({x:-b.dx, y:-b.dy + b.elementHeight});
    this.getClientCornersCache = function() {
      return m.map(function(a) {
        return b.getCanvasXY(a.x, a.y);
      });
    };
    this.getClientCorners = function() {
      var a = b.elementX + "" + b.elementY + "" + b.elementAngle + "" + b.elementScaleX + "" + b.elementScaleX;
      if (d.getClientCorners && d.getClientCorners.key == a) {
        return d.getClientCorners.value;
      }
      var c = b.getClientCornersCache();
      d.getClientCorners = {key:a, value:c};
      return c;
    };
    this.getClientRectCache = function() {
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
    this.getClientRect = function() {
      var a = b.elementX + "" + b.elementY + "" + b.elementAngle + "" + b.elementScaleX + "" + b.elementScaleX;
      if (d.getClientRect && d.getClientRect.key == a) {
        return d.getClientRect.value;
      }
      var c = b.getClientRectCache();
      d.getClientRect = {key:a, value:c};
      return c;
    };
    this.applyElementDecorators = function() {
      var a = this, b = [].slice.apply(arguments);
      c = c.concat(b);
      b.forEach(function(b) {
        a.applyElementDecorator(b[0], b[1]);
      });
    };
    this.applyElementDecorator = function(a, b) {
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
    Object.defineProperty(b, "mass", {get:function() {
      return this.elementMass;
    }, set:function(a) {
      this.elementMass = a;
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
  CreJs.Creanvas.elementDecorators.clickable = {applyTo:function(a, g) {
    var e = g.onclick;
    a.onClick = function(g) {
      DEBUG && a.debug("onClick", e);
      e.call(a, g);
      a.triggerRedraw();
    };
    a.elementEvents.addEventListenerX({eventId:"click", handleEvent:a.onClick});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.collidable = {applyTo:function(a, g) {
    var e = [];
    a.collidable = {};
    var h = g.onCollision, f = g.coefficient;
    a.controller.collisionSolver = a.controller.collisionSolver || new CreJs.Creanvas.CollisionSolver(a.controller);
    a.collidable.coefficient = f || 0 === f ? f : 1;
    a.elementMoving = a.elementMoving || {movingSpeed:new CreJs.Core.Vector(0, 0), movingAcceleration:new CreJs.Core.Vector(0, 0), omega:0};
    a.elementEvents.addEventListenerX({eventId:"collision", handleEvent:function(b) {
      h && h.call(a, b);
    }});
    a.preMove = this.preMove || [];
    a.preMove.push(function() {
      return a.controller.collisionSolver.solveCollision(a);
    });
    a.getMomentOfInertia = function() {
      return a.elementMass / 12 * (a.elementWidth * a.elementScaleX * a.elementWidth * a.elementScaleX + a.elementHeight * a.elementScaleY * a.elementHeight * a.elementScaleY);
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
    var c = a.controller.context.canvas, f = c.ownerDocument.createElement("canvas"), c = c.ownerDocument.createElement("canvas");
    f.width = c.width = a.elementWidth;
    f.height = c.height = a.elementHeight;
    a.collidedContext = c.getContext("2d");
    a.collidedContext.putImageData(a.elementImage, 0, 0);
    a.collidedContext.globalCompositeOperation = "source-atop";
    a.collidedContext.fillStyle = "#000";
    a.collidedContext.fillRect(0, 0, a.elementWidth, a.elementHeight);
    a.collisionContext = f.getContext("2d");
    a.collisionContext.globalCompositeOperation = "source-over";
    a.collisionContext.drawImage(a.collidedContext.canvas, 0, 0);
    f = a.collisionContext.getImageData(0, 0, a.elementWidth, a.elementHeight);
    c = a.collisionContext.createImageData(a.elementWidth, a.elementHeight);
    a.edges = [];
    for (var d = 0;d < a.elementWidth;d++) {
      for (var b = 0;b < a.elementHeight;b++) {
        if (!(200 > f.data[b * a.elementWidth * 4 + 4 * d + 3])) {
          for (var m = !1, k = -1;2 > k;k++) {
            for (var l = -1;2 > l;l++) {
              if (0 > b + k || 0 > d + l || b + k > a.elementHeight - 1 || d + k > a.elementWidth - 1 || 100 > f.data[(b + k) * a.elementWidth * 4 + 4 * (d + l) + 3]) {
                m = !0, l = k = 2;
              }
            }
          }
          a.collisionContext.putImageData(c, 0, 0);
          m && (a.edges.push({x:d, y:b}), c.data[b * a.elementWidth * 4 + 4 * d] = 0, c.data[b * a.elementWidth * 4 + 4 * d + 1] = 0, c.data[b * a.elementWidth * 4 + 4 * d + 2] = 0, c.data[b * a.elementWidth * 4 + 4 * d + 3] = 255);
        }
      }
    }
    a.collisionContext.putImageData(c, 0, 0);
    a.collisionContext.translate(a.dx, a.dy);
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.customTimer = {applyTo:function(a, g) {
    setInterval(function() {
      g.action.call(a);
    }, g.time);
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.droppable = {applyTo:function(a, g) {
    var e = g.dropZone;
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
  CreJs.Creanvas.elementDecorators.dropzone = {applyTo:function(a, g) {
    var e = g.availableSpots, h = g.dropX, f = g.dropY;
    a.droppedElementsList = [];
    a.elementEvents.addEventListenerX({eventGroupType:"dropzone", eventId:"drop", handleEvent:function(c) {
      0 >= e || (DEBUG && a.controller.logMessage("drop event on dropzone " + a.elementId + ", dropped " + c.droppedElement.id), e--, c.droppedElement.x = h || a.elementX, c.droppedElement.y = f || a.elementY, c.droppedElement.dropZone = a, a.droppedElementsList.push(c.droppedElement), c.droppedElement.elementEvents.dispatch("dropped", {dropZone:a, droppedElement:c.droppedElement}), a.elementEvents.dispatch("droppedIn", {dropZone:a, droppedElement:c.droppedElement}), a.triggerRedraw());
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
  CreJs.Creanvas.elementDecorators.duplicable = {applyTo:function(a, g) {
    var e = g.isBlocked, h = g.generatorCount || Infinity;
    DEBUG && a.debug("duplicable.applyTo", "generatorCount is " + h);
    var f = !1;
    a.elementEvents.addEventListenerX({eventGroupType:"duplicable", eventId:"pointerDown", handleEvent:function(c) {
      0 <= c.touchIdentifier && (f = !0);
      if (!(f && 0 > c.touchIdentifier || e && e() || (DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount was: " + h), 0 >= h))) {
        h--;
        DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount is now: " + h);
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
  CreJs.Creanvas.elementDecorators.movable = {applyTo:function(a, g) {
    var e = !1, h = this.touchIdentifier = null, f = g.isBlocked;
    a.startMoving = function(c) {
      DEBUG && a.controller.logMessage("Starting moving - identifier: " + c.touchIdentifier);
      e = !0;
      a.touchIdentifier = c.touchIdentifier;
      h = {x:c.x, y:c.y};
      a.dropZone && (a.dropZone.drag(a), a.dropZone = null);
    };
    a.moveCompleted = function(c) {
      DEBUG && a.controller.logMessage("Completed move - identifier: " + c.touchIdentifier);
      e = !1;
      h = null;
      a.isDroppable && (DEBUG && a.controller.logMessage("Trigger drop - identifier: " + c.touchIdentifier), a.controller.triggerPointedElementEvent("drop", {x:c.x, y:c.y, droppedElement:a}));
    };
    a.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerDown", handleEvent:function(c) {
      f && f() || a.startMoving(c);
    }, listenerId:a.elementId});
    var c = !1;
    a.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerMove", handleEvent:function(d) {
      !e || f && f() || (c || (c = !0, DEBUG && a.controller.logMessage("pointereMove event on movable " + a.elementId + " (" + a.touchIdentifier + ")")), a.elementX += d.x - h.x, a.elementY += d.y - h.y, h = {x:d.x, y:d.y}, a.triggerRedraw());
    }, listenerId:a.elementId});
    a.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerUp", handleEvent:function(d) {
      !e || f && f() || (DEBUG && a.controller.logMessage("End detected for touch " + a.touchIdentifier), a.controller.getCanvasXYFromClientXY(d), a.elementX += d.x - h.x, a.elementY += d.y - h.y, a.moveCompleted(d), a.touchIdentifier = null, c = !1, a.triggerRedraw());
    }, listenerId:a.elementId});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.moving = {type:"moving", applyTo:function(a, g) {
    var e, h, f, c, d, b = g.vx, m = g.vy, k = g.ax, l = g.ay, r = g.rotationSpeed;
    DEBUG && a.controller.logMessage("Applying moving decorator to " + a.elementName + "-" + a.elementId);
    var q, n, p;
    a.elementMoving = a.elementMoving || {};
    a.elementMoving.movingSpeed = new CreJs.Core.Vector(b || 0, m || 0);
    a.elementMoving.movingAcceleration = new CreJs.Core.Vector(k || 0, l || 0);
    a.elementMoving.omega = r || 0;
    q = a.controller.getTime();
    setInterval(function() {
      n = a.controller.getTime();
      p = n - q;
      if (!(1 > p) && (q = n, a.elementMoving.movingSpeed.x += a.elementMoving.movingAcceleration.x * p, a.elementMoving.movingSpeed.y += a.elementMoving.movingAcceleration.y * p, 0 != a.elementMoving.movingSpeed.x || 0 != a.elementMoving.movingSpeed.y || 0 != a.elementMoving.omega || a.elementScaleSpeed && (0 != a.elementScaleSpeed.x || 0 != a.elementScaleSpeed.y))) {
        e = a.elementX;
        h = a.elementY;
        f = a.elementAngle;
        c = a.elementScaleX;
        d = a.elementScaleY;
        a.elementX += a.elementMoving.movingSpeed.x * p;
        a.elementY += a.elementMoving.movingSpeed.y * p;
        a.elementAngle += a.elementMoving.omega * p;
        a.elementScaleSpeed && (a.elementScaleX += a.elementScaleSpeed.x * p, a.elementScaleY += a.elementScaleSpeed.y * p);
        var b = !0;
        a.preMove && a.preMove.forEach(function(c) {
          b && (c.call(a) || (b = !1));
        });
        b || (a.elementX = e, a.elementY = h, a.elementAngle = f, a.elementScaleX = c, a.elementScaleY = d);
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
(function() {
  var a = CreJs.Creevents = CreJs.Creevents || {}, g;
  a.Event = function(a) {
    this.eventId = a;
    g = CreJs.CreHelpers;
    var h = [], f = new CreJs.Crelog.Logger;
    this.dispatch = function(c, d) {
      var b = g.GetGuid(), m = h.length;
      DEBUG && c && "pointerMove" != c.eventId && "drag" != c.eventId && "drop" != c.eventId && f.logMessage("Dispatching " + m + " " + c.eventId + ". (" + b + ")");
      h.forEach(function(g) {
        g.debugEvent = a;
        setTimeout(function() {
          DEBUG && c && "pointerMove" != c.eventId && f.logMessage("Actually handling " + c.eventId + ". (" + b + ")");
          g.handleEvent(c);
          m--;
          0 == m && d && d();
        });
      });
    };
    this.addEventListenerX = function(a) {
      a.handleEvent = a.handleEvent || a.handleEvent;
      a.rank = a.rank || a.rank;
      a.listenerId = a.listenerId || a.listenerId;
      a.eventGroupType = a.eventGroupType || a.eventGroupType;
      var d = g.GetGuid();
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
    var g = this, e = {}, h = [];
    this.hasEvent = function(a) {
      return void 0 != e[a];
    };
    var f = function(c) {
      h.push(c);
      e[c] = new a.Event(c);
    };
    this.addEventListenerX = function(a) {
      var d = a.eventId || a.eventId;
      e[d] || f(d);
      return e[d].addEventListenerX(a);
    };
    this.dispatch = function(a, d, b) {
      e[a] && (d && (d.eventId = a), e[a].dispatch(d, b));
    };
    this.removeEventListener = function(a) {
      e[a.eventId] ? e[a.eventId].removeEventListener(a) : h.forEach(function(d) {
        e[d].removeEventListener(a);
      });
    };
    this.registerControlEvent = function(a, d, b) {
      e[b] || f(b);
      a.addEventListenerX(d, function(a) {
        a.preventDefault();
        setTimeout(function() {
          g.dispatch(b, a);
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
    var g = Date.now().toString(16), g = a.repeatString("x", 15 - g.length) + g;
    return("xxxxxxxx-xxxx-4xxx-y" + g.slice(0, 3) + "-" + g.slice(3)).replace(/[xy]/g, function(a) {
      var g = 16 * Math.random() | 0;
      return("x" == a ? g : g & 3 | 8).toString(16);
    });
  };
  a.repeatString = function(g, e) {
    return 0 >= e ? "" : g + a.repeatString(g, e - 1);
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

