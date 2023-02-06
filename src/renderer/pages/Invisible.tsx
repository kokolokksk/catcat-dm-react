import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import React from 'react';
import { MuaConfig } from 'renderer/@types/catcat';
import { catConfigItem, getNewSessionId } from 'renderer/components/CatCat';
import CatLog from 'renderer/utils/CatLog';
import '../styles/invisible.css';

type StateType = {
  muaConfig: MuaConfig;
};

class Invisible extends React.Component<any, StateType> {
  // eslint-disable-next-line global-require
  sdk = require('microsoft-cognitiveservices-speech-sdk');

  ttsOk = false;

  speakStatus = false;

  speechConfig!: {
    speechSynthesisLanguage: string;
    speechSynthesisVoiceName: string;
    speechRecognitionLanguage: string;
  };

  constructor(props: any) {
    super(props);
    const muaConfig: MuaConfig = {
      count: 0,
      roomid: 0,
      clientId: '',
      ttsDanmu: false,
      ttsGift: false,
      ttsKey: '',
      alwaysOnTop: false,
      catdb: false,
      dmTs: '',
      SESSDATA: '',
      csrf: '',
      v1: '',
      v2: '',
      fansDisplay: '',
      darkMode: false,
      proxyApi: false,
      sessionId: getNewSessionId(),
      started: true,
      wave: false,
      theme: 'light',
      real_roomid: 0,
      area_id: 102,
      parent_area_id: 2,
      danmuDir: '',
    };
    this.state = { muaConfig };
    CatLog.console(`muacofig加载完成`);
    CatLog.console(this.state);
  }

  async componentDidMount() {
    const { muaConfig } = this.state;
    const arr = catConfigItem.map((item) =>
      window.electron.store.get(item.name)
    );
    arr.map((item: any, index: number) => {
      CatLog.console(item);
      const k = catConfigItem[index].name as string;
      muaConfig[k] = item;

      return '';
    });
    const start = await this.load(muaConfig);
    if (start) {
      this.synthesizeToSpeaker('喵喵Start！');
      // do setup check!
      if (!muaConfig.roomid || muaConfig.roomid === 0) {
        this.synthesizeToSpeaker('请先设置房间号');
        this.sttFromMic();
      } else {
        const num = this.splitToDigit(muaConfig.roomid.toString());
        this.synthesizeToSpeaker(`房间号设置为: ${num.join(' ')}`);
        this.sttFromMic();
      }
    }
    CatLog.console('componentDidMount');
  }

  splitToDigit = (n: string) => [...`${n}`].map(Number);

  synthesizeToSpeaker = (text: string) => {
    const player = new this.sdk.SpeakerAudioDestination();
    player.onAudioEnd = function (s: unknown) {
      CatLog.console(s);
    };
    const synthesizer = new this.sdk.SpeechSynthesizer(
      this.speechConfig,
      this.sdk.AudioConfig.fromDefaultSpeakerOutput(player)
    );
    CatLog.console('come in ss');
    CatLog.console(synthesizer);
    try {
      synthesizer.speakTextAsync(
        text,
        (result: any) => {
          this.speakStatus = false;
          synthesizer.close();
          if (result) {
            console.log(JSON.stringify(result));
            this.speakStatus = false;
          }
          // synthesizer.close()
        },
        (error: any) => {
          console.log(error);
          this.speakStatus = false;
          synthesizer.close();
        }
      );
    } catch (e) {
      CatLog.console(e);
      this.speakStatus = false;
    }
  };

  sttFromMic = async () => {
    const audioConfig = this.sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new this.sdk.SpeechRecognizer(
      this.speechConfig,
      audioConfig
    );
    const s = await recognizer.recognizeOnceAsync(
      (result: { reason: ResultReason; text: any }) => {
        let displayText;
        if (result.reason === ResultReason.RecognizedSpeech) {
          displayText = `RECOGNIZED: Text=${result.text}`;
        } else {
          displayText =
            'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
        }
        CatLog.console(displayText);
      }
    );
    CatLog.console(s);
  };

  load = async (muaConfig: MuaConfig): Promise<any> => {
    CatLog.console('load muaconfig');
    CatLog.console(muaConfig);
    window.electron.ipcRenderer.sendMessage('setOnTop:setting', [
      muaConfig.alwaysOnTop,
    ]);
    // fixme : is already sync
    const res = await window.electron.store.get('ttsKey');
    if (res && res !== '') {
      this.speechConfig = this.sdk.SpeechConfig.fromSubscription(
        res,
        'eastasia'
      );
      this.speechConfig.speechSynthesisLanguage = 'zh-CN';
      this.speechConfig.speechRecognitionLanguage = 'zh-CN';
      this.speechConfig.speechSynthesisVoiceName = 'zh-CN-XiaoxiaoNeural';
      this.ttsOk = true;
    } else {
      this.ttsOk = false;
    }
    CatLog.console('init tts data');
    return this.ttsOk;
  };

  render() {
    return (
      <div>
        <img
          className="drag"
          alt="catcat"
          src="https://i0.hdslb.com/bfs/new_dyn/750c0c53bbee5e1d4f151b3ac7236bd21999280.png@120w_120h_1e_1c.webp"
        />
      </div>
    );
  }
}
export default Invisible;
