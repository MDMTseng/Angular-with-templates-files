var touchPDOMs = document.querySelectorAll(".touchP");

for (index = 0; index < touchPDOMs.length; index++) {
    
	regTouchPanel(touchPDOMs[index], touchPDOMCB);
	
	touchPDOMs[index].touchyData.lastEndTouchOffSet_percent={x:0,y:0};
}




/*var touchPDOM2 = document.querySelectorAll(".touchP")[1];

if (touchPDOM2 != null) {
	regTouchPanel(touchPDOM2, touchPDOMCB);

}

var touchPDOM = document.querySelectorAll(".touchP")[0];

if (touchPDOM != null) {
	regTouchPanel(touchPDOM, touchPDOMCB);

}*/
var aF = 0;


var Animationpath = 
[0,0,3,7,10,13,16,19,22,24,
27,30,32,35,37,40,42,44,47,49,
51,53,55,57,59,61,62,64,66,67,
69,71,72,73,75,76,77,79,80,81,
82,83,84,85,86,87,88,89,89,90,
91,92,92,93,93,94,95,95,95,96,
96,97,97,97,98,98,98,99,99,99,
99,99,99,100,100,100,100,100,100,100,
100,100,100,100,100,100,100,100,100,100,
100,100,100,100,100,100,100,100,100,100,
];



/*initAnimationpath();
function initAnimationpath() {
	var L = 30;
	for (var i = 0; i < L; i++) {
		Animationpath.push(100 * Math.pow(i / (L - 1), 0.6));
	}
}*/

var cancelTouch = false;
var tmplastEndTouchOffSet = null;
var startPoint = 0;
var animat = null;
function touchPDOMCB(ev, ele) {
	var tD = ele.touchyData;
	//textDOM.innerHTML = "State::" + tD.state + "   X::" + tD.offSetPos.x + "   Y::" + tD.offSetPos.y + " <br>   speed    X::" + tD.aveSpeed.x + "   Y::" + tD.aveSpeed.y;
	if (tD.state == "move") {
		if (tD.tNo == 0) {
			var X = tD.aveSpeed.x > 0 ? tD.aveSpeed.x : -tD.aveSpeed.x;
			var Y = tD.aveSpeed.y > 0 ? tD.aveSpeed.y : -tD.aveSpeed.y;
			if (Y > X) {
				tmplastEndTouchOffSet = tD.lastEndTouchOffSet;
				cancelTouch = true;
			}
		}
		if (!cancelTouch) {
			tD.tNo++;
			ele.style.webkitTransform =
				ele.style.MozTransform = 
				ele.style.msTransform = 
				ele.style.OTransform =
				ele.style.transform = 'translate3d(' + ((tD.offSetPos.x )*100/tD.oriTouchEle.offsetWidth+ 
				tD.lastEndTouchOffSet_percent.x )+ '%, 0px,0)';
			ev.preventDefault();
		}
	} else if (tD.state == "start") {
		
		while (tD.oriTouchEle.tagName.toLowerCase() != "li")
			tD.oriTouchEle = tD.oriTouchEle.parentNode;
		
		
		tD.lastEndTouchOffSet.x=tD.lastEndTouchOffSet_percent.x*tD.oriTouchEle.offsetWidth/100;
		clearInterval(animat);

		cancelTouch = false;
		tD.tNo = 0;
		console.log("start");
	} else {//end
		
		if (cancelTouch) {
			tD.lastEndTouchOffSet = tmplastEndTouchOffSet;
		} else {
			unregTouchStart(ele);
			regTouchStart(ele);

			tD.aF = 0;
			while (tD.oriTouchEle.tagName.toLowerCase() != "li")
			tD.oriTouchEle = tD.oriTouchEle.parentNode;


			var toX;

			toX = tD.oriTouchEle.offsetLeft;
			if (tD.aveSpeed.x < -3) {
				if (tD.oriTouchEle.nextElementSibling != null)
					toX = tD.oriTouchEle.nextElementSibling.offsetLeft;
				else
				{
					var parentChild=tD.oriTouchEle.parentNode.children;
					toX = parentChild[0].offsetLeft;
				}
			} else if (tD.aveSpeed.x > 3) {

				if (tD.oriTouchEle.previousElementSibling != null)
					toX = tD.oriTouchEle.previousElementSibling.offsetLeft;
				else
				{
					var parentChild=tD.oriTouchEle.parentNode.children;
					toX = parentChild[parentChild.length-1].offsetLeft;
				}
			}
			tD.lastEndTouchOffSet_percent.x=
			tD.lastEndTouchOffSet.x*100/tD.oriTouchEle.offsetWidth;
			toX=toX*100/tD.oriTouchEle.offsetWidth;
			
			startPoint = tD.lastEndTouchOffSet_percent.x;
			console.log(tD.lastEndTouchOffSet_percent.x);
			tD.lastEndTouchOffSet.y = 0;
			//aF=window.performance.now();
			//aF = 0;
			animat = setInterval(function() {
				//aF++;
				//var progress=(window.performance.now()-aF)/200;
				tD.aF += 0.02;
				var progress = tD.aF;
				if (progress > 1)
					progress = 1;
				var x = valueMapping(arrayInterpolation(progress, 1, Animationpath), 0, 100, startPoint, -toX);
				tD.lastEndTouchOffSet_percent.x = x;

				ele.style.webkitTransform =
				ele.style.MozTransform = 
				ele.style.msTransform = 
				ele.style.OTransform =
				ele.style.transform = 'translate3d(' + tD.lastEndTouchOffSet_percent.x + '%, 0px,0)';

				if (progress == 1) {
					clearInterval(animat);
					animat = null;
				}
			}, 1);

		}
		console.log("end");
	}

	return true;
}

/*		animat = setInterval(function() {
 aF++;
 tD.lastEndTouchOffSet.x += tD.aveSpeed.x;
 tD.lastEndTouchOffSet.y += tD.aveSpeed.y;
 ele.style.webkitTransform = 'translate3d(' + (tD.lastEndTouchOffSet.x) + 'px, ' + (tD.lastEndTouchOffSet.y) + 'px,0)';
 tD.aveSpeed.x *= 0.8;tD.aveSpeed.y *= 0.8;
 var vecABS = tD.aveSpeed.x * tD.aveSpeed.x + tD.aveSpeed.y * tD.aveSpeed.y;
 if (vecABS < 0.1) {
 clearInterval(animat);
 animat=null;
 }

 console.log("Animating");
 }, 22);*/