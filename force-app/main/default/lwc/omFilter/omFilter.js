import { LightningElement, wire, api, track } from 'lwc';
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import PRODUCT_OBJECT from '@salesforce/schema/Product__c';

export default class OmFilter extends LightningElement {
    fieldNamesForEnabledFilters = ["Type__c", "Family__c"]; //TODO: закастить поле через xml наружу
    @api activeFilters = [];
    @track filtersToActivate = [];
    treeModel;
    error;
    recordTypeId;

    @wire(getObjectInfo, { objectApiName: PRODUCT_OBJECT })
    results({ error, data }) {
        if (data) {
            this.recordTypeId = data.defaultRecordTypeId;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.recordTypeId = undefined;
        }
    }

    @wire(getPicklistValuesByRecordType, {
        objectApiName: PRODUCT_OBJECT,
        recordTypeId: "$recordTypeId"
    })
    wiredValues({ error, data }) {
        if (data) {
            this.treeModel = this.buildTreeModel(data.picklistFieldValues);
            this.error = undefined;
        } else {
            this.error = error;
            this.treeModel = undefined;
        }
    }

    buildTreeModel(picklistValues) {
        const treeNodes = [];
        Object.keys(picklistValues)
            .filter(item => { if (this.fieldNamesForEnabledFilters.includes(item)) { console.log(item); return true; } })
            .forEach((picklist) => {
                treeNodes.push({
                    label: picklist,
                    expanded: true,
                    disabled: false,
                    items: picklistValues[picklist].values.map((item) => ({
                        label: item.label,
                        name: item.value
                    }))
                });
            });
        return treeNodes;
    }

    handleSelect(event) {
        if (this.filtersToActivate.includes(event.detail.name)) {
            this.filtersToActivate.pop(event.detail.name);
        }
        else {
            this.filtersToActivate.push(event.detail.name);
        }
    }
}