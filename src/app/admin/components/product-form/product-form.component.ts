import { FirestorageUploadService } from './../../../shared/services/firestorage-upload.service';
import { Product } from 'shared/models/product';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'shared/services/product.service';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'shared/services/category.service';
import { map, take, finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$;
  imageUrls$;
  id;
  product: Product = {key: '', title: '', description: '', price: null, category: '', imageUrl: '' };
  uploadPercent: Observable<number>;
  // downloadURL: Observable<string>;
  downloadURL: string;

  constructor(
    private storageService: FirestorageUploadService,
    private storage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {

    this.categories$ = this.categoryService.getAll().snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() as {} }));
      })
    );

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.productService.get(this.id).valueChanges()
      .pipe(take(1)).subscribe((product: Product) => this.product = product);
    }
  }
  ngOnInit() {
    this.imageUrls$ = this.storageService.getFiles().snapshotChanges().pipe(
      map(changes => {
        debugger;
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() as {} }));
      })
    );
  }

  upload(event) {
    const file = event.target.files[0];
    const filePath = '/uploads/' + file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.storageService.saveFileURl(url);
            this.downloadURL = url;
            this.product.imageUrl = url;
          });
        })
     )
    .subscribe();
  }

  selectImage(imageUrl) {
    this.product.imageUrl = imageUrl;
    // $('#imageModal').modal('hide');
  }

  save(product) {
    if (this.id) {
      this.productService.update(this.id, product);
    } else { this.productService.create(product); }

    this.router.navigate(['/admin/products']);
  }

  delete() {
    // tslint:disable-next-line: curly
    if (!confirm('Are you sure you want to delete this product')) return;

    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);

  }

}
