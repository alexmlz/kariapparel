import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FirestorageUploadService {

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase) { }


  getFiles() {
    return this.db.list('fireStorageFiles');
  }

  saveFileURl(downloadURL) {
    const newFile = {
      url : downloadURL
    };
    this.db.list('fireStorageFiles').push(newFile);
  }
}
