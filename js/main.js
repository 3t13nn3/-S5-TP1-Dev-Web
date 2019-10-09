/*Etienne PENAULT							*/
/*TODO - Fix Speed in size function			*/
/*TODO - Add some generic picture detection	*/

window.addEventListener("load", event => {
	main();
});

const main = event => {
	let canvas = new Gallery();
	canvas.createImage();
	canvas.loop();
}

class Gallery {

	/*To create a canvas*/
	constructor() {
		this.canvas         = document.createElement("canvas");
		this.context        = this.canvas.getContext("2d");

		this.canvas.width   = window.innerWidth;
		this.canvas.height  = window.innerHeight;

  		document.body.appendChild(this.canvas);
		console.log("Canvas: " + window.innerWidth + " " +  window.innerWidth);

		/*Initialize variables*/
		
		this.randomNumber   = 0;

		this.nbOfImages     = 5;
		this.images         = [];
		this.imageIndex     = 0;

		this.lastFrame      = Date.now();
		this.delta          = 0;

		this.speed          = 0;
		this.bounceSpeed    = 0;
		this.animationOn    = false;

		this.maxIterationsWidth     = 0;
		this.maxIterationsHeight    = 0;
		this.squareWidth            = 0;
		this.squareHeight           = 0;
		this.previousIndex          = 0;
		this.clickX                 = 0;
		this.clickY                 = 0;

		this.shadowffset            = 3;
		this.transparency           = 0.75;
		this.offset                 = 1;
		this.selectedAnimation      = 0;

		this.distanceBeetweenSquaresAndClick = [];
		this.event();

	}

	/*Handle resize*/
	resize(){
		window.onresize = ()=>{
			this.canvas.width   = window.innerWidth;
			this.canvas.height  = window.innerHeight;
		};
	}

	/*Drawing our images & our transition if our transition's boolean is as true*/
	draw(){
		this.context.drawImage(this.images[(this.imageIndex)],0,0,this.canvas.width,this.canvas.height);
		if(this.animationOn == true){
			if(this.selectedAnimation == 0)
				this.squareClickAnimation()
			else if(this.selectedAnimation == 1)
				this.squareAnimation()
		}

	}	

	/*Graphic loop*/
	loop(){
		/*Kind of swapframebuffer*/
		let swap = this;
		window.requestAnimationFrame(()=>{swap.loop()});
		this.delta      = Date.now() - this.lastFrame;
		this.draw();
		this.lastFrame  = Date.now();
	}

	/*Fill our vector of images*/
	createImage(){
		for(let i =0; i<this.nbOfImages; ++i){
			this.images[i] = new Image();
		    this.images[i].src = "media/" + (i+1).toString() + ".jpg";
		}
	}

	/*Hanlde previous and next option to change image*/
	changeImage(direction){
		/*Reset our value that we will nedd for our animation*/
		if(this.selectedAnimation == 0)
			this.randomNumber   = Math.floor(Math.random() * 40) + 10;
		else if(this.selectedAnimation == 1)
			this.randomNumber   = Math.floor(Math.random() * 20) + 2;
		this.speed       = 0;
		this.bounceSpeed = 0;
		this.animationOn = true;
		this.setSquareDimensions();
		this.calculateDistance();
		if(direction == "next"){
			this.imageIndex++
			this.previousIndex 	= (((this.imageIndex)-1) >= 0) ? ((this.imageIndex)-1) : this.nbOfImages-1;
		}
		else if(direction == "prev"){
			this.imageIndex--;
			this.previousIndex 	= (((this.imageIndex)+1) >= 0) ? ((this.imageIndex)+1) : this.nbOfImages-1;
		}

		if(this.imageIndex < 0)
			this.imageIndex = this.nbOfImages-1;
		else if(this.imageIndex > this.nbOfImages-1)
			this.imageIndex = 0;
	}

	/*Event handler*/
	event(){

		/*MOUSE*/
		this.canvas.addEventListener("click", event => {
			this.clickX	           = event.clientX;
			this.clickY	           = event.clientY;
			this.selectedAnimation = 0;
			this.changeImage("next");	
		});


		/*KEYBOARD*/
		document.addEventListener("keydown", event => {
			/*Right & Up*/
		    if(event.keyCode == 39 || event.keyCode == 38) {
		    	this.selectedAnimation = 1;
		        this.changeImage("next");
		    }
		    /*Left & Down*/
		    else if(event.keyCode == 37 || event.keyCode == 40) {
		    	this.selectedAnimation = 1;
		        this.changeImage("prev");	
		    }
		});

		this.resize();
	}


	/*To keep some square form, add some squares if height or width is increase	*/
	/*And trying to keep a rationnal speed with any size of canvas				*/
	setSquareDimensions(){
		let minimumNumberOfSquareOnTheSmallerAxe    = this.randomNumber;
		this.maxIterationsWidth                     = minimumNumberOfSquareOnTheSmallerAxe;
		this.maxIterationsHeight                    = minimumNumberOfSquareOnTheSmallerAxe;
		this.squareWidth                            = (this.canvas.width/this.maxIterationsWidth);
		this.squareHeight                           = (this.canvas.height/this.maxIterationsHeight);
		if(this.canvas.width > this.canvas.height){
			this.maxIterationsWidth    = Math.floor(this.maxIterationsWidth*(this.canvas.width/this.canvas.height))
			this.squareWidth = (this.canvas.width/this.maxIterationsWidth);
		}else{
			this.maxIterationsHeight   = Math.floor(this.maxIterationsHeight*(this.canvas.height/this.canvas.width))
			this.squareHeight = (this.canvas.height/this.maxIterationsHeight);
		}
	}

