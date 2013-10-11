var thoughtTrainApp = 
angular.module('thoughtTrainApp', ['firebase']).
  constant('firebaseUrl', "https://thoughttrain.firebaseIO.com/thoughts/").
  config(['$routeProvider', function($routeProvider) {
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

thoughtTrainApp.controller('ThoughtListCtrl', ['$scope', 'firebaseUrl', 'angularFireCollection',
  function($scope, firebaseUrl, angularFireCollection) {
    $scope.thoughts = angularFireCollection(new Firebase(firebaseUrl));
  }
]);

thoughtTrainApp.controller('ThoughtCreateCtrl', ['$scope', 'firebaseUrl', 'angularFireCollection', '$location',
  function($scope, firebaseUrl, angularFireCollection, $location) {
    $scope.thoughts = angularFireCollection(new Firebase(firebaseUrl));
    $scope.submit = function(){
      var newThought = $scope.thoughts.add({text: $scope.text});
      $location.path('/thoughts/'+newThought.name());
    }
  }
]);

thoughtTrainApp.controller('ThoughtDetailCtrl', ['$scope', 'firebaseUrl', 'angularFire', '$routeParams',
  function($scope, firebaseUrl, angularFire, $routeParams) {
    var ref = new Firebase(firebaseUrl + $routeParams.thoughtId);
    angularFire(ref, $scope, 'thought');
  }
]);