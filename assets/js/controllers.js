var thoughtTrainApp = 
angular.module('thoughtTrainApp', ['firebase']).
  constant('firebaseRootUrl', "https://thoughttrain.firebaseIO.com").
  factory('firebaseRootRef', ['firebaseRootUrl', function(fbRootUrl){
    return new Firebase(fbRootUrl)
  }]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/topic-list.html',
        controller: 'TopicListCtrl'
      }).
      when('/topics/new', {
        templateUrl: 'views/topic-new.html',
        controller: 'TopicCreateCtrl'
      }).
      when('/topics/:topicId', {
        templateUrl: 'views/topic-detail.html',
        controller: 'TopicDetailCtrl'
      }).
      when('/topics/:topicId/edit', {
        templateUrl: 'views/topic-edit.html',
        controller: 'TopicEditCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

thoughtTrainApp.controller('TopicListCtrl', ['$scope', 'firebaseRootRef', 'angularFireCollection',
  function($scope, firebaseRootRef, angularFireCollection) {
    $scope.topics = angularFireCollection(firebaseRootRef.child('topics'));
  }
]);

thoughtTrainApp.controller('TopicCreateCtrl', ['$scope', 'firebaseRootRef', 'angularFireCollection', '$location',
  function($scope, firebaseRootRef, angularFireCollection, $location) {
    $scope.topics = angularFireCollection(firebaseRootRef.child('topics'));
    $scope.submit = function(){
      var newTopic = $scope.topics.add({text: $scope.text});
      $location.path('/topics/'+newTopic.name());
    }
  }
]);

thoughtTrainApp.controller('TopicDetailCtrl', ['$scope', 'firebaseRootRef', 'angularFire', '$routeParams', 'angularFireCollection',
  function($scope, firebaseRootRef, angularFire, $routeParams, angularFireCollection) {
    var topicRef = firebaseRootRef.child('topics/' + $routeParams.topicId)
      , thoughtsRef = firebaseRootRef.child('thoughts');

    $scope.thoughts = ["one","two"];
    $scope.thoughts.push(angularFireCollection(firebaseRootRef.child('topics/'+'-J5jaHnEg1jEnOd_nunu')));
    
    angularFire(topicRef, $scope, 'topic');
    $scope.thoughtData = {};
    topicRef.child('thoughts').on('child_added', function(snap){
      $scope.thoughtData[snap.name()] = angularFire(thoughtsRef.child(snap.name()), $scope, 'thought');;
    });

    $scope.thoughts.push("forced");
    
    $scope.addThought = function(e) {
      if (e.keyCode != 13) return;
      var id = thoughtsRef.push();
      id.set({text: $scope.newThoughtText}, function(err){
        if(!err){
          topicRef.child('thoughts/' + id.name()).set(true);
          $scope.newThoughtText = "";
        }
      });
    }
  }
]);

thoughtTrainApp.controller('TopicEditCtrl', ['$scope', 'firebaseRootRef', 'angularFire', '$routeParams',
  function($scope, firebaseRootRef, angularFire, $routeParams) {
    var ref = firebaseRootRef.child('topics').child($routeParams.topicId);
    angularFire(ref, $scope, 'topic');
  }
]);