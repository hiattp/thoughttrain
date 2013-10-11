var thoughtTrainApp = angular.module('thoughtTrainApp', ['firebase'])
  , firebaseUrl = "https://thoughttrain.firebaseIO.com/thoughts/";

thoughtTrainApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/thought-list.html',
        controller: 'ThoughtListCtrl'
      }).
      when('/thoughts/new', {
        templateUrl: 'views/thought-new.html',
        controller: 'ThoughtCreateCtrl'
      }).
      when('/thoughts/:thoughtId', {
        templateUrl: 'views/thought-detail.html',
        controller: 'ThoughtDetailCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

thoughtTrainApp.controller('ThoughtListCtrl', ['$scope', 'angularFireCollection',
  function ThoughtListCtrl($scope, angularFireCollection) {
    $scope.thoughts = angularFireCollection(new Firebase(firebaseUrl));
    // $scope.removeThought = function() {
    //   $scope.thoughts.splice($scope.toRemove, 1);
    //   $scope.toRemove = null;
    // }
  }
]);

thoughtTrainApp.controller('ThoughtCreateCtrl', ['$scope', 'angularFireCollection', '$location',
  function ThoughtCreateCtrl($scope, angularFireCollection, $location) {
    // var ref = new Firebase(firebaseUrl);
    $scope.thoughts = angularFireCollection(new Firebase(firebaseUrl));
    $scope.submit = function(){
      var newThought = $scope.thoughts.add({text: $scope.text});
      $location.path('/thoughts/'+newThought.name());
    }
  }
]);


thoughtTrainApp.controller('ThoughtDetailCtrl', ['$scope', 'angularFire', '$routeParams',
  function ThoughtDetailCtrl($scope, angularFire, $routeParams) {
    var ref = new Firebase(firebaseUrl + $routeParams.thoughtId);
    angularFire(ref, $scope, 'thought');
  }
]);