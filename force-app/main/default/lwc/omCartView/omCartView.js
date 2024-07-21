import LightningModal from 'lightning/modal';
import { api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from 'lightning/navigation';

import createOrderAndItems from '@salesforce/apex/OrderManagementAppService.createOrderAndItems';


export default class OmCartView extends NavigationMixin(LightningModal) {
    @api cartItems;
    @api accountId;
    @track cartItemsForTable = [];
    overallPrice = 0;
    orderId;
    showCheckout = true;
    url;


    connectedCallback() {
        let cartItemNames = [];
        this.cartItems.forEach(item => {
            this.overallPrice += item.Price__c;

            let sameItemIndex = cartItemNames.indexOf(item.Name);

            if (sameItemIndex !== -1) {
                this.cartItemsForTable[sameItemIndex].quantity++;
                this.cartItemsForTable[sameItemIndex].price += item.Price__c;
            } else {
                cartItemNames.push(item.Name);
                this.cartItemsForTable.push({ id: item.Id, name: item.Name, quantity: 1, price: item.Price__c, accountId: this.accountId });
            }
        });
    }

    checkout() {
        createOrderAndItems({
            orderItems: JSON.stringify(this.cartItemsForTable)
        })
            .then(result => {
                if (result) {
                    console.log(result);
                    if (result.startsWith("Error:")) {
                        dispatchEvent(new ShowToastEvent({
                            title: "Error",
                            message: result,
                            variant: "error"
                        }));
                    } else {
                        //this.close();
                        //TODO: doesn't work for some reason
                        this.orderId = result;
                        this.showCheckout = false;
                        this.cartItemsForTable = [];
                        this.orderIdPage = {
                            type: "standard__recordPage",
                            attributes: {
                                recordId: result,
                                actionName: "view",
                              },
                          };
                          this[NavigationMixin.GenerateUrl](this.orderIdPage).then((url) => (this.url = url));

                    }
                } else {
                    console.error("LWC: Unknown Error");
                }
            });
    }

    closeModal() {
        this.close();
    }
}