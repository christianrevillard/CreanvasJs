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
      clientRectIntersection = {left:Math.max(clientRectElement.leftInPoints, clientRectOther.leftInPoints) - 1, right:Math.min(clientRectElement.rightInPoints, clientRectOther.rightInPoints) + 1, top:Math.max(clientRectElement.topInPoints, clientRectOther.topInPoints) - 1, bottom:Math.min(clientRectElement.bottomInPoints, clientRectOther.bottomInPoints) + 1};
      clientRectIntersection.width = clientRectIntersection.right - clientRectIntersection.left;
      clientRectIntersection.height = clientRectIntersection.bottom - clientRectIntersection.top;
      if (clientRectIntersection.width <= 0 || clientRectIntersection.height <= 0) {
        return;
      }
      var collisionImage = element.collisionContext.getImageData(0, 0, element.widthInPoints, element.heightInPoints);
      element.collisionContext.scale(1 / (element.elementScaleX || 1), 1 / (element.elementScaleY || 1));
      element.collisionContext.rotate(-(element.elementAngle || 0));
      element.collisionContext.translate(other.elementX * element.controller.lengthScale - element.elementX * element.controller.lengthScale, other.elementY * element.controller.lengthScale - element.elementY * element.controller.lengthScale);
      element.collisionContext.rotate(other.elementAngle || 0);
      element.collisionContext.scale(other.elementScaleX || 1, other.elementScaleY || 1);
      element.collisionContext.globalCompositeOperation = "destination-out";
      element.collisionContext.drawImage(other.collidedContext.canvas, 0, 0, other.widthInPoints, other.heightInPoints, other.leftInPoints, other.topInPoints, other.widthInPoints, other.heightInPoints);
      element.collisionContext.scale(1 / (other.elementScaleX || 1), 1 / (other.elementScaleY || 1));
      element.collisionContext.rotate(-other.elementAngle || 0);
      element.collisionContext.translate(-other.elementX * element.controller.lengthScale + element.elementX * element.controller.lengthScale, -other.elementY * element.controller.lengthScale + element.elementY * element.controller.lengthScale);
      element.collisionContext.rotate(element.elementAngle || 0);
      element.collisionContext.scale(element.elementScaleX || 1, element.elementScaleY || 1);
      imageAfter = element.collisionContext.getImageData(0, 0, element.widthInPoints, element.heightInPoints);
      element.collisionContext.globalCompositeOperation = "source-over";
      element.collisionContext.putImageData(collisionImage, 0, 0);
      edges = [];
      element.edges.forEach(function(edgePoint) {
        if (imageAfter.data[edgePoint.y * element.widthInPoints * 4 + edgePoint.x * 4 + 3] < 90) {
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
      var point1 = element.getWebappXY(edges[theMax.i].x + element.left, edges[theMax.i].y + element.topInPoints);
      var point2 = element.getWebappXY(edges[theMax.j].x + element.left, edges[theMax.j].y + element.topInPoints);
      if (point1.x == point2.x && point1.y == point2.y) {
        return null;
      }
      return{x:(point1.x + point2.x) / 2, y:(point1.y + point2.y) / 2, vectors:CreJs.Core.getUnitVectors(point1.x, point1.y, point2.x, point2.y)};
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
      var elementMass = element.solidData.fixedPoint ? Infinity : element.solidData.elementMass;
      var otherMass = other.solidData.fixedPoint ? Infinity : other.solidData.elementMass;
      var elementMOI = element.solidData.fixed ? Infinity : element.getMomentOfInertia();
      var otherMOI = other.solidData.fixed ? Infinity : other.getMomentOfInertia();
      var F = element.solidData.coefficient * other.solidData.coefficient * 2 * (localSpeedOther.v - localSpeedElement.v + other.elementMoving.omega * otherRot.z - element.elementMoving.omega * elementRot.z) / (1 / otherMass + 1 / elementMass + otherRot.z * otherRot.z / otherMOI + elementRot.z * elementRot.z / elementMOI);
      element.elementMoving.movingSpeed.x += F / elementMass * colVectors.v.x;
      element.elementMoving.movingSpeed.y += F / elementMass * colVectors.v.y;
      other.elementMoving.movingSpeed.x -= F / otherMass * colVectors.v.x;
      other.elementMoving.movingSpeed.y -= F / otherMass * colVectors.v.y;
      element.elementMoving.omega += F * l1 / elementMOI;
      other.elementMoving.omega -= F * l2 / otherMOI;
    };
    var getCollidableElements = function() {
      return controller.elements.filter(function(e) {
        return e.solidData;
      });
    };
    this.solveCollision = function(element) {
      var toCheck = getCollidableElements();
      var others, center, collisionPoint, other;
      center = element.getCenter();
      others = toCheck.filter(function(other) {
        var otherCenter;
        if (other.elementId === element.elementId || !other.elementMoving.movingSpeed.x && !other.elementMoving.movingSpeed.y && !element.elementMoving.movingSpeed.x && !element.elementMoving.movingSpeed.y && !other.elementScaleSpeed && !element.elementScaleSpeed && !element.elementMoving.omega && !other.elementMoving.omega) {
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
    var canvas, needRedraw, refreshTime, time, timeStart, timeScale, controller = this;
    canvas = controllerData["canvas"];
    timeScale = controllerData["timeScale"] || 1;
    this.lengthScale = controllerData["lengthScale"] || canvas.height / controllerData["realHeight"] || canvas.width / controllerData["realWidth"] || 1;
    if (controllerData.realTime) {
      timeStart = Date.now();
      this.getTime = function() {
        return(Date.now() - timeStart) * timeScale / 1E3;
      };
    } else {
      time = 0;
      setInterval(function() {
        time += 10 * timeScale / 1E3;
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
            var eventData = controller.getWebappXYFromClientXY(clientXY);
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
            var eventData = controller.getWebappXYFromClientXY(clientXY);
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
    this.getWebappXYFromClientXY = function(clientXY) {
      var boundings = canvas.getBoundingClientRect();
      controller.logMessage("ClientXY: (" + clientXY.clientX + "," + clientXY.clientY + ")");
      var xy = {x:(clientXY.clientX - boundings.left) * canvas.width / boundings.width / controller.lengthScale, y:(clientXY.clientY - boundings.top) * canvas.height / boundings.height / controller.lengthScale};
      controller.logMessage("WebAppXY: (" + xy.x + "," + xy.y + ")");
      if (clientXY.type == "click") {
        controller.logMessage("Click on ! WebAppXY: (" + xy.x + "," + xy.y + ")");
      }
      return xy;
    };
    controller.elements = [];
    this.add = function() {
      if (DEBUG) {
        controller.logMessage("Controller.addElement: Adding element - args:" + arguments.length);
      }
      var args = [].slice.call(arguments);
      var identificationData = args.filter(function(arg) {
        return arg && arg[0] == "name";
      })[0] || ["name", "Unknown"];
      var imageData = args.filter(function(arg) {
        return arg && arg[0] == "image";
      })[0];
      var positionData = args.filter(function(arg) {
        return arg && arg[0] == "position";
      })[0];
      var element = new CreJs.Creanvas.Element(controller, identificationData, imageData, positionData);
      var decoratorArguments = args.filter(function(arg) {
        return arg && arg[0] != "name" && arg[0] != "position" && arg[0] != "image";
      });
      if (decoratorArguments.length > 0 && CreJs.Creanvas.elementDecorators) {
        if (DEBUG) {
          element.debug("New element", "apply " + decoratorArguments.length + " decorators");
        }
        element.applyElementDecorators.apply(element, decoratorArguments);
      }
      controller.elements.push(element);
      return element;
    };
    controller.logMessage("Adding background");
    this.add(["name", "background"], ["image", {"left":0, "width":canvas.width / controller.lengthScale, "top":0, "height":canvas.height / controller.lengthScale, "draw":controllerData["drawBackground"] || function(context) {
      context.fillStyle = controllerData["backgroundStyle"] || "#FFF";
      context.fillRect(0, 0, canvas.width / controller.lengthScale, canvas.height / controller.lengthScale);
    }}], ["position", {"z":-Infinity}]);
    setInterval(function() {
      if (needRedraw && !isDrawing) {
        isDrawing = true;
        controller.elements.sort(function(a, b) {
          return(a.elementZ || 0) - (b.elementZ || 0);
        }).forEach(function(element) {
          controller.context.translate(element.elementX * controller.lengthScale, element.elementY * controller.lengthScale);
          controller.context.rotate(element.elementAngle || 0);
          controller.context.scale(element.elementScaleX || 1, element.elementScaleY || 1);
          controller.context.drawImage(element.temporaryRenderingContext.canvas, 0, 0, element.widthInPoints, element.heightInPoints, element.leftInPoints, element.topInPoints, element.widthInPoints, element.heightInPoints);
          controller.context.scale(1 / (element.elementScaleX || 1), 1 / element.elementScaleY || 1);
          controller.context.rotate(-(element.elementAngle || 0));
          controller.context.translate(-element.elementX * controller.lengthScale, -element.elementY * controller.lengthScale);
        });
        isDrawing = false;
      } else {
        controller.logMessage("No redraw");
      }
    }, refreshTime);
    this["addElement"] = this.add;
    this["redraw"] = this.triggerRedraw;
    this["stop"] = this.stopController;
  };
  CreJs.Creanvas["Controller"] = CreJs.Creanvas.Controller;
})();
(function() {
  var creanvas = CreJs.Creanvas;
  var setIdentification = function(element, identificationData) {
    element.elementName = identificationData;
    element.elementId = CreJs.CreHelpers.GetGuid();
  };
  var setImage = function(element, imageData) {
    var width = imageData["width"];
    var height = imageData["height"];
    element.top = imageData["top"] == 0 ? 0 : imageData["top"] || -height / 2;
    element.left = imageData["left"] == 0 ? 0 : imageData["left"] || -width / 2;
    element.bottom = imageData["bottom"] == 0 ? 0 : imageData["bottom"] || element.top + height;
    element.right = imageData["right"] == 0 ? 0 : imageData["right"] || element.left + width;
    element.elementWidth = width || element.right - element.left;
    element.elementHeight = height || element.bottom - element.top;
    element.topInPoints = Math.round(element.top * element.controller.lengthScale);
    element.leftInPoints = Math.round(element.left * element.controller.lengthScale);
    element.bottomInPoints = Math.round(element.bottom * element.controller.lengthScale);
    element.rightInPoints = Math.round(element.right * element.controller.lengthScale);
    element.widthInPoints = Math.round(element.elementWidth * element.controller.lengthScale);
    element.heightInPoints = Math.round(element.elementHeight * element.controller.lengthScale);
    var canvas = element.controller.context.canvas;
    var tempCanvas = canvas.ownerDocument.createElement("canvas");
    element.temporaryRenderingContext = tempCanvas.getContext("2d");
    element.elementScaleX = imageData["scaleX"] || 1;
    element.elementScaleY = imageData["scaleY"] || 1;
    if (imageData["rawImage"]) {
      element.elementImage = imageData["rawImage"];
      element.temporaryRenderingContext.putImageData(element.elementImage, 0, 0);
    } else {
      var draw = imageData["draw"];
      tempCanvas.width = element.widthInPoints;
      tempCanvas.height = element.heightInPoints;
      element.temporaryRenderingContext.beginPath();
      element.temporaryRenderingContext.translate(-element.leftInPoints, -element.topInPoints);
      element.temporaryRenderingContext.scale(element.controller.lengthScale, element.controller.lengthScale);
      draw.call(element, element.temporaryRenderingContext);
      element.elementImage = element.temporaryRenderingContext.getImageData(0, 0, element.widthInPoints, element.heightInPoints);
    }
  };
  var setPosition = function(element, position) {
    element.elementX = position["x"] || 0;
    element.elementY = position["y"] || 0;
    element.elementZ = position["z"] || 0;
    element.elementAngle = position["angle"] || 0;
  };
  creanvas.Element = function(controller, identificationData, imageData, positionData) {
    var element = this;
    element.controller = controller;
    var cachedResults = [];
    var clonerdata = [];
    setIdentification(element, identificationData[1]);
    setImage(element, imageData[1]);
    setPosition(element, positionData[1]);
    clonerdata.push(identificationData);
    clonerdata.push(imageData);
    clonerdata.push(positionData);
    if (DEBUG) {
      element.debug = function(source, message) {
        element.controller.logMessage("Element." + source + ": " + message + ". Element: " + element.elementName + "/" + element.elementId);
      };
    }
    element.elementEvents = new CreJs.Creevents.EventContainer;
    element.hit = function(pointerX, pointerY) {
      var imageXY = element.getElementXY(pointerX, pointerY);
      var imageX = imageXY.x - element.leftInPoints;
      var imageY = imageXY.y - element.topInPoints;
      var xx = imageX >= 0 && imageX <= element.widthInPoints && imageY >= 0 && imageY <= element.heightInPoints && element.elementImage.data[4 * imageY * element.widthInPoints + 4 * imageX + 3] > 0;
      if (DEBUG) {
        element.debug("hit", xx ? "hit" : "no hit");
      }
      return xx;
    };
    element.cloneElement = function(ignoreDecorators) {
      if (DEBUG) {
        element.debug("cloneElement", "start cloning");
      }
      var elementsToApply = ignoreDecorators ? clonerdata.filter(function(d) {
        return ignoreDecorators.every(function(toIgnore) {
          return toIgnore != d[0];
        });
      }) : clonerdata;
      if (DEBUG) {
        element.debug("cloneElement", "apply " + elementsToApply.length + " stuff");
      }
      return element.controller.add.apply(element.controller, elementsToApply);
    };
    element.canHandle = function(eventId) {
      return eventId == "click" || eventId == "pointerDown" || element.elementEvents.hasEvent(eventId);
    };
    element.deactivate = function() {
      element.controller.elementEvents.removeEventListener(element.elementId);
      element.temporaryRenderingContext = null;
    };
    element.controller.elementEvents.getEvent("deactivate").addListener({"listenerId":element.elementId, "handleEvent":function(e) {
      element.deactivate();
    }});
    element.triggerRedraw = function() {
      element.controller.triggerRedraw();
    };
    element.getWebappXY = function(imageX, imageY) {
      return{x:element.elementX + (imageX * element.elementScaleX * Math.cos(element.elementAngle) - imageY * element.elementScaleY * Math.sin(element.elementAngle)) / element.controller.lengthScale, y:element.elementY + (imageX * element.elementScaleX * Math.sin(element.elementAngle) + imageY * element.elementScaleY * Math.cos(element.elementAngle)) / element.controller.lengthScale};
    };
    element.getElementXY = function(webAppX, webAppY) {
      return{x:Math.round(((webAppX - element.elementX) * element.controller.lengthScale * Math.cos(element.elementAngle) + (webAppY - element.elementY) * element.controller.lengthScale * Math.sin(element.elementAngle)) / element.elementScaleX), y:Math.round(((webAppY - element.elementY) * element.controller.lengthScale * Math.cos(element.elementAngle) - (webAppX - element.elementX) * element.controller.lengthScale * Math.sin(element.elementAngle)) / element.elementScaleY)};
    };
    element.getCenter = function() {
      return element.getWebappXY(element.leftInPoints + element.widthInPoints / 2, element.topInPoints + element.heightInPoints / 2);
    };
    var corners = [];
    corners.push({x:element.leftInPoints, y:element.topInPoints});
    corners.push({x:element.rightInPoints, y:element.topInPoints});
    corners.push({x:element.rightInPoints, y:element.bottomInPoints});
    corners.push({x:element.leftInPoints, y:element.bottomInPoints});
    element.getClientCornersCache = function() {
      return corners.map(function(point) {
        return element.getWebappXY(point.x, point.y);
      });
    };
    element.getClientCorners = function() {
      var key = element.elementX + "" + element.elementY + "" + element.elementAngle + "" + element.elementScaleX + "" + element.elementScaleX;
      if (cachedResults["getClientCorners"] && cachedResults["getClientCorners"].key == key) {
        return cachedResults["getClientCorners"].value;
      }
      var value = element.getClientCornersCache();
      cachedResults["getClientCorners"] = {key:key, value:value};
      return value;
    };
    element.getClientRectCache = function() {
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
    element.getClientRect = function() {
      var key = element.elementX + "" + element.elementY + "" + element.elementAngle + "" + element.elementScaleX + "" + element.elementScaleX;
      if (cachedResults["getClientRect"] && cachedResults["getClientRect"].key == key) {
        return cachedResults["getClientRect"].value;
      }
      var value = element.getClientRectCache();
      cachedResults["getClientRect"] = {key:key, value:value};
      return value;
    };
    element.applyElementDecorators = function() {
      var element = this;
      var newDecorators = [].slice.apply(arguments);
      clonerdata = clonerdata.concat(newDecorators);
      newDecorators.forEach(function(decoratorArgument) {
        element.applyElementDecorator(decoratorArgument[0], decoratorArgument[1]);
      });
    };
    element.applyElementDecorator = function(decoratorType, decoratorSettings) {
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
  };
})();
var CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators["clickable"] = {applyTo:function(element, clickData) {
    var onclick = clickData["onclick"];
    if (onclick) {
      element.onClick = function(event) {
        if (DEBUG) {
          element.debug("onClick", onclick);
        }
        onclick.call(element, event);
        element.triggerRedraw();
      };
      element.elementEvents.getEvent("click").addListener({handleEvent:element.onClick});
    }
    var isPointerDown = false;
    this.touchIdentifier = null;
    var ondown = clickData["ondown"];
    var onup = clickData["onup"];
    var onDown = function(e) {
      if (DEBUG) {
        element.controller.logMessage("Registered down - identifier: " + e.touchIdentifier);
      }
      element.touchIdentifier = e.touchIdentifier;
      isPointerDown = true;
      if (ondown) {
        if (DEBUG) {
          element.debug("onDown", ondown);
        }
        ondown.call(element, event);
        element.triggerRedraw();
      }
    };
    var onUp = function(e) {
      if (!isPointerDown) {
        return;
      }
      if (element.touchIdentifier != e.touchIdentifier) {
        return;
      }
      if (DEBUG) {
        element.controller.logMessage("registerd up - identifier: " + e.touchIdentifier);
      }
      isPointerDown = false;
      if (onup) {
        if (DEBUG) {
          element.debug("onUp", onup);
        }
        onup.call(element, event);
        element.triggerRedraw();
      }
    };
    element.elementEvents.getEvent("pointerDown").addListener({handleEvent:onDown, listenerId:element.elementId});
    element.elementEvents.getEvent("pointerUp").addListener({handleEvent:onUp, listenerId:element.elementId});
  }};
})();
var CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators["customTimer"] = {applyTo:function(element, customTimerData) {
    setInterval(function() {
      customTimerData["action"].call(element);
    }, customTimerData["time"]);
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
    element.elementEvents.getEvent("drop").addListener({handleEvent:drop, listenerId:element.elementId});
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
    element.elementEvents.getEvent("pointerDown").addListener({handleEvent:makeCopy, listenerId:element.elementId});
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
    element.elementEvents.getEvent("pointerDown").addListener({handleEvent:beginMove, listenerId:element.elementId});
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
    element.elementEvents.getEvent("pointerMove").addListener({handleEvent:move, listenerId:element.elementId});
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
      element.elementX += e.x - movingFrom.x;
      element.elementY += e.y - movingFrom.y;
      element.moveCompleted(e);
      element.touchIdentifier = null;
      isMovingLogged = false;
      element.triggerRedraw();
    };
    element.elementEvents.getEvent("pointerUp").addListener({handleEvent:moveend, listenerId:element.elementId});
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
      if (dt < .001) {
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
var CreJs = CreJs || {};
(function() {
  CreJs.Creanvas = CreJs.Creanvas || {};
  CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
  CreJs.Creanvas.elementDecorators["solid"] = {applyTo:function(element, solidData) {
    var cachedResults = [];
    element.solidData = {};
    element.solidData.elementMass = solidData["mass"] || 1;
    var onCollision = solidData["onCollision"];
    var collisionCoefficient = solidData["coefficient"];
    element.solidData.fixed = solidData["fixed"] || false;
    element.solidData.fixedPoint = element.solidData.fixed || solidData["fixedPoint"] || false;
    element.controller.collisionSolver = element.controller.collisionSolver || new CreJs.Creanvas.CollisionSolver(element.controller);
    element.solidData.coefficient = !collisionCoefficient && collisionCoefficient !== 0 ? 1 : collisionCoefficient;
    element.elementMoving = element.elementMoving || {movingSpeed:new CreJs.Core.Vector(0, 0), movingAcceleration:new CreJs.Core.Vector(0, 0), omega:0};
    element.elementEvents.getEvent("collision").addListener({handleEvent:function(collisionEvent) {
      if (onCollision) {
        onCollision.call(element, collisionEvent);
      }
    }});
    element.preMove = this.preMove || [];
    element.preMove.push(function() {
      return element.controller.collisionSolver.solveCollision(element);
    });
    element.getMomentOfInertia = function() {
      return element.solidData.elementMass / 12 * (element.widthInPoints * element.elementScaleX * element.widthInPoints * element.elementScaleX + element.heightInPoints * element.elementScaleY * element.heightInPoints * element.elementScaleY);
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
    tempCollisionCanvas.width = tempCollidedCanvas.width = element.widthInPoints;
    tempCollisionCanvas.height = tempCollidedCanvas.height = element.heightInPoints;
    element.collidedContext = tempCollidedCanvas.getContext("2d");
    element.collidedContext.putImageData(element.elementImage, 0, 0);
    element.collidedContext.globalCompositeOperation = "source-atop";
    element.collidedContext.fillStyle = "#000";
    element.collidedContext.fillRect(0, 0, element.widthInPoints, element.heightInPoints);
    element.collisionContext = tempCollisionCanvas.getContext("2d");
    element.collisionContext.globalCompositeOperation = "source-over";
    element.collisionContext.drawImage(element.collidedContext.canvas, 0, 0);
    var collisionImageOld = element.collisionContext.getImageData(0, 0, element.widthInPoints, element.heightInPoints);
    var collisionImageNew = element.collisionContext.createImageData(element.widthInPoints, element.heightInPoints);
    element.edges = [];
    for (var imageX = 0;imageX < element.widthInPoints;imageX++) {
      for (var imageY = 0;imageY < element.heightInPoints;imageY++) {
        if (collisionImageOld.data[imageY * element.widthInPoints * 4 + imageX * 4 + 3] < 200) {
          continue;
        }
        var edge = false;
        for (var i = -1;i < 2;i++) {
          for (var j = -1;j < 2;j++) {
            if (imageY + i < 0 || imageX + j < 0 || imageY + i > element.heightInPoints - 1 || imageX + i > element.elementWidth - 1 || collisionImageOld.data[(imageY + i) * element.elementWidth * 4 + (imageX + j) * 4 + 3] < 100) {
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
          collisionImageNew.data[imageY * element.widthInPoints * 4 + imageX * 4] = 0;
          collisionImageNew.data[imageY * element.widthInPoints * 4 + imageX * 4 + 1] = 0;
          collisionImageNew.data[imageY * element.widthInPoints * 4 + imageX * 4 + 2] = 0;
          collisionImageNew.data[imageY * element.widthInPoints * 4 + imageX * 4 + 3] = fillValue;
        }
      }
    }
    element.collisionContext.putImageData(collisionImageNew, 0, 0);
    element.collisionContext.translate(-element.leftInPoints, -element.topInPoints);
    Object.defineProperty(element, "solid", {get:function() {
      return this.solidData;
    }, set:function(y) {
      this.solidData = y;
    }});
    Object.defineProperty(element.solidData, "mass", {get:function() {
      return this.elementMass;
    }, set:function(y) {
      this.elementMass = y;
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
    this.addListener = function(listenerData) {
      listenerData.handleEvent = listenerData.handleEvent || listenerData["handleEvent"];
      listenerData.rank = listenerData.rank || listenerData["rank"];
      listenerData.listenerId = listenerData.listenerId || listenerData["listenerId"];
      var handlerGuid = helpers.GetGuid();
      eventHandlers.push({handlerGuid:handlerGuid, handleEvent:listenerData.handleEvent, rank:listenerData.rank, listenerId:listenerData.listenerId});
      eventHandlers = eventHandlers.sort(function(a, b) {
        return(a.rank || Infinity) - (b.rank || Infinity);
      });
      return handlerGuid;
    };
    this.removeEventListener = function(listenerData) {
      eventHandlers = eventHandlers.filter(function(registered) {
        return Boolean(listenerData.handlerGuid) && registered.handlerGuid != listenerData.handlerGuid || Boolean(listenerData.listenerId) && registered.listenerId != listenerData.listenerId;
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
    this.getEvent = function(eventId) {
      if (!events[eventId]) {
        addEvent(eventId);
      }
      return events[eventId];
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
    this["getEvent"] = this.getEvent;
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

