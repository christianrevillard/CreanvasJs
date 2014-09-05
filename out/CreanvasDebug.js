var TEST = true;
var DEBUG = true;
var CreJs = CreJs || {};
CreJs.Creanvas = CreJs.Creanvas || {};
window["CreJs"] = CreJs;
CreJs["Creanvas"] = CreJs.Creanvas;
if (TEST) {
  CreJs.Test = CreJs.Test || {};
  CreJs["Test"] = CreJs.Test;
}
;(function() {
  var core = CreJs.Core = CreJs.Core || {};
  core.Vector = function(x, y, z) {
    var vector = this;
    this.vectorX = x;
    this.vectorY = y;
    this.vectorZ = z || 0;
    this.draw = function(context, x, y, color) {
      context.lineWidth = 5;
      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 100 * vector.vectorX, y + 100 * vector.vectorY);
      context.stroke();
      context.lineWidth = 1;
      context.strokeStyle = "#000";
    };
    this.getCoordinates = function(unitVectors) {
      return{u:core.scalarProduct(vector, unitVectors.u), v:core.scalarProduct(vector, unitVectors.v), w:core.scalarProduct(vector, unitVectors.w)};
    };
    this.setCoordinates = function(unitVectors, u, v, w) {
      w = w || 0;
      vector.vectorX = u * unitVectors.u.vectorX + v * unitVectors.v.vectorX + w * unitVectors.w.vectorX;
      vector.vectorY = u * unitVectors.u.vectorY + v * unitVectors.v.vectorY + w * unitVectors.w.vectorY;
      vector.vectorZ = u * unitVectors.u.vectorZ + v * unitVectors.v.vectorZ + w * unitVectors.w.vectorZ;
    };
  };
  Object.defineProperty(core.Vector.prototype, "x", {get:function() {
    return this.vectorX;
  }, set:function(y) {
    this.vectorX = y;
  }});
  Object.defineProperty(core.Vector.prototype, "y", {get:function() {
    return this.vectorY;
  }, set:function(y) {
    this.vectorY = y;
  }});
  Object.defineProperty(core.Vector.prototype, "z", {get:function() {
    return this.vectorZ;
  }, set:function(y) {
    this.vectorZ = y;
  }});
  core.getUnitVectors = function(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var longueur = Math.sqrt(dx * dx + dy * dy);
    return{u:new core.Vector(dx / longueur, dy / longueur, 0), v:new core.Vector(-dy / longueur, dx / longueur, 0), w:new core.Vector(0, 0, 0)};
  };
  core.drawUnitVectors = function(context, x, y, unitVectors, color) {
    context.lineWidth = 5;
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 100 * unitVectors.u.vectorX, y + 100 * unitVectors.u.vectorY);
    context.moveTo(x, y);
    context.lineTo(x + 50 * unitVectors.v.vectorX, y + 50 * unitVectors.v.vectorY);
    context.stroke();
    context.lineWidth = 1;
    context.strokeStyle = "#000";
  };
  core.drawCoordinateVector = function(context, x, y, unitVectors, ux, vx, color) {
    context.lineWidth = 5;
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 100 * ux * unitVectors.u.vectorX, y + 100 * ux * unitVectors.u.vectorY);
    context.lineTo(x + 100 * ux * unitVectors.u.vectorX + 100 * vx * unitVectors.v.vectorX, y + 100 * ux * unitVectors.u.vectorY + 100 * vx * unitVectors.v.vectorY);
    context.stroke();
    context.lineWidth = 1;
    context.strokeStyle = "#000";
  };
  core.scalarProduct = function(v1, v2) {
    return v1.vectorX * v2.vectorX + v1.vectorY * v2.vectorY;
  };
  core.vectorProduct = function(v1, v2) {
    return new core.Vector(v1.vectorY * v2.vectorZ - v1.vectorZ * v2.vectorY, v1.vectorZ * v2.vectorX - v1.vectorX * v2.vectorZ, v1.vectorX * v2.vectorY - v1.vectorY * v2.vectorX);
  };
  CreJs["Core"] = CreJs.Core;
  CreJs.Core["Vector"] = CreJs.Core.Vector;
})();
if (TEST) {
  (function() {
    var core = CreJs.Test.Core = CreJs.Test.Core || {};
    core["test_Vector_constructor"] = function() {
      var x = 1, y = 2, z = 3;
      var vector = new CreJs.Core.Vector(x, y, z);
      if (vector.vectorX != x) {
        return "FAILED! vector.x: Expected " + x + ", was " + vector.vectorX;
      }
      if (vector.vectorY != y) {
        return "FAILED! vector.y: Expected " + y + ", was " + vector.vectorY;
      }
      if (vector.vectorZ != z) {
        return "FAILED! vector.z: Expected " + z + ", was " + vector.vectorZ;
      }
      return "OK";
    };
  })();
}
;(function() {
  CreJs.Creanvas.CollisionSolver = function(controller) {
    var findCollisionPoint = function(element, other) {
      var clientRectElement, clientRectOther, clientRectIntersection, imageAfter, edges;
      clientRectElement = element.getClientRect();
      clientRectOther = other.getClientRect();
      clientRectIntersection = {left:Math.max(clientRectElement.left, clientRectOther.left) - 1, right:Math.min(clientRectElement.right, clientRectOther.right) + 1, top:Math.max(clientRectElement.top, clientRectOther.top) - 1, bottom:Math.min(clientRectElement.bottom, clientRectOther.bottom) + 1};
      clientRectIntersection.width = clientRectIntersection.right - clientRectIntersection.left;
      clientRectIntersection.height = clientRectIntersection.bottom - clientRectIntersection.top;
      if (clientRectIntersection.width <= 0 || clientRectIntersection.height <= 0) {
        return;
      }
      var collisionImage = element.collisionContext.getImageData(0, 0, element.elementWidth, element.elementHeight);
      element.collisionContext.scale(1 / (element.elementScaleX || 1), 1 / (element.elementScaleY || 1));
      element.collisionContext.rotate(-(element.elementAngle || 0));
      element.collisionContext.translate(other.elementX - element.elementX, other.elementY - element.elementY);
      element.collisionContext.rotate(other.elementAngle || 0);
      element.collisionContext.scale(other.elementScaleX || 1, other.elementScaleY || 1);
      element.collisionContext.globalCompositeOperation = "destination-out";
      element.collisionContext.drawImage(other.collidedContext.canvas, 0, 0, other.elementWidth, other.elementHeight, -other.dx, -other.dy, other.elementWidth, other.elementHeight);
      element.collisionContext.scale(1 / (other.elementScaleX || 1), 1 / (other.elementScaleY || 1));
      element.collisionContext.rotate(-other.elementAngle || 0);
      element.collisionContext.translate(-other.elementX + element.elementX, -other.elementY + element.elementY);
      element.collisionContext.rotate(element.elementAngle || 0);
      element.collisionContext.scale(element.elementScaleX || 1, element.elementScaleY || 1);
      imageAfter = element.collisionContext.getImageData(0, 0, element.elementWidth, element.elementHeight);
      element.collisionContext.globalCompositeOperation = "source-over";
      element.collisionContext.putImageData(collisionImage, 0, 0);
      edges = [];
      element.edges.forEach(function(edgePoint) {
        if (imageAfter.data[edgePoint.y * element.elementWidth * 4 + edgePoint.x * 4 + 3] < 90) {
          edges.push(edgePoint);
        }
      });
      if (edges.length < 2) {
        return null;
      }
      var d, dmax = 0;
      var theMax = {i:0, j:edges.length - 1};
      for (var i = 1;i < edges.length;i++) {
        for (var j = i + 1;j < edges.length;j++) {
          var dx = edges[i].x - edges[j].x;
          var dy = edges[i].y - edges[j].y;
          d = Math.sqrt(dx * dx + dy * dy);
          if (d > dmax) {
            dmax = d;
            theMax.i = i;
            theMax.j = j;
          }
        }
      }
      var point1 = element.getCanvasXY(edges[theMax.i].x - element.dx, edges[theMax.i].y - element.dy);
      var point2 = element.getCanvasXY(edges[theMax.j].x - element.dx, edges[theMax.j].y - element.dy);
      if (point1.x == point2.x && point1.y == point2.y) {
        return null;
      }
      return{x:Math.round((point1.x + point2.x) / 2), y:Math.round((point1.y + point2.y) / 2), vectors:CreJs.Core.getUnitVectors(point1.x, point1.y, point2.x, point2.y)};
    };
    var updateAfterCollision = function(element, other, collisionPoint) {
      var colVectors, speedElement, speedOther, localSpeedElement, localSpeedOther, centerCollisionElement, l1, centerCollisionOther, l2;
      colVectors = collisionPoint.vectors;
      centerCollisionElement = new CreJs.Core.Vector(collisionPoint.x - element.elementX, collisionPoint.y - element.elementY);
      l1 = CreJs.Core.vectorProduct(centerCollisionElement, colVectors.v).z;
      centerCollisionOther = new CreJs.Core.Vector(collisionPoint.x - other.elementX, collisionPoint.y - other.elementY);
      l2 = CreJs.Core.vectorProduct(centerCollisionOther, colVectors.v).z;
      var elementRot = CreJs.Core.vectorProduct(centerCollisionElement, colVectors.v);
      var otherRot = CreJs.Core.vectorProduct(centerCollisionOther, colVectors.v);
      speedElement = new CreJs.Core.Vector(element.elementMoving.movingSpeed.x, element.elementMoving.movingSpeed.y);
      speedOther = new CreJs.Core.Vector(other.elementMoving.movingSpeed.x, other.elementMoving.movingSpeed.y);
      if (element.elementScaleSpeed) {
        speedElement.x += centerCollisionElement.x * element.elementScaleSpeed.x;
        speedElement.y += centerCollisionElement.y * element.elementScaleSpeed.y;
      }
      if (other.elementScaleSpeed) {
        speedOther.x += centerCollisionOther.x * other.elementScaleSpeed.x;
        speedOther.y += centerCollisionOther.y * other.elementScaleSpeed.y;
      }
      localSpeedElement = speedElement.getCoordinates(colVectors);
      localSpeedOther = speedOther.getCoordinates(colVectors);
      var F = element.collidable.coefficient * other.collidable.coefficient * 2 * (localSpeedOther.v - localSpeedElement.v + other.elementMoving.omega * otherRot.z - element.elementMoving.omega * elementRot.z) / (1 / other.elementMass + 1 / element.elementMass + otherRot.z * otherRot.z / other.getMomentOfInertia() + elementRot.z * elementRot.z / element.getMomentOfInertia());
      element.elementMoving.movingSpeed.x += F / element.elementMass * colVectors.v.x;
      element.elementMoving.movingSpeed.y += F / element.elementMass * colVectors.v.y;
      other.elementMoving.movingSpeed.x -= F / other.elementMass * colVectors.v.x;
      other.elementMoving.movingSpeed.y -= F / other.elementMass * colVectors.v.y;
      element.elementMoving.omega += F * l1 / element.getMomentOfInertia();
      other.elementMoving.omega -= F * l2 / other.getMomentOfInertia();
    };
    var getCollidableElements = function() {
      return controller.elements.filter(function(e) {
        return e.collidable;
      });
    };
    this.solveCollision = function(element) {
      var toCheck = getCollidableElements();
      var others, center, collisionPoint, other;
      center = element.getCenter();
      others = toCheck.filter(function(other) {
        var otherCenter;
        if (other.elementId === element.elementId || !other.elementMoving.movingSpeed.x && !other.elementMoving.movingSpeed.y && !element.elementMoving.movingSpeed.x && !element.elementMoving.movingSpeed.y && !other.elementScaleSpeed && !element.elementScaleSpeed) {
          return false;
        }
        otherCenter = other.getCenter();
        if (Math.sqrt((center.x - otherCenter.x) * (center.x - otherCenter.x) + (center.y - otherCenter.y) * (center.y - otherCenter.y)) > element.getRadius() + other.getRadius()) {
          return false;
        }
        return true;
      });
      if (others.length == 0) {
        return true;
      }
      collisionPoint = null;
      others.forEach(function(checkCollisionWith) {
        if (collisionPoint) {
          return;
        }
        collisionPoint = findCollisionPoint(element, checkCollisionWith);
        if (collisionPoint) {
          other = checkCollisionWith;
        }
      });
      if (!collisionPoint) {
        return true;
      }
      updateAfterCollision(element, other, collisionPoint);
      element.elementEvents.dispatch("collision", {element:other, collisionPoint:collisionPoint});
      other.elementEvents.dispatch("collision", {element:element, collisionPoint:collisionPoint});
      return false;
    };
  };
})();
(function() {
  CreJs.Creanvas.Controller = function(controllerData) {
    var canvas, needRedraw, refreshTime, controller, time, timeStart, timeScale, meterPerPoint;
    controller = this;
    canvas = controllerData["canvas"];
    timeScale = controllerData["timeScale"] || 1;
    meterPerPoint = controllerData["meterPerPoint"] || 1;
    if (controllerData.realTime) {
      timeStart = Date.now();
      this.getTime = function() {
        return(Date.now() - timeStart) * timeScale;
      };
    } else {
      time = 0;
      setInterval(function() {
        time += 10 * timeScale;
      }, 10);
      this.getTime = function() {
        return time;
      };
    }
    this.logMessage = function(logData) {
      if (controllerData["log"]) {
        controllerData["log"](logData);
      }
    };
    if (DEBUG) {
      this.logMessage("Starting controller");
    }
    controller.context = canvas.getContext("2d");
    controller.context.setTransform(1, 0, 0, 1, 0, 0);
    controller.context.scale(1 / meterPerPoint, 1 / meterPerPoint);
    needRedraw = true;
    isDrawing = false;
    refreshTime = controllerData["refreshTime"] || 50;
    this.triggerPointedElementEvent = function(eventId, event) {
      var hit = false;
      controller.elements.filter(function(e) {
        return e.canHandle(eventId);
      }).sort(function(a, b) {
        return b.elementZ || 0 - a.elementZ || 0;
      }).forEach(function(element) {
        if (hit) {
          return;
        }
        if (element.hit(event.x, event.y)) {
          element.elementEvents.dispatch(eventId, event);
          hit = true;
        }
      });
    };
    this.triggerElementEventByIdentifier = function(eventId, event) {
      controller.elements.forEach(function(element) {
        if (element.touchIdentifier == event.touchIdentifier) {
          element.elementEvents.dispatch(eventId, event);
        }
      });
    };
    this.registerCanvasPointerEvent = function(controlEventId, customEventId) {
      canvas.addEventListener(controlEventId, function(event) {
        setTimeout(function() {
          var triggerEvent = function(clientXY, touchIdentifier) {
            if (DEBUG) {
              controller.logMessage("Canvas event " + controlEventId + " with touchIdentifier " + touchIdentifier);
            }
            var eventData = controller.getCanvasXYFromClientXY(clientXY);
            eventData.touchIdentifier = touchIdentifier;
            controller.triggerPointedElementEvent(customEventId, eventData);
          };
          if (event.changedTouches) {
            for (var i = 0;i < event.changedTouches.length;i++) {
              triggerEvent(event.changedTouches[i], event.changedTouches[i].identifier);
            }
          } else {
            triggerEvent(event, -1);
          }
        });
      });
    };
    this.registerTouchIdentifierEvent = function(controlEventId, customEventId) {
      canvas.addEventListener(controlEventId, function(event) {
        setTimeout(function() {
          var triggerEvent = function(clientXY, touchIdentifier) {
            if (DEBUG) {
              controller.logMessage("Canvas event " + controlEventId + " with touchIdentifier " + touchIdentifier);
            }
            var eventData = controller.getCanvasXYFromClientXY(clientXY);
            eventData.touchIdentifier = touchIdentifier;
            controller.triggerElementEventByIdentifier(customEventId, eventData);
          };
          if (event.changedTouches) {
            for (var i = 0;i < event.changedTouches.length;i++) {
              triggerEvent(event.changedTouches[i], event.changedTouches[i].identifier);
            }
          } else {
            triggerEvent(event, -1);
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
      controller.elementEvents.dispatch("deactivate");
      controller.elements = [];
    };
    this.triggerRedraw = function() {
      needRedraw = true;
    };
    this.getCanvasXYFromClientXY = function(clientXY) {
      var boundings = canvas.getBoundingClientRect();
      controller.logMessage("ClientXY: (" + clientXY.clientX + "," + clientXY.clientY + ")");
      var xy = {x:Math.round((clientXY.clientX - boundings.left) * canvas.width / boundings.width * meterPerPoint), y:Math.round((clientXY.clientY - boundings.top) * canvas.height / boundings.height * meterPerPoint)};
      controller.logMessage("canvasXY: (" + xy.x + "," + xy.y + ")");
      if (clientXY.type == "click") {
        controller.logMessage("Click on ! canvasXY: (" + xy.x + "," + xy.y + ")");
      }
      return xy;
    };
    controller.elements = [];
    this.add = function() {
      if (DEBUG) {
        controller.logMessage("Controller.addElement: Adding element - args:" + arguments.length);
      }
      var args = [].slice.call(arguments);
      var element = new CreJs.Creanvas.Element(controller, args[0]);
      if (DEBUG) {
        controller.logMessage("Controller.addElement: Created element: " + element.elementName + "-" + element.elementId);
      }
      if (args.length > 1) {
        if (DEBUG) {
          controller.logMessage("Controller.addElement: Applying " + (args.length - 1) + " decorators");
        }
        element.applyElementDecorators.apply(element, args.slice(1));
      } else {
        if (DEBUG) {
          controller.logMessage("Controller.addElement: No decorator to apply");
        }
      }
      controller.elements.push(element);
      return element;
    };
    controller.logMessage("Adding background");
    this.add({elementName:"background", elementImage:{imageWidth:canvas.width, imageHeight:canvas.height, imageTranslate:{translateDx:0, translateDy:0}, imageDraw:controllerData["drawBackground"] || function(context) {
      context.fillStyle = controllerData["backgroundStyle"] || "#FFF";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }}, elementPosition:{positionZ:-Infinity}});
    setInterval(function() {
      if (needRedraw && !isDrawing) {
        isDrawing = true;
        controller.elements.sort(function(a, b) {
          return(a.elementZ || 0) - (b.elementZ || 0);
        }).forEach(function(element) {
          controller.context.translate(element.elementX, element.elementY);
          controller.context.rotate(element.elementAngle || 0);
          controller.context.scale(element.elementScaleX || 1, element.elementScaleY || 1);
          controller.context.drawImage(element.temporaryRenderingContext.canvas, 0, 0, element.elementWidth, element.elementHeight, -element.dx, -element.dy, element.elementWidth, element.elementHeight);
          controller.context.scale(1 / (element.elementScaleX || 1), 1 / element.elementScaleY || 1);
          controller.context.rotate(-(element.elementAngle || 0));
          controller.context.translate(-element.elementX, -element.elementY);
        });
        isDrawing = false;
      } else {
        controller.logMessage("No redraw");
      }
    }, refreshTime);
    var convertExternInput = function(elementDefinition) {
      return{elementName:elementDefinition["name"], elementImage:elementDefinition["image"] ? {imageWidth:elementDefinition["image"]["width"], imageHeight:elementDefinition["image"]["height"], imageDraw:elementDefinition["image"]["draw"], imageTranslate:elementDefinition["image"]["translate"] ? {translateDx:elementDefinition["image"]["translate"]["dx"], translateDy:elementDefinition["image"]["translate"]["dy"]} : null} : null, elementPosition:elementDefinition["position"] ? {positionX:elementDefinition["position"]["x"] || 
      0, positionY:elementDefinition["position"]["y"] || 0, positionZ:elementDefinition["position"]["z"] || 0} : null, rules:elementDefinition["rules"]};
    };
    this["addElement"] = function() {
      var args = [].slice.call(arguments);
      args[0] = convertExternInput(args[0]);
      return this.add.apply(this, args);
    };
    this["redraw"] = this.triggerRedraw;
    this["stop"] = this.stopController;
  };
  CreJs.Creanvas["Controller"] = CreJs.Creanvas.Controller;
})();
(function() {
  var creanvas = CreJs.Creanvas;
  creanvas.Element = function(controller, elementDefinition) {
    this.elementName = elementDefinition.elementName;
    var image = elementDefinition.elementImage;
    var draw = image.imageDraw;
    var position = elementDefinition.elementPosition;
    var rules = elementDefinition.rules;
    var decoratorArguments = [].slice.apply(arguments).slice(2);
    var cachedResults = [];
    this.controller = controller;
    this.elementId = CreJs.CreHelpers.GetGuid();
    this.elementWidth = image.imageWidth;
    this.elementHeight = image.imageHeight;
    this.elementX = position.positionX || 0;
    this.elementY = position.positionY || 0;
    this.elementZ = position.positionZ || 0;
    this.elementAngle = position.positionAngle || 0;
    this.elementScaleX = image.imageScaleX || 1;
    this.elementScaleY = image.imageScaleY || 1;
    this.elementMass = 1;
    var translate = image.imageTranslate || {translateDx:image.imageWidth / 2, translateDy:image.imageHeight / 2};
    this.dx = translate.translateDx;
    this.dy = translate.translateDy;
    if (image.rawImage) {
      this.elementImage = image.rawImage;
      var canvas = this.controller.context.canvas;
      var tempCanvas = canvas.ownerDocument.createElement("canvas");
      this.temporaryRenderingContext = tempCanvas.getContext("2d");
      this.temporaryRenderingContext.putImageData(this.elementImage, 0, 0);
    } else {
      var canvas = this.controller.context.canvas;
      var tempCanvas = canvas.ownerDocument.createElement("canvas");
      tempCanvas.width = image.imageWidth;
      tempCanvas.height = image.imageHeight;
      this.temporaryRenderingContext = tempCanvas.getContext("2d");
      this.temporaryRenderingContext.beginPath();
      this.temporaryRenderingContext.translate(this.dx, this.dy);
      draw(this.temporaryRenderingContext);
      this.elementImage = this.temporaryRenderingContext.getImageData(0, 0, image.imageWidth, image.imageHeight);
    }
    var element = this;
    if (DEBUG) {
      element.debug = function(source, message) {
        element.controller.logMessage("Element." + source + ": " + message + ". Element: " + element.elementName + "/" + element.elementId);
      };
    }
    if (rules) {
      element.rules = [];
      rules.forEach(function(rule) {
        var ruleId = element.rules.length;
        element.rules.push(rule);
        setInterval(function() {
          element.rules[ruleId]["rule"].call(element);
          element.triggerRedraw();
        }, rule["checkTime"]);
      });
    }
    this.elementEvents = new CreJs.Creevents.EventContainer;
    this.isPointInPath = function(clientXY) {
      var canvasXY = element.controller.getCanvasXYFromClientXY(clientXY);
      return element.controller.noDrawContext.isPointInPath(element, draw, canvasXY);
    };
    if (decoratorArguments.length > 0 && CreJs.Creanvas.elementDecorators) {
      if (DEBUG) {
        controller.logMessage("New element " + elementName + " : apply " + decoratorArguments.length + " decorators");
      }
      element.applyElementDecorators(decoratorArguments);
    }
    this.hit = function(pointerX, pointerY) {
      var imageX = Math.round(pointerX - element.elementX + element.dx);
      var imageY = Math.round(pointerY - element.elementY + element.dy);
      var xx = imageX >= 0 && imageX <= element.elementWidth && imageY >= 0 && imageY <= element.elementHeight && element.elementImage.data[4 * imageY * element.elementWidth + 4 * imageX + 3] > 0;
      if (DEBUG) {
        element.debug("hit", xx ? "hit" : "no hit");
      }
      return xx;
    };
    this.cloneElement = function(ignoreDecorators) {
      image.image = element.elementImage;
      if (DEBUG) {
        element.debug("cloneElement", "start cloning");
      }
      var newElement = element.controller.add(elementDefinition);
      var decoratorsToApply = ignoreDecorators ? decoratorArguments.filter(function(d) {
        return ignoreDecorators.every(function(toIgnore) {
          return toIgnore != d[0];
        });
      }) : decoratorArguments;
      if (DEBUG) {
        element.debug("cloneElement", "apply " + decoratorsToApply.length + " decorators");
      }
      newElement.applyElementDecorators.apply(newElement, decoratorsToApply);
      return newElement;
    };
    this.removeElementDecorator = function(decoratorType) {
      if (DEBUG) {
        element.debug("removeElementDecorator", decoratorType);
      }
      var decorator = CreJs.Creanvas.elementDecorators[decoratorType];
      if (decorator && decorator.removeFrom) {
        decorator.removeFrom(element);
      } else {
        if (DEBUG) {
          element.debug("removeElementDecorator", "Cannot remove: " + decoratorType);
        }
      }
    };
    this.canHandle = function(eventId) {
      return eventId == "click" || eventId == "pointerDown" || element.elementEvents.hasEvent(eventId);
    };
    this.deactivate = function() {
      element.controller.elementEvents.removeEventListener({listenerId:element.elementId});
      element.temporaryRenderingContext = null;
    };
    element.controller.elementEvents.addEventListenerX({"eventId":"deactivate", "listenerId":element.elementId, "handleEvent":function(e) {
      element.deactivate();
    }});
    this.triggerRedraw = function() {
      element.controller.triggerRedraw();
    };
    this.getCanvasXY = function(imageX, imageY) {
      return{x:Math.round(element.elementX + imageX * element.elementScaleX * Math.cos(element.elementAngle) - imageY * element.elementScaleY * Math.sin(element.elementAngle)), y:Math.round(element.elementY + imageX * element.elementScaleX * Math.sin(element.elementAngle) + imageY * element.elementScaleY * Math.cos(element.elementAngle))};
    };
    this.getCanvasXYNoRounding = function(imageX, imageY) {
      return{x:element.elementX + imageX * element.elementScaleX * Math.cos(element.elementAngle) - imageY * element.elementScaleY * Math.sin(element.elementAngle), y:element.elementY + imageX * element.elementScaleX * Math.sin(element.elementAngle) + imageY * element.elementScaleY * Math.cos(element.elementAngle)};
    };
    this.getElementXY = function(canvasX, canvasY) {
      return{x:Math.round(((canvasX - element.elementX) * Math.cos(element.elementAngle) + (canvasY - element.elementY) * Math.sin(element.elementAngle)) / element.elementScaleX), y:Math.round(((canvasY - element.elementY) * Math.cos(element.elementAngle) - (canvasX - element.elementX) * Math.sin(element.elementAngle)) / element.elementScaleY)};
    };
    this.getCenter = function() {
      return element.getCanvasXY(-element.dx + element.elementWidth / 2, -element.dy + element.elementHeight / 2);
    };
    var corners = [];
    corners.push({x:-element.dx, y:-element.dy});
    corners.push({x:-element.dx + element.elementWidth, y:-element.dy});
    corners.push({x:-element.dx + element.elementWidth, y:-element.dy + element.elementHeight});
    corners.push({x:-element.dx, y:-element.dy + element.elementHeight});
    this.getClientCornersCache = function() {
      return corners.map(function(point) {
        return element.getCanvasXY(point.x, point.y);
      });
    };
    this.getClientCorners = function() {
      var key = element.elementX + "" + element.elementY + "" + element.elementAngle + "" + element.elementScaleX + "" + element.elementScaleX;
      if (cachedResults["getClientCorners"] && cachedResults["getClientCorners"].key == key) {
        return cachedResults["getClientCorners"].value;
      }
      var value = element.getClientCornersCache();
      cachedResults["getClientCorners"] = {key:key, value:value};
      return value;
    };
    this.getClientRectCache = function() {
      var clientCorners = element.getClientCorners();
      return{top:clientCorners.reduce(function(a, b) {
        return Math.min(a, b.y);
      }, Infinity), bottom:clientCorners.reduce(function(a, b) {
        return Math.max(a, b.y);
      }, -Infinity), left:clientCorners.reduce(function(a, b) {
        return Math.min(a, b.x);
      }, Infinity), right:clientCorners.reduce(function(a, b) {
        return Math.max(a, b.x);
      }, -Infinity)};
    };
    this.getClientRect = function() {
      var key = element.elementX + "" + element.elementY + "" + element.elementAngle + "" + element.elementScaleX + "" + element.elementScaleX;
      if (cachedResults["getClientRect"] && cachedResults["getClientRect"].key == key) {
        return cachedResults["getClientRect"].value;
      }
      var value = element.getClientRectCache();
      cachedResults["getClientRect"] = {key:key, value:value};
      return value;
    };
    this.applyElementDecorators = function() {
      var element = this;
      var newDecorators = [].slice.apply(arguments);
      decoratorArguments = decoratorArguments.concat(newDecorators);
      newDecorators.forEach(function(decoratorArgument) {
        element.applyElementDecorator(decoratorArgument[0], decoratorArgument[1]);
      });
    };
    this.applyElementDecorator = function(decoratorType, decoratorSettings) {
      var element = this;
      if (DEBUG) {
        element.debug("applyElementDecorator", decoratorType);
      }
      var decorator = CreJs.Creanvas.elementDecorators[decoratorType];
      if (decorator) {
        decorator.applyTo(element, decoratorSettings);
      } else {
        if (DEBUG) {
          element.debug("applyElementDecorator", "Not found: " + decoratorType);
        }
      }
    };
    Object.defineProperty(element, "name", {get:function() {
      return this.elementName;
    }, set:function(y) {
      this.elementName = y;
    }});
    Object.defineProperty(element, "width", {get:function() {
      return this.elementWidth;
    }, set:function(y) {
      this.elementWidth = y;
    }});
    Object.defineProperty(element, "height", {get:function() {
      return this.elementHeight;
    }, set:function(y) {
      this.elementHeight = y;
    }});
    Object.defineProperty(element, "scaleX", {get:function() {
      return this.elementScaleX;
    }, set:function(y) {
      this.elementScaleX = y;
    }});
    Object.defineProperty(element, "scaleY", {get:function() {
      return this.elementScaleY;
    }, set:function(y) {
      this.elementScaleY = y;
    }});
    Object.defineProperty(element, "x", {get:function() {
      return this.elementX;
    }, set:function(y) {
      this.elementX = y;
    }});
    Object.defineProperty(element, "y", {get:function() {
      return this.elementY;
    }, set:function(y) {
      this.elementY = y;
    }});
    Object.defineProperty(element, "z", {get:function() {
      return this.elementZ;
    }, set:function(y) {
      this.elementZ = y;
    }});
    Object.defineProperty(element, "angle", {get:function() {
      return this.elementAngle;
    }, set:function(y) {
      this.elementAngle = y;
    }});
    Object.defineProperty(element, "mass", {get:function() {
      return this.elementMass;
    }, set:function(y) {
      this.elementMass = y;
    }});
    Object.defineProperty(element, "id", {get:function() {
      return this.elementId;
    }});
    Object.defineProperty(element, "image", {get:function() {
      return this.elementImage;
    }});
    Object.defineProperty(element, "events", {get:function() {
      return this.elementEvents;
    }});
    element["clone"] = element.cloneElement;
    element["applyDecorator"] = element.applyElementDecorator;
    element["applyDecorators"] = element.applyElementDecorators;
    element["removeDecorator"] = element.removeElementDecorator;
  };
})();
var CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators["clickable"] = {applyTo:function(element, clickData) {
    var onclick = clickData["onclick"];
    element.onClick = function(event) {
      if (DEBUG) {
        element.debug("onClick", onclick);
      }
      onclick.call(element, event);
      element.triggerRedraw();
    };
    element.elementEvents.addEventListenerX({eventId:"click", handleEvent:element.onClick});
  }};
})();
var CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators["collidable"] = {applyTo:function(element, collidableData) {
    var cachedResults = [];
    element.collidable = {};
    var onCollision = collidableData["onCollision"];
    var collisionCoefficient = collidableData["coefficient"];
    element.controller.collisionSolver = element.controller.collisionSolver || new CreJs.Creanvas.CollisionSolver(element.controller);
    element.collidable.coefficient = !collisionCoefficient && collisionCoefficient !== 0 ? 1 : collisionCoefficient;
    element.elementMoving = element.elementMoving || {movingSpeed:new CreJs.Core.Vector(0, 0), movingAcceleration:new CreJs.Core.Vector(0, 0), omega:0};
    element.elementEvents.addEventListenerX({eventId:"collision", handleEvent:function(collisionEvent) {
      if (onCollision) {
        onCollision.call(element, collisionEvent);
      }
    }});
    element.preMove = this.preMove || [];
    element.preMove.push(function() {
      return element.controller.collisionSolver.solveCollision(element);
    });
    element.getMomentOfInertia = function() {
      return element.elementMass / 12 * (element.elementWidth * element.elementScaleX * element.elementWidth * element.elementScaleX + element.elementHeight * element.elementScaleY * element.elementHeight * element.elementScaleY);
    };
    element.geRadiusCache = function() {
      return Math.sqrt(element.elementWidth * element.elementWidth * element.elementScaleX * element.elementScaleX + element.elementHeight * element.elementHeight * element.elementScaleY * element.elementScaleY) / 2;
    };
    element.getRadius = function() {
      var key = element.elementWidth + "" + element.elementHeight + "" + element.elementScaleX + "" + element.elementScaleY;
      if (cachedResults["getRadius"] && cachedResults["getRadius"].key == key) {
        return cachedResults["getRadius"].value_;
      }
      var value = element.geRadiusCache();
      cachedResults["geRadius"] = {kevectorY:key, value_:value};
      return value;
    };
    var canvas = element.controller.context.canvas;
    var tempCollisionCanvas = canvas.ownerDocument.createElement("canvas");
    var tempCollidedCanvas = canvas.ownerDocument.createElement("canvas");
    tempCollisionCanvas.width = tempCollidedCanvas.width = element.elementWidth;
    tempCollisionCanvas.height = tempCollidedCanvas.height = element.elementHeight;
    element.collidedContext = tempCollidedCanvas.getContext("2d");
    element.collidedContext.putImageData(element.elementImage, 0, 0);
    element.collidedContext.globalCompositeOperation = "source-atop";
    element.collidedContext.fillStyle = "#000";
    element.collidedContext.fillRect(0, 0, element.elementWidth, element.elementHeight);
    element.collisionContext = tempCollisionCanvas.getContext("2d");
    element.collisionContext.globalCompositeOperation = "source-over";
    element.collisionContext.drawImage(element.collidedContext.canvas, 0, 0);
    var collisionImageOld = element.collisionContext.getImageData(0, 0, element.elementWidth, element.elementHeight);
    var collisionImageNew = element.collisionContext.createImageData(element.elementWidth, element.elementHeight);
    element.edges = [];
    for (var imageX = 0;imageX < element.elementWidth;imageX++) {
      for (var imageY = 0;imageY < element.elementHeight;imageY++) {
        if (collisionImageOld.data[imageY * element.elementWidth * 4 + imageX * 4 + 3] < 200) {
          continue;
        }
        var edge = false;
        for (var i = -1;i < 2;i++) {
          for (var j = -1;j < 2;j++) {
            if (imageY + i < 0 || imageX + j < 0 || imageY + i > element.elementHeight - 1 || imageX + i > element.elementWidth - 1 || collisionImageOld.data[(imageY + i) * element.elementWidth * 4 + (imageX + j) * 4 + 3] < 100) {
              edge = true;
              i = 2;
              j = 2;
            }
          }
        }
        var fillValue = 255;
        element.collisionContext.putImageData(collisionImageNew, 0, 0);
        if (edge) {
          element.edges.push({x:imageX, y:imageY});
          collisionImageNew.data[imageY * element.elementWidth * 4 + imageX * 4] = 0;
          collisionImageNew.data[imageY * element.elementWidth * 4 + imageX * 4 + 1] = 0;
          collisionImageNew.data[imageY * element.elementWidth * 4 + imageX * 4 + 2] = 0;
          collisionImageNew.data[imageY * element.elementWidth * 4 + imageX * 4 + 3] = fillValue;
        }
      }
    }
    element.collisionContext.putImageData(collisionImageNew, 0, 0);
    element.collisionContext.translate(element.dx, element.dy);
  }};
})();
var CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators["droppable"] = {applyTo:function(element, droppableData) {
    var dropZone = droppableData["dropZone"];
    element.isDroppable = true;
    element.elementDropZone = dropZone;
    if (DEBUG) {
      element.debug("droppable.applyTo", "Now droppable");
    }
    Object.defineProperty(element, "dropZone", {get:function() {
      return this.elementDropZone;
    }, set:function(y) {
      this.elementDropZone = y;
    }});
  }};
})();
var CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators["dropzone"] = {applyTo:function(element, dropzoneData) {
    var availableSpots = dropzoneData["availableSpots"];
    var dropX = dropzoneData["dropX"];
    var dropY = dropzoneData["dropY"];
    element.droppedElementsList = [];
    var drop = function(e) {
      if (availableSpots <= 0) {
        return;
      }
      if (DEBUG) {
        element.controller.logMessage("drop event on dropzone " + element.elementId + ", dropped " + e.droppedElement.id);
      }
      availableSpots--;
      e.droppedElement.x = dropX || element.elementX;
      e.droppedElement.y = dropY || element.elementY;
      e.droppedElement.dropZone = element;
      element.droppedElementsList.push(e.droppedElement);
      e.droppedElement.elementEvents.dispatch("dropped", {dropZone:element, droppedElement:e.droppedElement});
      element.elementEvents.dispatch("droppedIn", {dropZone:element, droppedElement:e.droppedElement});
      element.triggerRedraw();
    };
    element.elementEvents.addEventListenerX({eventGroupType:"dropzone", eventId:"drop", handleEvent:drop, listenerId:element.elementId});
    element.drag = function(draggedElement) {
      if (DEBUG) {
        element.controller.logMessage("dragging from dropzone " + element.elementId + ", dragged " + draggedElement.id);
      }
      draggedElement.dropZone = null;
      availableSpots++;
      element.droppedElementsList.splice(element.droppedElementsList.indexOf(draggedElement), 1);
      element.triggerRedraw();
    };
    Object.defineProperty(element, "droppedElements", {get:function() {
      return this.droppedElementsList;
    }});
  }};
})();
var CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators["duplicable"] = {applyTo:function(element, duplicableData) {
    var isBlocked = duplicableData["isBlocked"];
    var generatorCount = duplicableData["generatorCount"] || Infinity;
    if (DEBUG) {
      element.debug("duplicable.applyTo", "generatorCount is " + generatorCount);
    }
    var requiresTouch = false;
    var makeCopy = function(e) {
      if (e.touchIdentifier >= 0) {
        requiresTouch = true;
      }
      if (requiresTouch && e.touchIdentifier < 0) {
        return;
      }
      if (isBlocked && isBlocked()) {
        return;
      }
      if (DEBUG) {
        element.debug("duplicable.makeCopy", "GeneratorCount was: " + generatorCount);
      }
      if (generatorCount <= 0) {
        return;
      }
      generatorCount--;
      if (DEBUG) {
        element.debug("duplicable.makeCopy", "GeneratorCount is now: " + generatorCount);
      }
      var copy = element.cloneElement(["duplicable"]);
      copy.elementName += " (duplicate)";
      copy.applyElementDecorator("movable", {isBlocked:isBlocked});
      copy.startMoving(e);
      element.triggerRedraw();
    };
    element.elementEvents.addEventListenerX({eventGroupType:"duplicable", eventId:"pointerDown", handleEvent:makeCopy, listenerId:element.elementId});
  }, removeFrom:function(element) {
    element.elementEvents.removeEventListener({eventGroupType:"duplicable", listenerId:element.elementId});
  }};
})();
(function() {
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas["elementDecorators"] = CreJs.Creanvas.elementDecorators;
})();
var CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators["movable"] = {applyTo:function(element, movableData) {
    var isMoving = false;
    this.touchIdentifier = null;
    var movingFrom = null;
    var isBlocked = movableData.isBlocked;
    element.startMoving = function(e) {
      if (DEBUG) {
        element.controller.logMessage("Starting moving - identifier: " + e.touchIdentifier);
      }
      isMoving = true;
      element.touchIdentifier = e.touchIdentifier;
      movingFrom = {x:e.x, y:e.y};
      if (element.dropZone) {
        element.dropZone.drag(element);
        element.dropZone = null;
      }
    };
    element.moveCompleted = function(e) {
      if (DEBUG) {
        element.controller.logMessage("Completed move - identifier: " + e.touchIdentifier);
      }
      isMoving = false;
      movingFrom = null;
      if (element.isDroppable) {
        if (DEBUG) {
          element.controller.logMessage("Trigger drop - identifier: " + e.touchIdentifier);
        }
        element.controller.triggerPointedElementEvent("drop", {x:e.x, y:e.y, droppedElement:element});
      }
    };
    var beginMove = function(e) {
      if (isBlocked && isBlocked()) {
        return;
      }
      element.startMoving(e);
    };
    element.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerDown", handleEvent:beginMove, listenerId:element.elementId});
    var isMovingLogged = false;
    var move = function(e) {
      if (!isMoving) {
        return;
      }
      if (isBlocked && isBlocked()) {
        return;
      }
      if (!isMovingLogged) {
        isMovingLogged = true;
        if (DEBUG) {
          element.controller.logMessage("pointereMove event on movable " + element.elementId + " (" + element.touchIdentifier + ")");
        }
      }
      element.elementX += e.x - movingFrom.x;
      element.elementY += e.y - movingFrom.y;
      movingFrom = {x:e.x, y:e.y};
      element.triggerRedraw();
    };
    element.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerMove", handleEvent:move, listenerId:element.elementId});
    var moveend = function(e) {
      if (!isMoving) {
        return;
      }
      if (isBlocked && isBlocked()) {
        return;
      }
      if (DEBUG) {
        element.controller.logMessage("End detected for touch " + element.touchIdentifier);
      }
      var canvasXY = element.controller.getCanvasXYFromClientXY(e);
      element.elementX += e.x - movingFrom.x;
      element.elementY += e.y - movingFrom.y;
      element.moveCompleted(e);
      element.touchIdentifier = null;
      isMovingLogged = false;
      element.triggerRedraw();
    };
    element.elementEvents.addEventListenerX({eventGroupType:"movable", eventId:"pointerUp", handleEvent:moveend, listenerId:element.elementId});
  }};
})();
var CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators["moving"] = {type:"moving", applyTo:function(element, elementMoving) {
    var vx = elementMoving["vx"];
    var vy = elementMoving["vy"];
    var ax = elementMoving["ax"];
    var ay = elementMoving["ay"];
    var omega = elementMoving["rotationSpeed"];
    if (DEBUG) {
      element.controller.logMessage("Applying moving decorator to " + element.elementName + "-" + element.elementId);
    }
    var lastUpdated, currentTime, dt, rollbackData;
    element.elementMoving = element.elementMoving || {};
    element.elementMoving.movingSpeed = new CreJs.Core.Vector(vx || 0, vy || 0);
    element.elementMoving.movingAcceleration = new CreJs.Core.Vector(ax || 0, ay || 0);
    element.elementMoving.omega = omega || 0;
    lastUpdated = element.controller.getTime();
    setInterval(function() {
      currentTime = element.controller.getTime();
      dt = currentTime - lastUpdated;
      if (dt < 1) {
        return;
      }
      lastUpdated = currentTime;
      element.elementMoving.movingSpeed.x += element.elementMoving.movingAcceleration.x * dt;
      element.elementMoving.movingSpeed.y += element.elementMoving.movingAcceleration.y * dt;
      if (element.elementMoving.movingSpeed.x == 0 && element.elementMoving.movingSpeed.y == 0 && element.elementMoving.omega == 0 && (!element.elementScaleSpeed || element.elementScaleSpeed.x == 0 && element.elementScaleSpeed.y == 0)) {
        return;
      }
      rollbackData = {elementX:element.elementX, elementY:element.elementY, elementAngle:element.elementAngle, elementScaleX:element.elementScaleX, elementScaleY:element.elementScaleY};
      element.elementX += element.elementMoving.movingSpeed.x * dt;
      element.elementY += element.elementMoving.movingSpeed.y * dt;
      element.elementAngle += element.elementMoving.omega * dt;
      if (element.elementScaleSpeed) {
        element.elementScaleX += element.elementScaleSpeed.x * dt;
        element.elementScaleY += element.elementScaleSpeed.y * dt;
      }
      var preMoveOk = true;
      if (element.preMove) {
        element.preMove.forEach(function(preMoveFunction) {
          if (!preMoveOk) {
            return;
          }
          if (!preMoveFunction.call(element)) {
            preMoveOk = false;
          }
        });
      }
      if (!preMoveOk) {
        element.elementX = rollbackData.elementX;
        element.elementY = rollbackData.elementY;
        element.elementAngle = rollbackData.elementAngle;
        element.elementScaleX = rollbackData.elementScaleX;
        element.elementScaleY = rollbackData.elementScaleY;
      } else {
      }
    }, 20);
    Object.defineProperty(element, "moving", {get:function() {
      return this.elementMoving;
    }, set:function(y) {
      this.elementMoving = y;
    }});
    Object.defineProperty(element.elementMoving, "speed", {get:function() {
      return this.movingSpeed;
    }, set:function(y) {
      this.movingSpeed = y;
    }});
    Object.defineProperty(element.elementMoving, "acceleration", {get:function() {
      return this.movingAcceleration;
    }, set:function(y) {
      this.movingAcceleration = y;
    }});
    Object.defineProperty(element.elementMoving, "rotationSpeed", {get:function() {
      return this.omega;
    }, set:function(y) {
      this.omega = y;
    }});
    Object.defineProperty(element, "scaleSpeed", {get:function() {
      return this.elementScaleSpeed;
    }, set:function(y) {
      this.elementScaleSpeed = y;
    }});
  }};
})();
(function() {
  var creevents = CreJs.Creevents = CreJs.Creevents || {};
  var helpers;
  creevents.Event = function(eventId) {
    this.eventId = eventId;
    helpers = CreJs.CreHelpers;
    var eventHandlers = [];
    var logger = new CreJs.Crelog.Logger;
    this.dispatch = function(eventData, callback) {
      var myDispatch = helpers.GetGuid();
      var count = eventHandlers.length;
      if (DEBUG && eventData && eventData.eventId != "pointerMove" && eventData.eventId != "drag" && eventData.eventId != "drop") {
        logger.logMessage("Dispatching " + count + " " + eventData.eventId + ". (" + myDispatch + ")");
      }
      eventHandlers.forEach(function(handler) {
        handler.debugEvent = eventId;
        setTimeout(function() {
          if (DEBUG && eventData && eventData.eventId != "pointerMove") {
            logger.logMessage("Actually handling " + eventData.eventId + ". (" + myDispatch + ")");
          }
          handler.handleEvent(eventData);
          count--;
          if (count == 0 && callback) {
            callback();
          }
        });
      });
    };
    this.addEventListenerX = function(listenerData) {
      listenerData.handleEvent = listenerData.handleEvent || listenerData["handleEvent"];
      listenerData.rank = listenerData.rank || listenerData["rank"];
      listenerData.listenerId = listenerData.listenerId || listenerData["listenerId"];
      listenerData.eventGroupType = listenerData.eventGroupType || listenerData["eventGroupType"];
      var handlerGuid = helpers.GetGuid();
      eventHandlers.push({handlerGuid:handlerGuid, handleEvent:listenerData.handleEvent, rank:listenerData.rank, listenerId:listenerData.listenerId, eventGroupType:listenerData.eventGroupType});
      eventHandlers = eventHandlers.sort(function(a, b) {
        return(a.rank || Infinity) - (b.rank || Infinity);
      });
      return handlerGuid;
    };
    this.removeEventListener = function(listenerData) {
      eventHandlers = eventHandlers.filter(function(registered) {
        return Boolean(listenerData.handlerGuid) && registered.handlerGuid != listenerData.handlerGuid || Boolean(listenerData.listenerId) && registered.listenerId != listenerData.listenerId || Boolean(listenerData.eventGroupType) && registered.eventGroupType != listenerData.eventGroupType;
      });
    };
  };
  CreJs["Creevents"] = creevents;
  creevents["Event"] = creevents.Event;
})();
(function() {
  var creevents = CreJs.Creevents = CreJs.Creevents || {};
  creevents.EventContainer = function() {
    var container = this;
    var events = {};
    var eventIds = [];
    this.hasEvent = function(eventId) {
      return events[eventId] != undefined;
    };
    var addEvent = function(eventId) {
      eventIds.push(eventId);
      events[eventId] = new creevents.Event(eventId);
    };
    this.addEventListenerX = function(listenerData) {
      var eventId = listenerData.eventId || listenerData["eventId"];
      if (!events[eventId]) {
        addEvent(eventId);
      }
      return events[eventId].addEventListenerX(listenerData);
    };
    this.dispatch = function(eventId, eventData, callback) {
      if (events[eventId]) {
        if (eventData) {
          eventData.eventId = eventId;
        }
        events[eventId].dispatch(eventData, callback);
      }
    };
    this.removeEventListener = function(listenerData) {
      if (events[listenerData.eventId]) {
        events[listenerData.eventId].removeEventListener(listenerData);
      } else {
        eventIds.forEach(function(eventId) {
          events[eventId].removeEventListener(listenerData);
        });
      }
    };
    this.registerControlEvent = function(control, controlEventId, customEventId) {
      if (!events[customEventId]) {
        addEvent(customEventId);
      }
      control.addEventListenerX(controlEventId, function(event) {
        event.preventDefault();
        setTimeout(function() {
          container.dispatch(customEventId, event);
        }, 0);
      });
    };
    this["addEventListener"] = this.addEventListenerX;
  };
  creevents["EventContainer"] = creevents.EventContainer;
})();
(function() {
  var helpers = CreJs.CreHelpers = CreJs.CreHelpers || {};
  helpers.GetGuid = function() {
    var timeStampPart = Date.now().toString(16);
    var tail = helpers.repeatString("x", 15 - timeStampPart.length) + timeStampPart;
    var template = "xxxxxxxx-xxxx-4xxx-y" + tail.slice(0, 3) + "-" + tail.slice(3);
    return template.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      var v = c == "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  };
  helpers.repeatString = function s(s, n) {
    if (n <= 0) {
      return "";
    }
    return s + helpers.repeatString(s, n - 1);
  };
})();
(function() {
  var isLogging = true;
  var log = CreJs.Crelog = CreJs.Crelog || {};
  log.Logger = function() {
    this.logMessage = function(logData) {
      if (!isLogging) {
        return;
      }
      console.log(logData);
    };
  };
  CreJs["Crelog"] = log;
  log["Logger"] = log.Logger;
  log.Logger["log"] = log.Logger.logMessage;
})();

