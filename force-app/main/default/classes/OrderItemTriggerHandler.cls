public with sharing class OrderItemTriggerHandler {

    public static void addOrderItem(List<OrderItem__c> orderItems) {
        updateOrderManagementTotalFields(orderItems);
    }

    public static void deleteOrderItem(List<OrderItem__c> orderItems) {
        updateOrderManagementTotalFields(orderItems);
    }

    private static void updateOrderManagementTotalFields(List<OrderItem__c> orderItems) {
        List<Id> orderIdsToUpdate = new List<Id>();

        for (OrderItem__c orderItem : orderItems) {
            orderIdsToUpdate.add(orderItem.OrderId__c);
        }
        
        List<Order__c> ordersToUpdate = [
                SELECT Id, TotalPrice__c, TotalProductCount__c,
                    (SELECT Id, OrderId__c, Quantity__c, Price__c FROM Order_Items__r)
                FROM Order__c
                WHERE Id IN :orderIdsToUpdate
        ];

        for (Order__c each : ordersToUpdate) {
            each.TotalProductCount__c = 0;
            each.TotalPrice__c = 0;
            for (OrderItem__c orderItem : each.Order_Items__r) {
                each.TotalProductCount__c += orderItem.Quantity__c;
                each.TotalPrice__c += orderItem.Price__c;
            }
        }
        
        Database.update(ordersToUpdate);
    }
}