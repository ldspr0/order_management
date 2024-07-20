public with sharing class OrderManagementAppService {
        
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts(){
        try {
            if(Schema.sObjectType.Product__c.isAccessible()) {
                return [SELECT Id, Name, Description__c, Family__c, Price__c, Type__c FROM Product__c LIMIT 10000];
            } else {
                throw new AuraHandledException('You don\'t have access to the Product object');
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}