@isTest
public with sharing class OrderManagementAppServiceTest {
    @TestSetup
    static void makeData(){
        
        List<Product__c> products = new List<Product__c>();
        for(Integer i = 0; i < 10; i++){
            products.add(new Product__c(Name = 'TestProduct ' + i, Type__c = 'Type A', Price__c = 100));
        }

        Database.insert(products);
    }

    @isTest
    static void getProductsTest() {
        List<Product__c> result = OrderManagementAppService.getProducts();
        System.assert(result.size() > 0, 'At least one product record should be returned');
    }
    
}