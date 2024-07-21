import { api, track } from "lwc";
import LightningModal from 'lightning/modal';
// import getImgUrlString from '@salesforce/apex/OrderManagementAppService.getUrlStringFromServer';

export default class OmCartView extends LightningModal {
    @api cartItems;
    @track cartItemsForTable = [];
    overallPrice = 0;


    connectedCallback() {
        let cartItemNames = [];
        this.cartItems.forEach((item, index) => {
            this.overallPrice += item.Price__c;

            let sameItemIndex = cartItemNames.indexOf(item.Name);

            if (sameItemIndex !== -1) {
                this.cartItemsForTable[sameItemIndex].quantity++;
                this.cartItemsForTable[sameItemIndex].price += item.Price__c;
            } else {
                cartItemNames.push(item.Name);
                this.cartItemsForTable.push({index: index, name: item.Name, quantity: 1, price: item.Price__c});
            }
        });
    }

    checkout() {
        // getImgUrlString({
        //     productName: this.productName
        // })
        //     .then(result => {
        //         if (result) {
        //             this.imgUrl = result;
        //         } else {
        //             this.imgUrl = "Image not found";
        //         }

        //     });

        // this.close();
    }

    closeModal() {
        this.close();
    }
}