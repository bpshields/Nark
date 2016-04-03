(function () {

    angular
        .module('app')
        .controller('TableController', [
            '$scope', 'socket', 'tableService',
            TableController
        ]);

    function TableController($scope, socket, tableService) {
        var vm = this;

        socket.on('Services:Update', function (data) {
            if ( data.old_val ) {
                for(var index=0; index <vm.tableData.length; index++) {
                    if (vm.tableData[index].id === data.old_val.id) {
                        vm.tableData[index] = data.new_val;
                    }
                }
            } else {
                vm.tableData.push(data.new_val);
                console.log(vm.tableData);
            }
        });

        vm.tableData = [];

        tableService
            .loadAllItems()
            .then(function (tableData) {
                vm.tableData = [].concat(tableData);
            });
    }

})();
