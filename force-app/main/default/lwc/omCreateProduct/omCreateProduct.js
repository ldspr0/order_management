import LightningModal from 'lightning/modal';

import OBJECT from "@salesforce/schema/Product__c";
import NAME_FIELD from "@salesforce/schema/Product__c.Name";
import DESCRIPTION_FIELD from "@salesforce/schema/Product__c.Description__c";
import TYPE_FIELD from "@salesforce/schema/Product__c.Type__c";
import FAMILY_FIELD from "@salesforce/schema/Product__c.Family__c";
import PRICE_FIELD from "@salesforce/schema/Product__c.Price__c";
import IMAGE_FIELD from "@salesforce/schema/Product__c.Image__c";

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getImgUrlString from '@salesforce/apex/OrderManagementAppService.getUrlStringFromServer';

export default class OmCreateProduct extends LightningModal {
    object = OBJECT;
    myFields = [NAME_FIELD, DESCRIPTION_FIELD, TYPE_FIELD, FAMILY_FIELD, PRICE_FIELD, IMAGE_FIELD];
    imgUrl;
    productName;

    handleProductCreated() {
        this.close();
        this.dispatchEvent(new ShowToastEvent({
            title: "Product is created",
            message: "Product is successfully created",
            variant: "success",
            mode: "dismissable"
        }));
    }

    handleProductCreateError(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: "Error",
            message: "Error message is: " + event.detail.detail,
            variant: "error",
            mode: "dismissable"
        }));
    }

    handleAbort() {
        this.close();
    }

    handleBlur(event) {
        this.productName = event.target.value;
    }

    getUrlStringFromServer() {
        getImgUrlString({
            productName: this.productName
        })
            .then(result => {
                if (result) {
                    this.imgUrl = result;
                } else {
                    this.imgUrl = "Image not found";
                }

            });
    }
}