import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Project } from 'src/app/core/interfaces/Project';
import { ProjectsService } from 'src/app/core/services/projects.service';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent implements OnInit{

  selectedFiles: any[] = [];
  
  base64Image: string | ArrayBuffer | null = '';
  project: Project = {
    id: '',
    title : '',
    description : '',
    genre: '',
    media : {
      mediaPath: '',
      images: []
    },
    responsabilities: [],
    skills: [],
    links: [],
    date: ''
  }

  roles: boolean = true;
  roleType: 'responsabilities' | 'skills' = 'responsabilities';
  
  projectsService = inject(ProjectsService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  
  ngOnInit(): void {
    let projectName;
    this.route.paramMap.subscribe({
      next: (param) => {
        projectName = param.get('project');
        const encodedParam = encodeURIComponent(projectName ?? '');
        this.getProject(encodedParam);
      }
    })
  }

  getProject(projectName: string){
    console.log(projectName)
    this.projectsService.getProjectByName(projectName).subscribe({
      next: (result) => {
        if(result.success){
          this.project = result.data
          this.roleType = this.project.responsabilities.length > 0 ? 'responsabilities' : 'skills';
        }
      }
    })
  }
  
  updateProject(){
    this.project.skills = this.project.skills.filter(skill => skill)
    this.project.responsabilities = this.project.responsabilities.filter(resp => resp)
    this.project.links = this.project.links.filter(link => link.name && link.url)
    console.log(this.project.links)
    if(!this.selectedFiles || !this.project.title || !this.project.description || !this.project.genre || this.project.links.length == 0 || this.project[this.roleType].length == 0 || !this.project.date){
      console.log('Rellena todos los campos!!')
    }else{
      this.selectedFiles = this.selectedFiles.filter(file => typeof file != 'string')
      const formData = new FormData();
      formData.append('project',JSON.stringify(this.project));
      this.selectedFiles.forEach(file => {
        formData.append('media',file);
      });
      this.projectsService.updateProject(formData).subscribe({
        next: (result) => {
          if(!result.success){
            console.log(result.data)
          }else{
            console.log(result.data)
            this.router.navigate(['/admin/backoffice']);
          }
        },error: (err) => {
          console.log(err)
        }
      })
    }
  }
  
  removeImage(index: number){
    this.selectedFiles = this.selectedFiles.filter(file => file != this.project.media.images[index])
    this.project.media.images.splice(index,1);
    console.log(this.project.media.images)
  }

  onFileSelected(event: any) {
    const file:File = event.target.files[0];
    this.project.media.images.push(file.name);
    this.selectedFiles.push(file);
  }
  addField(field: string){
    if(field == 'responsabilities' || field == 'skills'){
      this.project[field].push('');
    }
    if(field == 'links'){
      this.project[field].push({name: '',url: ''});
    }
  }

  removeField(field:string,index:number){
    if(field == 'links' || field == 'responsabilities' || field == 'skills'){
      this.project[field].splice(index,1);
    }
  }

  toggleRoles(){
    this.roles = !this.roles
    this.roleType = this.roles == true ? 'responsabilities' : 'skills'
  }

}
