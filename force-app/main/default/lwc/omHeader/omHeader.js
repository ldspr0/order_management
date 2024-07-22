import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue  } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import isCurrentUserManager from '@salesforce/apex/OrderManagementAppService.isCurrentUserManager';

import ACCOUNT_NAME_FIELD from "@salesforce/schema/Account.Name";
import ACCOUNT_NUMBER_FIELD from "@salesforce/schema/Account.AccountNumber";

import createProductModal from "c/omCreateProduct";
import openCartModal from "c/omCartView";



export default class OmHeader extends LightningElement {
    @api accountId;
    @api cartItems;
    isManager;

    @wire(isCurrentUserManager)
    getUserData({ error, data }) {
        this.isManager = data;
        if (error){
            console.error(error);
        }
    }
    
    @wire(getRecord, { recordId: "$accountId", fields: [ACCOUNT_NAME_FIELD, ACCOUNT_NUMBER_FIELD], })
    account;
    // @TODO: need to update behavior if accountId is not provided

    get name() {
        return getFieldValue(this.account.data, ACCOUNT_NAME_FIELD);
    }

    get accountNumber() {
        return getFieldValue(this.account.data, ACCOUNT_NUMBER_FIELD);
    }

    createProduct() {
        createProductModal.open({
            size: 'medium',
        });
    }

    openCart() {
        if (!this.accountId) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error",
                    message: "Account for current Order is not selected",
                    variant: "error"
                })
            );
        }
        else if (this.cartItems.length > 0){
            openCartModal.open({
                size: 'medium',
                cartItems: this.cartItems,
                accountId: this.accountId
            });
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error",
                    message: "Your cart is empty",
                    variant: "error"
                })
            );
        }
    }

    handleAccountSelect(event) {
        this.accountId = event.detail;
    }
}