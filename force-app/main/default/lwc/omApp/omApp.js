import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getProducts from '@salesforce/apex/OrderManagementAppService.getProducts';
export default class OmApp extends LightningElement {
    @track products;
    @track cartItems = [];
    allProducts;
    activeFilters;

    searchString;
    error;

    @wire(CurrentPageReference)
    currentPageRef;

    @wire(getProducts)
    getPrdcts({ error, data }) {
        if (data) {
            this.products = data;
            this.allProducts = data;
        } else {
            this.error = error;
        }
    }

    get accountId() {
        return this.currentPageRef.state.c__accountId;
    }

    set accountId(value) {
    }

    handleKeyUp(event) {

        const searchString = event.target.value;
        console.log('searching?')
        if (searchString.length > 2) {
            console.log('reducing');
            this.products = this.allProducts.filter(item => {
                if (item.Name.toLowerCase().includes(searchString.toLowerCase())) {
                    return true;
                }
                if (item.Description__c) {
                    if (item.Description__c.toLowerCase().includes(searchString.toLowerCase())) {
                        return true;
                    }
                }
            })
        } else {
            this.products = this.allProducts;
        }
        this.searchString = searchString;

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
