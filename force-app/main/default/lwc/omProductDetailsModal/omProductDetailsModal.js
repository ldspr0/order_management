import { api } from "lwc";
import LightningModal from 'lightning/modal';


export default class OmProductDetailsModal extends LightningModal {
    @api item;
}