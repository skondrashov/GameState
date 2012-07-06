Last updated: July 6, 2012
	
GameState Javascript HTML5 video game development library documentation	
	https://github.com/Timaster/GameState
	Copyright (C)  2012  Timofey Kondrashov

    Permission is granted to copy, distribute and/or modify this document
    under the terms of the GNU Free Documentation License, Version 1.3
    or any later version published by the Free Software Foundation;
    with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.
    A copy of the license can be found at http://www.gnu.org/copyleft/fdl.html


About the GameState library:
	This library is written completely in virgin Javascript, with no jQuery or other libraries required. It can
	be used as-is, without downloading anything else (except for a web browser).
	The GameState library has its name because I can't think of a more clever name for it right now. I may
	rerelease it under another name at some point in the future.
	This library is intended for use ONLY for HTML5 video games for the Google Chrome and Chromium browsers, as
	some of its aspects are unsupported by other popular browsers, such as Mozilla Firefox. If it does work in
	other browsers, that is completely by accident, as I have not tested it anywhere else. This will be fixed in
	the future, but until this notice is removed, do not bother sending me bug reports for other browsers.
	DO, however, email me at any time at timaster@gmail.com if you have any questions, comments, hate mail,
	praise, corrections, or bug reports for this library as you use it to write games on the most recent
	versions of Chrome or Chromium (as of this writing, 20.0.1132.47 is the latest version of Chrome).

	To use the library, you must include all of the components that ship with it inside of an html file, and
	then create a GameState object that serves as the container for all of the library's objects and functions.
	The details of the GameState object and its creation are given below, in the body of the read-me.
	Here is a list of components of the library:
		js/GameState/
			request_animation_frame.js
			game_state.js
			resources.js
			sprite.js
			animation.js
		js/modes/
			loading_mode.js
		js/
			sprite_info.js
			main.js
	Each of these components must be included IN THE ABOVE ORDER (unless you know what you're doing) for the
	library to function correctly.


This readme covers the public functions and objects that the library provides. It is intended for use as a guide
while developing games using the GameState library. It does not, therefore, cover the inner workings of each
class and function, except where such information may be useful to a game developer.
In addition, the information here only pertains to the use of the library as proscribed - any use of the library
in ways that are not explicitly recommended should be considered undefined.
It is highly recommended that you, as a developer, look at the sample code provided with this document as you
read through it, to help you understand the intended method of use of the library. If no sample code was
provided, you may download it at http://www-personal.umich.edu/~timaster/GameState/GameState_sample.zip
This document should help clarify the specifics of each aspect of the library, but reading the sample code is
the best way to understand the way that all of the parts work together.

* MAIN
	The recommended way to begin the game logic of a game written with the GameState library is to add
	onload="main()" to the body tag of the html file the game is to be run in. This main function needs to be
	written by the developer (a base is provided in js/main.js), and should contain the following.
		1) A declaration of a GameState object, as described in the 'GAMESTATE' section of this document, with
		<width>, <height>, and <FRAME_RATE> passed to the constructor.
		2) A call to the GameState object's <init>.
		3) A call to the GameState object's <loadMode>, passing a LoadingMode object containing of the initial
		loading of the game passed into it as a function.
		4) A call to the GameState object's <setMode>, specifying the name of the LoadingMode just loaded into
		memory.
		5) A call to the GameState object's <start>, signifying the transfer of control to the screens and modes
		of the game logic.
	Finally, you may output an error message stating that if the GameState object's <init> failed, the player
	may need to upgrade to a more modern browser.
	The 5 core steps are, ideally, the only ones that should be run outside of any mode, so that a screen may
	take control as quickly as possible, and the canvas is not left blank for any significant amount of time.

