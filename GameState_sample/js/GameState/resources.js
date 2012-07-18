"use strict";
GameState.prototype.getImage = function(imageName) {
	var img;
	img = new Image();
	img.src =
		'res/img/static/'		// this line is the root file path of static images in the game
		+imageName;
	LoadingMode.waitFor(img);
	return img;
};

GameState.prototype.getSound = function(soundName) {
	var snd;
	snd = new Audio(
		'res/audio/sfx/'		// this line is the root file path of sound effects in the game
		+soundName
	);
	snd.preload = 'auto';
	return snd;
};

GameState.prototype.getSong = function(songName) {
	var snd;
	snd = new Audio(
		'res/audio/music/'		// this line is the root file path of music in the game
		+songName
	);
	snd.preload = 'auto';
	snd.loop = 'loop';
	return snd;
};

GameState.prototype.getSprite = function(spriteName) {
	var anims = {},
		info = GameState.spriteInfo[spriteName],
		img, imgs, anim, k;
	for (anim in info) {
		imgs = new Array();
		for (k=0; k<info[anim].images; k++) {
			img = new Image();
			img.src =
				'res/img/sprites/'						// this line is the root file path for all sprite objects. feel free to modify this to suit your project's folder structure
				+spriteName+'/'+anim+'/'+k+'.png';		// this line is structured in a particular way, and it is not recommended to modify it
			imgs.push(img);
			LoadingMode.waitFor(img);
		}
		anims[anim] = new this.Animation(imgs, info[anim]);
	}
	return new this.Sprite(anims);
};