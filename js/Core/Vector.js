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
			context.lineTo(x + 100*vector.xCoordinate, y + 100*vector.yCoordinate);
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
			vector.xCoordinate = u*unitVectors.u.xCoordinate + v*unitVectors.v.xCoordinate + w*unitVectors.w.xCoordinate;
			vector.yCoordinate = u*unitVectors.u.yCoordinate + v*unitVectors.v.yCoordinate + w*unitVectors.w.yCoordinate;
			vector.zCoordinate = u*unitVectors.u.zCoordinate + v*unitVectors.v.zCoordinate + w*unitVectors.w.zCoordinate;
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
			u:new core.Vector(dx/longueur, dy/longueur),
			v:new core.Vector(-dy/longueur, dx/longueur),
			w:0
		};
	};
	
	core.drawUnitVectors = function(context, x, y, unitVectors, color)
	{
		context.lineWidth=5;
		context.strokeStyle=color;
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x + 100*unitVectors.u.xCoordinate, y + 100*unitVectors.u.yCoordinate);
		context.moveTo(x, y);
		context.lineTo(x + 50*unitVectors.v.xCoordinate, y + 50*unitVectors.v.yCoordinate);
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
		context.lineTo(x + 100*ux*unitVectors.u.xCoordinate, y + 100*ux*unitVectors.u.yCoordinate);
		context.lineTo(x + 100*ux*unitVectors.u.xCoordinate + 100*vx*unitVectors.v.xCoordinate, y + 100*ux*unitVectors.u.yCoordinate + 100*vx*unitVectors.v.yCoordinate);
		context.stroke();
		context.lineWidth=1;
		context.strokeStyle="#000";
	};

	
	core.scalarProduct = function(v1, v2)
	{
		return v1.xCoordinate * v2.xCoordinate + v1.yCoordinate * v2.yCoordinate;
	};
	
	core.vectorProduct = function(v1,v2)
	{
		return new core.Vector(
				v1.yCoordinate * v2.zCoordinate - v1.zCoordinate * v2.yCoordinate,				
				v1.zCoordinate * v2.xCoordinate - v1.xCoordinate * v2.zCoordinate,	
				v1.xCoordinate * v2.yCoordinate - v1.yCoordinate * v2.xCoordinate);
	};	
})();