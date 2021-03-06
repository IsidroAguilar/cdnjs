/* ng-FitText.js v3.0.0
 * https://github.com/patrickmarabeas/ng-FitText.js
 *
 * Original jQuery project: https://github.com/davatron5000/FitText.js
 * Includes use of Underscore's debounce function
 *
 * Copyright 2014, Patrick Marabeas http://marabeas.io
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Date: 18/09/2014
 */

(function(window, document, angular, undefined) {

  'use strict';

  angular.module('ngFitText', [])
    .value( 'config', {
      'debounce': false,
      'delay': 250,
      'min': undefined,
      'max': undefined
    })

    .directive('fittext', ['$timeout', 'config', 'fitTextConfig', function($timeout, config, fitTextConfig) {
      return {
        restrict: 'A',
        scope: true,
        transclude: true,
        replace: true,
        template: function(element, attrs) {
          var tag = element[0].nodeName;
          return "<" + tag + " data-ng-transclude data-ng-style='{fontSize:fontSize}'></" + tag + ">";
        },
        link: function(scope, element, attrs) {
          angular.extend(config, fitTextConfig.config);

          element[0].style.display = 'inline-block';
          element[0].style.whiteSpace = 'nowrap';
          element[0].style.lineHeight = '1';

          scope.compressor = attrs.fittext || 1;
          scope.minFontSize = attrs.fittextMin || config.min || Number.NEGATIVE_INFINITY;
          scope.maxFontSize = attrs.fittextMax || config.max || Number.POSITIVE_INFINITY;

          (scope.resizer = function() {
            $timeout( function() {
              scope.ratio = element[0].offsetHeight / element[0].offsetWidth;
                scope.fontSize = Math.max(
                  Math.min(element.parent()[0].offsetWidth * scope.ratio * scope.compressor,
                    parseFloat(scope.maxFontSize)
                  ),
                  parseFloat(scope.minFontSize)
                ) + 'px';
            },100);
          })();

          scope.$watch(attrs.ngModel, function() { scope.resizer() });

          config.debounce
            ? angular.element(window).bind('resize', config.debounce(function(){ scope.$apply(scope.resizer)}, config.delay))
            : angular.element(window).bind('resize', function(){ scope.$apply(scope.resizer)});
        }
      }
    }])

    .provider('fitTextConfig', function() {
      var self = this;
      this.config = {};
      this.$get = function() {
        var extend = {};
        extend.config = self.config;
        return extend;
      };
      return this;
    });

})(window, document, angular);