(function()
{
	var core = CreJs.Core = CreJs.Core|| {};
	
	core.Vector = function(x,y,z)
	{
		var vector = this;
		this.x = x;
		this.y = y;
		this.z = z || 0;
		
		this.draw = function(context, x, y, color)
		{
			context.lineWidth=5;
			context.strokeStyle=color;
			context.beginPath();
			context.moveTo(x, y);
			context.lineTo(x + 100*vector.x, y + 100*vector.y);
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
			vector.x = u*unitVectors.u.x + v*unitVectors.v.x + w*unitVectors.w.x;
			vector.y = u*unitVectors.u.y + v*unitVectors.v.y + w*unitVectors.w.y;
			vector.z = u*unitVectors.u.z + v*unitVectors.v.z + w*unitVectors.w.z;
		};

	};	
	
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
		context.lineTo(x + 100*unitVectors.u.x, y + 100*unitVectors.u.y);
		context.moveTo(x, y);
		context.lineTo(x + 50*unitVectors.v.x, y + 50*unitVectors.v.y);
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
		context.lineTo(x + 100*ux*unitVectors.u.x, y + 100*ux*unitVectors.u.y);
		context.lineTo(x + 100*ux*unitVectors.u.x + 100*vx*unitVectors.v.x, y + 100*ux*unitVectors.u.y + 100*vx*unitVectors.v.y);
		context.stroke();
		context.lineWidth=1;
		context.strokeStyle="#000";
	};

	
	core.scalarProduct = function(v1, v2)
	{
		return v1.x * v2.x + v1.y * v2.y;
	};
	
	core.VectorProduct = function(v1,v2)
	{
		return new core.Vector(
				v1.y * v2.z - v1.z * v2.y,				
				v1.z * v2.x - v1.x * v2.z,	
				v1.x * v2.y - v1.y * v2.x);
	};
})();