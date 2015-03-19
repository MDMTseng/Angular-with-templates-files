var MyDireModule = angular.module('MyDireModule', []);
MyDireModule.directive('myCustomer', function() {
	return {
		template : 'Name: {{customer.name}} Address: {{customer.address}}'
	};
}).directive('myCustomerUrl', function() {
	return {
		restrict : "E",
		transclude : true,
		templateUrl : 'my-customer.html',
		link : function(scope, element, attr) {
			console.log('my-customer.html');

		}
	};
}).directive('myDirective', function($timeout) {
	return {
		restrict : "E",
		transclude : true,
		templateUrl : 'tpl2',
		link : function(scope, element, attr) {
			$timeout(function() {
				scope.tdata = attr;
			}, 2000);

		}
	};
}).directive('myDirective', function($templateCache, $compile, $timeout) {

	link = function(scope, element, attr) {
		var template = $templateCache.get(scope.template);
		$templateCache.get(scope.template);
		scope.values = scope.mydata;
		scope.doSomething = scope.mycallback;
		scope.tdata = attr;
		element.append($compile(template)(scope));
	};
	return {
		restrict : 'A',
		transclude : false,
		scope : {
			template : "@",
			mydata : "=",
			mycallback : "&"
		},
		link : function(scope, element, attr) {
			var template = $templateCache.get(scope.template);
			if ( typeof template.then == "function")
				template.then(function(response) {
					console.log("New load");
					link(scope, element, attr);
				});
			else
				link(scope, element, attr);
		}
	}
}).factory('$templateCache', function($cacheFactory, $http, $injector) {
	var cache = $cacheFactory('templates');
	var allTplPromise;

	var allTplsCollect = $cacheFactory('allTplsCollect');
	return {
		get : function(url) {  
			var urls=url.split(">");//templates.html|temp1.html
           url=urls[urls.length-1];
           
			var fromCache = cache.get(url);
			
			// already have required template in the cache
			if (fromCache) {
				return fromCache;
			}
         
			// first template request ever - get the all tpl file
			if (urls.length==2&&allTplsCollect.get(urls[0])==null) {
				console.log("load NEW::"+urls[0]);
				allTplPromise = $http.get(urls[0]).then(function(response) {
					// compile the response, which will put stuff into the cache
					$injector.get('$compile')(response.data);
					return response;
				});
				allTplsCollect.put(urls[0],allTplPromise);
			}

			// return the all-tpl promise to all template requests
			return allTplPromise.then(function(response) {
				return {
					status : response.status,
					data : cache.get(url)
				};
			});
		},

		put : function(key, value) {
			console.log("PUT________");
			console.log(key+':::'+value);
			cache.put(key, value);
		}
	};
});
