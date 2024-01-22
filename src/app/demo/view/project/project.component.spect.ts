import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProjectComponent } from "./project.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { TabViewModule } from "primeng/tabview";
import { MultiSelectModule } from "primeng/multiselect";
import { ToastModule } from "primeng/toast";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { MasterTableService } from "src/app/services/master-table.service";
import { AppBreadcrumbService } from "src/app/app.breadcrumb.service";
// import { ProjectsService } from "src/app/services/project-serivce/projects.service";
import { MessageService } from "primeng/api";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { MasterDataService } from "src/app/services/master-dataserivce/master-data.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ProjectsService } from "src/app/services/project-serivce/projects.service";
import { By } from "@angular/platform-browser";

describe('ProjectComponent',()=>{
    let component: ProjectComponent; // Replace 'ProjectComponent' with the actual name of your component
    let fixture: ComponentFixture<ProjectComponent>; // Replace 'ProjectComponent' with the actual name of your component
    let fb: FormBuilder;
    // let mtest: MasterTableService;  let projectService: ProjectService;
  let httpTestingController: HttpTestingController;




    beforeEach(async () => {
        await TestBed.configureTestingModule({
          declarations: [ProjectComponent], // Replace 'CreateProjectComponent' with the actual name of your component
          imports: [ReactiveFormsModule, 
                    TabViewModule,
                    ToastModule,
                    DropdownModule,
                    MultiSelectModule,
                    CalendarModule,
                    HttpClientTestingModule,
                    HttpClient,
                    HttpClientModule
                  ],
          providers:[
            {
              provide: ProjectsService,
              useClass: ProjectsService
            },  
            {
                provide: MasterDataService,
                useClass: MockMasterTableService
              },
            AppBreadcrumbService,
            MessageService,
            {
              provide: HttpClient,
              useClass: MockHttpClient
            }
          ]
        }).compileComponents();


      });


  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent); // Replace 'CreateProjectComponent' with the actual name of your component
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should call ngOnit',()=>{
    expect(component).toBeTruthy()
  })

  it("should render table", () => {
    const result = fixture.debugElement.queryAll(By.css(".testtable"));
    const markup = result[0].nativeNode.outerHTML;
    console.log(markup);
  });

});
export class MockHttpClient {
    get() {}
    post() {}
  }
  //function Observalbe call test with ngOnIit .
  export class MockMasterTableService {
    fetchAllProjectDetails(): Observable<any> {
      return of({})
    }
    getCompany(): Observable<any> {
      return of({})
    }
    getDataFromFilter(): Observable<any> {
      return of({})
    }
  }