var thoughtTrainApp = angular.module('thoughtTrainApp', ['firebase']);
 
// thoughtTrainApp.controller('ThoughtsCtrl', function ThoughtsCtrl($scope) {
//   $scope.thoughts = [
//     {'name': 'Nexus S',
//      'snippet': 'Fast just got faster with Nexus S.'},
//     {'name': 'Motorola XOOM™ with Wi-Fi',
//      'snippet': 'The Next, Next Generation tablet.'},
//     {'name': 'MOTOROLA XOOM™',
//      'snippet': 'The Next, Next Generation tablet.'}
//   ];
// });

thoughtTrainApp.controller('ThoughtsCtrl', ['$scope', 'angularFire',
  function ThoughtsCtrl($scope, angularFire) {
    var ref = new Firebase('https://thoughttrain.firebaseIO.com/thoughts');
    $scope.thoughts = [];
    angularFire(ref, $scope, 'thoughts');
    
    // Add a new item by simply modifying the model directly.
    // $scope.thoughts.push({text: "This is my thought on Firebase!", authorEmail: "hiattp@gmail.com"});
    // Or, attach a function to $scope that will let a directive in markup manipulate the model.
    $scope.removeThought = function() {
      $scope.thoughts.splice($scope.toRemove, 1);
      $scope.toRemove = null;
    };
    
  }
]);