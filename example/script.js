serachableMultiSelectExample = function(){
    angular
    .module("serachableMultiselectExampleApp", ["searchable.multiselect"])
    .controller('serachableMultiselectExampleCtrl', ['$scope', serachableMultiselectExampleCtrl]);
    function serachableMultiselectExampleCtrl($scope) {
        var $ctrl = this;
        $scope.name = 'John Smith';
        $scope.users = [
            {
                name: 'Muhammed',
                surname: 'Celik',
                age: 48
            },
            {
                name: 'Alys',
                surname: 'Mcgregor',
                age: 30
            },
            {
                name: 'Hays',
                surname: 'Yuvaan',
                age: 20
            },
            {
                name: 'Isaac',
                surname: 'Bryant',
                age: 14
            },
            {
                name: 'Jazmine',
                surname: 'Reed',
                age: 54
            }
        ];
        $scope.selectedUsers = [$scope.users[0], $scope.users[3]];
        $scope.generateFullName = function(user){
            return user.name + ' ' + user.surname;
        }
    }
};
angular.element(document).ready(serachableMultiSelectExample());
