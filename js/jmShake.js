			void function(win){
				var shake = {
					init : init,
					run : run,
					stop : stop,
					time : time
				}
				var shake_count = 0;
				function init(obj){
					shake.before = obj.before;
					shake.after = obj.after;
					shake.shakeChance = obj.shakeChance;
					// shake.sound = sound;
					shake.duration = obj.duration;
					if(obj.end){
						shake.end = once(obj.end);
					}
					shake.shareUrl = obj.shareUrl;
					shake.timeUrl = obj.timeUrl;

				}
				function removeShakeEvent(){
					win.removeEventListener('devicemotion', deviceMotionHandler, false);
				}
				function addShakeEvent(){
					win.addEventListener('devicemotion', deviceMotionHandler, false);
				}

				function run(){
					//先判断设备是否支持HTML5摇一摇功能
					if (win.DeviceMotionEvent) {
						//获取移动速度，得到device移动时相对之前某个时间的差值比
						addShakeEvent();
					}else{
						alert('您好，你目前所用的设置好像不支持重力感应哦！');
					}
				}
				function stop(){
					//先判断设备是否支持HTML5摇一摇功能
					if (win.DeviceMotionEvent) {
						//获取移动速度，得到device移动时相对之前某个时间的差值比
						removeShakeEvent();
					}else{
						alert('您好，你目前所用的设置好像不支持重力感应哦！');
					}
				}

				//设置临界值,这个值可根据自己的需求进行设定，默认就3000也差不多了
				var shakeThreshold = 1500;
				//设置最后更新时间，用于对比
				var lastUpdate     = 0;
				var lastTime = 0;
				//设置位置速率
				var curShakeX=curShakeY=curShakeZ=lastShakeX=lastShakeY=lastShakeZ=0;

				function deviceMotionHandler(event){
					//获得重力加速
					var acceleration =event.accelerationIncludingGravity;

					//获得当前时间戳
					var curTime = new Date().getTime();

					

					if ((curTime - lastUpdate)> 100) {

						//时间差
						var diffTime = curTime -lastUpdate;
							lastUpdate = curTime;


						//x轴加速度
						curShakeX = acceleration.x;
						//y轴加速度
						curShakeY = acceleration.y;
						//z轴加速度
						curShakeZ = acceleration.z;

						var speed = Math.abs(curShakeX + curShakeY + curShakeZ - lastShakeX - lastShakeY - lastShakeZ) / diffTime * 10000;
						// console.log(diffTime);
						if (speed > shakeThreshold) {
							if(lastTime == 0){
								lastTime = curTime;
							}else if((curTime - lastTime) < shake.duration){
								return false;
							}
							if(shake_count >= shake.shakeChance){
								if(shake.end != null){
									shake.end();
								}
								if(shake.end == null){
									removeShakeEvent();
								}
								shake.end = null;
								return false;
							}
							var before = shake.before();
							if(before == false){
								return false;
							}
							//TODO 相关方法，比如：
							shake_count ++;
							//播放动画
							setTimeout(shake.after, shake.duration);
							lastTime = curTime;
						}

						lastShakeX = curShakeX;
						lastShakeY = curShakeY;
						lastShakeZ = curShakeZ;
					}
				}
				function addTime() {
				    $.ajax({
				        url: shake.shareUrl,
				        dataType: "json",
				        data: {
				            t: Math.random()
				        },
				        success: function(data) {
				            if (data.status == 0 || data.status == "0") {
				                time();
				                tipsDia('分享成功，获得一次机会！')
				            }
				        }
				    })
				}

				function time() {
				    $.ajax({
				        url: shake.timeUrl,
				        dataType: "json",
				        data: {
				            t: Math.random()
				        },
				        success: function(data) {
				            if (data.times != 0 || data.times != "0") {
				                count = 0
				                shake.shakeChance = data.times;
				            } else {
				                shake.shakeChance = 0;
				            }
				        }
				    })
				}

				function once(fn, context) { 
					var result;
					return function() { 
						if(fn) {
							result = fn.apply(context || this, arguments);
							fn = null;
						}
						return result;
					};
				}
				win.jmShake = shake;
			}(window)