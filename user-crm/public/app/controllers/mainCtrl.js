angular.module('myApp', ['userService'])
.controller('mainController', function (User) {
    var vm = this;
    
    User.all().success(function (data) { 
        vm.users = data;
    });
});