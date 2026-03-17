import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Fund } from '../../shared/models/fund.model'

@Injectable({ providedIn: 'root' })
export class FundsService {

    private api = 'http://localhost:3000/funds'

    constructor(private http: HttpClient) { }

    getFunds(): Observable<Fund[]> {
        return this.http.get<Fund[]>(this.api)
    }
}