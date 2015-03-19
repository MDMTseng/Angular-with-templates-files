function enumLocalIPs(cb) {
	var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
	if (!RTCPeerConnection)
		return false;
	var addrs = new Array();

	function addAddress(newAddr) {
		if ( addrs.indexOf(newAddr) >= 0)
			return;
		addrs.push(newAddr);
	}

	function grepSDP(sdp) {
		sdpLines = sdp.split('\r\n');
		for (var i = 0; i < sdpLines.length; i++) {
			line = sdpLines[i];
			if (~line.indexOf('a=candidate')) {
				var parts = line.split(' '), addr = parts[4], type = parts[7];
				if (type === 'host')
					addAddress(addr);
			} else if (~line.indexOf('c=')) {
				var parts = line.split(' '), addr = parts[2];
				addAddress(addr);
			}
		}
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
	var TMP = 0;

	rtc.createOffer(function(offerDesc) {
		TMP++;
		grepSDP(offerDesc.sdp);
		rtc.setLocalDescription(offerDesc);

	}, function(e) {
	});
	setTimeout(function() {
		cb(addrs);
	}, 1500);
	return true;
}

function GetLocalIP(callback) {
	if (callback == null)
		return false;
	return enumLocalIPs(function(localIps) {
		callback(localIps);
	});

}
