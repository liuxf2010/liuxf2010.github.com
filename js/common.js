;(function($){
	$.define = function(name, object){
		if(!$[name]){
			$[name] = $.extend({extend:$.extend}, object);
		}else{
			$[name].extend || ($[name].extend = $.extend);
			$[name].extend(object);
		}
	};
	$.define("action", {
		"AddFav":function(){
			if (document.all) {
				window.external.addFavorite(window.location.href, document.title);
			} else if (window.sidebar) {
				window.sidebar.addPanel(document.title, window.location.href, "");
			}
		}
	});
	$.define("fun", {
		"showLocale":function(objD){
			var str,colorhead,colorfoot;
			var yy = objD.getYear();
			if(yy<1900) yy = yy+1900;
			var MM = objD.getMonth()+1;
			if(MM<10) MM = '0' + MM;
			var dd = objD.getDate();
			if(dd<10) dd = '0' + dd;
			var hh = objD.getHours();
			if(hh<10) hh = '0' + hh;
			var mm = objD.getMinutes();
			if(mm<10) mm = '0' + mm;
			var ss = objD.getSeconds();
			if(ss<10) ss = '0' + ss;
			var ww = objD.getDay();
			if  ( ww==0 )  colorhead="<font color=\"#FF0000\">";
			if  ( ww > 0 && ww < 6 )  colorhead="<font color=\"#373737\">";
			if  ( ww==6 )  colorhead="<font color=\"#008000\">";
			if  (ww==0)  ww="星期日";
			if  (ww==1)  ww="星期一";
			if  (ww==2)  ww="星期二";
			if  (ww==3)  ww="星期三";
			if  (ww==4)  ww="星期四";
			if  (ww==5)  ww="星期五";
			if  (ww==6)  ww="星期六";
			colorfoot="</font>"
			str = colorhead + yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss + "  " + ww + colorfoot;
			return(str);
		}
	});
	$.define("load", {
		"localtime":function(){
			var el = this;
			var tick = function(){
				var today = new Date();
				el.innerHTML = $.fun.showLocale(today);
				window.setTimeout(tick, 1000);
			};
			tick();
		}
	});
	$(function(){
		$(document).on('click','a.cmAction',function(e){
			var href = $(e.target).attr('href');
			if(href.charAt(0) === '#'){
				var hashName = href.split('#').join('');
				if(hashName){
					var callback = $.action[hashName];
					if(callback){
						callback.call(e.target, e);
						e.preventDefault();
						return false;
					}
				}else{ e.preventDefault();return false; }
			}
		});
		var cb = $('.load_callback');
		cb.each(function(){
			var id = this.id;
			var callback = $.load[id];
			if(id && callback){
				callback.call(this, id);
			} 
		});
	});
}(jQuery));