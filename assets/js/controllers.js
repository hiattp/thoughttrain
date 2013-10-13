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

    angularFire(topicRef, $scope, 'topic');
    var thoughtIndex = new FirebaseIndex(topicRef.child('thought_list'), thoughtsRef);    
    $scope.thoughts = angularFireCollection(thoughtIndex);
    // angularFire(thoughtIndex, $scope, 'thoughts'); // why doesn't this work?
    
    $scope.addThought = function(e) {
      if (e.keyCode != 13) return;
      var id = thoughtsRef.push();
      id.set({text: $scope.newThoughtText}, function(err){
        if(!err){
          thoughtIndex.add(id.name());
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