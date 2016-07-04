void function(win){
	function getDiffTime(targetTimeStr){
        var now = new Date();
        var endDate = new Date(targetTimeStr);
        var diff = (endDate.getTime() - now.getTime())/1000;
        var diffTimeHour = Math.floor(diff/3600);
        var diffTimeMin = Math.floor((diff - diffTimeHour*3600)/60);
        var diffTimeSec = Math.floor(diff - diffTimeHour*3600 - diffTimeMin*60);
        if (diff <= 0){
        	return false;
        }
        return {
        	diffTimeHour : diffTimeHour,
        	diffTimeMin : diffTimeMin,
        	diffTimeSec : diffTimeSec
        }
    }
    function outputFormatTime(formatTimeDom, formatTimeStr, endFn){
    	endFn = once(endFn);
    	formatDate(formatTimeDom, formatTimeStr ,endFn);
    	var timer;
    	timer = setInterval(function(){
    		if(formatDate(formatTimeDom, formatTimeStr ,endFn) == false){
    			clearInterval(timer);
    		}
	    }, 1000);
    }
    function formatDate(formatTimeDom, formatTimeStr ,endFn ){
	    	var formatTime = null;
	    	formatTime = getDiffTime(formatTimeStr);
	    	if(!formatTime){
	    		endFn();
	    		return false;
	    	}
	    	formatTime.diffTimeHour = formatTime.diffTimeHour < 10 ? "0" + formatTime.diffTimeHour : formatTime.diffTimeHour;
	    	formatTime.diffTimeMin = formatTime.diffTimeMin < 10 ? "0" + formatTime.diffTimeMin : formatTime.diffTimeMin;
	    	formatTime.diffTimeSec = formatTime.diffTimeSec < 10 ? "0" + formatTime.diffTimeSec : formatTime.diffTimeSec;
	    	formatTimeDom[0].innerHTML = formatTime.diffTimeHour + "小时";
	    	formatTimeDom[1].innerHTML = formatTime.diffTimeMin + "分钟";
	    	formatTimeDom[2].innerHTML = formatTime.diffTimeSec + "秒";
    }

	 function once(fn, context) { 
	 	var result; 
	 	return function() { 
	 		if(fn) { 
	 			result = fn.apply(context || this, arguments); fn = null; 
	 		} return result; 
	 	}; 
	 }

	 win.jmCountDown = outputFormatTime;
}(window);