* GAMESTATE
	The GameState constructor takes 3 arguments:

		- width
			An integer specifying the width of the draw data of the canvas, in pixels. This number will adjust
			if and only if a call to <setResolution()> changes the aspect ratio of the displayed canvas. See
			<setResolution()> for details.

		- height
			An integer constant specifying the height of the drawing canvas. This number cannot change, even
			upon calls to <setResolution()>. See <setResolution()> for details.

		- FRAME_RATE
			A positive real number constant specifying the average number of frames per second that the game
			should run at. Some frames may run slightly faster than others, but the engine will ensure that, in
			the long run, the average is maintained.

	The GameState class/namespace contains the following public variables and objects:

		- mousePosition
			This is a 2-element Array, where the elements are the x and y value, respectively, of the draw data
			of the canvas that the mouse is hovering over.
				Use: If the game requires mouse interaction, then use this with <getCollision> to allow the user
				to interact with the game.

		- mouseDown
			If a mouse button is being held down, this is set to true. Otherwise, it is set to false.
				Use: If the game requires mouse input, then use this with <getCollision> to allow the user to
				interact with the game.

		- mousePressed
			If a mouse buttons was up during the previous frame, but is down during this frame, this set to
			true. Otherwise, it is set to false.
				Use: If the game requires mouse input, then use this with <getCollision> to allow the user to
				interact with the game.

		- keysDown
			An array that stores a value of true at the index of any keys that are being held down. For example,
			keysDown[32] has a value of true if the spacebar is being held down. If a key is not being held
			down, the value at the keyCode index is either undefined or false.
				Use: If the game requires keyboard input, then use this to allow the user to interact with the
				game.

		- keysPressed
			An array that stores a value of true at the index of any keys that were up in the previous frame,
			but are down during this frame. For example, keysDown[32] has a value of true if the spacebar has
			just been pressed. If a key has not been pressed, the value at the keyCode index is undefined.
				Use: If the game requires keyboard input, then use this to allow the user to interact with the
				game.

		- ctx
			This is the canvas context that the game is displayed on. It contains many functions and attributes,
			all of which are described in detail at http://www.w3schools.com/html5/html5_ref_canvas.asp
				Use: The most common use of this object that I foresee is to draw text with ctx.fillText, but a
				developer may choose to use any of the context methods or attributes. Note that ctx.canvas.width
				and ctx.canvas.height may not be equivalent to <width> and <height>, if <setResolution> has been
				called.

		- style
			This is a handle for the style attribute of the DOM element containing the canvas, as defined by the
			<init> function.
				Use: Use this to provide the game with a border, or remove the mouse, or anything you may come
				up with to aesthetically modify the display of the game.

	The GameState class/namespace contains the following public functions:

		- init ( containerID ) : returns boolean
			Takes a single string, which is the id of a DOM element in the document.
			This function removes the contents of the DOM element, and places a canvas of the width and height
			specified in the contructor inside of it. The element is then centered inside its container.
			In addition, this function sets <collisionMap> to a cleared state, and creates event handlers for
			mouse and keyboard input.
			If the browser does not support the HTML5 canvas, this function returns false. Otherwise, it returns
			true.
				Use: Call <init> once a GameState object has been created. If <init> returns false, you must not
				run any more GameState functions, and you may assume that the user's browser does not support
				HTML5, and output an error informing them of that.

		- start ( ) : 
			Begins the game loop. Once <start> has been called, the game will run the current screen as set by
			<setScreen>, <FRAME_RATE> times per second.
				Use: After init() has been called, call start after any game options have been set, and a mode
				has been loaded and set with <loadMode> and <setMode>.

		- getWidth ( ) : returns integer
			Returns the width of the draw data of the canvas.
				Use: The primary envisioned use is to detect the edges of the draw data, but there are sure to
				be many other uses. Use as you desire.

		- getHeight ( ) : returns integer
			Returns the height of the draw data of the canvas.
				Use: The primary envisioned use is to detect the edges of the draw data, but there are sure to
				be many other uses. Use as you desire.

		- setResolution ( x, y, fullscreen, fill ) : 
			Sets the display resolution of the canvas based on the arguments. Calls to this function can change
			the <width> of the draw data, but never the height.
			The width will automatically adjust according to the aspect ratio passed into this resolution.
			If fullscreen is set, then the game will expand until either the x dimension or y dimension of the
			screen is filled.
			If fill is also set, then the game will adjust the <width> of the draw data and the canvas
			automatically to fill the screen completely.
				Use: For changes in resolution only, it is sufficient to set only the first two arguments, e.g.
				setResolution(800,600).
				If you want to make the game fullscreen, then set fill if the aspect ratio of your game is not
				important.
				This function is intuitive. Simply attempt to use it, and what it does should make sense.

		The following functions deal with switching between game modes and screens. For details on how to
		construct modes, see the section titled 'MODES'.

			- loadMode ( mode, modeName ) : 
				Takes an object structured as a mode (see the 'MODE' section), and a string containing a single
				word that may be used later to retreive the object from memory using <setMode>.
					Use: <loadMode> is intended to be called from loading screens, or from <main>. Because
					creating modes is the most time and memory-intensive thing your game is likely to do,
					<loadMode> should be called when making the player wait will be the least obtrusive. When
					you want to load a mode, create it, and pass it to <loadMode> along with a unique handle
					that describes the mode's function. Loading a second mode with the same name will safely
					clear the old mode from memory and replace it with the new one.

			- unloadMode ( modeName ) : 
				Removes a mode from memory that has previously been loaded with <loadMode> with the same value
				of modeName.
					Use: When memory usage is a concern, or you know that a mode will never be used again, you
					may use <unloadMode> to free memory.

			- setMode ( modeName ) : 
				Runs the <init> function of a mode that has previously been loaded with <loadMode> with the same
				value of modeName.
					Use: To gain access to a mode's screens and other variables, use <setMode>, and then
					<setScreen> inside of the mode's <init>. See <init> for details.

			- setScreen ( screen ) :
				Takes a function that will be run <FRAME_RATE> times per second by the engine.
					Use: A mode should call this function whenever it wants to change screenss. For details on how
					to form screens, see the 'MODE' section.

		The following functions deal with the collision map of the GameState engine, which is an array of
		dimensions <width>x<height>, designed to be used in a flexible way to create collision detection in the
		game engine. The collision map may contain any value (or object) for any element, and the developer must
		decide what values best suit their needs.
		The default value of every element of the collision map is null.
		One use of the collision map would be to assign objects in the game individual ID numbers, and to use
		<setCollision> to fill areas of the collision map corresponding to each object with those numbers. Then,
		when the user clicks on an area of the canvas, the developer can use the coordinates from <mousePressed>
		in <getCollision> to figure out what object was clicked, and to perform any desired action upon it.
		It is important to be careful about the order in which the collision map functions are called. Calling 
		<setCollision>, then <clearCollisionMap>, then <getCollision> will always result in <getCollision>
		returning false. Note that there is no requirement for <clearCollisionMap> to be called at all. For
		example, screens with buttons may fill the maps with the locations of the buttons, and then assume that
		the buttons do not move.

			- setCollision ( x, y, value ) : 
				Sets the element of the collision map at the given coordinates to the given value.
					Use: The collision map has a 1-to-1 correspondence with the draw data of the canvas. Use
					<setCollision> to mark particular areas of the canvas as belonging to an object or having a
					particular quality.

			- getCollision ( x , y ) : returns value
				Returns the value of the element of the collision map at the given coordinates.
					Use: Use this function to determine the object present of a particular area of the canvas.

			- clearCollisionMap ( ) : 
				Sets every element of the collision map to its default value of null.
					Use: Use this function to quickly reset the values of every element of the collision map to
					the	default value of null.

		The following functions deal with loading resources into the game. These are the functions located in
		resources.js. Each of these functions has a filepath that you may want to modify to suit the needs of your
		game. See the section titled 'FOLDER STRUCTURE' for details.

			-getImage ( imageName ) : returns Image object
				This function loads an image with the given name from the path for static images. It returns the
				image as an Image object, with the extra functions described in the 'IMAGE' section.
				The default path for static images is 'res/img/static/'.
					Use: Load static images into memory, to draw with draw()

			-getSound ( soundName ) : returns Audio object
				This function returns an Audio object, with the extra functions described in the 'AUDIO' section.
				The default path for sound effects is 'res/audio/sfx/'.
					Use: Load sound effects into memory, to play with play()

			-getSong ( songName ) : returns Audio object
				This function returns an Audio object that is set to loop by default, and with the extra functions
				described in the 'AUDIO' section.
				The default path for music is 'res/audio/music/'.
					Use: Load music into memory, to play with play()

			-getSprite ( spriteName ) : returns Sprite object
				This function reads the rules for a sprite with the given name from the <spriteInfo> object
				described in the 'SPRITE INFO' section, and loads them into a Sprite object as described in the
				'SPRITE' section.
				The default path for sprites is 'res/img/sprites/'.
					Use: Load images with animations into memory, to draw with draw()

