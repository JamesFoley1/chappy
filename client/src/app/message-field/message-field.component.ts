import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { ChatService } from '../chat.service';
import { LocalStorageService } from '../../../node_modules/ngx-webstorage';


@Component({
  selector: 'app-message-field',
  templateUrl: './message-field.component.html',
  styleUrls: ['./message-field.component.css']
})
export class MessageFieldComponent implements OnInit {
  user = this.localStorage.retrieve('user');
  form_message: FormGroup;
  id = this.user._id;
  errors: any;
  message_list: any;
  userName = this.user.username;
  userAvatar = this.user.avatar;

  constructor(private _httpService: HttpService, private fb: FormBuilder, private chat: ChatService, private localStorage: LocalStorageService)
  {
    this._httpService.msgField = this;
    chat.messages.subscribe(msg => {
      // console.log('response from websocket server')
    })
  }

  private random_message = {
    author: 'elliot',
    message: 'howdy howdy howdy'
  }

  ngOnInit() {
    this.form_message = this.fb.group({
      U_id: this.id,
      content: '',
      T_id: this._httpService.sub_id,
      userName: this.userName,
      userAvatar: this.userAvatar
    });

    this.chat.messages.subscribe(msg => {
      this.random_message = msg;
    })

  }

  sendMessage(post){
    let messages = this._httpService.updateTextChannel(post);
    messages.subscribe(data => {
      if('errors' in data){
        console.log(data);
        this.errors = data;
      }
      else {
        this._httpService.getMessages();
        
        this.form_message = this.fb.group({
          U_id: this.id,
          content: '',
          T_id: this._httpService.sub_id,
          userName: this.userName,
          userAvatar: this.userAvatar
        });
      }
    })
    this.chat.sendMsg("testmsg");
  }


}
