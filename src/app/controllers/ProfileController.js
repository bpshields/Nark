(function(){

  angular
    .module('app')
    .controller('ProfileController', [
      '$scope', 'socket', ProfileController
    ]);

  function ProfileController($scope, socket) {

    var vm = this;
    vm.types = ['GET','POST','PUT','DELETE'];
    vm.contentTypes = ['application/json','text/plain','appliaction/javascript','application/xml','text/xml','text/html'];
    vm.user = {
      title: 'Admin',
      email: 'contact@flatlogic.com',
      firstName: '',
      lastName: '' ,
      company: 'FlatLogic Inc.' ,
      address: 'Fabritsiusa str, 4' ,
      city: 'Minsk' ,
      state: '' ,
      biography: 'We are young and ambitious full service design and technology company. ' +
      'Our focus is JavaScript development and User Interface design.',
      postalCode : '220007'
    };
  }

})();
