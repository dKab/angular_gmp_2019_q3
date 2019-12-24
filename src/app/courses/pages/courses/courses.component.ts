import { Component, OnInit, OnChanges } from '@angular/core';
import { ICourse } from '../../models/course';
import { FilterPipe } from 'src/app/ui/pipes/filter.pipe';
import { CoursesService } from '../../services/courses.service';
import {Observable, Subject} from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap, filter, startWith, switchMapTo
} from 'rxjs/operators';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  public courses$: Observable<ICourse[]>;
  public lastCourseCount = 4; number;
  // private searchTerms = new Subject<string>();

  constructor(private filterPipe: FilterPipe,
              private courseService: CoursesService,
  ) { }

  ngOnInit() {
    this.courses$ = this.courseService.getCourses(this.lastCourseCount)
    //   .pipe(
    //   switchMap(
    //     () => this.searchTerms.pipe(
    //       startWith(''),
    //       debounceTime(300),
    //       distinctUntilChanged(),
    //       switchMap((text: string) => this.courseService.searchCourses(text))
    //     )
    //   )
    // )
      ;
  }

  public onDeleteHandler(id: number) {
    this.courseService.deleteCourseById(id).subscribe(
      () => this.courses$ = this.courseService.getCourses(),
      (error) => console.log(error)
    );
  }

  public onSearchHandler(term: string): void {
     // this.searchTerms.next(term);
    this.courses$ = this.courseService.getCourses(this.lastCourseCount, term);
  }

  public onLoadMoreHandler() {
    this.lastCourseCount += 3;
    this.courses$ = this.courseService.getCourses(this.lastCourseCount);
  }

}
