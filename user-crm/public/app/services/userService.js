angular.module('userService', [])
.factory('User', function ($http) {
    var userFactory = {};
    userFactory.all = function () {
        return $http.get("/api/Users");
    }
    
    return userFactory;
});