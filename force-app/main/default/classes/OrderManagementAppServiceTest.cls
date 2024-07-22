@isTest
public with sharing class OrderManagementAppServiceTest {
    @TestSetup
    static void makeData(){
        
        List<Product__c> products = new List<Product__c>();
        for(Integer i = 0; i < 10; i++){
            products.add(new Product__c(Name = 'TestProduct ' + i, Type__c = 'Type A', Price__c = 100));
        }

        Database.insert(products);

        Account acc = new Account();
        acc.Name = 'test Account';

        Database.insert(acc);
    }

    @isTest
    static void getProductsTest() {
        String filter = '';
        List<Product__c> result = OrderManagementAppService.getProducts(filter);
        System.assert(result.size() > 0, 'At least one product record should be returned');

        filter = '["Type A"]';
        List<Product__c> result2 = OrderManagementAppService.getProducts(filter);
        System.assert(result2.size() > 0, 'At least one product record should be returned');

        filter = '["Type B"]';
        List<Product__c> result3 = OrderManagementAppService.getProducts(filter);
        System.assert(result3.size() == 0, 'No product record should be returned');
    }
    
    @isTest
    static void getUrlStringFromServerTest() {
        Test.setMock(HttpCalloutMock.class, new Mock());
       
        Test.startTest();
        String productName = 'Car';
        String result = OrderManagementAppService.getUrlStringFromServer(productName);
        Test.stopTest();

        System.assert(result != '', 'Product name should be in the result');
    }

    @isTest
    static void testCurrentUserMethod() {
        Boolean isManager = OrderManagementAppService.isCurrentUserManager();
        // TODO: need to create asserts for different users
    }
    
    @isTest
    static void testCreateOrder() {
        List<Product__c> products = [SELECT Id, Name FROM Product__c];
        Id productId = products[0].Id;
        String productName = products[0].Name;

        List<Account> accs = [SELECT Id FROM Account];
        Id accountId = accs[0].Id;

        String orderItems = '[{"id":"'+productId+'", "name":"'+productName+'","price":123.00,"quantity":2,"accountId":"'+accountId+'" },{"id":"'+productId+'", "name":"'+productName+'","price":123.00,"quantity":2,"accountId":"'+accountId+'"}]';
        String result = OrderManagementAppService.createOrderAndItems(orderItems);
        System.assert(result != null, 'Order should be created');

        List<OrderItem__c> orderItemsQuery = [SELECT Id FROM OrderItem__c];
        System.assert(orderItemsQuery.size() == 2);
        Database.delete(orderItemsQuery[0]);
        orderItemsQuery = [SELECT Id FROM OrderItem__c];
        System.assert(orderItemsQuery.size() == 1);
    }

    @isTest
    static void testGetAccounts() {
        String searchTerm = 'test';
        List<Account> accs = OrderManagementAppService.getAccounts(searchTerm);
        System.assert(accs.size() > 0, 'At least one account should be returned');
    }


    private static final String FAKE_RESPONSE_JSON = '{"success": true,"word": "car","rowcount": 4,' +
  '"data": [ '+
    '{"id": 602,"imageurl": "http://www.glyffix.com/Image/ShowUploadedImage/602"},'+
    '{"id": 3846,"imageurl": "http://www.glyffix.com/Image/ShowUploadedImage/3846"},'+
    '{"id": 3847,"imageurl": "http://www.glyffix.com/Image/ShowUploadedImage/3847"},'+
    '{"id": 3848,"imageurl": "http://www.glyffix.com/Image/ShowUploadedImage/3848"}'+
    '],"errormessage": ""}';

    private class Mock implements HttpCalloutMock {

        public HTTPResponse respond(HTTPRequest req) {

            // You could assert the request content here

            HTTPResponse res = new HTTPResponse();
            res.setBody(FAKE_RESPONSE_JSON);
            res.setStatusCode(200);
            return res;
        }
    }

}