	/*Useful for our clicked animation, calculate the distance beetween our click and every squares*/
	calculateDistance(){
		for(let i = 0; i < this.maxIterationsWidth; ++i){
			this.distanceBeetweenSquaresAndClick[i] = [];
			for(let j = 0; j < this.maxIterationsHeight; ++j){
				this.distanceBeetweenSquaresAndClick[i][j] = (Math.sqrt(
								Math.pow(this.clickX - (this.squareWidth*i + this.squareWidth/2), 2) + 
								Math.pow(this.clickY - (this.squareHeight*j + this.squareHeight/2), 2)
					)/500) + 1;
			}
		}
	}

	/*Method that create our square animation in function of time*/
	squareAnimation(){

		/*Image variables*/
		let imageForEffect	= this.images[this.previousIndex];

		/*SPPED*/
		if(this.canvas.width > this.canvas.height){
			this.speed += this.delta/(this.maxIterationsWidth);
		}else{
			this.speed += this.delta/(this.maxIterationsHeight);
		} 		
		this.bounceSpeed += this.delta/60;
		
		/*Drawing and moving our squares*/
		for(let i = 0; i < this.maxIterationsWidth; ++i){
			for(let j = 0; j < this.maxIterationsHeight; ++j){
				if(this.squareHeight > this.speed*2 && this.squareWidth> this.speed*2){

					this.context.globalAlpha = this.transparency;
					this.context.fillRect(this.squareWidth*i  +this.speed     + this.shadowffset,
					                      this.squareHeight*j +this.speed     + this.shadowffset + 25*Math.sin(this.bounceSpeed), 
					                      this.squareWidth    -(this.speed*2) + this.shadowffset + this.offset,
					                      this.squareHeight   -(this.speed*2) + this.shadowffset + this.offset
					);
					this.context.globalAlpha = 1;

					this.context.drawImage(imageForEffect,
					                       imageForEffect.naturalWidth/this.maxIterationsWidth*i,
					                       imageForEffect.naturalHeight/this.maxIterationsHeight*j, 
					                       imageForEffect.naturalWidth/this.maxIterationsWidth,
					                       imageForEffect.naturalHeight/this.maxIterationsHeight,
					                       this.squareWidth*i  +this.speed ,
					                       this.squareHeight*j +this.speed     + 25*Math.sin(this.bounceSpeed), 
					                       this.squareWidth	   -(this.speed*2) + this.offset,
					                       this.squareHeight   -(this.speed*2) + this.offset);
				}
				else{
					this.animationOn = false;
					return
				}
			}
		}
	}

	/*Method that create our square animation in function of time & click coordinates*/
	squareClickAnimation(){
		
		/*Image variables*/
		let imageForEffect	= this.images[this.previousIndex];

		/*SPPED*/
		if(this.canvas.width > this.canvas.height){
			this.speed += this.delta/(this.maxIterationsWidth);
		}else{
			this.speed += this.delta/(this.maxIterationsHeight);
		} 		

		/*Drawing and moving our squares*/
		for(let i = 0; i < this.maxIterationsWidth; ++i){
			for(let j = 0; j < this.maxIterationsHeight; ++j){
				if(this.squareHeight > this.speed*this.distanceBeetweenSquaresAndClick[i][j]*2 && this.squareWidth> this.speed*this.distanceBeetweenSquaresAndClick[i][j]*2){
					
					this.context.globalAlpha = this.transparency;
					this.context.fillRect(this.squareWidth*i  +this.speed*this.distanceBeetweenSquaresAndClick[i][j]   + this.shadowffset,
					                      this.squareHeight*j +this.speed*this.distanceBeetweenSquaresAndClick[i][j]   + this.shadowffset, 
					                      this.squareWidth	  -this.speed*this.distanceBeetweenSquaresAndClick[i][j]*2 + this.shadowffset + this.offset,
					                      this.squareHeight   -this.speed*this.distanceBeetweenSquaresAndClick[i][j]*2 + this.shadowffset + this.offset
					);
					this.context.globalAlpha = 1;

					this.context.drawImage(imageForEffect,
					                       imageForEffect.naturalWidth/this.maxIterationsWidth*i,
					                       imageForEffect.naturalHeight/this.maxIterationsHeight*j, 
					                       imageForEffect.naturalWidth/this.maxIterationsWidth,
					                       imageForEffect.naturalHeight/this.maxIterationsHeight,
					                       this.squareWidth*i  +this.speed*this.distanceBeetweenSquaresAndClick[i][j] ,
					                       this.squareHeight*j +this.speed*this.distanceBeetweenSquaresAndClick[i][j], 
					                       this.squareWidth	   -this.speed*this.distanceBeetweenSquaresAndClick[i][j]*2 + this.offset,
					                       this.squareHeight   -this.speed*this.distanceBeetweenSquaresAndClick[i][j]*2 + this.offset);

				}else if(this.squareHeight <= this.speed && this.squareWidth<= this.speed){
					this.animationOn = false;
					return
				}
			}
		}
	}
}