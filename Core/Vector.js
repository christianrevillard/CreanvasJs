(function()
{
	var core = CreJs.Core = CreJs.Core || {};
	
	core.Vector = function(x,y,z)
	{
		var vector = this;
		this.vectorX = x;
		this.vectorY = y;
		this.vectorZ = z || 0;
		
		this.draw = function(context, x, y, color)
		{
			context.lineWidth=5;
			context.strokeStyle=color;
			context.beginPath();
			context.moveTo(x, y);
			context.lineTo(x + 100*vector.vectorX, y + 100*vector.vectorY);
			context.stroke();
			context.lineWidth=1;
			context.strokeStyle="#000";
		};
		
		this.getCoordinates = function(unitVectors)
		{
			return {
				u: core.scalarProduct(vector,unitVectors.u),
				v: core.scalarProduct(vector,unitVectors.v),
				w: core.scalarProduct(vector,unitVectors.w)
			};
		};

		this.setCoordinates = function(unitVectors, u, v, w)
		{
			w = w || 0;
			vector.vectorX = u*unitVectors.u.vectorX + v*unitVectors.v.vectorX + w*unitVectors.w.vectorX;
			vector.vectorY = u*unitVectors.u.vectorY + v*unitVectors.v.vectorY + w*unitVectors.w.vectorY;
			vector.vectorZ = u*unitVectors.u.vectorZ + v*unitVectors.v.vectorZ + w*unitVectors.w.vectorZ;
		};
	};	
	
	Object.defineProperty(core.Vector.prototype, "x", { get: function() {return this.vectorX; }, set: function(y) { this.vectorX = y; }});
	Object.defineProperty(core.Vector.prototype, "y", { get: function() {return this.vectorY; }, set: function(y) { this.vectorY = y; }});
	Object.defineProperty(core.Vector.prototype, "z", { get: function() {return this.vectorZ; }, set: function(y) { this.vectorZ = y; }});
	
	core.getUnitVectors = function(x1, y1, x2, y2)
	{
		var dx = x2-x1; 
		var dy = y2-y1;
		var longueur = Math.sqrt(dx*dx + dy*dy);
		return {
			u:new core.Vector(dx/longueur, dy/longueur,0),
			v:new core.Vector(-dy/longueur, dx/longueur,0),
			w:new core.Vector(0,0,0)
		};
	};
	
	core.drawUnitVectors = function(context, x, y, unitVectors, color)
	{
		context.lineWidth=5;
		context.strokeStyle=color;
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x + 100*unitVectors.u.vectorX, y + 100*unitVectors.u.vectorY);
		context.moveTo(x, y);
		context.lineTo(x + 50*unitVectors.v.vectorX, y + 50*unitVectors.v.vectorY);
		context.stroke();
		context.lineWidth=1;
		context.strokeStyle="#000";
	};

	core.drawCoordinateVector = function(context, x, y, unitVectors, ux, vx, color)
	{
		context.lineWidth=5;
		context.strokeStyle=color;
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x + 100*ux*unitVectors.u.vectorX, y + 100*ux*unitVectors.u.vectorY);
		context.lineTo(x + 100*ux*unitVectors.u.vectorX + 100*vx*unitVectors.v.vectorX, y + 100*ux*unitVectors.u.vectorY + 100*vx*unitVectors.v.vectorY);
		context.stroke();
		context.lineWidth=1;
		context.strokeStyle="#000";
	};

	
	core.scalarProduct = function(v1, v2)
	{
		return v1.vectorX * v2.vectorX + v1.vectorY * v2.vectorY;
	};
	
	core.vectorProduct = function(v1,v2)
	{
		return new core.Vector(
				v1.vectorY * v2.vectorZ - v1.vectorZ * v2.vectorY,				
				v1.vectorZ * v2.vectorX - v1.vectorX * v2.vectorZ,	
				v1.vectorX * v2.vectorY - v1.vectorY * v2.vectorX);
	};	

	CreJs["Core"] = CreJs.Core;
	CreJs.Core["Vector"] = CreJs.Core.Vector;

})();
