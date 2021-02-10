import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  constructor() { }

  private _token = '';

  private _errLogger = (err: any) => { console.log('err: ', err); }

  token(username: string, password: string) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({ 'username': username, 'password': password });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    return fetch('https://developer.expert.ai/oauth2/token', requestOptions)
      .then(response => response.text())
      .then((result) => {
        this._token = result;
      }, this._errLogger)
      .catch(this._errLogger);
  }

  analyzeFull(txt: string) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + this._token);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({ document: { text: txt } });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    return fetch('https://nlapi.expert.ai/v2/analyze/standard/en', requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(this._errLogger);
  }

  analyzeDisambiguation(txt: string) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + this._token);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({ document: { text: txt } });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    return fetch('https://nlapi.expert.ai/v2/analyze/standard/en/disambiguation', requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(this._errLogger);
  }
}
