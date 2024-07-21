public with sharing class OrderManagementAppService {
        
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts(){
        try {
            if(Schema.sObjectType.Product__c.isAccessible()) {
                return [SELECT Id, Name, Description__c, Family__c, Price__c, Type__c, Image__c FROM Product__c LIMIT 10000];
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