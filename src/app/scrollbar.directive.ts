import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollbar]'
})
export class ScrollbarDirective {
  private rightDivision: HTMLElement= this.renderer.createElement('div');
  parentScrollHeight :any;
  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }
  ngOnInit() {
    // Customize scrollbar appearance and behavior
    this.renderer.setStyle(this.elementRef.nativeElement, 'overflow', 'auto');
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'flex');
    this.renderer.setStyle(this.elementRef.nativeElement.parentElement, 'display', 'flex');
    this.renderer.setStyle(this.elementRef.nativeElement.parentElement, ' flex-direction', 'row');

    this.setHeightToParentScrollHeight();
      // Hide default scrollbar
      this.hideDefaultScrollbar();

        // Create and position the right division
    this.createRightDivision();
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    // Update height when parent scroll height changes
    this.setHeightToParentScrollHeight();
      
  }

  private setHeightToParentScrollHeight() {
    const parentElement = this.elementRef.nativeElement.parentElement;
    console.log('parentElement',parentElement);
    this.parentScrollHeight = window.getComputedStyle(parentElement).height;
    console.log("this.pparentScrollHeight",this.parentScrollHeight)
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.parentScrollHeight);

  }

  private hideDefaultScrollbar() {
    this.renderer.setStyle(this.elementRef.nativeElement, '-ms-overflow-style', 'none');  // IE and Edge
    this.renderer.setStyle(this.elementRef.nativeElement, 'scrollbar-width', 'none'); // Firefox
    this.renderer.setStyle(this.elementRef.nativeElement, 'scrollbar-color', 'transparent'); // Firefox
    this.renderer.setStyle(this.elementRef.nativeElement, 'overflow-y', 'scroll'); // Trigger for Webkit
    this.renderer.setStyle(this.elementRef.nativeElement, 'overflow-y', 'scroll'); // Trigger for Webkit
    this.renderer.setStyle(this.elementRef.nativeElement, '-webkit-overflow-scrolling', 'touch'); // Smooth scrolling in iOS
    this.renderer.setStyle(this.elementRef.nativeElement, '-webkit-scrollbar', 'none'); // Hide scrollbar in Webkit
  }
  private createRightDivision() {
    this.rightDivision = this.renderer.createElement('div');
    this.renderer.addClass(this.rightDivision, 'right-division');
    this.renderer.setStyle(this.rightDivision, 'display', 'flex');
    // this.renderer.setStyle(this.rightDivision, 'align-items', 'center');
    this.renderer.setStyle(this.rightDivision, 'float', 'right'); // Position at the right side
    //this.renderer.setStyle(this.rightDivision, 'top', '0');
    this.renderer.setStyle(this.rightDivision, 'width', '14px'); // Adjust width as needed
    this.renderer.setStyle(this.rightDivision, 'height', this.parentScrollHeight); // Adjust height as needed
    this.renderer.setStyle(this.rightDivision, 'background-color', '#e8f4fa'); //'#d2e8f5 Adjust background color as needed
    console.log("this.elementRef.nativeElement",this.elementRef.nativeElement)
    this.renderer.appendChild(this.elementRef.nativeElement.parentElement, this.rightDivision);

     // Create the inner division with a height of 300px
  const innerDivision = this.renderer.createElement('div');
  this.renderer.setStyle(innerDivision, 'height', '100px');
  this.renderer.setStyle(innerDivision, 'cursor', 'pointer');
  this.renderer.setStyle(innerDivision, 'width', '11px');
  this.renderer.setStyle(innerDivision, 'border-radius', '5px'); // Set border radius
  this.renderer.setStyle(innerDivision, 'background-color', '#d2e8f5'); // Adjust color as needed
  this.renderer.appendChild(this.rightDivision, innerDivision);

 // Add a reference to the native element
 const nativeElement = this.elementRef.nativeElement;

 // Add a scroll event listener to the native element
 this.renderer.listen(nativeElement, 'scroll', () => {
   // Calculate the new position of the inner division based on the scroll position of the native element
   const scrollPercentage = nativeElement.scrollTop / (nativeElement.scrollHeight - nativeElement.clientHeight);
   const maxTop = this.rightDivision.clientHeight - innerDivision.clientHeight;
   const newTop = maxTop * scrollPercentage;

   // Update the position of the inner division
   innerDivision.style.transform = `translateY(${newTop}px)`;

   // Update the scrollTop of the native element to keep them in sync
   const newScrollTop = newTop * (nativeElement.scrollHeight - nativeElement.clientHeight) / maxTop;
   nativeElement.scrollTop = newScrollTop;
 });

  }
  

}
