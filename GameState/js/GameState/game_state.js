function GameState(width,height,FRAME_RATE)
{
	var gs = this;
	var i,j,k,n;	// iterator variables
	// PUBLIC
	// input variables
	gs.mousePosition = new Array(2);
	gs.mouseDown = false;
	gs.mousePressed = false;
	gs.keysDown = new Array(256);
	gs.keysPressed = [];
	// display management
	gs.ctx = null;						// the drawing canvas context
	gs.style = null;					// the handle for the style of the game container div

	// PRIVATE
	// ---framerate management---
	// constants
	// var FRAME_RATE						// frames per second
	// variables
	var currentScreen = null;				// stores the current loop of the game. null if nothing is set to run
	var time = null;						// a Date object storing the current time
	var oldTime = null;						// the time at which the last frame was run, as a Date object
	var timeRem = 0;						// if the game ends up taking more time than it should on a frame, it should try to catch up on subsequent frames.
												// this is especially important because javascript only allows frames to be run at millisecond counts divisible by 5.
												// at 60 fps, frames need to be run every 16.666... milliseconds
												// this variable lets us accurately maintain any framerate (provided the CPU can handle it)
	var fpsPeriod = 1000/FRAME_RATE;		// the time, in milliseconds, between frames
												
												
	// ---display resolution---
	// variables
	// var width						// width of the drawing buffer, in pixels. if the game resolution is changed, this number should adjust to accurately reflect the aspect ratio.
	// var height						// height of the drawing buffer, in pixels. if the game resolution is changed this number will NOT change.
											// instead, the canvas will be scaled so that the apparent height matches the resolution y value.
											// these width and height numbers contrast with ctx.canvas.width and ctx.canvas.height, which are the size of the canvas as it is drawn on the screen
											// width and height represent the space that the program has to draw on.
											// for example, if this.width == 600, this.height = 400, ctx.canvas.width == 1200, and ctx.canvas.height == 800
											// then a 50x50 square drawn from the canvas origin will appear as a 100x100 square on the screen
											// and a 600x600 square drawn from the origin will appear as a 1200x800 rectangle to the user because it will be cropped

	// modes
	var modes = {};
	// user interaction
	var collisionMap = [];
	// drawing
	var imgs = new Array();

	// *************FUNCTIONS*****************
	// PUBLIC FUNCTIONS

	// this function fills the style and ctx variables that the game uses for all of its graphics operations
	// it also handles the error message for users whose browsers don't support HTML5
	// in the event that the browser doesn't support HTML5, this function will return false
	gs.init = function(containerID)
	{
		var canvas, container = document.getElementById(containerID);
		try	// we don't want users without HTML5 support to see browser-generated error messages, so we'll put our canvas-making attempts in a try/catch block
		{
			gs.style = container.style;

			canvas = document.createElement('canvas');
			while(container.hasChildNodes())
				container.removeChild(container.firstChild);
			container.appendChild(canvas);

			gs.ctx = canvas.getContext('2d');

			gs.setResolution(width,height);
		}catch(e)
		{
			return false;
		}
		
		window.addEventListener('mousemove',
			function(e)
			{
				delete gs.mousePosition;
				gs.mousePosition = [(e.pageX-gs.ctx.canvas.parentNode.offsetLeft)*width/gs.ctx.canvas.width, (e.pageY-gs.ctx.canvas.parentNode.offsetTop)*height/gs.ctx.canvas.height];
			}, false);
		
		window.addEventListener('mousedown',
			function(e)
			{
				if (!gs.mouseDown)
					gs.mousePressed = true;
				else
					gs.mouseDown = true;
			}, false);

		window.addEventListener('mouseup',
			function(e)
			{
				gs.mouseDown = false;
			}, false);

		window.addEventListener('keydown',
			function(e)
			{
				if (!gs.keysDown[e.keyCode])
					gs.keysPressed[e.keyCode] = true;
				gs.keysDown[e.keyCode] = true;
			}, false);

		window.addEventListener('keyup',
			function(e)
			{
				gs.keysDown[e.keyCode] = false;
			}, false);

		for (i=0; i<gs.keysDown.length; i++)
			gs.keysDown[i] = false;

		gs.clearCollisionMap();
		return true;
	};

	function checkFrame()
	{
		delete time;
		time = new Date();
		if ((timeRem+time.valueOf()-oldTime.valueOf()) >= (0|fpsPeriod))
		{
			timeRem += time.valueOf() - oldTime.valueOf() - fpsPeriod;
			while (timeRem > 2*fpsPeriod)
				timeRem -= fpsPeriod;
			delete oldTime;
			oldTime = time;
			requestAnimationFrame(runFrame);
		}
		setTimeout(checkFrame,1);
	}
	
	function runFrame()
	{
		for (i=0; i<imgs.length; i++)
			delete imgs[i];
		delete imgs;
		imgs = new Array();
		gs.ctx.clearRect(0,0,width,height);
		currentScreen();
		delete gs.keysPressed;
		gs.keysPressed = [];
		gs.mousePressed = false;
		if (imgs.length)
			draw();
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = runFrame;

	// this function begins the game loop using the current screen.
	// once this function is run, the game should continue its logic through the use of its modes and screens
	gs.start = function()
	{
		if (!oldTime)	// if oldTime is defined, that means start has already been called. We don't want to allow start to be called multiple times
		{
			oldTime = new Date();
			checkFrame();
		}
	};

	gs.loadMode = function(mode,modeName)
	{
		if (modes[modeName])
			modes[modeName].destroy();
		modes[modeName]=mode;
	};

	gs.unloadMode = function(modeName)
	{
		gs.loadMode(null,modeName);
	};

	gs.setMode = function(modeName)
	{
		gs.clearCollisionMap();
		modes[modeName].init();
	};

	Image.prototype.draw = function(x, y, flip, rotation, scaling)
	{
		if (!scaling)
			scaling = 1;
		imgs.push([this,x,y,flip,rotation,scaling]);
	};

	Audio.prototype.stop = function()
	{
		this.pause();
		this.currentTime = 0;
	};

	Audio.prototype.destroy = function()
	{
		delete this;
	};

	Image.prototype.destroy = function()
	{
		delete this;
	};

	function draw()
	{
		var img;		// the image to be drawn
		var x, y;		// coordinates of the upper left corner of the image
		var rotation;	// angle of rotation
		var flip;		// horizontal flip
		var scaling;	// the scaling ratio of the image
		for (k=0; k<imgs.length; k++)
		{
			img = imgs[k][0];
			x = imgs[k][1];
			y = imgs[k][2];
			flip = imgs[k][3];
			rotation = imgs[k][4];
			scaling = imgs[k][5];
			gs.ctx.save();
			gs.ctx.translate(x+scaling*img.width/2,y+scaling*img.height/2);
			gs.ctx.rotate(rotation);
			gs.ctx.scale(scaling-scaling*2*flip,scaling);
			gs.ctx.drawImage(img, -img.width/2, -img.height/2);
			gs.ctx.restore();
		}
	}

	gs.getWidth = function()
	{
		return width;
	};

	gs.getHeight = function()
	{
		return height;
	};

	gs.setScreen = function(screen)
	{
		currentScreen = screen;
	};

	// sets the resolution of the game to the x and y arguments
	// if fs is set, then the game will be scaled to fit the browser window
	// if stretch is also set, then both dimensions will scale to fill up all of the space even if the aspect ratios of the canvas and browser window do not match
	// the fs and stretch arguments should be treated as optional (ie setResolution(500,500) and setResolution(500,500,true) are both valid)
	gs.setResolution = function(x,y,fs,fill)
	{
		if (fs) {
			x = window.innerWidth;
			y = window.innerHeight;
			if (fill)
				width = 0|(height * x/y);
			else {
				if (window.innerWidth/width > window.innerHeight/height)
					x = 0|(width * y/height);
				else
					y = 0|(height * x/width);
			}
		}
		width = 0|((height * x/y)+.5);
		gs.ctx.canvas.width = x;
		gs.ctx.canvas.height = y;
		gs.ctx.scale(x/width,y/height);

		// changing the size of the canvas resets the canvas styles, so we have to set them again every time we resize
		gs.style.left="50%";
		gs.style.top="50%";
		gs.style.width=gs.ctx.canvas.width+"px";
		gs.style.height=gs.ctx.canvas.height+"px";
		gs.style.marginLeft="-"+(gs.ctx.canvas.width/2)+"px";
		gs.style.marginTop="-"+(gs.ctx.canvas.height/2)+"px";
	};

	gs.setCollision = function(x,y,n)
	{
		if (x >= 0 && y >= 0 && x < width && y < height)
			collisionMap[(0|y)*width+(0|x)]= n;
	};

	gs.getCollision = function(x,y)
	{
		if (x >= 0 && y >= 0 && x < width && y < height)
			return collisionMap[(0|y)*width+(0|x)];
		else
			return null;
	};
	
	gs.clearCollisionMap = function()
	{
		for (i=0; i<width; i++)
			for (j=0; j<=height; j++)
				collisionMap[j*width+i] = null;
	};

	gs.destroy = function()
	{
		for (i=0;i<imgs.length;i++)
			delete imgs[i];
		delete imgs;
		for (i=0;i<modes.length;i++)
			modes[i][0].destroy();
		delete modes;
		delete collisionMap;
		delete time;
		delete oldTime;
		delete gs;
	};
}