import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  constructor() { }

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
    return fetch('https://developer.expert.ai/oauth2/token', requestOptions);
  }

  callEndpoint(endpoint: string, txt: string, token: string) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({ document: { text: txt } });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    return fetch('https://nlapi.expert.ai/' + endpoint, requestOptions);
  }

  analyzeFull(txt: string, token: string) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({ document: { text: txt } });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    return fetch('https://nlapi.expert.ai/v2/analyze/standard/en/disambiguation', requestOptions);
  }

  analyzeDisambiguation(txt: string, token: string) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({ document: { text: txt } });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    return fetch('https://nlapi.expert.ai/v2/analyze/standard/en/disambiguation', requestOptions);
  }
}
