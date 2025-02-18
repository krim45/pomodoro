import axios from 'axios';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { UserContext } from '../../App';
import Timer from '../../components/desktop/Timer';
import TimerButton from '../../components/desktop/TimerButton';
import sound from '../../images/sound.svg';
import mute from '../../images/mute.svg';
import alarm from '../../images/alarm.mp3';
import Loading from '../../components/desktop/Loading';

const MainWrapper = styled.div`
  display: flex;
  position: relative;
  margin-top: ${(props) => (props.isMobile ? '14rem' : '8rem')};
  margin-bottom: 5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Player = styled.div`
  display: none;
`;

const MuteButton = styled.div`
  max-width: 1320px;
  width: 70%;
  display: flex;
  justify-content: end;

  button {
    background-color: none;
    border: none;
  }

  img {
    height: 4rem;
  }
`;

const PomodoroPage = ({ isMobile }) => {
  const POMODORO_TIME = 25 * 60;
  const BREAKE_TIME = 5 * 60;
  const NOTICE_TIME = 10;
  const CIRCLE_DASHARRAY = '0 283';
  const POMODORO_API = 'https://final.eax.kr/api/pomodoro';
  const music = JSON.parse(sessionStorage.getItem('musicList')) || [];

  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  const [player, setPlayer] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [alarmPlayer] = useState(new Audio(alarm));
  const [time, setTime] = useState(POMODORO_TIME);
  const [noticeTime, setNoticeTime] = useState(NOTICE_TIME);
  const [pomoCount, setPomoCount] = useState(0);
  const [start, setStart] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [timerDasharray, setTimerDasharray] = useState(CIRCLE_DASHARRAY);
  const [noticeDasharray, setNoticeDasharray] = useState(CIRCLE_DASHARRAY);
  const [startTimerInterval, setStartTimerInterval] = useState(null);
  const [noticeTimerInterval, setNoticeTimerInterval] = useState(null);

  const startTimerCleanup = useRef();
  const noticeTimerCleanup = useRef();

  useEffect(() => {
    if (startTimerInterval) {
      startTimerCleanup.current = startTimerInterval;
    }
  }, [startTimerInterval]);

  useEffect(() => {
    if (noticeTimerInterval) {
      noticeTimerCleanup.current = noticeTimerInterval;
    }
  }, [noticeTimerCleanup]);

  useEffect(() => {
    window.onYouTubeIframeAPIReady = () => {
      if (music.length > 0) {
        const newPlayer = new window.YT.Player('player', {
          width: '480',
          height: '270',
          videoId: music[0].music_url,
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });

        sessionStorage.setItem('musicIdx', 0);
        setPlayer(newPlayer);
      } else {
        setIsLoading(false);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      window.onYouTubeIframeAPIReady();
    }

    return () => {
      alarmPlayer.pause();
      clearInterval(startTimerCleanup.current);
      clearInterval(noticeTimerCleanup.current);
    };
  }, []);

  const onPlayerReady = (event) => {
    event.target.setPlaybackRate(1);
    event.target.setVolume(70);
    setIsLoading(false);
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      const idx =
        (JSON.parse(sessionStorage.getItem('musicIdx')) + 1) % music.length;
      sessionStorage.setItem('musicIdx', idx);
      event.target.loadVideoById(music[idx].music_url);
    }
  };

  const onPlayerPlay = () => {
    if (!player) return;
    player.setVolume(70);
    player.playVideo();
  };

  const onPlayerSetVolume = () => {
    if (!player) return;
    player.setVolume(20);
  };

  const onPlayerPause = () => {
    if (!player) return;
    player.pauseVideo();
  };

  const onPlayerMute = () => {
    if (!player) return;
    if (player.isMuted()) {
      player.unMute();
    } else {
      player.mute();
    }
    setIsMuted(!isMuted);
  };

  const clearTimer = () => {
    const breakTime = pomoCount === 3 ? BREAKE_TIME * 3 : BREAKE_TIME;

    setStart(false);
    setTime(breakTime);
    setIsVisible(false);
    setTimerDasharray(CIRCLE_DASHARRAY);
  };

  const clearNotice = () => {
    setIsVisible(true);
    setNoticeTime(NOTICE_TIME);
    setNoticeDasharray(CIRCLE_DASHARRAY);
  };

  const startTimer = () => {
    if (!player && music.length !== 0) {
      setIsLoading(true);
      return;
    }

    let timerInterval = null;
    let timePassed = 0;
    let timeLeft = time;
    setStart(true);
    setShowExit(true);
    setShowButton(false);
    sendPomodoroBeginning();
    onPlayerPlay();

    timerInterval = setInterval(() => {
      timePassed += 1;
      timeLeft = time - timePassed;

      if (timeLeft === -1) {
        clearInterval(timerInterval);
        setShowExit(false);
        onPlayerSetVolume();
        clearTimer();
        noticeBreakTime();
        return;
      }

      setTime(timeLeft);
      setTimerDasharray(`${((timePassed / time) * 283).toFixed(0)} 283`);
    }, 1000);

    setStartTimerInterval(timerInterval);
  };

  const noticeBreakTime = () => {
    let timerInterval = null;
    let timePassed = 0;
    let timeLeft = noticeTime;
    alarmPlayer.currentTime = 0;
    alarmPlayer.play();

    timerInterval = setInterval(() => {
      timePassed += 1;
      timeLeft = noticeTime - timePassed;

      if (timeLeft === -1) {
        clearInterval(timerInterval);
        alarmPlayer.pause();
        clearNotice();
        onPlayerPause();
        setShowButton(true);
        setTime(POMODORO_TIME);
        setStart(false);
        return;
      }

      setNoticeTime(timeLeft);
      setNoticeDasharray(`${((timePassed / noticeTime) * 283).toFixed(0)} 283`);
    }, 1000);

    setNoticeTimerInterval(timerInterval);
  };

  const startBreakTimer = () => {
    let timerInterval = null;
    let timePassed = 0;
    let timeLeft = time;
    alarmPlayer.pause();
    setStart(true);
    onPlayerPlay();
    clearNotice();
    setPomoCount(pomoCount + 1);
    clearInterval(noticeTimerInterval);
    sendPomodoroEndding();

    timerInterval = setInterval(() => {
      timePassed += 1;
      timeLeft = time - timePassed;

      if (timeLeft === -1) {
        if (pomoCount === 3) setPomoCount(0);
        setTime(POMODORO_TIME);
        setStart(false);
        setIsVisible(true);
        setShowButton(true);
        onPlayerPause();
        setTimerDasharray(CIRCLE_DASHARRAY);
        clearInterval(timerInterval);
        return;
      }

      setTime(timeLeft);
      setTimerDasharray(`${((timePassed / time) * 283).toFixed(0)} 283`);
    }, 1000);
  };

  const exitPomodoro = () => {
    navigate('/music');
  };

  const sendPomodoroBeginning = () => {
    if (userInfo) {
      const token = localStorage.getItem('Token');
      const headers = {
        authorization: `Bearer ${token}`,
      };

      axios.post(POMODORO_API, {}, { headers }).catch((err) => {
        console.log(err);
      });
    }
  };

  const sendPomodoroEndding = () => {
    if (userInfo) {
      const token = localStorage.getItem('Token');
      const headers = {
        authorization: `Bearer ${token}`,
      };

      axios.patch(POMODORO_API, {}, { headers }).catch((err) => {
        console.log(err);
      });
    }
  };

  return (
    <MainWrapper isMobile={isMobile}>
      <Player id="player"></Player>
      {isLoading ? <Loading /> : null}
      <MuteButton>
        <button onClick={onPlayerMute}>
          {isMuted ? (
            <img src={mute} alt="sound icon"></img>
          ) : (
            <img src={sound} alt="sound icon"></img>
          )}
        </button>
      </MuteButton>
      <Timer
        time={time}
        start={start}
        isVisible={isVisible}
        timerDasharray={timerDasharray}
        noticeDasharray={noticeDasharray}
        pomoCount={pomoCount}
        noticeTime={noticeTime}
        startBreakTimer={startBreakTimer}
        isMobile={isMobile}
      />

      <TimerButton
        showExit={showExit}
        showButton={showButton}
        timerDasharray={timerDasharray}
        startTimer={startTimer}
        exitPomodoro={exitPomodoro}
        isMobile={isMobile}
      />
    </MainWrapper>
  );
};

export default PomodoroPage;
