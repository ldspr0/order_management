public with sharing class OrderManagementAppService {
        
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts(String filters){
        try {
            List<String> filterStrings = new List<String>();
            if (filters.length() > 0) {
                filterStrings = (List<String>)JSON.deserializeStrict(filters, List<String>.class);
            }
            if(Schema.sObjectType.Product__c.isAccessible()) {
                if (filterStrings.isEmpty()){
                    return [SELECT Id, Name, Description__c, Family__c, Price__c, Type__c, Image__c FROM Product__c LIMIT 10000];
                } else {
                    return [SELECT Id, Name, Description__c, Family__c, Price__c, Type__c, Image__c FROM Product__c WHERE Family__c IN :filterStrings OR Type__c IN :filterStrings LIMIT 10000];
                }
                
            } else {
                throw new AuraHandledException('You don\'t have access to the Product object');
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String getUrlStringFromServer(String productName){
        try {

            Http httpObject = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('http://www.glyffix.com/api/Image?word=' + productName.escapeHtml4().replace(' ', '%20'));
            request.setHeader('Content-Type', 'application/json');
            request.setHeader('accept','application/json');
            request.setMethod('GET');
            HttpResponse response = httpObject.send(request);
            String responseBody = response.getBody();
            System.debug(responseBody);

            GlyffixWrapper wrapper = (GlyffixWrapper)JSON.deserializeStrict(responseBody, GlyffixWrapper.class);
            System.debug(wrapper);
            
            if (wrapper.rowcount > 0) {
                return wrapper.data[0].imageurl;
            } else {
                return '';
            }
            

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Boolean isCurrentUserManager(){
        try {
            if (Schema.sObjectType.User.isAccessible()) {
       
                User currentUser = [SELECT Id, IsManager__c FROM User WHERE Id = :UserInfo.getUserId()];
                return currentUser.IsManager__c;
            } else {
                throw new AuraHandledException('You don\'t have access to the User Object');
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled
    public static String createOrderAndItems(String orderItems){
        List<OrderItemWrapper> orderWrappers = (List<OrderItemWrapper>)JSON.deserializeStrict(orderItems, List<OrderItemWrapper>.class);

        if (orderWrappers.isEmpty()){
            return 'Error: There are no products in the cart';
        }
        String orderId = 'Error: Unknown Error';

        if (Schema.sObjectType.Order__c.isCreateable()) {
            Order__c order = new Order__c();
            order.AccountId__c = orderWrappers[0].accountId;
            Database.SaveResult result = Database.insert(order);

            if (!result.isSuccess()) {
                return 'Error: ' + result.getErrors()[0].getMessage();
            }
            orderId = result.Id;

            
            if (Schema.SObjectType.OrderItem__c.isCreateable()) {
                List<OrderItem__c> orderItemsToCreate = new List<OrderItem__c>();
                for (OrderItemWrapper orderWrapper : orderWrappers) {
                    orderItemsToCreate.add(new OrderItem__c(OrderId__c = order.Id, ProductId__c = orderWrapper.id, Quantity__c = orderWrapper.quantity, Price__c = orderWrapper.price));
                }
                Database.insert(orderItemsToCreate);
            } else {
                return 'Error: You don\'t have access to create OrderItems';
            }
        } else {
            return 'Error: You don\'t have access to create an Order';
        }

        return orderId;

    }

    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String searchTerm){
        List<Account> accList = new List<Account>();
        String searchKeyword = '';
        if(searchTerm != null){
            searchKeyword = '%'+searchTerm+'%';
            accList = [SELECT Id, Name FROM Account WHERE Name LIKE :searchKeyword];
        }
        return accList;
    }

    class OrderItemWrapper {
        public Id id;
        public String name;
        public Decimal price;
        public Integer quantity;
        public String accountId;

        OrderItemWrapper(Id id, String name, Decimal price, Integer quantity, String accountId) {
            this.id = id;
            this.name = name;
            this.price = price;
            this.quantity = quantity;
            this.accountId = accountId;
        }
    }


    class GlyffixWrapper {
        boolean success;
        String word;
        Integer rowcount;
        List<glyffixDataWrapper> data; 
        String errormessage;

        GlyffixWrapper(boolean success, String word, Integer rowcount, List<glyffixDataWrapper> data, String errormessage) {
            this.success = success;
            this.word = word;
            this.rowcount = rowcount;
            this.data = data;
            this.errormessage = errormessage;
        }
    }

    class GlyffixDataWrapper {
        String id;
        String imageurl;

        GlyffixDataWrapper(String id, String imageurl) {
            this.id = id;
            this.imageurl = imageurl;
        }
    }
}