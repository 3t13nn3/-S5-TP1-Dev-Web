/*Etienne PENAULT							*/
/*TODO - Fix Speed in size function			*/
/*TODO - Fix Keyboard inputs				*/
/*TODO - Add some generic picture detection	*/

window.addEventListener("load", event => {
	console.log("loaded");
	main();
});

const main = event => {
	let canvas = new MyCanvas();
	canvas.createImage();
	canvas.loop();
}

class MyCanvas {

	randomNumber	= 0;

	nbOfImages		= 5;
	images			= [];
	imageIndex		= 0;

	FPS				= 120;
	lastFrame 		= 0;
	delta			= 0;

	speed			= 0;
	bounceSpeed 	= 0;
	animationOn		= false;

	/*To create a canvas*/
	constructor() {
		this.canvas 		= document.createElement("canvas");
		this.context 		= this.canvas.getContext("2d");

		this.canvas.width 	= window.innerWidth;
		this.canvas.height 	= window.innerHeight;

  		document.body.appendChild(this.canvas);
		console.log("Canvas: " + window.innerWidth + " " +  window.innerWidth);

		/*Initialize init time at the canvas creation*/
		this.lastFrame = Date.now();
	}

	/*Handle resize*/
	resize(){
		window.onresize = ()=>{
			this.canvas.width 	= window.innerWidth;
			this.canvas.height 	= window.innerHeight;
		};
	}

	/*Drawing our images & our transition if our transition's boolean is as true*/
	draw(){
		this.context.drawImage(this.images[(this.imageIndex)],0,0,this.canvas.width,this.canvas.height);
		if(this.animationOn == true)
			this.squareAnimation()
	}	

	/*Graphic loop*/
	loop(){
		this.delta	= (Date.now() - this.lastFrame);
		if (this.delta > 1000/this.FPS){
			this.event();
			this.resize();
			this.draw();
			this.lastFrame	= Date.now();
		}
		/*Kind of swapframebuffer*/
		let swap = this;
		window.requestAnimationFrame(()=>{swap.loop()});
	}

	/*Fill our vector of images*/
	createImage(){
		for(let i =0; i<this.nbOfImages; ++i){
			this.images[i] = new Image();
		    this.images[i].src = "media/" + (i+1).toString() + ".jpg";;
		}
	}

	/*Hanlde previous and next option to change image*/
	changeImage(direction){
		/*Reset our value that we will nedd for our animation*/
		this.randomNumber	= Math.floor(Math.random() * 15) + 2;
		this.speed = 0;
		this.bounceSpeed = 0;
		this.animationOn = true;

		if(direction == "next")
			this.imageIndex++
		else if(direction == "prev")
			this.imageIndex--;

		if(this.imageIndex < 0)
			this.imageIndex = this.nbOfImages-1;
		else if(this.imageIndex > this.nbOfImages-1)
			this.imageIndex = 0;
	}

	/*Event handler*/
	event(){

		/*MOUSE*/
		this.canvas.onclick = ()=>{
			this.changeImage("next");	
		}

		/*KEYBOARD*/
		/*wtf doing shit ¯\_(ツ)_/¯ */
		document.addEventListener("keydown", event => {
			/*Right & Up*/
		    if(event.keyCode == 39 || event.keyCode == 38) {
		        this.changeImage("next");
		    }
		    /*Left & Down*/
		    else if(event.keyCode == 37 || event.keyCode == 40) {
		        this.changeImage("prev");	
		    }
		});
	}

	/*Method that create our square animation in function of time*/
	squareAnimation(){

		/*Image variables*/
		let	previousIndex 	= (((this.imageIndex)-1) >= 0) ? ((this.imageIndex)-1) : this.nbOfImages-1;
		let imageForEffect	= this.images[previousIndex];

		//Change it for some fun
		let minimumNumberOfSquareOnTheSmallerAxe	= this.randomNumber;
		let transparency							= 1;

		let maxIterationsWidth	= minimumNumberOfSquareOnTheSmallerAxe;
		let maxIterationsHeight	= minimumNumberOfSquareOnTheSmallerAxe;

		/*To get no empty fills*/
		let offset				= 1;
		let squareWidth			= (this.canvas.width/maxIterationsWidth);
		let squareHeight		= (this.canvas.height/maxIterationsHeight);

		/*To keep some square form, add some squares if height or width is increase	*/
		/*And trying to keep a rationnal speed with any size of canvas				*/
		if(this.canvas.width > this.canvas.height){
			maxIterationsWidth   = Math.floor(maxIterationsWidth*(this.canvas.width/this.canvas.height))
			squareWidth = (this.canvas.width/maxIterationsWidth);
			this.speed += this.delta/(maxIterationsWidth);
		}else{
			maxIterationsHeight   = Math.floor(maxIterationsHeight*(this.canvas.height/this.canvas.width))
			squareHeight = (this.canvas.height/maxIterationsHeight);
			this.speed += this.delta/(maxIterationsHeight);
		}

		this.bounceSpeed += this.delta/60;
		
		/*Drawing and moving our squares*/
		for(let i = 0; i < maxIterationsWidth; ++i){
			for(let j = 0; j < maxIterationsHeight; ++j){
				if(squareHeight > this.speed*2 && squareWidth> this.speed*2){

					this.context.globalAlpha = transparency;

					this.context.drawImage(imageForEffect,
						imageForEffect.naturalWidth/maxIterationsWidth*i,
						imageForEffect.naturalHeight/maxIterationsHeight*j, 
						imageForEffect.naturalWidth/maxIterationsWidth,
						imageForEffect.naturalHeight/maxIterationsHeight,
						squareWidth*i  +this.speed ,
						squareHeight*j +this.speed+ 25*Math.sin(this.bounceSpeed), 
						squareWidth	 -(this.speed*2) + offset,
						squareHeight   -(this.speed*2) + offset);

					this.context.globalAlpha = 1;
				}
				else{
					this.animationOn = false;
					return
				}
			}
		}
	}

}