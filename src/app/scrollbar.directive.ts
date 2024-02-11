import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollbar]'
})
export class ScrollbarDirective {
  private rightDivision: HTMLElement= this.renderer.createElement('div');
  parentScrollHeight :any;
  private startY: any;
  private startTop:any;
  private maxTop: any;
  private minTop: any;
  private isDragging: boolean = false;
  isHovering: boolean=false;
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
    this.parentScrollHeight = window.getComputedStyle(parentElement).height;
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
    this.renderer.setStyle(this.rightDivision, 'float', 'right'); 
    this.renderer.setStyle(this.rightDivision, 'width', '14px'); 
    this.renderer.setStyle(this.rightDivision, 'height', this.parentScrollHeight); 
    this.renderer.setStyle(this.rightDivision, 'background-color', '#e8f4fa');
    
    this.renderer.appendChild(this.elementRef.nativeElement.parentElement, this.rightDivision);
    // Calculate the height of the inner division (25% of parentScrollHeight)
    const innerDivisionHeight = parseFloat(this.parentScrollHeight) * 0.25;

      // Create the inner division with a height of 300px
    const innerDivision = this.renderer.createElement('div');
    this.renderer.setStyle(innerDivision, 'height', innerDivisionHeight + 'px');
    this.renderer.setStyle(innerDivision, 'cursor', 'pointer');
    this.renderer.setStyle(innerDivision, 'width', '11px');
    this.renderer.setStyle(innerDivision, 'border-radius', '5px'); // Set border radius
    this.renderer.setStyle(innerDivision, 'background-color', '#d2e8f5'); // Adjust color as needed
    this.renderer.appendChild(this.rightDivision, innerDivision);

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

//Add mouseover event listener to the right division
this.renderer.listen(this.rightDivision, 'mouseover', () => {
  this.isHovering = true;
});

//Add mouseout event listener to the right division
this.renderer.listen(this.rightDivision, 'mouseout', () => {
  this.isHovering = false;
});

this.renderer.listen(this.rightDivision, 'wheel', (event: WheelEvent) => {
  if (this.isHovering && event.deltaY !== 0) {
    if (!this.isDragging) {
      const scrollAmount = event.deltaY * .2; 
      this.elementRef.nativeElement.scrollTop += scrollAmount;
    }
  }
});

   // Add mouse event listeners for dragging
   this.renderer.listen(innerDivision, 'mousedown', (event: MouseEvent) => {
    this.startY = event.clientY;
    this.startTop = innerDivision.offsetTop;
    this.maxTop = this.rightDivision.clientHeight - innerDivision.clientHeight;
   this.minTop = 0;
    this.isDragging = true;
    this.renderer.addClass(document.body, 'dragging');
    event.preventDefault(); 
  });

 
  this.renderer.listen('document', 'mousemove', (event: MouseEvent) => {
    if (this.isDragging && this.startY !== undefined) {
      const deltaY = event.clientY - this.startY;
      const scrollAmount = deltaY * 0.1; 
      this.elementRef.nativeElement.scrollTop += scrollAmount;
      console.log('this.startTop',this.startTop)
      console.log('deltaY',deltaY);
      innerDivision.style.top = event.clientY - (innerDivision.clientHeight / 2) + 'px';
    }
  });

  this.renderer.listen('document', 'mouseup', () => {
    if (this.isDragging) {
      this.isDragging = false;
      this.startY = undefined;
      this.renderer.removeClass(document.body, 'dragging'); 
    }
  });

  this.renderer.listen(innerDivision, 'mouseout', () => {
   this.isDragging = false;
    this.renderer.removeClass(document.body, 'dragging');
  });

  this.renderer.listen(this.rightDivision, 'mousedown', (event: MouseEvent) => {
    const clickPosition = event.clientY - this.rightDivision.getBoundingClientRect().top;
    const scrollPosition = (clickPosition / this.rightDivision.clientHeight) * (this.elementRef.nativeElement.scrollHeight - this.elementRef.nativeElement.clientHeight);
    this.elementRef.nativeElement.scrollTop = scrollPosition;
  });
  
  
  }
 

}
