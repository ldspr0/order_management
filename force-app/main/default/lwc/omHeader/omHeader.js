import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue  } from "lightning/uiRecordApi";
import ACCOUNT_NAME_FIELD from "@salesforce/schema/Account.Name";
import ACCOUNT_NUMBER_FIELD from "@salesforce/schema/Account.AccountNumber";



export default class OmHeader extends LightningElement {
    @api accountId;

    @wire(getRecord, { recordId: "$accountId", fields: [ACCOUNT_NAME_FIELD, ACCOUNT_NUMBER_FIELD], })
    account;
    // @TODO: need to update behavior if accountId is not provided
    
    get name() {
        return getFieldValue(this.account.data, ACCOUNT_NAME_FIELD);
    }

    get accountNumber() {
        return getFieldValue(this.account.data, ACCOUNT_NUMBER_FIELD);
    }
}