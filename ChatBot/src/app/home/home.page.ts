import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { timeout } from 'rxjs';
import { Messages } from '../models/message.model';
import { OpenaiService } from '../services/openai.service';
import { CustomValidator } from '../utils/custom-validators';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonContent, {static: false}) content!: IonContent;
  messages: Messages[] = [];


  form = new FormGroup({
    promt: new FormControl('', [Validators.required, CustomValidator.noWhiteSpace])
  })


  loading: boolean = false;


  constructor(
    private openAI: OpenaiService
  ) {}

  submit(){

    if(this.form.valid){
      let promt = this.form.value.promt as string;


    // Mensaje del Usuario
    let useMsg: Messages = { sender: 'me', content: promt}
    this.messages.push(useMsg);

    // Mensaje del Bot
    let botMsg: Messages = { sender: 'bot', content: ''}
    this.messages.push(botMsg);

    this.scrollToBottom();
    this.form.reset();
    this.form.disable();

    this.loading = true;

    this.openAI.sendQuestion(promt).subscribe({
      next: (res: any) => {
        console.log(res);
        this.loading = false;
        this.typeText(res.bot)
        this.form.enable();
      }, error: (error:any) => {
        console.log(error);
      }
      
    })

   /*  setTimeout(() => {
      this.loading = false;
      this.typeText('Hola')
      this.form.enable();
    }, 2000); */

    }
    

  }

  typeText(text: string){

    let textIndex = 0;
    let messagesLastIndex = this.messages.length - 1;

    let interval = setInterval(() => {

      if(textIndex < text.length){
        this.messages[messagesLastIndex].content += text.charAt(textIndex);
        textIndex++;
      } else {
        clearInterval(interval);
        this.scrollToBottom();
      }

    }, 15)

  }
  scrollToBottom(){
    this.content.scrollToBottom(2000);
  }
}