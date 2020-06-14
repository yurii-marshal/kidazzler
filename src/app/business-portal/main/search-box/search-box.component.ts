import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'kz-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit {
  stickySearch: boolean = false;
  searchPosition: any;

  constructor(private router: Router) {}

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    this.stickySearch = windowScroll > this.searchPosition - 30;
  }

  ngOnInit() {
    this.searchPosition = 269;
  }

  goToSearch() {
    this.router.navigate(['/business-portal/search']);
  }
}
