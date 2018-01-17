(function() {

    'use strict';

    function CreditCardController(
        metadataService,
        tipoManipulationService,
        tipoHandle,
        tipoRouter,
        $scope,
        $rootScope,
        $timeout,
        $mdDialog,
        $mdToast, 
        cardHeading) {
        var _instance = this;
        
        tipoManipulationService.initGA();
        _instance.inProgress = false;
        $scope.heading = cardHeading;
        $scope.date = new Date();
        $scope.expiryDate = new Date();
        $scope.expiryDate.setMonth($scope.date.getMonth() + 1);
        $scope.creditCard;
        $scope.cardToken;
        var appMetadata = metadataService.applicationMetadata;
        var appMetadata = _.merge(_.get(appMetadata, "TipoApp"), _.get(appMetadata, "TipoConfiguration"));
       
        function markProgress() {
            _instance.inProgress = true;
            delete _instance.lastError;
        }

        _instance.cancel = function() {
            var element = document.getElementById("creditCard");
            element.className = element.className.replace(/\bslideInRight\b/g, "slideOutRight");
            $timeout(function(){
                $mdDialog.cancel();
                tipoRouter.endStateChange();
            }, 500);
        };
      
        _instance.callInitCard = function () {
            $timeout( function(){
                _instance.initCard();
            }, 0 );
        }
        _instance.initCard = function() {
            $scope.creditCard = tipoManipulationService.initialiseCreditCard(appMetadata.app_subscription.publishable_key);
        }

        _instance.createToken = function() {
            $scope.creditCard.stripe.createToken($scope.creditCard.cardElement).then(function(result) {
                if (result.error) {
                    // Inform the user if there was an error
                    _instance.lastError = result.error.message;
                } else {
                    // Send the token to your server
                    delete _instance.lastError;
                    markProgress();
                    $scope.cardToken = result.token;
                    sendToken();
                }
            });
        }

        function sendToken() {
            tipoHandle.callAction('TipoSubscriptions', 'attach_card', ['2000000001'], 'TipoSubscriptions', { token_source: $scope.cardToken.id, credit_card: $scope.cardToken.card.last4 }).then(function(response) {
                $rootScope.showSubscribeNow = false;
                _instance.cancel();
                var toast = $mdToast.tpToast();
                toast._options.locals = {
                header: 'Action successfully completed',
                body: 'Your 30 days free trial started sucessfully'
                };
                $mdToast.show(toast);
            }, function (err) {
                _instance.inProgress = false;
            });
        }

    }
    angular.module('tipo.user')
        .controller('CreditCardController', CreditCardController);

})();