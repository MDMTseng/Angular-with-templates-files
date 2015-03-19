var isTouch = is_touch_device();
var textDOM = document.querySelectorAll(".texta")[0];

//var blockDOM = touchPDOM.querySelectorAll("div.block")[0];

function addTouchyData(TPDOM, callBK) {
	if (TPDOM.touchyData == null)
		TPDOM.touchyData = {
			oriTouchEle : null,
			TPCallBK : callBK,
			state : "end",
			initTouchPos : {
				x : 0,
				y : 0
			},
			nowTouchPos : {
				x : 0,
				y : 0
			},
			lastTouchPos : {
				x : 0,
				y : 0
			},
			offSetPos : {
				x : 0,
				y : 0
			},
			diffTouchOffSet : {
				x : 0,
				y : 0
			},
			aveSpeed : {
				x : 0,
				y : 0
			},
			lastEndTouchOffSet : {
				x : 0,
				y : 0
			},
		};
}

function regTouchPanel(TPDOM, callBK) {
	addTouchyData(TPDOM, callBK);

	if (isTouch) {
		console.log("touch_device");
		//
		TPDOM.addEventListener("touchmove", touchmoves, false);
		TPDOM.addEventListener("touchstart", touchstarts, false);
		TPDOM.addEventListener("touchend", touchends, false);
	} else {
		console.log("touch_device");
		TPDOM.addEventListener("mousemove", touchmoves, false);
		TPDOM.addEventListener("mousedown", touchstarts, false);
		TPDOM.addEventListener("mouseup", touchends, false);
	}
}

function unregTouchPanel(TPDOM, callBK) {
	//addTouchyData(TPDOM, callBK);
	TPDOM.touchyData = null;
	if (isTouch) {
		//console.log("touch_device");
		//
		TPDOM.removeEventListener("touchmove", touchmoves, false);
		TPDOM.removeEventListener("touchstart", touchstarts, false);
		TPDOM.removeEventListener("touchend", touchends, false);
	} else {
		//console.log("touch_device");
		TPDOM.removeEventListener("mousemove", touchmoves, false);
		TPDOM.removeEventListener("mousedown", touchstarts, false);
		TPDOM.removeEventListener("mouseup", touchends, false);
	}
}

function regTouchStart(TPDOM) {
	//addTouchyData(TPDOM, callBK);
	//TPDOM.touchyData=null;
	if (isTouch)
		TPDOM.addEventListener("touchstart", touchstarts, false);
	else
		TPDOM.addEventListener("mousedown", touchstarts, false);
}

function unregTouchStart(TPDOM) {
	//addTouchyData(TPDOM, callBK);
	//TPDOM.touchyData=null;
	if (isTouch)
		TPDOM.removeEventListener("touchstart", touchstarts, false);
	else
		TPDOM.removeEventListener("mousedown", touchstarts, false);
}

var onTouchEle = null;

function touchmoves(ev) {

	if (onTouchEle == null)
		return;
	ev = ev || window.event;
	//console.log(ev);

	if (ev.touches != null)
		var touchPos = mouseCoords(ev.touches[0]);
	else
		var touchPos = mouseCoords(ev);
	var tD = onTouchEle.touchyData;
	tD.state = "move";
	tD.diffTouchOffSet.x = touchPos.x - tD.lastTouchPos.x;
	tD.diffTouchOffSet.y = touchPos.y - tD.lastTouchPos.y;
	tD.nowTouchPos = touchPos;
	tD.aveSpeed.x = tD.aveSpeed.x * 0.6 + tD.diffTouchOffSet.x * 0.4;
	tD.aveSpeed.y = tD.aveSpeed.y * 0.6 + tD.diffTouchOffSet.y * 0.4;
	tD.offSetPos.x = (touchPos.x - tD.initTouchPos.x);
	tD.offSetPos.y = (touchPos.y - tD.initTouchPos.y);
	var ret = tD.TPCallBK(ev, onTouchEle);
	tD.lastTouchPos.x = touchPos.x;
	tD.lastTouchPos.y = touchPos.y;
	return ret;
	//onTouchEle.style.webkitTransform = 'translate3d(' + (onTouchEle.offSetPos.x + onTouchEle.initPos.x) + 'px, ' + (onTouchEle.offSetPos.y + onTouchEle.initPos.y) + 'px,0)';
	//ev.preventDefault();

	//onTouchEle.TPCallBK(ev,);
}

function touchstarts(ev) {

	console.log(ev);
	if (ev.touches != null) {
		var touchPos = mouseCoords(ev.touches[0]);
		onTouchEle = ev.touches[0].target;
	} else {
		var touchPos = mouseCoords(ev);
		onTouchEle = ev.target;
	}

	var oriTouchEle = onTouchEle;
	if (onTouchEle.touchyData == null) {
		onTouchEle = onTouchEle.parentNode;

		while (onTouchEle.touchyData == null) {
			if (onTouchEle == document) {
				onTouchEle = null;
				return;
			}
			onTouchEle = onTouchEle.parentNode;

		}

	}
	var tD = onTouchEle.touchyData;
	tD.oriTouchEle = oriTouchEle;
	tD.state = "start";
	tD.aveSpeed.x = tD.aveSpeed.y = tD.diffTouchOffSet.x = tD.diffTouchOffSet.y = tD.offSetPos.x = tD.offSetPos.y = 0;

	tD.initTouchPos = touchPos;
	tD.lastTouchPos.x = tD.nowTouchPos.x = touchPos.x;
	tD.lastTouchPos.y = tD.nowTouchPos.y = touchPos.y;

	return tD.TPCallBK(ev, onTouchEle);
}

function touchends(ev) {
	if (onTouchEle == null)
		return;
	//textDOM.innerHTML = "touchends::!!!";
	//onTouchEle.style.webkitTransform = "rotate(0deg)";
	var tD = onTouchEle.touchyData;
	tD.state = "end";
	//textDOM.innerHTML = "    speed    X::" + tD.aveSpeed.x + "   Y::" + tD.aveSpeed.y;
	tD.lastEndTouchOffSet.x += tD.offSetPos.x;
	tD.lastEndTouchOffSet.y += tD.offSetPos.y;
	var ret = tD.TPCallBK(ev, onTouchEle);
	onTouchEle = null;
	return ret;
	//ev.preventDefault();
}

function mouseCoords(ev) {
	if (ev.pageX || ev.pageY) {
		return {
			x : ev.pageX,
			y : ev.pageY
		};
	}

	return {
		x : ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y : ev.clientY + document.body.scrollTop - document.body.clientTop
	};
}

function is_touch_device() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	// || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

function arrayInterpolation(progress, total, arr) {
	var virtualNum = (arr.length - 1) * progress / total;
	var baseNum = Math.floor(virtualNum);
	if (virtualNum == baseNum)
		return arr[baseNum];
	virtualNum -= baseNum;

	return arr[baseNum] * (1 - virtualNum) + arr[baseNum + 1] * virtualNum;

}

function valueMapping(inData, insec1, inset2, outsec1, outsec2) {
	return (inData - insec1) * (outsec2 - outsec1) / (inset2 - insec1) + outsec1;
}
