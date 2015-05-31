angular.module('firstApp',[])
    .controller('mainController',function(){
        var vm = this;

        vm.message = 'welcome to use angular.';

        vm.computers = [
            { name:"mac book", color: 'silver' },
            { name:"yoga 2 pro", color: 'gray' }
        ];

        vm.computerData={};
        vm.addComputer = function(){
            vm.computers.push({
                name:vm.computerData.name,
                color:vm.computerData.color
            });

            vm.computerData = {};
        };


    });
