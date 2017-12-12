(function () {

  var app = angular.module('myReddit', ['ionic', 'angularMoment']);

  app.controller('RedditCtrl', function ($http, $scope) {

    $scope.stories = [];

    function loadStories(params, callback) {
      $http.get('https://www.reddit.com/r/Boxing/new/.json', {params: params})
        .success(function (response) {
          var stories = [];
          angular.forEach(response.data.children, function (child) {
            var story = child.data;
            if (!story.thumbnail || story.thumbnail === 'self' || story.thumbnail === 'default') {
              story.thumbnail = 'https://www.redditstatic.com/icon.png';
            }

            if (story.thumbnail === 'nsfw') {
              story.thumbnail = 'https://i.imgur.com/6i1Q2k6.png';
            }

            stories.push(child.data);
          });
          callback(stories);
        });

      // TODO: For DBN JSON Api endpoint.
      // $http.get('https://detroitboxingnews.com/json/feed', {params: params})
      //   .success(function(response) {
      //     var stories = [];
      //     angular.forEach(response, function(story) {
      //
      //       stories.push(story);
      //     });
      //     callback(stories);
      //   });
      // }

    }

    $scope.loadOlderStories = function() {
      var params = {};
      if ($scope.stories.length > 0) {
        params['after'] = $scope.stories[$scope.stories.length - 1].name;
      }
      loadStories(params, function(olderStories) {
        $scope.stories = $scope.stories.concat(olderStories);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.loadNewerStories = function() {
      var params = {'before': $scope.stories[0].name};
      loadStories(params, function(newerStories) {
        $scope.stories = newerStories.concat($scope.stories);
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.openLink = function(story) {
      if (story['user_id']) {
        window.open("https://www.detroitboxingnews.com/articles/" + story['slug'], '_blank');
      } else {
        window.open(story.url, '_blank');
      }
    };

  });

  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.cordova && window.cordova.InAppBrowser) {
        window.open = window.cordova.InAppBrowser.open;
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

}());
