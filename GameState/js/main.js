function main() {
	var gs = new GameState(600,400,60);		// creates a game at 800x600 pixels running at 60 fps

	if (gs.init('game_container')) {		// places the game inside of a DOM element with id='game_container' (in index.html)
		gs.loadMode(new LoadingMode([
			[
				function() {
					// FILL THIS IN
				},'Loading...'
			]
		],gs),'load');
		gs.setMode('load');
		gs.start();
	}
	else {
		//this line contains the error message for HTML5 incompatibility, and also removes the tag from the main page which contains the javascript incompatibility error.
		container.innerHTML='It looks like your browser doesn\'t support HTML5. Please upgrade to a modern browser, such as the latest versions of <a href="https://www.google.com/chrome">Google Chrome</a> or <a href="http://www.mozilla.org/en-US/firefox/new/">Mozilla Firefox</a>.';
	}
}