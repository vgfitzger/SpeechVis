/**
 * Tool to display speech recog data
 */

import React, { Component } from 'react'
import {render} from 'react-dom';
import ReactAudioPlayer from 'react-audio-player';
import axios from 'axios'

//Container class for subtitles and ReactAudioPlayer
class SpeechPlayer extends ReactAudioPlayer {
    constructor(props) {
        super(props);
        this.state = {
            seek: 0,
            playing:false
        }
    }
    onPlay(e){
        speechPlayer.setState({ seek: e.target.currentTime, audio: document.getElementById('audioplayer'),playing:true });
        setTimeout(speechPlayer.updateCurrentDuration,10)
        speechPlayer.interval = setInterval(speechPlayer.updateCurrentDuration, 20);
    }
    onPause(e){
        speechPlayer.setState({ playing:false });
        clearInterval( speechPlayer.interval )
    }
    updateCurrentDuration(){
        speechPlayer.setState( { seek: speechPlayer.state.audio.currentTime })
    }
    render() {
        const incompatibilityMessage = this.props.children || (
                <p>Your browser does not support the <code>audio</code> element.</p>
            );

        return (
            <div>
            <audio
                id="audioplayer"
                className="react-audio-player"
                src={this.props.src}
                autoPlay={this.props.autoPlay}
                preload={this.props.preload}
                controls
                ref={(ref) => this.audioEl = ref}
                onPlay={this.onPlay}
                onPause={this.onPause}
            >
                {incompatibilityMessage}
            </audio>
            <Subtitles time={this.state.seek} playing={this.state.playing} />
            </div>
        );

    }
}


//Component to display the transcript
class Subtitles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            words: [],
        }
    }
    componentDidMount() {
        var _this = this;
        //pull in the data from a remote url since the file// protocol fails
        this.serverRequest =
            axios
                .get("https://s3.amazonaws.com/stuffstrfonts/17_32_05.txt")
                .then(function(result) {
                    _this.setState({
                        words: _this.parseFileData(result.data)
                    });
                })
    }
    componentWillUnmount() {
        this.serverRequest.abort();
    }
    //render the transcript with the highlighted word in yellow
    render() {
        //help delay
        var time = this.props.time+0.05;
        var playing = this.props.playing
        return (
            <div>
                {this.state.words.map(function(word,index,array) {
                    var className = "";
                    //check to see if this is the newest word by checking the next one
                    if( word.start <= time && playing ){
                        if( typeof array[index+1] == 'undefined' ){
                            className = "reading";
                        }else if( array[index+1].start > time ){
                            className = "reading";
                        }
                    }
                        return (
                            <span key={word.word+word.start} className={className}>
                                {word.word+" "}
                            </span>
                        );

                })}
            </div>
        )
    }
    //explode and parse the transcript file
    parseFileData(data){
        var dataArray = data.split("\n")
        var result = [];
        for( var i in dataArray ){
            var wordArray = dataArray[i].split(' ')
            if( wordArray.length == 3 ){
                var word = { word : wordArray[2], start: parseFloat(wordArray[0]), duration: parseFloat( wordArray[1] ) }
                result.push(word);
            }
        }
        return result;
    }
}



//Need to store a ref to this can access in the events otherwise.
var speechPlayer = render( <SpeechPlayer
        src="assets/17_32_05.m4a"
    />, document.getElementById('player'));

