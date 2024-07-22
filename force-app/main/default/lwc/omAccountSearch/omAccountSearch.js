import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/OrderManagementAppService.getAccounts';

export default class OmAccountSearch extends LightningElement {
    searchTerm;
    accList = [];
    selectedAccount;
    error;
    
    get dataPresent() {
        return this.accList?.length;
    }

    @wire(getAccounts, {searchTerm: '$searchTerm'})
    wiredAccounts({ error, data }) {
        if(error){
            console.log(error);
        } else if(data){
            this.accList = data;
            console.log('Data: '+this.accList.length);
        }
    }

    handleSearch(event) {
        this.searchTerm = event.target.value;
    }

    getSelectedName(event) {
        this.selectedAccount = event.target.dataset.id;
        this.dispatchEvent(new CustomEvent('selected', {detail: this.selectedAccount}));
    }

}