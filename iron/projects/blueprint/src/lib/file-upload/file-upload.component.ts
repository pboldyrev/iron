import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { BluHeading } from '../heading/heading.component';
import { BluIcon } from '../icon/icon.component';

@Component({
  selector: 'blu-file-upload',
  standalone: true,
  imports: [CommonModule, BluHeading, BluIcon],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class BluFileUpload {
  @Output() fileUploaded = new EventEmitter<string>();

  @HostListener('dragover', ['$event']) dragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
  // Dragleave Event
  @HostListener('dragleave', ['$event']) public dragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
  // Drop Event
  @HostListener('drop', ['$event']) public drop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.loadAndEmitContent(event.dataTransfer.files);

  }

  onFileSelected(event: any): void {
    this.loadAndEmitContent(event?.target?.files);
  }

  private loadAndEmitContent(files: File[]): void {
    const file = files[0] as File;
    if(!file) {
      return;
    }
    let fileUploaded = this.fileUploaded;
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt: any) {
      fileUploaded.emit(evt.target.result);
    }
  }
}
