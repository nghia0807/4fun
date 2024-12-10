import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
interface TableItem {
  [key: string]: any;
}
@Component({
  selector: 'app-table-component',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzPaginationModule],
  templateUrl: './table-component.component.html',
  styleUrl: './table-component.component.css'
})
export class TableComponentComponent {
  @Input() data: TableItem[] = [];
  @Input() headers: string[] = [];
  @Input() defaultPageSize: number = 10;

  totalData: TableItem[] = [];
  displayData: TableItem[] = [];
  pageSize: number = 10;
  currentPage: number = 1;

  ngOnInit() {
    // Thiết lập số dòng mặc định hoặc từ input
    this.pageSize = this.defaultPageSize;
    this.totalData = this.data;
    this.updateDisplayData();
  }

  updateDisplayData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayData = this.totalData.slice(startIndex, endIndex);
  }

  onPageIndexChange(pageIndex: number) {
    this.currentPage = pageIndex;
    this.updateDisplayData();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.updateDisplayData();
  }
  transformHeaderKey(header: string): string {
    return header.toLowerCase().replace(/\s+/g, '_');
  }  
}
