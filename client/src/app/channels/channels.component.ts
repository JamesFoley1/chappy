import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { SubChannelsComponent } from '../sub-channels/sub-channels.component';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  user = this._httpService.user;
  channel: any;
  abb_channel: Object[];

  constructor(private _httpService: HttpService, private _route: Router, private _router: ActivatedRoute) {}

  ngOnInit() {
    this.updateUser();
    this.user = this._httpService.user;
  }

  // Adding channel group and running service method to update user info
  addChannel(){
    let genericData = {
      U_id: this._httpService.user.id,
      channelName: 'New Channel',
    }
    let new_channel = this._httpService.createChannel(genericData);
    new_channel.subscribe(data => {
      this.ngOnInit();
    });
    
  }
  
  updateUser(){
    let obs = this._httpService.getOneUser(this._httpService.user.id);
    obs.subscribe(data=>{
      this._httpService.user = {
          id: data["_id"],
          username: data["username"],
          email: data["email"],
          avatar: data["avatar"],
          status: data["status"],
          channels: data["channels"],
          dm_channels: data["dm_channels"],
          friendsList: data["friendsList"]
        };
        this.AbbreviateChannels();
    })
  }

  // Make a list of abbreviated channel names for display
  AbbreviateChannels(){
    this.abb_channel = [];
    for (var x of this._httpService.user.channels){
      this.abb_channel.push(
        {
          name: x["channelName"].match(/\b\w/g).join(''),
          id: x._id
        }
      );
    }
    return this.abb_channel;
  }

  // Set id in sub channel component
  getChannelId(id){
    this._httpService.channel_id = id;
    console.log(id);
  }


}
