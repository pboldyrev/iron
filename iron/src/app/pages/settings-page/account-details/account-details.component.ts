import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, BluHeading, BluText, BluInput, BluModal, BluTag],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss'
})
export class AccountDetailsComponent {
  planName = "";
  userEmail = "";
  planExpiresAt = "";

  constructor(
    private dataService: DataService,
  ){}
  
  ngOnInit() {
    this.dataService.getUser$().subscribe((data: any) => {
      this.userEmail = data.user.email;
      this.planName = data.user.plan;
      if(!data.user.premiumPaidTime) {
        this.planExpiresAt = "Never";
      } else {
        this.planExpiresAt = (new Date(data.user.premiumPaidTime)).toLocaleDateString('en-US', {timeZone: 'UTC'});
      }
      console.log(data);
    });
  }
}
