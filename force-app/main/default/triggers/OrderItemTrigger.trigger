trigger OrderItemTrigger on OrderItem__c (after insert, after update, after delete, after undelete) {
    if (Trigger.isAfter && (Trigger.isInsert || Trigger.isUpdate || Trigger.isUndelete)) {
        OrderItemTriggerHandler.addOrderItem(Trigger.new);
    } else if(Trigger.isAfter && Trigger.isDelete){
        OrderItemTriggerHandler.deleteOrderItem(Trigger.old);
    }
}