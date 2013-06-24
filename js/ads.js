(function($){
var ads = {
	"topbanner":function(){
		var html = '<a href="http://www.lady172.com/" target="_blank">';
		html += '<img src="/upload/2012/11/2113431265.jpg"  width="708" height="81" border="0" /></a>';
		return html;
	},
	"ad1":function(){
		var html = '<a href="http://www.lady172.com/" target="_blank">';
		html += '<img src="/upload/2012/11/21144037468.jpg"  width="239" height="104" border="0" /></a>';
		return html;
	},
	"ad2":function(){
		var html = '<a href="http://www.lady172.com/" target="_blank">';
		html += '<img src="/upload/2012/11/21144037468.jpg"  width="239" height="104" border="0" /></a>';
		return html;
	},
	"ad3":function(){
		var html = '<a href="http://www.lady172.com/" target="_blank">';
		html += '<img src="/upload/2012/11/21144037468.jpg"  width="239" height="104" border="0" /></a>';
		return html;
	},
	"ad4":function(){
		var html = '<a href="http://www.lady172.com/" target="_blank">';
		html += '<img src="/upload/2012/11/2116145828.jpg"  width="239" height="104" border="0" /></a>';
		return html;
	},
	"ad5":function(){
		var html = '<a href="http://www.lady172.com/" target="_blank">';
		html += '<img src="/upload/2012/11/21144037468.jpg"  width="239" height="104" border="0" /></a>';
		return html;
	},
	"banner1":function(){
		var html = '<a href="http://www.lady172.com/" target="_blank">';
		html += '<img src="/upload/2012/11/2116357281.jpg"  width="964" height="267" border="0" /></a>';
		return html;
	},
	"banner2":function(){
		var html = '<a href="http://www.lady172.com/" target="_blank">';
		html += '<img src="/upload/2012/11/2275125109.jpg"  width="980" height="89" border="0" /></a>';
		return html;
	},
	"banner3":function(){
		this.innerHTML = '<a style="display:none!important" id="tanx-a-mm_11988958_3445613_11182675"></a>';
		tanx_s = document.createElement("script");
		tanx_s.type = "text/javascript";
		tanx_s.charset = "gbk";
		tanx_s.id = "tanx-s-mm_11988958_3445613_11182675";
		tanx_s.async = true;
		tanx_s.src = "http://p.tanx.com/ex?i=mm_11988958_3445613_11182675";
		tanx_h = document.getElementsByTagName("head")[0];
		if(tanx_h)tanx_h.insertBefore(tanx_s,tanx_h.firstChild);
	},
	"banner4":function(){
		var html = '<iframe src="http://rcm-cn.amazon-adsystem.com/e/cm?t=liuxf201000-23&o=28&p=285&l=ez&f=ifr&f=ifr" width="950" height="80" scrolling="no" marginwidth="0" marginheight="0" border="0" frameborder="0" style="border:none;"></iframe>';
		return html;
	},
	"neiye1":function(){
		var html = '<a href="http://www.lady172.com/" target="_blank">';
		html += '<img src="/upload/2012/11/22151142138.jpg"  width="283" height="232" border="0" /></a>';
		return html;
	},
	"neiye2":function(){
		var html = '<a href="http://www.lady172.com/" target="_blank">';
		html += '<img src="/upload/2012/11/2310152175.jpg"  width="283" height="232" border="0" /></a>';
		return html;
	}
};
$(function(){
	var ads_el = $('.ads_class');
	ads_el.each(function(){
		var id = this.getAttribute('adName');
		var html = ads[id].call(this, id);
		if(html) this.innerHTML = html;
	});
});
}(jQuery));