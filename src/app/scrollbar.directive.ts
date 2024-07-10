import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollbar]'
})
export class ScrollbarDirective {
  private rightDivision: HTMLElement= this.renderer.createElement('div');
  private innerDivision : HTMLElement= this.renderer.createElement('div');
  parentScrollHeight :any;
  private startY: any;
  private startTop:any;
  private maxTop: any;
  private minTop: any;
  private isDragging: boolean = false;
  isHovering: boolean=false;
  private hideTimeout: any;

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
    this.renderer.setStyle(this.elementRef.nativeElement, '-webkit-overflow-scrolling', 'touch'); // Smooth scrolling mobile device
    this.renderer.setStyle(this.elementRef.nativeElement, '-webkit-scrollbar', 'none'); // Hide scrollbar in Webkit
  }
  private createRightDivision() {
 
    this.renderer.addClass(this.rightDivision, 'right-division');
    this.renderer.setStyle(this.rightDivision, 'display', 'flex');
    this.renderer.setStyle(this.rightDivision, 'float', 'right'); 
    this.renderer.setStyle(this.rightDivision, 'width', '14px'); 
    this.renderer.setStyle(this.rightDivision, 'height', this.parentScrollHeight); 
 
    this.renderer.appendChild(this.elementRef.nativeElement.parentElement, this.rightDivision);
    this.renderer.setStyle(this.rightDivision, 'background-color', 'transparent'); 
    // Calculate the height of the inner division (25% of parentScrollHeight)
    const innerDivisionHeight = parseFloat(this.parentScrollHeight) * 0.25;

      // Create the inner division with a height of 300px
    this.renderer.setStyle(this.innerDivision, 'height', innerDivisionHeight + 'px');
    this.renderer.addClass(this.innerDivision, 'inner-division');
    //this.renderer.setStyle(this.innerDivision, 'cursor', 'pointer');
    this.renderer.setStyle(this.innerDivision, 'width', '11px');
    this.renderer.setStyle(this.innerDivision, 'border-radius', '5px'); // Set border radius
    this.renderer.setStyle(this.innerDivision, 'background-color', '#d2e8f5'); // Adjust color as needed
    this.renderer.appendChild(this.rightDivision, this.innerDivision);
    this.renderer.setStyle(this.innerDivision, 'display', 'none');
    const nativeElement = this.elementRef.nativeElement;

   // Add a scroll event listener to the native element
   this.renderer.listen(nativeElement, 'scroll', () => {
   // Calculate the new position of the inner division based on the scroll position of the native element
   const scrollPercentage = nativeElement.scrollTop / (nativeElement.scrollHeight - nativeElement.clientHeight);
   const maxTop = this.rightDivision.clientHeight - this.innerDivision.clientHeight;
   const newTop = maxTop * scrollPercentage;

   // Update the position of the inner division
   this.innerDivision.style.transform = `translateY(${newTop}px)`;

   // Update the scrollTop of the native element to keep them in sync
   const newScrollTop = newTop * (nativeElement.scrollHeight - nativeElement.clientHeight) / maxTop;
   nativeElement.scrollTop = newScrollTop;
 });

//Add mouseover event listener to the right division
this.renderer.listen(this.rightDivision, 'mouseover', () => {
  clearTimeout(this.hideTimeout); // Clear the timeout to prevent hiding
  this.isHovering = true;
  this.renderer.setStyle(this.innerDivision, 'display', 'flex');
  this.renderer.setStyle(this.rightDivision, 'background-color', '#e8f4fa');
});

//Add mouseout event listener to the right division
this.renderer.listen(this.rightDivision, 'mouseout', () => {
  this.hideTimeout = setTimeout(() => {
  this.isHovering = false;
  this.renderer.setStyle(this.innerDivision, 'display', 'none');
  this.renderer.setStyle(this.rightDivision, 'background-color', 'transparent');
}, 5000);
});

this.renderer.listen(this.rightDivision, 'wheel', (event: WheelEvent) => {
  if (this.isHovering && event.deltaY !== 0) {
    if (!this.isDragging) {
      const scrollAmount = event.deltaY * .9; 
      this.elementRef.nativeElement.scrollTop += scrollAmount;
    }
  }
});

   // Add mouse event listeners for dragging
   this.renderer.listen(this.innerDivision, 'mousedown', (event: MouseEvent) => {
    console.log('dragging');
    const focusedElement = document.activeElement;
    console.log('focus elemnt',focusedElement);
    
    if (focusedElement) {
        const elementClass = focusedElement.classList.value;
        console.log('Class of the focused element:', elementClass);
    } else {
        console.log('No element is currently focused.');
    }
    this.startY = event.clientY;
    this.startTop = this.innerDivision.offsetTop;
    this.maxTop = this.rightDivision.clientHeight - this.innerDivision.clientHeight;
    this.minTop = 0;
    this.isDragging = true;
    this.renderer.addClass(document.body, 'dragging');
    event.preventDefault(); 
  });

  this.renderer.listen('document', 'mousemove', (event: MouseEvent) => {
    if (this.isDragging && this.startY !== undefined) {
      const deltaY = event.clientY - this.startY;
      const newTop = this.startTop !== undefined ? this.startTop + deltaY : this.innerDivision.offsetTop;
      const maxTop = this.rightDivision.clientHeight - this.innerDivision.clientHeight;
  
      // Calculate new top position relative to right division boundaries
      let constrainedTop = event.clientY - this.rightDivision.getBoundingClientRect().top - (this.innerDivision.clientHeight / 2);
      constrainedTop = Math.max(0, Math.min(constrainedTop, maxTop));
  
      // Update top position
      this.innerDivision.style.top = constrainedTop + 'px';
  
      // Calculate scroll position and update parent scrollTop only if top has been initialized
      if (this.startTop !== undefined) {
        const scrollPercentage = constrainedTop / maxTop;
        const newScrollTop = scrollPercentage * (this.elementRef.nativeElement.scrollHeight - this.elementRef.nativeElement.clientHeight);
        this.elementRef.nativeElement.scrollTop = newScrollTop;
      }
    }
  });  

  this.renderer.listen('document', 'mouseup', () => {
    if (this.isDragging) {
      this.isDragging = false;
      this.startY = undefined;
      this.renderer.removeClass(document.body, 'dragging'); 
    }
  });


// If the click is on the mouse drag rail, then scroll the content to the clicked position 
this.renderer.listen(this.rightDivision, 'mousedown', (event: MouseEvent) => {
  if (!this.isInnerDivisionClicked(event)) {
    const clickPosition = event.clientY - this.rightDivision.getBoundingClientRect().top;
    const scrollPosition = (clickPosition / this.rightDivision.clientHeight) * (this.elementRef.nativeElement.scrollHeight - this.elementRef.nativeElement.clientHeight);
    this.elementRef.nativeElement.scrollTop = scrollPosition;
  }
});

// If the click is on the scroll bar, then focus the scroll bar only and prevent scrolling 
this.renderer.listen(this.innerDivision, 'mousedown', (event: MouseEvent) => {
  // Prevent propagation to the parent element
  event.stopPropagation();
});
this.renderer.listen(this.innerDivision, 'click', () => {
  // Focus the inner division
  const focusedElement = document.activeElement as HTMLElement;
  if (focusedElement) {
      focusedElement.blur();
  }

  this.innerDivision.focus();
  console.log('innerdivisonclick');
  
});


  // Add mouse enter and mouse leave event listeners to show/hide the right division
this.renderer.listen(this.elementRef.nativeElement, 'mouseenter', () => {
  clearTimeout(this.hideTimeout); // Clear the timeout to prevent hiding
  this.renderer.setStyle(this.rightDivision, 'background-color', '#e8f4fa');
  this.renderer.setStyle(this.innerDivision, 'display', 'flex');
});

this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', () => {
  this.hideTimeout = setTimeout(() => {
    this.renderer.setStyle(this.rightDivision, 'background-color', 'transparent');
    this.renderer.setStyle(this.innerDivision, 'display', 'none');
  }, 5000); // Set the delay in milliseconds (e.g., 500ms)
});

  }
  // Helper function to check if the inner division is clicked
  private isInnerDivisionClicked(event: MouseEvent): boolean {
  return this.innerDivision.contains(event.target as Node);
}

}
