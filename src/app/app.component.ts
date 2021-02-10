import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'expert-ai-vis';

  constructor() {
    this.req0();

  }
  req0() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer eyJraWQiOiI1RDVOdFM1UHJBajVlSlVOK1RraXVEZE15WWVMMFJQZ3RaUDJGTlhESHpzPSIsImFsZyI6IlJTMjU2In0.eyJjdXN0b206Y291bnRyeSI6IlRSIiwic3ViIjoiY2RjNjFkOWMtODgzZS00ZGVhLTlkNmYtZjNjMmJhZmNhNjNhIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImN1c3RvbTpwZXJzb25hbGl6YXRpb25BdXRoIjoiMSIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTEuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0xX0FVSGdRMDhDQiIsImNvZ25pdG86dXNlcm5hbWUiOiJjZGM2MWQ5Yy04ODNlLTRkZWEtOWQ2Zi1mM2MyYmFmY2E2M2EiLCJjdXN0b206Y29tcGFueSI6IkNhbmJheiBDby4iLCJhdWQiOiI1a2g5YzBtb2NuajkyM3FkY2pzazM3OHN2aCIsImV2ZW50X2lkIjoiZTllZGY4ZTEtMTcwYy00OGM4LWFjYTctOGNlYjE4NmI0MWQyIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MTI5ODI1OTAsIm5hbWUiOiJ5dXN1ZiIsImV4cCI6MTYxMzA2ODk5MCwiaWF0IjoxNjEyOTgyNTkwLCJmYW1pbHlfbmFtZSI6ImNhbmJheiIsImVtYWlsIjoieXVzdWZzYWlkY2FuYmF6QGdtYWlsLmNvbSIsImN1c3RvbTptYXJrZXRpbmdBdXRoIjoiMSJ9.QXXGCqw1MaMx8To4ADKGg7IHf7jvDukRFddhUmizDwOyoLTs-DZu49n_r8XmVxUviQXyT5QnwHM4bVxtBvOTc0zhMZCbZVimwoFSCEUYz6xbHQO8llXhDLAD7pa7PsRjqDR5lT_4JkYlQlv_jOJzY9Y1X0s7PwVE2Yt-FKIXmJwZLt-WY1YwrSkrHyyu74Xlx3iTq55GRjpg4qEoiUAVt2vfVRkefu26N_2OG90Z-XYBHHz9xCO-uuX1zeTHqtesIcOJcub-raLeA9caDqMgeG4IWELWdDXeGo75KIUKrg1GcF0C_lfPkMsfMWwZbVDuVrKpfbumRYOCRXQaQcT_Ew");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "document": { "text": "Michael Jordan was one of the best basketball players of all time. Scoring was Jordan's stand-out skill, but he still holds a defensive NBA record, with eight steals in a half." } });

    var requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://nlapi.expert.ai/v2/analyze/standard/en", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }
}
