define(function (require) {

	var window_w = document.body.offsetWidth;
	var tagsli = document.querySelectorAll("#slideshow-inner li");
	var images = document.querySelectorAll("#slideshow-inner li img");
	var slideUl = document.querySelector("#slideshow-inner ul");
	var slideDiv = document.querySelector("#slideshow-inner");
	var actLi = document.querySelector("#slider1");

	function orderListOfSlides(curSlide, prev_req, next_req){
		var slidLen = tagsli.length;
		var medLen =  Math.floor(slidLen/2);
		var ceilLen = Math.ceil(slidLen/2);
		slideUl.className = "paused-transformation";
		var curIt = parseInt(curSlide.getAttribute('id').match(/slide(\d+)/)[1]);
		if(curIt && slidLen>2) for(var i=1; i<=medLen; i++){
			slideUl.appendChild(document.querySelector("#slideshow-inner li#slide"+((curIt+i)%slidLen?(curIt+i)%slidLen:slidLen)));
			slideUl.insertBefore(document.querySelector("#slideshow-inner li#slide"+((curIt+medLen+i)%slidLen?(curIt+medLen+i)%slidLen:slidLen)), curSlide);
			slideUl.style.left = "-"+curSlide.offsetLeft+"px";
		} else if (slidLen==2) { 
			if (prev_req) slideUl.insertBefore(slideUl.lastElementChild, curSlide); 
			else slideUl.appendChild(slideUl.firstElementChild); 
		}
	}

	function loadImage(tagLi){
		var img = tagLi.firstElementChild||tagLi.firstChild;
		if(img.width>=img.height)
			img.className = "wider-image";
		else img.className = "narrow-image";
		tagLi.setAttribute('info', "loaded"); 
		img.src = img.getAttribute('data-path')+img.getAttribute('data-name');
	}
	
	function setLiAct(tagLi){
		actLi.className = '';
		actLi = tagLi;
		if (actLi.getAttribute('info')=="not-loaded") loadImage(actLi);
		actLi.className = "active";
		document.querySelector("div.slide-navigation ul a.active").className = "";
		document.querySelector("#slide-page-"+actLi.id.match(/slide(\d+)/)[1]).className = "active";
		slideUl.className = "";
		slideUl.style.left = '-'+actLi.offsetLeft + 'px';
	}
	
	
    return {
		onloadWindow: function(event){
			window_w = document.body.offsetWidth;
			var width = Math.round(window_w*0.8);
			var height = Math.round(window_w*0.8/1.5);
			for (var i=0; i<images.length; i++){
				images[i].width = width;
				images[i].height  = height;
				tagsli[i].setAttribute('info', "not-loaded");
			}
			var slideNavigation = document.querySelector("div.slide-navigation ul");
			for(var i=0; i<images.length; i++)
				slideNavigation.innerHTML += "<a href='#' id='slide-page-"+(i+1)+"'/>";
			slideDiv.style.width = width+'px';
			slideDiv.style.height = height+'px';
			slideUl.style.width = width*(images.length+1)+'px';
			actLi = tagsli[0];
			orderListOfSlides(actLi);
			actLi.className = "active";
			slideUl.style.left = "-"+actLi.offsetLeft+"px";
			document.querySelector("#slide-page-"+actLi.id.match(/slide(\d+)/)[1]).className = "active";
			loadImage(actLi);
			if(images.length<2)document.querySelector("#slideshow-wrap nav a").className = "inactive";
		},
		
		resize: function(){
			window_w = document.body.offsetWidth;
			var width = Math.round(window_w*0.8);
			var height = Math.round(window_w*0.8/1.5);
			for (var i=0; i<images.length; i++){
				images[i].width = tagsli[i].style.width = width+'px';
				images[i].height = tagsli[i].style.height = height+'px';
			}
			slideDiv.style.width = width+'px';
			slideDiv.style.height = slideUl.style.height = height+'px';
			slideUl.style.width = width*(images.length+1)+'px';
			slideUl.className = "paused-transformation";
			slideUl.style.left = "-"+actLi.offsetLeft+"px";
		},
		
		clickSlideNavigation: function (event){
			event.preventDefault();
			var actN = document.querySelector("div.slide-navigation ul a.active").id.match(/slide-page-(\d+)/)[1];
			var num = event.toElement.id.match(/slide-page-(\d+)/)[1];
			var minN = actN>num? num:actN;
			var maxN = actN>num? actN:num;
			if(num&&slideUl.children.length>=num && actN!=num){
				slideUl.className = "paused-transformation";
				var maxLi = document.querySelector('#slide'+maxN);
				if (maxLi.getAttribute('info')=="not-loaded") loadImage(maxLi);
				for(i=minN; i<maxN; i++){
					var tagLi = document.querySelector('#slide'+i);
					slideUl.insertBefore(tagLi, maxLi);
					if (tagLi.getAttribute('info')=="not-loaded") loadImage(tagLi);
					slideUl.style.left = "-"+actLi.offsetLeft+"px";
				}
				setLiAct(document.querySelector('#slide'+num));
			}
		},
		
		clickPrevSlide: function (event){
			event.preventDefault();
			if(!(actLi.previousElementSibling)){
				orderListOfSlides(actLi, prev_req=true, next_req=false);
				slideUl.style.left = "-"+actLi.offsetLeft+"px";
			}
			setLiAct(actLi.previousElementSibling);
		},
		
		clickNextSlide: function (event){
			event.preventDefault();
			if(!(actLi.nextElementSibling)){
				orderListOfSlides(actLi, prev_req=false, next_req=true);
				slideUl.style.left = "-"+actLi.offsetLeft+"px";
			}
			setLiAct(actLi.nextElementSibling);
		},
	};
});

