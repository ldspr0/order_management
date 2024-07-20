import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class OmAccountButtonRef2 extends NavigationMixin(LightningElement) {
    @api recordId;
    @api invoke() {
        const pageReference = {
            type: 'standard__app',
            attributes: {
                appTarget: 'c__Order_Management',
                pageRef: {
                    type: 'standard__navItemPage',
                    attributes: {
                        apiName: 'Order_Management'
                    },
                    state: {
                        c__accountId: this.recordId
                    }
                }
            }
        };

        this[NavigationMixin.GenerateUrl](pageReference)
            .then(url => {
                window.open(url, '_blank');
            })
            .catch(error => {
                console.error('Error generating URL:', error);
            });
    }
}

