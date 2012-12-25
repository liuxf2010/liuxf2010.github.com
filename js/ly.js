;(function($){
	var root = this;
	var document = root.document;
	var cnWeeks = String.fromCharCode(26085, 19968, 20108, 19977, 22235, 20116, 20845);
	var ns = function(ns, property){
		if (typeof ns === 'string') {
            var nss = ns.split('.');
            var parent = root;
            if (ns.charAt(0) === '.') {
                nss.shift();
            }
            while (ns = nss.shift()) {
                parent[ns] = parent[ns] || {};
                parent = parent[ns];
            }
            if ($.isPlainObject(property)) {
                $.extend(parent, property);
            } else if ($.isFunction(property)) {
                property.call(parent);
            }
            return parent;
        }
        return ns;
	};
	var localStorage = root.localStorage;
    (function() {
        if (typeof localStorage === 'undefined') {
            var name = 'userDateFixStorage';
            var fixStorage = function() {
                var storageOwner;
                var storageContainer;
                var storage;
                try {
                    storageContainer = new ActiveXObject('htmlfile');
                    storageContainer.open();
                    storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></frame>');
                    storageContainer.close();
                    storageOwner = storageContainer.w.frames[0].document;
                    storage = storageOwner.createElement('div');
                } catch(e) { 
                    storageOwner = document.body;
                    storage = document.createElement('div');
                }
                return function(fn) {
                    storageOwner.appendChild(storage);
                    storage.addBehavior('#default#userData');
                    storage.load(name);
                    var result = fn(storage);
                    storageOwner.removeChild(storage);
                    return result;
                };
            }();
            root.localStorage = localStorage = {
                setItem: function(sKey, sValue) {
                    fixStorage(function(dom) {
                        dom.setAttribute(sKey, sValue);
                        dom.save(name);
                    });
                },
                getItem: function(sKey) {
                    return fixStorage(function(dom) {
                        return dom.getAttribute(sKey);
                    });
                },
                removeItem: function(sKey) {
                    fixStorage(function(dom) {
                        dom.removeAttribute(sKey);
                        dom.save(name);
                    });
                },
                clear: function() {
                    fixStorage(function(dom) {
                        var attributes = dom.XMLDocument.documentElement.attributes;
                        for (var i=0, attr; attr=attributes[i]; i++) {
                            dom.removeAttribute(attr.name);
                        }
                        dom.save(name);
                    });
                }
            };
        }
    }());
	var Cookie = function(name, value, options){
		if (typeof value != 'undefined') {
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else {
        	var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = _.str.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
	};
	ns('ly', {
		ns:ns,
		cookie:Cookie,
		ie6:!('1'[0]) && !root.XMLHttpRequest,
		newClass:function(property){
			var fn = function(){
                if ($.isFunction(this.initialize)) this.initialize.apply(this, arguments);
            };
            $.extend(fn.prototype, property);
            return fn;
		}
	});
	ns('ly.storage', {
        set: function(sKey, sValue) {
            localStorage.setItem(sKey, String(sValue));
        },
        get: function(sKey) {
            return localStorage.getItem(sKey);
        },
        remove: function(sKey) {
            localStorage.removeItem(sKey);
        },
        clear: function() {
            localStorage.clear();
        }
    });
}(jQuery));