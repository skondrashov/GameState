GameState.Animation = function(imgs, info)
{
	// imgs - stores an array of the images that the animation consists of
	// imgDurs - stores an array of the duration of each image in the animation
	// imgOrgs - stores an array of the origins of each image in the animation
	// the indices of each array correspond to each other; imgs[n] lasts imgDurs[n] frames and has an origin of imgOrgs[n]
	var imgID = 0;
	var frameCount = 0;

	var nextName = info.next;
	var imgDurs = new Array();
	var imgOffs = new Array();
	var k;
	for (k=0; k<info.images; k++)
	{
		imgDurs.push(info.durations[k]);
		imgOffs.push(new Array(2));
		imgOffs[k][0] = info.offsets[k][0];
		imgOffs[k][1] = info.offsets[k][1];
	}

	this.reset = function()
	{
		imgID = 0;
		frameCount = 0;
	};

	this.nextFrame = function()
	{
		frameCount++;
		if (frameCount>=imgDurs[imgID])
		{
			frameCount=0;
			imgID++;
			if (imgID==imgs.length)
			{
				imgID = 0;
				return nextName;
			}
		}
		return false; // if the animation is complete, this function returns the name of the next animation instead
	};

	this.draw = function(x,y,flip,rotation,scaling)
	{
		if (!flip)
			flip = false;
		imgs[imgID].draw(x+imgOffs[imgID][0]-(imgOffs[imgID][0]*flip),y+imgOffs[imgID][1],flip,rotation,scaling);
	};

	this.destroy = function()
	{
		for (k=0; k<info.images; k++)
		{
			imgs[k].destroy();
			imgOffs[k].destroy();
		}
		imgOffs.destroy();
		imgDurs.destroy();
		delete this;
	};
};