var app = angular.module("myApp", []);

app.controller('controller', ['$scope', '$http', function($scope, $http) { 

  var refreshNews = function() {
    $http.get('/news').success(function(response) {
        console.log("Received projects"); 
        $scope.news = response;
    });
  };

  refreshNews(); 


}]);