* MODE
	A mode is an object, the specific construction of which is up to the developer. The engine comes with a
	single provided mode, the <LoadingMode>, but there is no requirement that other modes resemble it. The only
	requirements for a mode are that it must contain an <init> and <destroy> function.

	- LoadingMode
		LoadingMode is a special mode that comes with the library, and it is provided to make loading screens
		easier for the developer to code, as well as to be an example of a simple mode and a simple way of
		structuring modes.
		The constructor for LoadingMode takes 2 arguments - an array of arrays called <loadingFunctions> and a
		GameState object called <gs>.

			-loadingFunctions
				This is a 2-dimensional array - an array of arrays. Each array in loadingFunctions has 2 elements.
					1) A function, which will run after all of the functions in the previous arrays have
					completed.
					2) A string that will be displayed on the screen while the function is running.
				<loadingFunctions> allows a developer to provide as much or as little information about what the
				game is loading while the player waits for the game to load. Because the library does not yet
				support networking, loading times should be extremely fast, and it may not be necessary to use
				more than one function with the string 'Loading...'.

			-gs
				This is provided as a way for the mode to access the GameState object that the game is using, so
				that <LoadingMode> has access to the canvas context of the game, the <setScreen> function, and
				the <getWidth> and <getHeight> functions.

	Below are the specifications for writing your own modes.

		1) Every mode must have access to the GameState object that the game is using. The easiest way to give
		modes access is to pass the GameState object as an argument to the constructor.

		2) All modes must have <init> and <destroy> functions.

			- init ( ) : 
				Must contain a call to <setScreen>, to ensure that the game logic changes to this mode. In
				addition, any loading that was not done in the constructor of the mode may be done here. It is
				recommended that loading done in the <init> function rather than the constructor account for
				multiple calls to <init> after only a single call to the constructor. For example, a Pac-Man
				game may load the images to draw the walls of a level in the constructor, but place the dots on
				the level in <init>. Then, calls to <init> will place the dots where they should be without
				having to reload the walls. Putting either the dot placement in the constructor or the wall
				image loading in <init> would force unnecessary loading time.

			- destroy ( ) : 
				A destructor for the mode. This function should call the <destroy> method of every object it
				contains that has a <destroy> method, especially for those resources that are loaded using the
				resource loading functions of a GameState object. If an object does not have a <destroy> method,
				then it must be deleted using the delete keyword. If this destructor is not complete, then
				<unloadMode> may leak unnecessary memory.

		3) All modes must have access to functions called screens, which are the essential blocks of code that
		run game logic. A screen function, once passed to a GameState object through the GameState object's
		<setScreen> function, will be run up to <FRAME_RATE> times per second. Therefore, screens should
		generally contain only such operations that can consistently run in only a few milliseconds. A screen's
		duties include:
			- Processing user input (if any).
			- Calculating the values of game variables, such as the positions of game objects.
			- Registering sprites and images to draw with their <draw> functions.
			- Deciding if the screen should end on a particular frame, and then making a call either to the 
				GameState object's <setScreen> or <setMode>.
		In a game written with the GameState library, every game logic task is performed inside of a screen
		function.

