import { LightningElement, api } from 'lwc';
import openProductModal from 'c/omProductDetailsModal';

export default class OmProductItem extends LightningElement {
    @api item;
    descriptionReduced;

    renderedCallback() {
        const description = this.item.Description__c;
        if (description && description.length > 100) {
            this.descriptionReduced = description.slice(0, 100) + "...";
        } else if (!description) {
            this.descriptionReduced = "Description is not provided";
        } else {
            this.descriptionReduced = description;
        }
    }

    openDescription() {
        openProductModal.open({
            size: 'medium',
            item: this.item
        });
    }
}