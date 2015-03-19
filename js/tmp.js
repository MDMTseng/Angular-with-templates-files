

function enumLocalIPs(cb) {
	var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
	if (!RTCPeerConnection)
		return false;
	var addrs = Object.create(null);
	addrs['0.0.0.0'] = false;
	function addAddress(newAddr) {
		if ( newAddr in addrs)
			return;
		addrs[newAddr] = true;
	}

	function grepSDP(sdp) {

		sdpLines=sdp.split('\r\n');
		for(var i=0;i<sdpLines.length;i++)
		{line=sdpLines[i];
			if (~line.indexOf('a=candidate')) {
				var parts = line.split(' '), addr = parts[4], type = parts[7];
				if (type === 'host')
					addAddress(addr);
			} else if (~line.indexOf('c=')) {
				var parts = line.split(' '), addr = parts[2];
				addAddress(addr);
			}
		}
		
		
		//cb(addrs);
	}

	var rtc = new RTCPeerConnection({
		iceServers : []
	});
	if (window.mozRTCPeerConnection)
		rtc.createDataChannel('', {
			reliable : false
		});
	rtc.onicecandidate = function(evt) {
		if (evt.candidate)
			grepSDP(evt.candidate.candidate);
	};
	var TMP=0;
	setTimeout(function() {
		
		rtc.createOffer(function(offerDesc) {
			grepSDP(offerDesc.sdp);
			rtc.setLocalDescription(offerDesc);
		}, function(e) {
		console.log(e);
		});
	}, 100);
	return true;
}

function severScan(callback) {
	if (callback == null)
		return;
	var ev = {};
	enumLocalIPs(function(localIp) {
		ev.localIP = localIp;
		ev.remoteIP = [];
		ev.newData = localIp;
		//document.getElementById('localips').innerHTML += localIp + '<br>';
		callback(ev);
		/*var q = new TaskController(1);
		 q.queue(function(cb) {
		 probeNet(localIp,
		 function(ip) {
		 //document.getElementById('results').innerHTML += ip + '<br>';
		 ev.newData=ip;
		 ev.remoteIP.push(ip);
		 callback(ev);

		 },
		 cb);
		 });*/
	}) || (ev.error = 'WebRTC seems not to be supported');
	callback(ev);

}

function GetLocalIP() {
	var ev = {};
	enumLocalIPs(function(localIp) {
		ev.localIP = localIp;
		ev.remoteIP = [];
		ev.newData = localIp;
		//document.getElementById('localips').innerHTML += localIp + '<br>';
		callback(ev);
		/*var q = new TaskController(1);
		 q.queue(function(cb) {
		 probeNet(localIp,
		 function(ip) {
		 //document.getElementById('results').innerHTML += ip + '<br>';
		 ev.newData=ip;
		 ev.remoteIP.push(ip);
		 callback(ev);

		 },
		 cb);
		 });*/
	}) || (ev.error = 'WebRTC seems not to be supported');
	callback(ev);

}