* IMAGE
	Any Image objects created after a GameState object has been created, in particular those returned by the
	<getImage> function, have additional methods in addition to those that they have by default.

	- draw ( x, y, horizontalFlip, rotation, scaling ) : 
		Registers the image with the GameState object to be drawn at the end of the current frame.
			Use: Whenever you want to display an Image, use this function to draw it with the desired properties.

	- destroy ( ) : 
		Removes the Image from memory. This is identical to using delete, but allows the developer to consistently
		use destroy for all objects.
			Use: Call this in the <destroy> methods of modes that load the image in their constructors, or when
			you otherwise needs to free an image from memory.

* SPRITE
	<getSprite> returns a Sprite object, which contains a a full set of images and animations, which are loaded
	according to rules in the <spriteInfo> object. Each Sprite object has the following functions:

	-draw ( x, y, horizontalFlip, rotation, scaling ) : 
		Registers the current image of the current animation of the sprite with the GameState object to be drawn
		at the end of the current frame, and then sets the next image as the current image.
	-setAnim ( animName ) : 
		Takes a name of an animation that the sprite has, as defined in the <spriteInfo> object. The next call
		to <draw> will draw the first frame of this animation, and subsequent calls will cycle through the
		animation.
	-destroy ( ) : 
		Removes the sprite from memory, including every image and data structure contained inside it.
			Use: Call this in the <destroy> methods of modes that load the sprite in their constructors, or when
			you otherwise need to free a sprite from memory.

* AUDIO
	Any Audio objects created after a GameState object has been created, in particular those returned by the
	<getSound> and <getSong> functions, have additional methods in addition to those that they have by default.

	-stop ( ) : 
		Stops the Audio object if it is playing.
			Use: Sounds cannot play simulteneously in HTML5 without some workarounds. If you want to play a
			sound that is already playing, first call <stop> and then play the sound. Also, you can simply stop
			sounds if you need to with <stop>.

	-destroy ( ) : 
		Removes the Audio object from memory. This is identical to using delete, but allows the developer to
		consistently use destroy for all objects.
			Use: Call this in the <destroy> methods of modes that load the sound in their constructors, or when
			you otherwise needs to free a sound from memory.
				
