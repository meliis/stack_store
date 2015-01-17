'use strict';

angular.module('stackStoreApp')
  .controller('ProductViewCtrl', function ($scope, Product, CartFactory, $routeParams, Auth, orderFactory) {

    $scope.cart;
  	$scope.user = Auth.getCurrentUser();

    var getCart = function() {
     if (Auth.isLoggedIn()) {
       // retrieve user's cart
     } else {
       CartFactory.get({id: localStorage.cartId}, function(cart) {
         $scope.cart = cart;
       });
     }
    };

    getCart();

  	$scope.quantity = 1;
  	
    Product.get({id: $routeParams.id}, function(product) {
    	$scope.product = product;
    });

    $scope.maxStars = [1,2,3,4,5];

    $scope.addToCart = function(productId, quantity) {

      var productExists = false;

      angular.forEach($scope.cart.lineItems, function(lineItem) {
        if (lineItem.item === productId) {
          lineItem.quantity += quantity;
          $scope.cart.$update();
          productExists = true;
        }
      });

      if (productExists === false) {
        $scope.cart.lineItems.push({item: productId, quantity: quantity});
        $scope.cart.$update();
        console.log("check your db!", $scope.cart);
      }

      $scope.quantity = 1;

    	// var productExists = false;
    	// angular.forEach($scope.user.orders[0].products, function(product) {
    	// 	if($scope.product._id === product.product._id) {
    	// 		product.qty += quantity;
    	// 		productExists = true;
    	// 	}
    	// });

    	// if(productExists === false) {
	    // 	$scope.user.orders[0].products.push({product: $scope.product, qty: quantity});    		
    	// }

    	// $scope.quantity = 1;
    };

    //initiate temporary banner for the cart

  });
