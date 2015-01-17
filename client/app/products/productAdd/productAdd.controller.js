'use strict';

angular.module('stackStoreApp')
  .controller('ProductAddCtrl', function ($scope, Product, Category, Auth) {
    $scope.isAdmin = Auth.isAdmin;

    $scope.newProduct = {
    	categories: [],
        images: []
    }
    $scope.newCat = {
        name: ""
    }

    $scope.addedSuccess = false;

    $scope.categories = Category.query();

    filepicker.setKey("ABXzKGxApRcCcK8K59thqz");

    $scope.pickFile = function(){
        filepicker.pick(
        {
            mimetypes: ['image/*', 'text/plain'],
            container: 'window',
            services:['COMPUTER', 'FACEBOOK', 'GMAIL'],
        },
        function(Blob){
            $scope.newProduct.images.push(Blob.url)
            $scope.$apply();
            // console.log(Blob.url);
        },
        function(FPError){
            console.log(FPError.toString());
        });
    }

    $scope.addCategory = function() {
        $scope.categories.push($scope.newCat);
        var cat = new Category({name: $scope.newCat.name});
        cat.$save();
        $scope.newCat.name = "";
    }

    $scope.addProduct = function(){
        var num = $scope.newProduct.price
        $scope.newProduct.price = Math.round(num * 100)/100
    	Product.save($scope.newProduct); //idk

    	$scope.addedSuccess = true;

    	$scope.addProductForm.$setPristine();
    	$scope.newProduct = {
    		name: "",
    		categories: [],
    		images: [],
    		description: {},
    		price: null
    	}
    }

    $scope.toggleCat = function(cat) {
    	var indexCat = $scope.newProduct.categories.indexOf(cat);

    	if(indexCat > -1){
    		$scope.newProduct.categories.splice(indexCat,1);
    	}
    	else{
    		$scope.newProduct.categories.push(cat);
    	}
    }
  });