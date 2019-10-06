/*Etienne PENAULT*/
/*TODO - Set FPS cap*/

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

	randomNumber = 0;

	nbOfImages	= 5;
	imagesPath	= [];
	images 		= [];
	imageIndex	= 0;

	lastFrame 	= Date.now();
	delta		= 0;
	speed		= 0;
	animationOn	= false;

	constructor() {
		this.canvas 		= document.createElement("canvas");
		this.context 		= this.canvas.getContext("2d");

		this.canvas.width 	= window.innerWidth;
		this.canvas.height 	= window.innerHeight;

  		document.body.appendChild(this.canvas);
		console.log("Canvas: " + window.innerWidth + " " +  window.innerWidth);
	}

	resize(){
		window.onresize = ()=>{
			this.canvas.width 	= window.innerWidth;
			this.canvas.height 	= window.innerHeight;
		};
	}

	draw(){
		//this.context.fillStyle = "#FF0000";
		this.context.drawImage(this.images[(this.imageIndex)],0,0,this.canvas.width,this.canvas.height);
		this.event();
		if(this.animationOn == true)
			this.squareAnimation()
	}	

	loop(){
		this.delta 		= (Date.now() - this.lastFrame); //to get ms
		this.lastFrame	= Date.now();
		let here = this;
		window.requestAnimationFrame(()=>{here.loop()});
		this.resize();
		this.draw();

	}

	createImage(){
		for(let i =0; i<this.nbOfImages; ++i){
			this.images[i] = new Image();
		    this.images[i].src = "media/" + (i+1).toString() + ".jpg";;
		}
	}

	changeImage(direction){
		this.randomNumber 	= Math.floor(Math.random() * 15) + 2;
		this.speed = 0;
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

	event(){

		/*MOUSE*/
		this.canvas.onclick = ()=>{
			this.changeImage("next");	
		}

		/*KEYBOARD*/ /*wtf doing shit*/
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

squareAnimation(){
		let offset 			= 1;

		//Change it for some fun
		let minimumNumberOfSquareOnTheSmallerAxe 	= this.randomNumber;
		let transparency							= 1;

		let maxIterationsWidth   = minimumNumberOfSquareOnTheSmallerAxe;
		let maxIterationsHeight  = minimumNumberOfSquareOnTheSmallerAxe;

		let squareWidth		= (this.canvas.width/maxIterationsWidth);
		let squareHeight	= (this.canvas.height/maxIterationsHeight);


		//To keep some square form, add some squares if height or width is increase
		//To keep some square form, add some squares if height or width is increase
		if(this.canvas.width > this.canvas.height){
			maxIterationsWidth   = Math.floor(maxIterationsWidth*(this.canvas.width/this.canvas.height))
			squareWidth = (this.canvas.width/maxIterationsWidth);
			this.speed += this.delta/(maxIterationsWidth);
		}else{
			maxIterationsHeight   = Math.floor(maxIterationsHeight*(this.canvas.height/this.canvas.width))
			squareHeight = (this.canvas.height/maxIterationsHeight);
			this.speed += this.delta/(maxIterationsHeight);
		}

		


		let	previousIndex 	= (((this.imageIndex)-1) >= 0) ? ((this.imageIndex)-1) : this.nbOfImages-1;
		let imageForEffect	= this.images[previousIndex];

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
										  squareHeight*j +this.speed+ 25*Math.sin(this.speed/(60/minimumNumberOfSquareOnTheSmallerAxe)), 
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