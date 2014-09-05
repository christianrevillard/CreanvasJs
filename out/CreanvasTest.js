var TEST = !0, DEBUG = !1, CreJs = CreJs || {};
CreJs.Creanvas = CreJs.Creanvas || {};
window.CreJs = CreJs;
CreJs.Creanvas = CreJs.Creanvas;
TEST && (CreJs.Test = CreJs.Test || {}, CreJs.Test = CreJs.Test);
(function() {
  var a = CreJs.Core = CreJs.Core || {};
  a.Vector = function(g, d, h) {
    var e = this;
    this.vectorX = g;
    this.vectorY = d;
    this.vectorZ = h || 0;
    this.draw = function(a, f, g, c) {
      a.lineWidth = 5;
      a.strokeStyle = c;
      a.beginPath();
      a.moveTo(f, g);
      a.lineTo(f + 100 * e.vectorX, g + 100 * e.vectorY);
      a.stroke();
      a.lineWidth = 1;
      a.strokeStyle = "#000";
    };
    this.getCoordinates = function(b) {
      return{u:a.scalarProduct(e, b.u), v:a.scalarProduct(e, b.v), w:a.scalarProduct(e, b.w)};
    };
    this.setCoordinates = function(a, f, g, c) {
      c = c || 0;
      e.vectorX = f * a.u.vectorX + g * a.v.vectorX + c * a.w.vectorX;
      e.vectorY = f * a.u.vectorY + g * a.v.vectorY + c * a.w.vectorY;
      e.vectorZ = f * a.u.vectorZ + g * a.v.vectorZ + c * a.w.vectorZ;
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
  a.getUnitVectors = function(g, d, h, e) {
    g = h - g;
    d = e - d;
    e = Math.sqrt(g * g + d * d);
    return{u:new a.Vector(g / e, d / e, 0), v:new a.Vector(-d / e, g / e, 0), w:new a.Vector(0, 0, 0)};
  };
  a.drawUnitVectors = function(a, d, h, e, b) {
    a.lineWidth = 5;
    a.strokeStyle = b;
    a.beginPath();
    a.moveTo(d, h);
    a.lineTo(d + 100 * e.u.vectorX, h + 100 * e.u.vectorY);
    a.moveTo(d, h);
    a.lineTo(d + 50 * e.v.vectorX, h + 50 * e.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.drawCoordinateVector = function(a, d, h, e, b, f, k) {
    a.lineWidth = 5;
    a.strokeStyle = k;
    a.beginPath();
    a.moveTo(d, h);
    a.lineTo(d + 100 * b * e.u.vectorX, h + 100 * b * e.u.vectorY);
    a.lineTo(d + 100 * b * e.u.vectorX + 100 * f * e.v.vectorX, h + 100 * b * e.u.vectorY + 100 * f * e.v.vectorY);
    a.stroke();
    a.lineWidth = 1;
    a.strokeStyle = "#000";
  };
  a.scalarProduct = function(a, d) {
    return a.vectorX * d.vectorX + a.vectorY * d.vectorY;
  };
  a.vectorProduct = function(g, d) {
    return new a.Vector(g.vectorY * d.vectorZ - g.vectorZ * d.vectorY, g.vectorZ * d.vectorX - g.vectorX * d.vectorZ, g.vectorX * d.vectorY - g.vectorY * d.vectorX);
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
    var g = function(a, b) {
      var f, d, c, l, m, g, n;
      l = a.getClientRect();
      m = b.getClientRect();
      f = Math.max(l.left, m.left) - 1;
      d = Math.min(l.right, m.right) + 1;
      c = Math.max(l.top, m.top) - 1;
      l = Math.min(l.bottom, m.bottom) + 1;
      if (!(0 >= d - f || 0 >= l - c)) {
        f = a.collisionContext.getImageData(0, 0, a.elementWidth, a.elementHeight);
        a.collisionContext.scale(1 / (a.elementScaleX || 1), 1 / (a.elementScaleY || 1));
        a.collisionContext.rotate(-(a.elementAngle || 0));
        a.collisionContext.translate(b.elementX - a.elementX, b.elementY - a.elementY);
        a.collisionContext.rotate(b.elementAngle || 0);
        a.collisionContext.scale(b.elementScaleX || 1, b.elementScaleY || 1);
        a.collisionContext.globalCompositeOperation = "destination-out";
        a.collisionContext.drawImage(b.collidedContext.canvas, 0, 0, b.elementWidth, b.elementHeight, -b.dx, -b.dy, b.elementWidth, b.elementHeight);
        a.collisionContext.scale(1 / (b.elementScaleX || 1), 1 / (b.elementScaleY || 1));
        a.collisionContext.rotate(-b.elementAngle || 0);
        a.collisionContext.translate(-b.elementX + a.elementX, -b.elementY + a.elementY);
        a.collisionContext.rotate(a.elementAngle || 0);
        a.collisionContext.scale(a.elementScaleX || 1, a.elementScaleY || 1);
        g = a.collisionContext.getImageData(0, 0, a.elementWidth, a.elementHeight);
        a.collisionContext.globalCompositeOperation = "source-over";
        a.collisionContext.putImageData(f, 0, 0);
        n = [];
        a.edges.forEach(function(c) {
          90 > g.data[c.y * a.elementWidth * 4 + 4 * c.x + 3] && n.push(c);
        });
        if (2 > n.length) {
          return null;
        }
        var h;
        c = d = 0;
        f = n.length - 1;
        for (l = 1;l < n.length;l++) {
          for (m = l + 1;m < n.length;m++) {
            h = n[l].x - n[m].x;
            var p = n[l].y - n[m].y;
            h = Math.sqrt(h * h + p * p);
            h > d && (d = h, c = l, f = m);
          }
        }
        d = a.getCanvasXY(n[c].x - a.dx, n[c].y - a.dy);
        f = a.getCanvasXY(n[f].x - a.dx, n[f].y - a.dy);
        return d.x == f.x && d.y == f.y ? null : {x:Math.round((d.x + f.x) / 2), y:Math.round((d.y + f.y) / 2), vectors:CreJs.Core.getUnitVectors(d.x, d.y, f.x, f.y)};
      }
    }, d = function(a, b, f) {
      var d, c, l, m, g, h;
      d = f.vectors;
      m = new CreJs.Core.Vector(f.x - a.elementX, f.y - a.elementY);
      g = CreJs.Core.vectorProduct(m, d.v).z;
      h = new CreJs.Core.Vector(f.x - b.elementX, f.y - b.elementY);
      f = CreJs.Core.vectorProduct(h, d.v).z;
      var q = CreJs.Core.vectorProduct(m, d.v), p = CreJs.Core.vectorProduct(h, d.v);
      c = new CreJs.Core.Vector(a.elementMoving.movingSpeed.x, a.elementMoving.movingSpeed.y);
      l = new CreJs.Core.Vector(b.elementMoving.movingSpeed.x, b.elementMoving.movingSpeed.y);
      a.elementScaleSpeed && (c.x += m.x * a.elementScaleSpeed.x, c.y += m.y * a.elementScaleSpeed.y);
      b.elementScaleSpeed && (l.x += h.x * b.elementScaleSpeed.x, l.y += h.y * b.elementScaleSpeed.y);
      m = c.getCoordinates(d);
      l = l.getCoordinates(d);
      q = a.collidable.coefficient * b.collidable.coefficient * 2 * (l.v - m.v + b.elementMoving.omega * p.z - a.elementMoving.omega * q.z) / (1 / b.elementMass + 1 / a.elementMass + p.z * p.z / b.getMomentOfInertia() + q.z * q.z / a.getMomentOfInertia());
      a.elementMoving.movingSpeed.x += q / a.elementMass * d.v.x;
      a.elementMoving.movingSpeed.y += q / a.elementMass * d.v.y;
      b.elementMoving.movingSpeed.x -= q / b.elementMass * d.v.x;
      b.elementMoving.movingSpeed.y -= q / b.elementMass * d.v.y;
      a.elementMoving.omega += q * g / a.getMomentOfInertia();
      b.elementMoving.omega -= q * f / b.getMomentOfInertia();
    }, h = function() {
      return a.elements.filter(function(a) {
        return a.collidable;
      });
    };
    this.solveCollision = function(a) {
      var b = h(), f, k, c;
      f = a.getCenter();
      b = b.filter(function(c) {
        var b;
        if (c.elementId === a.elementId || !(c.elementMoving.movingSpeed.x || c.elementMoving.movingSpeed.y || a.elementMoving.movingSpeed.x || a.elementMoving.movingSpeed.y || c.elementScaleSpeed || a.elementScaleSpeed)) {
          return!1;
        }
        b = c.getCenter();
        return Math.sqrt((f.x - b.x) * (f.x - b.x) + (f.y - b.y) * (f.y - b.y)) > a.getRadius() + c.getRadius() ? !1 : !0;
      });
      if (0 == b.length) {
        return!0;
      }
      k = null;
      b.forEach(function(b) {
        k || (k = g(a, b)) && (c = b);
      });
      if (!k) {
        return!0;
      }
      d(a, c, k);
      a.elementEvents.dispatch("collision", {element:c, collisionPoint:k});
      c.elementEvents.dispatch("collision", {element:a, collisionPoint:k});
      return!1;
    };
  };
})();
(function() {
  CreJs.Creanvas.Controller = function(a) {
    var g, d, h, e, b, f, k, c;
    e = this;
    g = a.canvas;
    k = a.timeScale || 1;
    c = a.meterPerPoint || 1;
    a.realTime ? (f = Date.now(), this.getTime = function() {
      return(Date.now() - f) * k;
    }) : (b = 0, setInterval(function() {
      b += 10 * k;
    }, 10), this.getTime = function() {
      return b;
    });
    this.logMessage = function(c) {
      a.log && a.log(c);
    };
    DEBUG && this.logMessage("Starting controller");
    e.context = g.getContext("2d");
    e.context.scale(1 / c, 1 / c);
    d = !0;
    isDrawing = !1;
    h = a.refreshTime || 50;
    this.triggerPointedElementEvent = function(a, c) {
      var b = !1;
      e.elements.filter(function(c) {
        return c.canHandle(a);
      }).sort(function(a, c) {
        return c.elementZ || 0 - a.elementZ || 0;
      }).forEach(function(d) {
        !b && d.hit(c.x, c.y) && (d.elementEvents.dispatch(a, c), b = !0);
      });
    };
    this.triggerElementEventByIdentifier = function(a, c) {
      e.elements.forEach(function(b) {
        b.touchIdentifier == c.touchIdentifier && b.elementEvents.dispatch(a, c);
      });
    };
    this.registerCanvasPointerEvent = function(a, c) {
      g.addEventListener(a, function(b) {
        setTimeout(function() {
          var d = function(b, d) {
            DEBUG && e.logMessage("Canvas event " + a + " with touchIdentifier " + d);
            var f = e.getCanvasXYFromClientXY(b);
            f.touchIdentifier = d;
            e.triggerPointedElementEvent(c, f);
          };
          if (b.changedTouches) {
            for (var f = 0;f < b.changedTouches.length;f++) {
              d(b.changedTouches[f], b.changedTouches[f].identifier);
            }
          } else {
            d(b, -1);
          }
        });
      });
    };
    this.registerTouchIdentifierEvent = function(a, c) {
      g.addEventListener(a, function(b) {
        setTimeout(function() {
          var d = function(b, d) {
            DEBUG && e.logMessage("Canvas event " + a + " with touchIdentifier " + d);
            var f = e.getCanvasXYFromClientXY(b);
            f.touchIdentifier = d;
            e.triggerElementEventByIdentifier(c, f);
          };
          if (b.changedTouches) {
            for (var f = 0;f < b.changedTouches.length;f++) {
              d(b.changedTouches[f], b.changedTouches[f].identifier);
            }
          } else {
            d(b, -1);
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
      d = !0;
    };
    this.getCanvasXYFromClientXY = function(a) {
      var b = g.getBoundingClientRect();
      e.logMessage("ClientXY: (" + a.clientX + "," + a.clientY + ")");
      b = {x:Math.round((a.clientX - b.left) * g.width / b.width * c), y:Math.round((a.clientY - b.top) * g.height / b.height * c)};
      e.logMessage("canvasXY: (" + b.x + "," + b.y + ")");
      "click" == a.type && e.logMessage("Click on ! canvasXY: (" + b.x + "," + b.y + ")");
      return b;
    };
    e.elements = [];
    this.add = function() {
      DEBUG && e.logMessage("Controller.addElement: Adding element - args:" + arguments.length);
      var a = [].slice.call(arguments), b = new CreJs.Creanvas.Element(e, a[0]);
      DEBUG && e.logMessage("Controller.addElement: Created element: " + b.elementName + "-" + b.elementId);
      1 < a.length ? (DEBUG && e.logMessage("Controller.addElement: Applying " + (a.length - 1) + " decorators"), b.applyElementDecorators.apply(b, a.slice(1))) : DEBUG && e.logMessage("Controller.addElement: No decorator to apply");
      e.elements.push(b);
      return b;
    };
    e.logMessage("Adding background");
    this.add({elementName:"background", elementImage:{imageWidth:g.width, imageHeight:g.height, imageTranslate:{translateDx:0, translateDy:0}, imageDraw:a.drawBackground || function(b) {
      b.fillStyle = a.backgroundStyle || "#FFF";
      b.fillRect(0, 0, g.width, g.height);
    }}, elementPosition:{positionZ:-Infinity}});
    setInterval(function() {
      d && !isDrawing ? (isDrawing = !0, e.elements.sort(function(a, b) {
        return(a.elementZ || 0) - (b.elementZ || 0);
      }).forEach(function(a) {
        e.context.translate(a.elementX, a.elementY);
        e.context.rotate(a.elementAngle || 0);
        e.context.scale(a.elementScaleX || 1, a.elementScaleY || 1);
        e.context.drawImage(a.temporaryRenderingContext.canvas, 0, 0, a.elementWidth, a.elementHeight, -a.dx, -a.dy, a.elementWidth, a.elementHeight);
        e.context.scale(1 / (a.elementScaleX || 1), 1 / a.elementScaleY || 1);
        e.context.rotate(-(a.elementAngle || 0));
        e.context.translate(-a.elementX, -a.elementY);
      }), isDrawing = !1) : e.logMessage("No redraw");
    }, h);
    this.addElement = function() {
      var a = [].slice.call(arguments), b = a[0];
      a[0] = {elementName:b.name, elementImage:b.image ? {imageWidth:b.image.width, imageHeight:b.image.height, imageDraw:b.image.draw, imageTranslate:b.image.translate ? {translateDx:b.image.translate.dx, translateDy:b.image.translate.dy} : null} : null, elementPosition:b.position ? {positionX:b.position.x || 0, positionY:b.position.y || 0, positionZ:b.position.z || 0} : null, rules:b.rules};
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
    var d = g.elementImage, h = d.imageDraw, e = g.elementPosition, b = g.rules, f = [].slice.apply(arguments).slice(2), k = [];
    this.controller = a;
    this.elementId = CreJs.CreHelpers.GetGuid();
    this.elementWidth = d.imageWidth;
    this.elementHeight = d.imageHeight;
    this.elementX = e.positionX || 0;
    this.elementY = e.positionY || 0;
    this.elementZ = e.positionZ || 0;
    this.elementAngle = e.positionAngle || 0;
    this.elementScaleX = d.imageScaleX || 1;
    this.elementScaleY = d.imageScaleY || 1;
    this.elementMass = 1;
    e = d.imageTranslate || {translateDx:d.imageWidth / 2, translateDy:d.imageHeight / 2};
    this.dx = e.translateDx;
    this.dy = e.translateDy;
    d.rawImage ? (this.elementImage = d.rawImage, e = this.controller.context.canvas, e = e.ownerDocument.createElement("canvas"), this.temporaryRenderingContext = e.getContext("2d"), this.temporaryRenderingContext.putImageData(this.elementImage, 0, 0)) : (e = this.controller.context.canvas, e = e.ownerDocument.createElement("canvas"), e.width = d.imageWidth, e.height = d.imageHeight, this.temporaryRenderingContext = e.getContext("2d"), this.temporaryRenderingContext.beginPath(), this.temporaryRenderingContext.translate(this.dx, 
    this.dy), h(this.temporaryRenderingContext), this.elementImage = this.temporaryRenderingContext.getImageData(0, 0, d.imageWidth, d.imageHeight));
    var c = this;
    DEBUG && (c.debug = function(a, b) {
      c.controller.logMessage("Element." + a + ": " + b + ". Element: " + c.elementName + "/" + c.elementId);
    });
    b && (c.rules = [], b.forEach(function(a) {
      var b = c.rules.length;
      c.rules.push(a);
      setInterval(function() {
        c.rules[b].rule.call(c);
        c.triggerRedraw();
      }, a.checkTime);
    }));
    this.elementEvents = new CreJs.Creevents.EventContainer;
    this.isPointInPath = function(a) {
      a = c.controller.getCanvasXYFromClientXY(a);
      return c.controller.noDrawContext.isPointInPath(c, h, a);
    };
    0 < f.length && CreJs.Creanvas.elementDecorators && (DEBUG && a.logMessage("New element " + elementName + " : apply " + f.length + " decorators"), c.applyElementDecorators(f));
    this.hit = function(a, b) {
      var d = Math.round(a - c.elementX + c.dx), f = Math.round(b - c.elementY + c.dy), d = 0 <= d && d <= c.elementWidth && 0 <= f && f <= c.elementHeight && 0 < c.elementImage.data[4 * f * c.elementWidth + 4 * d + 3];
      DEBUG && c.debug("hit", d ? "hit" : "no hit");
      return d;
    };
    this.cloneElement = function(a) {
      d.image = c.elementImage;
      DEBUG && c.debug("cloneElement", "start cloning");
      var b = c.controller.add(g), e = a ? f.filter(function(b) {
        return a.every(function(a) {
          return a != b[0];
        });
      }) : f;
      DEBUG && c.debug("cloneElement", "apply " + e.length + " decorators");
      b.applyElementDecorators.apply(b, e);
      return b;
    };
    this.removeElementDecorator = function(a) {
      DEBUG && c.debug("removeElementDecorator", a);
      var b = CreJs.Creanvas.elementDecorators[a];
      b && b.removeFrom ? b.removeFrom(c) : DEBUG && c.debug("removeElementDecorator", "Cannot remove: " + a);
    };
    this.canHandle = function(a) {
      return "click" == a || "pointerDown" == a || c.elementEvents.hasEvent(a);
    };
    this.deactivate = function() {
      c.controller.elementEvents.removeEventListener({listenerId:c.elementId});
      c.temporaryRenderingContext = null;
    };
    c.controller.elementEvents.addEventListenerX({eventId:"deactivate", listenerId:c.elementId, handleEvent:function(a) {
      c.deactivate();
    }});
    this.triggerRedraw = function() {
      c.controller.triggerRedraw();
    };
    this.getCanvasXY = function(a, b) {
      return{x:Math.round(c.elementX + a * c.elementScaleX * Math.cos(c.elementAngle) - b * c.elementScaleY * Math.sin(c.elementAngle)), y:Math.round(c.elementY + a * c.elementScaleX * Math.sin(c.elementAngle) + b * c.elementScaleY * Math.cos(c.elementAngle))};
    };
    this.getCanvasXYNoRounding = function(a, b) {
      return{x:c.elementX + a * c.elementScaleX * Math.cos(c.elementAngle) - b * c.elementScaleY * Math.sin(c.elementAngle), y:c.elementY + a * c.elementScaleX * Math.sin(c.elementAngle) + b * c.elementScaleY * Math.cos(c.elementAngle)};
    };
    this.getElementXY = function(a, b) {
      return{x:Math.round(((a - c.elementX) * Math.cos(c.elementAngle) + (b - c.elementY) * Math.sin(c.elementAngle)) / c.elementScaleX), y:Math.round(((b - c.elementY) * Math.cos(c.elementAngle) - (a - c.elementX) * Math.sin(c.elementAngle)) / c.elementScaleY)};
    };
    this.getCenter = function() {
      return c.getCanvasXY(-c.dx + c.elementWidth / 2, -c.dy + c.elementHeight / 2);
    };
    var l = [];
    l.push({x:-c.dx, y:-c.dy});
    l.push({x:-c.dx + c.elementWidth, y:-c.dy});
    l.push({x:-c.dx + c.elementWidth, y:-c.dy + c.elementHeight});
    l.push({x:-c.dx, y:-c.dy + c.elementHeight});
    this.getClientCornersCache = function() {
      return l.map(function(a) {
        return c.getCanvasXY(a.x, a.y);
      });
    };
    this.getClientCorners = function() {
      var a = c.elementX + "" + c.elementY + "" + c.elementAngle + "" + c.elementScaleX + "" + c.elementScaleX;
      if (k.getClientCorners && k.getClientCorners.key == a) {
        return k.getClientCorners.value;
      }
      var b = c.getClientCornersCache();
      k.getClientCorners = {key:a, value:b};
      return b;
    };
    this.getClientRectCache = function() {
      var a = c.getClientCorners();
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
      var a = c.elementX + "" + c.elementY + "" + c.elementAngle + "" + c.elementScaleX + "" + c.elementScaleX;
      if (k.getClientRect && k.getClientRect.key == a) {
        return k.getClientRect.value;
      }
      var b = c.getClientRectCache();
      k.getClientRect = {key:a, value:b};
      return b;
    };
    this.applyElementDecorators = function() {
      var a = this, b = [].slice.apply(arguments);
      f = f.concat(b);
      b.forEach(function(b) {
        a.applyElementDecorator(b[0], b[1]);
      });
    };
    this.applyElementDecorator = function(a, b) {
      DEBUG && this.debug("applyElementDecorator", a);
      var c = CreJs.Creanvas.elementDecorators[a];
      c ? c.applyTo(this, b) : DEBUG && this.debug("applyElementDecorator", "Not found: " + a);
    };
    Object.defineProperty(c, "name", {get:function() {
      return this.elementName;
    }, set:function(a) {
      this.elementName = a;
    }});
    Object.defineProperty(c, "width", {get:function() {
      return this.elementWidth;
    }, set:function(a) {
      this.elementWidth = a;
    }});
    Object.defineProperty(c, "height", {get:function() {
      return this.elementHeight;
    }, set:function(a) {
      this.elementHeight = a;
    }});
    Object.defineProperty(c, "scaleX", {get:function() {
      return this.elementScaleX;
    }, set:function(a) {
      this.elementScaleX = a;
    }});
    Object.defineProperty(c, "scaleY", {get:function() {
      return this.elementScaleY;
    }, set:function(a) {
      this.elementScaleY = a;
    }});
    Object.defineProperty(c, "x", {get:function() {
      return this.elementX;
    }, set:function(a) {
      this.elementX = a;
    }});
    Object.defineProperty(c, "y", {get:function() {
      return this.elementY;
    }, set:function(a) {
      this.elementY = a;
    }});
    Object.defineProperty(c, "z", {get:function() {
      return this.elementZ;
    }, set:function(a) {
      this.elementZ = a;
    }});
    Object.defineProperty(c, "angle", {get:function() {
      return this.elementAngle;
    }, set:function(a) {
      this.elementAngle = a;
    }});
    Object.defineProperty(c, "mass", {get:function() {
      return this.elementMass;
    }, set:function(a) {
      this.elementMass = a;
    }});
    Object.defineProperty(c, "id", {get:function() {
      return this.elementId;
    }});
    Object.defineProperty(c, "image", {get:function() {
      return this.elementImage;
    }});
    Object.defineProperty(c, "events", {get:function() {
      return this.elementEvents;
    }});
    c.clone = c.cloneElement;
    c.applyDecorator = c.applyElementDecorator;
    c.applyDecorators = c.applyElementDecorators;
    c.removeDecorator = c.removeElementDecorator;
  };
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.clickable = {applyTo:function(a, g) {
    var d = g.onclick;
    a.onClick = function(g) {
      DEBUG && a.debug("onClick", d);
      d.call(a, g);
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
    var d = [];
    a.collidable = {};
    var h = g.onCollision, e = g.coefficient;
    a.controller.collisionSolver = a.controller.collisionSolver || new CreJs.Creanvas.CollisionSolver(a.controller);
    a.collidable.coefficient = e || 0 === e ? e : 1;
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
      if (d.getRadius && d.getRadius.key == b) {
        return d.getRadius.value_;
      }
      var c = a.geRadiusCache();
      d.geRadius = {kevectorY:b, value_:c};
      return c;
    };
    var b = a.controller.context.canvas, e = b.ownerDocument.createElement("canvas"), b = b.ownerDocument.createElement("canvas");
    e.width = b.width = a.elementWidth;
    e.height = b.height = a.elementHeight;
    a.collidedContext = b.getContext("2d");
    a.collidedContext.putImageData(a.elementImage, 0, 0);
    a.collidedContext.globalCompositeOperation = "source-atop";
    a.collidedContext.fillStyle = "#000";
    a.collidedContext.fillRect(0, 0, a.elementWidth, a.elementHeight);
    a.collisionContext = e.getContext("2d");
    a.collisionContext.globalCompositeOperation = "source-over";
    a.collisionContext.drawImage(a.collidedContext.canvas, 0, 0);
    e = a.collisionContext.getImageData(0, 0, a.elementWidth, a.elementHeight);
    b = a.collisionContext.createImageData(a.elementWidth, a.elementHeight);
    a.edges = [];
    for (var f = 0;f < a.elementWidth;f++) {
      for (var k = 0;k < a.elementHeight;k++) {
        if (!(200 > e.data[k * a.elementWidth * 4 + 4 * f + 3])) {
          for (var c = !1, l = -1;2 > l;l++) {
            for (var m = -1;2 > m;m++) {
              if (0 > k + l || 0 > f + m || k + l > a.elementHeight - 1 || f + l > a.elementWidth - 1 || 100 > e.data[(k + l) * a.elementWidth * 4 + 4 * (f + m) + 3]) {
                c = !0, m = l = 2;
              }
            }
          }
          a.collisionContext.putImageData(b, 0, 0);
          c && (a.edges.push({x:f, y:k}), b.data[k * a.elementWidth * 4 + 4 * f] = 0, b.data[k * a.elementWidth * 4 + 4 * f + 1] = 0, b.data[k * a.elementWidth * 4 + 4 * f + 2] = 0, b.data[k * a.elementWidth * 4 + 4 * f + 3] = 255);
        }
      }
    }
    a.collisionContext.putImageData(b, 0, 0);
    a.collisionContext.translate(a.dx, a.dy);
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.droppable = {applyTo:function(a, g) {
    var d = g.dropZone;
    a.isDroppable = !0;
    a.elementDropZone = d;
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
    var d = g.availableSpots, h = g.dropX, e = g.dropY;
    a.droppedElementsList = [];
    a.elementEvents.addEventListenerX({eventGroupType:"dropzone", eventId:"drop", handleEvent:function(b) {
      0 >= d || (DEBUG && a.controller.logMessage("drop event on dropzone " + a.elementId + ", dropped " + b.droppedElement.id), d--, b.droppedElement.x = h || a.elementX, b.droppedElement.y = e || a.elementY, b.droppedElement.dropZone = a, a.droppedElementsList.push(b.droppedElement), b.droppedElement.elementEvents.dispatch("dropped", {dropZone:a, droppedElement:b.droppedElement}), a.elementEvents.dispatch("droppedIn", {dropZone:a, droppedElement:b.droppedElement}), a.triggerRedraw());
    }, listenerId:a.elementId});
    a.drag = function(b) {
      DEBUG && a.controller.logMessage("dragging from dropzone " + a.elementId + ", dragged " + b.id);
      b.dropZone = null;
      d++;
      a.droppedElementsList.splice(a.droppedElementsList.indexOf(b), 1);
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
    var d = g.isBlocked, h = g.generatorCount || Infinity;
    DEBUG && a.debug("duplicable.applyTo", "generatorCount is " + h);
    var e = !1;
    a.elementEvents.addEventListenerX({eventGroupType:"duplicable", eventId:"pointerDown", handleEvent:function(b) {
      0 <= b.touchIdentifier && (e = !0);
      if (!(e && 0 > b.touchIdentifier || d && d() || (DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount was: " + h), 0 >= h))) {
        h--;
        DEBUG && a.debug("duplicable.makeCopy", "GeneratorCount is now: " + h);
        var f = a.cloneElement(["duplicable"]);
        f.elementName += " (duplicate)";
        f.applyElementDecorator("movable", {isBlocked:d});
        f.startMoving(b);
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
    var d = !1, h = this.touchIdentifier = null, e = g.isBlocked;
    a.startMoving = function(b) {
      DEBUG && a.controller.logMessage("Starting moving - identifier: " + b.touchIdentifier);
      d = !0;
      a.touchIdentifier = b.touchIdentifier;
      h = {x:b.x, y:b.y};
      a.dropZone && (a.dropZone.drag(a), a.dropZone = null);
    };
    a.moveCompleted = function(b) {
      DEBUG && a.controller.logMessage("Completed move - identifier: " + b.touchIdentifier);
      d = !1;
      h = null;
      a.isDroppable && (DEBUG && a.controller.logMessage("Trigger drop - identifier: " + b.touchIdentifier), a.controller.triggerPointedElementEvent("drop", {x:b.x, y:b.y, droppedElement:a}));
    };
    a.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerDown", handleEvent:function(b) {
      e && e() || a.startMoving(b);
    }, listenerId:a.elementId});
    var b = !1;
    a.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerMove", handleEvent:function(f) {
      !d || e && e() || (b || (b = !0, DEBUG && a.controller.logMessage("pointereMove event on movable " + a.elementId + " (" + a.touchIdentifier + ")")), a.elementX += f.x - h.x, a.elementY += f.y - h.y, h = {x:f.x, y:f.y}, a.triggerRedraw());
    }, listenerId:a.elementId});
    a.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerUp", handleEvent:function(f) {
      !d || e && e() || (DEBUG && a.controller.logMessage("End detected for touch " + a.touchIdentifier), a.controller.getCanvasXYFromClientXY(f), a.elementX += f.x - h.x, a.elementY += f.y - h.y, a.moveCompleted(f), a.touchIdentifier = null, b = !1, a.triggerRedraw());
    }, listenerId:a.elementId});
  }};
})();
CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators.moving = {type:"moving", applyTo:function(a, g) {
    var d, h, e, b, f, k = g.vx, c = g.vy, l = g.ax, m = g.ay, r = g.rotationSpeed;
    DEBUG && a.controller.logMessage("Applying moving decorator to " + a.elementName + "-" + a.elementId);
    var n, q, p;
    a.elementMoving = a.elementMoving || {};
    a.elementMoving.movingSpeed = new CreJs.Core.Vector(k || 0, c || 0);
    a.elementMoving.movingAcceleration = new CreJs.Core.Vector(l || 0, m || 0);
    a.elementMoving.omega = r || 0;
    n = a.controller.getTime();
    setInterval(function() {
      q = a.controller.getTime();
      p = q - n;
      if (!(1 > p) && (n = q, a.elementMoving.movingSpeed.x += a.elementMoving.movingAcceleration.x * p, a.elementMoving.movingSpeed.y += a.elementMoving.movingAcceleration.y * p, 0 != a.elementMoving.movingSpeed.x || 0 != a.elementMoving.movingSpeed.y || 0 != a.elementMoving.omega || a.elementScaleSpeed && (0 != a.elementScaleSpeed.x || 0 != a.elementScaleSpeed.y))) {
        d = a.elementX;
        h = a.elementY;
        e = a.elementAngle;
        b = a.elementScaleX;
        f = a.elementScaleY;
        a.elementX += a.elementMoving.movingSpeed.x * p;
        a.elementY += a.elementMoving.movingSpeed.y * p;
        a.elementAngle += a.elementMoving.omega * p;
        a.elementScaleSpeed && (a.elementScaleX += a.elementScaleSpeed.x * p, a.elementScaleY += a.elementScaleSpeed.y * p);
        var c = !0;
        a.preMove && a.preMove.forEach(function(b) {
          c && (b.call(a) || (c = !1));
        });
        c || (a.elementX = d, a.elementY = h, a.elementAngle = e, a.elementScaleX = b, a.elementScaleY = f);
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
    var h = [], e = new CreJs.Crelog.Logger;
    this.dispatch = function(b, f) {
      var k = g.GetGuid(), c = h.length;
      DEBUG && b && "pointerMove" != b.eventId && "drag" != b.eventId && "drop" != b.eventId && e.logMessage("Dispatching " + c + " " + b.eventId + ". (" + k + ")");
      h.forEach(function(g) {
        g.debugEvent = a;
        setTimeout(function() {
          DEBUG && b && "pointerMove" != b.eventId && e.logMessage("Actually handling " + b.eventId + ". (" + k + ")");
          g.handleEvent(b);
          c--;
          0 == c && f && f();
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
      h = h.sort(function(a, b) {
        return(a.rank || Infinity) - (b.rank || Infinity);
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
    var g = this, d = {}, h = [];
    this.hasEvent = function(a) {
      return void 0 != d[a];
    };
    var e = function(b) {
      h.push(b);
      d[b] = new a.Event(b);
    };
    this.addEventListenerX = function(a) {
      var f = a.eventId || a.eventId;
      d[f] || e(f);
      return d[f].addEventListenerX(a);
    };
    this.dispatch = function(a, f, e) {
      d[a] && (f && (f.eventId = a), d[a].dispatch(f, e));
    };
    this.removeEventListener = function(a) {
      d[a.eventId] ? d[a.eventId].removeEventListener(a) : h.forEach(function(e) {
        d[e].removeEventListener(a);
      });
    };
    this.registerControlEvent = function(a, f, h) {
      d[h] || e(h);
      a.addEventListenerX(f, function(a) {
        a.preventDefault();
        setTimeout(function() {
          g.dispatch(h, a);
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
  a.repeatString = function(g, d) {
    return 0 >= d ? "" : g + a.repeatString(g, d - 1);
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

