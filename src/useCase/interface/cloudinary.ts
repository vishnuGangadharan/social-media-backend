interface cloudinaryI{
    uploadImage(image:any,folderName:string):Promise<string>;
    uploadMultipleImages(images:string[],folderName:string):Promise<string[]>;
}
export default cloudinaryI  