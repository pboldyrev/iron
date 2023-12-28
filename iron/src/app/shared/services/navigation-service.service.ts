import { Injectable } from "@angular/core";
import { ActivatedRoute, Router, RoutesRecognized } from "@angular/router";
import { filter, map, pairwise } from "rxjs";
import { ROOT_URL } from "../constants/constants";
import { Location } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  private previousUrl?: string;

  constructor(
    private readonly router: Router,
    private readonly location: Location,
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof RoutesRecognized),
        map((event) => event as RoutesRecognized),
        pairwise()
      )
      .subscribe((events: [RoutesRecognized, RoutesRecognized]) => {
        this.previousUrl = events[0].urlAfterRedirects;
      });
  }

  public back(): void {
    if (this.previousUrl !== undefined) {
      this.location.back();
    } else {
      this.router.navigate([ROOT_URL], { replaceUrl: true });
    }
  }

  public navigate(route: string): void {
    this.router.navigate([route]);
  }

  public getUrlParam(route: ActivatedRoute, param: string): string {
    return route.snapshot.paramMap.get(param) ?? '';
  }
}