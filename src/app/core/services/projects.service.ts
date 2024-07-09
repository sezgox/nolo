import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../interfaces/Project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private proyectosSubject = new BehaviorSubject<Project[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  proyectos$ = this.proyectosSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  //apiRoute: string = 'https://7q8hd2bw-3002.uks1.devtunnels.ms/projects/';
  apiRoute: string = 'http://localhost:3002/projects/'

  constructor(private http: HttpClient) { }

  loadProyectos(): void {
    if (this.proyectosSubject.getValue().length == 0) {
      this.loadingSubject.next(true)
      this.getProjects().subscribe({
        next: (res) => {
          if (res.success) {
            this.proyectosSubject.next(res.data);
          }
          this.loadingSubject.next(false);
        },error: (err) => {
          console.log(err)
          this.loadingSubject.next(false)
          this.proyectosSubject.next([])
        }
      })
    }else{
      this.loadingSubject.next(false)
    }
  }

  getAllProjects(): Observable<Project[]> {
    return this.proyectos$;
  }

  getProjects():Observable<any>{
    return this.http.get(`${this.apiRoute}`);
  }

  getProjectByName(name:string):Observable<any>{
    return this.http.get(`${this.apiRoute}${name}`);
  }

  uploadProject(formDataProject: FormData):Observable<any>{
    return this.http.post(`${this.apiRoute}`,formDataProject);
  }

  updateProject(formDataProject: FormData):Observable<any>{
    return this.http.put(`${this.apiRoute}`,formDataProject)
  }

  removeProject(id: string):Observable<any>{
    return this.http.delete(`${this.apiRoute}${id}`)
  }

}
