export * from  './app/shared/components/file-upload/file-select.directive';
export * from  './app/shared/components/file-upload/file-drop.directive';
export * from  './app/shared/components/file-upload/file-uploader.class';

import {FileSelectDirective} from './app/shared/components/file-upload/file-select.directive';
import {FileDropDirective} from './app/shared/components/file-upload/file-drop.directive';

export const FILE_UPLOAD_DIRECTIVES:[any] = [FileSelectDirective, FileDropDirective];

export default {
  directives: [
    FILE_UPLOAD_DIRECTIVES
  ]
};