GameState.Sprite = function(anims) {
	var numAnims = anims.length;
	var curAnim;
	var nextAnim;
	var k;
	var direction;

	this.setAnim = function(animName) {
		curAnim = anims[animName];
		curAnim.reset();
	};

	this.draw = function(x,y,rotation,flip,scaling) {
		curAnim.draw(x,y,rotation,flip,scaling);
		nextAnim = curAnim.nextFrame();
		if (nextAnim)
			this.setAnim(nextAnim);
	};

	this.destroy = function() {
		delete anims;
		delete this;
	};
};