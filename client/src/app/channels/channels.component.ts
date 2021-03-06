import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { SubChannelsComponent } from '../sub-channels/sub-channels.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LocalStorageService } from '../../../node_modules/ngx-webstorage';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  // Variables
  user = this.localStorage.retrieve('user');
  channel: any;
  abb_channel: Object[];
  new_id: any;
  newChannel: any;
  showCreate: Boolean;
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router, 
    private localStorage: LocalStorageService
  ) {}

  ngOnInit() {
    this.updateUser();
    this.user = this.localStorage.retrieve('user');
    this.newChannel = {
      U_id: this.user.id,
      channelName: ""
    };
  }

  // Adding channel group and running service method to update user info
  addChannel(){
    let new_channel = this._httpService.createChannel(this.newChannel);
    new_channel.subscribe(data => {
      console.log(data);
      this.new_id = data["_id"];
      this.ngOnInit();
    });
    this.hideCreateModal()
    this.newChannel = {
      U_id: this.user.id,
      channelName: ""
    };
  }

  showCreateModal() {
    this.showCreate = true;
  }
  hideCreateModal() {
    this.showCreate = false;
  }
  
  //update current user and local storage after a new channel is added
  //necessary for congruency across apps in this platform.
  updateUser(){
    let obs = this._httpService.getOneUser(this.user.id);
    obs.subscribe(data=> {
      this.user = {
          id: data["_id"],
          username: data["username"],
          email: data["email"],
          avatar: data["avatar"],
          status: data["status"],
          channels: data["channels"],
          dm_channels: data["dm_channels"],
          friendsList: data["friendsList"]
        };
        this.localStorage.store('user', this.user);
        this.AbbreviateChannels();
      })
  }

  // Make a list of abbreviated channel names for display
  AbbreviateChannels(){
    this.abb_channel = [];
    if (this.user.channels.length > 0){
      for (var x of this.user.channels){
        let channel = this._httpService.getOneChannel(x);
        channel.subscribe(data => {
          data["channelName"] = data["channelName"].match(/\b\w/g).join('');
          this.abb_channel.push(data);
        });
      }
    }
    return this.abb_channel;
  }

  // Set id in sub channel component
  getChannelId(id){
    this._httpService.showSub(id);
  }

  // Show a general channel named Chappy. Hard coded for visibility across all users.
  getMain(){
    this._httpService.showSub("5b5a13f1da275949507f8596");
  }


}
