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
      when('/topics/:topicId/thoughts/:thoughtId', {
        templateUrl: 'views/thought-show.html',
        controller: 'ThoughtShowCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

thoughtTrainApp.controller('MasterCtrl', ['$scope', 'firebaseRootRef', 'angularFireAuth',
  function($scope, firebaseRootRef, angularFireAuth){
    angularFireAuth.initialize(firebaseRootRef, {scope: $scope, name: "user"});
    $scope.login = function(){
      angularFireAuth.login("facebook",{
        rememberMe: true,
        scope: 'email'
      });
    }
    $scope.logout = function(){
      angularFireAuth.logout()
    }
  }
]);

thoughtTrainApp.controller('TopicListCtrl', ['$scope', 'firebaseRootRef', 'angularFireCollection',
  function($scope, firebaseRootRef, angularFireCollection) {
    $scope.topics = angularFireCollection(firebaseRootRef.child('topics'));
  }
]);

thoughtTrainApp.controller('TopicCreateCtrl', ['$scope', 'firebaseRootRef', 'angularFireCollection', '$location',
  function($scope, firebaseRootRef, angularFireCollection, $location) {
    $scope.topics = angularFireCollection(firebaseRootRef.child('topics'));
    $scope.submit = function(){
      var newTopic = $scope.topics.add({text: $scope.text, parentUserId: $scope.user.id, parentUserName: $scope.user.name});
      $location.path('/topics/'+newTopic.name());
    }
  }
]);

thoughtTrainApp.controller('TopicDetailCtrl', ['$scope', 'firebaseRootRef', 'angularFire', '$routeParams', 'angularFireCollection',
  function($scope, firebaseRootRef, angularFire, $routeParams, angularFireCollection) {
    var topicRef = firebaseRootRef.child('topics/' + $routeParams.topicId)
      , thoughtsRef = firebaseRootRef.child('thoughts');

    angularFire(topicRef, $scope, 'topic');
    $scope.topicId = $routeParams.topicId;

    var thoughtIndex = new FirebaseIndex(topicRef.child('thought_list'), thoughtsRef);    
    $scope.thoughts = angularFireCollection(thoughtIndex);

    $scope.newThought = {}
    $scope.addThought = function(e) {
      if (e.keyCode != 13) return;
      var newThoughtProperties = {topicId: $routeParams.topicId, parentUserId: $scope.user.id, parentUserName: $scope.user.name}
      for (var attrname in newThoughtProperties) { $scope.newThought[attrname] = newThoughtProperties[attrname]; }
      var id = thoughtsRef.push();
      id.set($scope.newThought, function(err){
        if(!err){
          thoughtIndex.add(id.name());
          $scope.newThought.text = "";
        }
      });
    }
  }
]);

thoughtTrainApp.controller('TopicEditCtrl', ['$scope', 'firebaseRootRef', 'angularFire', '$routeParams',
  function($scope, firebaseRootRef, angularFire, $routeParams) {
    var ref = firebaseRootRef.child('topics').child($routeParams.topicId + "/text");
    angularFire(ref, $scope, 'topic.text');
  }
]);

thoughtTrainApp.controller('ThoughtShowCtrl', ['$scope', 'firebaseRootRef', 'angularFire', '$routeParams', 'angularFireCollection',
  function($scope, firebaseRootRef, angularFire, $routeParams, angularFireCollection) {
    var thoughtsRef = firebaseRootRef.child('thoughts')
      , thoughtRef = thoughtsRef.child($routeParams.thoughtId);

    angularFire(thoughtRef, $scope, 'thought');
    $scope.topicId = $routeParams.topicId;

    var thoughtIndex = new FirebaseIndex(thoughtRef.child('subthought_list'), thoughtsRef);    
    $scope.thoughts = angularFireCollection(thoughtIndex);

    $scope.newThought = {}
    $scope.addThought = function(e) {
      if (e.keyCode != 13) return;
      var newThoughtProperties = {topicId: $routeParams.topicId, parentThoughtId: $routeParams.thoughtId, parentUserId: $scope.user.id, parentUserName: $scope.user.name}
      for (var attrname in newThoughtProperties) { $scope.newThought[attrname] = newThoughtProperties[attrname]; }
      var id = thoughtsRef.push();
      id.set($scope.newThought, function(err){
        if(!err){
          thoughtIndex.add(id.name());
          $scope.newThought.text = "";
        }
      });
    }
  }
]);