* FOLDER STRUCTURE
	The library is designed to be compact and not to require any modification, but there are some hardcoded
	filepaths that a developer may wish to modify. These filepaths are in the resource loading functions of
	the library, located in resources.js.

		- getImage, getSound, getSong
			These functions get resources from a path which is hardcoded into their body. If you want to change
			the folder structure of your game, it will be necessary to modify these functions so that they can
			find the files you need for you. In addition, you may add your own similar functions (ex:
			getBgImage) to help you achieve the folder structure your project needs.

		- getSprite
			Like the functions above, this function gets images from a hardcoded path, which you may change to
			adapt to your folder structure. However, this function must also read the included <spriteInfo> object
			and must load multiple files at once, from a relatively complex folder structure, and load them into
			GameState objects in a proper order. If you understand the function, and the way the Sprite and
			Animation classes work, then you should feel free to completely rewrite this function to fit your
			needs. However, it is recommended that you only change the root file path unless you are confident
			that you know what you are doing. For details on how the function reads the path of each frame of
			each animation of each sprite, and how you should structure the paths of your own sprite objects,
			see the section titled 'SPRITE INFO'.

	For the default filepaths used by each function, see the part of the 'GAMESTATE' section devoted to resource
	loading functions, or look at the source code in resources.js.

* SPRITE INFO
	One of the core components of the library that must be modified for almost any game is the <spriteInfo> object
	contained in sprite_info.js. This is a JSON object which is designed to be easy, albeit with some learning
	curve, for a developer to modify, and to make both simple and complex animations easy to create.
	If you have no prior knowledge of JSON, you should look at http://json.org/ for reference. It is not as
	complicated as it may appear.
	The object dictates a precise folder structure which must be used past the root folder of all of the
	sprites, as described in the 'FOLDER STRUCTURE' section.
	- The spriteInfo object may contain any number of values inside of it.
		- The name of each value must be a string which represents the name of the sprite, and also of the first
		folder in the sprite folder hierarchy past the root folder. eg 'res/img/sprite/spriteName/'
		- Each value must be an object, which represents animation data for the sprite with the given name. This
		object must contain at least one value.
			- The name of each value must be a string which represents the name of the animation, and also of
			the second folder in the sprite folder hierarchy past the root folder. eg
			'res/img/sprite/spriteName/animationName'.
			- Each value must be an object which contains four values, named "next", "images", "durations", and
			"offsets".
				- The value of "next" in each animation must be a string, which represents the name of the
				animation that the sprite should display if the current animation should end. If the value of
				the string is "", then the animation will repeat when it ends. For every value of "next" in
				every object in the "sprite" array, there must be an object with a matching value of "name".
				- The value of "images" in each animation must be a positive integer, which represents the
				number of images that each animation consists of. Each image must be a png named by its number
				in the animation and must be in the folder of its animation name. eg
				'res/img/sprite/spriteName/animationName/0.png'
				- The value of "durations" in each animation must be an array, the length of which is equal to
				the value of "images".
					- Each element of the "durations" array must be a positive integer, which represents the
					number of calls to the <draw> function of the sprite that must be made before the next image
					of the animation is displayed. For example, if the 3rd element of the "durations" array is
					6, then the image 3.png belonging to the current animation will be displayed for 6 frames,
					assuming that a call to this Sprite's <draw> function is made once per frame.
				- The value of "offsets" in each animation must be an array, the length of which is equal to the
				value of "images".
					- Each element of the "offsets" array must be an array of 2 elements, which represent the x
					and y offset at which each image must be displayed. For example, if the 3rd element of the
					"offsets" array is [-5,-5], then the image 3.png belonging to the current animation will be
					displayed 5 pixels higher and 5 pixels farther to the left than any images for which the
					offset is [0,0].

	These rules are long not because they are complicated, but because the explanation is exhaustive. By reading
	the sample code and playing with the values of the spriteInfo object included with it, you should be able to
	understand how to create your own animations of varying complexity. However, keep in mind that JSON syntax is
	unforgiving, and make sure to avoid common mistakes, such as ending arrays or objects with a comma. eg
	'[element, element,]' instead of '[element,element]', or using single quotes instead of double quotes to write
	value names.

That's it! If there are any questions that you have which are not immediately answered by the sample code or by
this README, make sure to IMMEDIATELY and WITHOUT HESITATION e-mail me at timaster@gmail.com . My goal is to
make using my library easy for anybody who may want to do so, and if something is unclear for any reason, that
is my fault and not yours.
This is doubly true if something simply does not work, as I almost undoubtedly have bugs in my code that need
fixing.
Finally, if you are satisfied with the library and have found it useful, please feel free to tell me so as well!
I would love to know that the work I've put into this has paid off for somebody.