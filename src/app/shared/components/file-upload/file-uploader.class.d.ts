import { FileItem } from './file-item.class';
export interface Headers {
    name: string;
    value: string;
}
export interface FileUploaderOptions {
    allowedMimeType?: Array<string>;
    allowedFileType?: Array<string>;
    autoUpload?: boolean;
    isHTML5?: boolean;
    filters?: Array<any>;
    headers?: Array<Headers>;
    maxFileSize?: number;
    queueLimit?: number;
    removeAfterUpload?: boolean;
    url?: string;
}
export declare class FileUploader {
    authToken: string;
    isUploading: boolean;
    queue: Array<any>;
    progress: number;
    _nextIndex: number;
    autoUpload: any;
    options: FileUploaderOptions;
    private _failFilterIndex;
    constructor(options: any);
    setOptions(options: any): void;
    addToQueue(files: any[], options?: any, filters?: any): void;
    removeFromQueue(value: any): void;
    clearQueue(): void;
    uploadItem(value: FileItem): void;
    cancelItem(value: any): void;
    uploadAll(): void;
    cancelAll(): void;
    isFile(value: any): boolean;
    isFileLikeObject(value: any): boolean;
    getIndexOfItem(value: any): number;
    getNotUploadedItems(): Array<any>;
    getReadyItems(): Array<any>;
    destroy(): void;
    onAfterAddingAll(fileItems: any): any;
    onBuildItemForm(fileItem: any, form: any): any;
    onAfterAddingFile(fileItem: any): any;
    onWhenAddingFileFailed(item: any, filter: any, options: any): any;
    onBeforeUploadItem(fileItem: any): any;
    onProgressItem(fileItem: any, progress: any): any;
    onProgressAll(progress: any): any;
    onSuccessItem(item: any, response: any, status: any, headers: any): any;
    onErrorItem(item: any, response: any, status: any, headers: any): any;
    onCancelItem(item: any, response: any, status: any, headers: any): any;
    onCompleteItem(item: any, response: any, status: any, headers: any): any;
    onCompleteAll(): any;
    _mimeTypeFilter(item: any): boolean;
    _fileSizeFilter(item: any): boolean;
    _fileTypeFilter(item: any): boolean;
    _onErrorItem(item: any, response: any, status: any, headers: any): void;
    _onCompleteItem(item: any, response: any, status: any, headers: any): void;
    protected _headersGetter(parsedHeaders: any): any;
    protected _xhrTransport(item: any): any;
    private _getTotalProgress(value?);
    private _getFilters(filters);
    private _render();
    private _queueLimitFilter();
    private _isValidFile(file, filters, options);
    private _isSuccessCode(status);
    private _transformResponse(response, headers);
    private _parseHeaders(headers);
    private _onWhenAddingFileFailed(item, filter, options);
    private _onAfterAddingFile(item);
    private _onAfterAddingAll(items);
    private _onBeforeUploadItem(item);
    private _onBuildItemForm(item, form);
    private _onProgressItem(item, progress);
    private _onSuccessItem(item, response, status, headers);
    private _onCancelItem(item, response, status, headers);
}
