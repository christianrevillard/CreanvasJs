var CreJs = CreJs || {};

(function()
{
	var core = CreJs.Core = CreJs.Core|| {};
	
	core.Vector = function(x,y)
	{
		var vector = this;
		this.x = x;
		this.y = y;		
		
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
				v: core.scalarProduct(vector,unitVectors.v)
			};
		};

		this.setCoordinates = function(unitVectors, u, v)
		{
			vector.x = u*unitVectors.u.x + v*unitVectors.v.x;
			vector.y = u*unitVectors.u.y + v*unitVectors.v.y;
		};

	};	
	
	core.getUnitVectors = function(x1, y1, x2, y2)
	{
		var dx = x2-x1; 
		var dy = y2-y1;
		var longueur = Math.sqrt(dx*dx + dy*dy);
		return {
			u:new core.Vector(dx/longueur, dy/longueur),
			v:new core.Vector(-dy/longueur, dx/longueur)				
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
		return v1.x * v2.y - v1.y * v2.x;
	};
	
})();