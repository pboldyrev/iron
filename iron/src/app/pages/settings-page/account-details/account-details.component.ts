import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { DataService } from 'src/app/shared/services/data.service';
import { SkeletonLoaderTextComponent } from 'src/app/skeleton-loader-text/skeleton-loader-text.component';
import { PlanName, PlanNameToDisplay } from '../billing/billing.constants';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, BluHeading, BluText, BluInput, BluModal, BluTag, SkeletonLoaderTextComponent, BluButton, BluSpinner],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss'
})
export class AccountDetailsComponent {
  planName: PlanName = PlanName.Free;
  userEmail = "";
  planExpiresAt = "";

  isLoading = false;
  confirmedDelete = 0;
  
  PlanNameToDisplay = PlanNameToDisplay;

  constructor(
    private dataService: DataService,
    private navigationService: NavigationService,
    private toastService: ToastService,
  ){}
  
  ngOnInit() {
    this.isLoading = true;
    this.dataService.getUser$().subscribe((data: any) => {
      this.userEmail = data.user.email;
      this.planName = data.user.plan;
      if(!data.user.premiumPaidTime) {
        this.planExpiresAt = "Never";
      } else {
        this.planExpiresAt = (new Date(data.user.premiumPaidTime)).toLocaleDateString('en-US', {timeZone: 'UTC'});
      }
      this.isLoading = false;
    });
  }

  onDeleteAccount(): void {
    this.confirmedDelete++;

    if(this.confirmedDelete < 3) {
      return;
    }

    this.dataService.removeUser$().subscribe(
      () => {
        localStorage.clear();
        this.navigationService.navigate('/login');
        this.toastService.showToast("Your account has been successfully deleted.", FeedbackType.SUCCESS);
      }
    );
  }
}
