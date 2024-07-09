import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/core/interfaces/Project';
import { ProjectsService } from 'src/app/core/services/projects.service';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-project',
  standalone: true,
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  imports: [NavbarComponent,FooterComponent]
})
export class ProjectComponent implements OnInit, AfterViewInit{

  @ViewChildren('visual') images!: QueryList<ElementRef>

  projectsService = inject(ProjectsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  project: Project = {
    id: undefined,
    title: 'OnTime!',
    genre: '',
    description: '',
    media: {
      mediaPath: '',
      images: []
    },
    responsabilities: [],
    skills: [],
    links: [],
    date: ''
  }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.project = history.state.proyecto;
    if (!this.project) {
      let projectName: any;
      this.route.paramMap.subscribe({
        next: (param) => {
          projectName = param.get('project');
          const encodedParam = encodeURIComponent(projectName);
          this.getProject(encodedParam);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.images.forEach((image: ElementRef) => {
      const imgElement = image.nativeElement as HTMLImageElement;

      imgElement.onload = () => {
        if(imgElement.naturalWidth > imgElement.naturalHeight){
        
          image.nativeElement.style.aspectRatio = '16/9';
          image.nativeElement.style.gridRow = 'span 1';
        }else{
          console.log(imgElement.naturalHeight)
          image.nativeElement.style.aspectRatio = '9/16';
          image.nativeElement.style.gridRow = 'span 3';
        }
      }
/*       if(image.nativeElement.offsetWidth > image.nativeElement.offsetHeight){
        image.nativeElement.style.aspectRatio = '16/9';
      }else{
        image.nativeElement.style.aspectRatio = '9/16';
        image.nativeElement.style.gridRow = 'span 2';
      } */
    })

  }

  getProject(projectName: string){
    this.projectsService.getProjectByName(projectName).subscribe({
      next: (result) => {
        if(result.success){
          this.project = result.data
          this.project.description = this.project.description.replace(/\n/g, "<br>");
        }
      }
    })
  }

}
