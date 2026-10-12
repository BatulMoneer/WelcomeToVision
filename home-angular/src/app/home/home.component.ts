import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  email = '';
  status = '';

  readonly cards = [
    {
      "title": "Company Profile 2026",
      "image": "assets/company-en.png",
      "url": "https://tovision.sa/storage/settings/profile-en.pdf",
      "language": "en"
    },
    {
      "title": "الملف التعريفي لشركة نحو الرؤية 2026",
      "image": "assets/company-ar.png",
      "url": "https://tovision.sa/storage/settings/profile-ar.pdf",
      "language": "ar"
    },
    {
      "title": "Factory Profile 2026",
      "image": "assets/factory-en.png",
      "url": "https://www.dropbox.com/scl/fi/eljjyn3ih979c2qvrqe9x/Factory-Profile-To-Vision-2026.pdf?rlkey=gvosupy6t1k12urzmcae6xwci&st=q95ol1um&dl=0",
      "language": "en"
    },
    {
      "title": "الملف التعريفي لمصنع شركة نحو الرؤية 2026",
      "image": "assets/factory-ar.png",
      "url": "https://www.dropbox.com/scl/fi/pzca5s8qc3u5z356vmpoi/2026.pdf?rlkey=5qo4gxwkdaurm3ievd6im401m&st=igrc5rh0&dl=0",
      "language": "ar"
    },
    {
      "title": "To Vision in 2025",
      "image": "assets/review.png",
      "url": "https://www.youtube.com/watch?v=_jeDp4K13go",
      "language": "en"
    },
    {
      "title": "دليل منتجات شركة نحو الرؤية",
      "image": "assets/catalogue.png",
      "url": "https://www.dropbox.com/scl/fi/zqfg3mor4ihhpt4adkn4x/.pdf?rlkey=y4y62835txjlsrvlxxjwd1c33&st=lg4b911c&dl=0",
      "language": "ar"
    }
  ];

  contact(form: NgForm): void {
    if (form.invalid) { 
      form.control.markAllAsTouched(); 
      return; 
    }
    
    // Open user's default email client with the entered email in the body/subject
    const subject = encodeURIComponent('Website Inquiry');
    const body = encodeURIComponent(`Hello Team,\n\nI would like to be contacted regarding my interest. My email is: ${this.email.trim()}`);
    
    window.location.href = `mailto:info@tovision.sa?subject=${subject}&body=${body}`;
    
    this.status = 'Opening your email client...';
    form.resetForm();
  }
}