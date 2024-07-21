import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getProducts from '@salesforce/apex/OrderManagementAppService.getProducts';
export default class OmApp extends LightningElement {
    @track products;
    @track showTable = false;
    @track cartItems = [];
    activeFilters;
    error;

    @wire(CurrentPageReference)
    currentPageRef;

    @wire(getProducts)
    getPrdcts({ error, data }) {
        if (data) {
            this.products = data;
            this.showTable = true;
        } else {
            this.error = error;
        }
    }

    get accountId() {
        return this.currentPageRef.state.c__accountId;
    }

    set accountId(value) {
    }

    handleAddToCart(event) {
        const cartItem = event.detail;
        this.cartItems.push(cartItem);

        this.dispatchEvent(new ShowToastEvent({
            title: cartItem.Name + " is added",
            message: "Item is successfully added to the cart",
            variant: "success"
        }));
    }
}
