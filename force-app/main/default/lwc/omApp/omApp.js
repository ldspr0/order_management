import { LightningElement, wire, api } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";

const ITEMS = [
    {
    name: 'car',
    description: 'Description of a car',
    type: 'Type I',
    family: 'Family I',
    price : '$5000',
    imgUrl : 'https://www.glyffix.com:443/Image/ShowUploadedImage/602',
    ready: true
  },
  {
    name: 'car',
    description: 'Description of a car',
    type: 'Type I',
    family: 'Family I',
    price : '$5000',
    imgUrl : 'https://www.glyffix.com:443/Image/ShowUploadedImage/602',
    ready: true
  },
  {
    name: 'car',
    description: 'Description of a car',
    type: 'Type I',
    family: 'Family I',
    price : '$5000',
    imgUrl : 'https://www.glyffix.com:443/Image/ShowUploadedImage/602',
    ready: true
  },
  {
    name: 'car',
    description: 'Description of a car',
    type: 'Type I',
    family: 'Family I',
    price : '$5000',
    imgUrl : 'https://www.glyffix.com:443/Image/ShowUploadedImage/602',
    ready: true
  },
  {
    name: 'car',
    description: 'Description of a car',
    type: 'Type I',
    family: 'Family I',
    price : '$5000',
    imgUrl : 'https://www.glyffix.com:443/Image/ShowUploadedImage/602',
    ready: true
  },
  {
    name: 'car',
    description: 'Description of a car',
    type: 'Type I',
    family: 'Family I',
    price : '$5000',
    imgUrl : 'https://www.glyffix.com:443/Image/ShowUploadedImage/602',
    ready: true
  },
  {
    name: 'car',
    description: 'Description of a car',
    type: 'Type I',
    family: 'Family I',
    price : '$5000',
    imgUrl : 'https://www.glyffix.com:443/Image/ShowUploadedImage/602',
    ready: true
  },
  {
    name: 'car',
    description: 'Description of a car',
    type: 'Type I',
    family: 'Family I',
    price : '$5000',
    imgUrl : 'https://www.glyffix.com:443/Image/ShowUploadedImage/602',
    ready: true
  },
  {
    name: 'car',
    description: 'Description of a car',
    type: 'Type I',
    family: 'Family I',
    price : '$5000',
    imgUrl : 'https://www.glyffix.com:443/Image/ShowUploadedImage/602',
    ready: true
  },
  
];

export default class OmApp extends LightningElement {
    @wire(CurrentPageReference)
    currentPageRef;
  
    @api accountId;
  
    get accountId() {
      return this.currentPageRef.state.c__accountId;
    }

    activeFilters;

    items = ITEMS;
}