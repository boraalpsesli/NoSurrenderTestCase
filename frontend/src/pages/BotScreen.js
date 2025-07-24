import React, { useState, useEffect } from "react";
import EnergyBar from "../components/EnergyBar/EnergyBar";
import TabBar from "../components/TabBar/TabBar";
import CardGrid from "../components/CardGrid/CardGrid";
import ClickCounter from "../components/ClickCounter/ClickCounter";
import "./BotScreen.css";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { setAllProgress, setProgress } from "../store/progressSlice";
import { setCardsLoading, setCardsError, setAllCards, updateCard } from "../store/cardsSlice";
import Toast from '../components/Toast/Toast';

const tabs = ["Tüm Seviyeler", "Sv1", "Sv2", "Max Sv"];

function calculateTimeLeft(lastEnergyUpdate, currentEnergy) {
  if (currentEnergy >= 100) return "Full";
  if (!lastEnergyUpdate) return "--:--";
  const last = new Date(lastEnergyUpdate).getTime();
  if (isNaN(last)) return "--:--";
  const regenInterval = 2 * 60 * 1000; // 2 minutes in ms
  const now = Date.now();
  const next = last + regenInterval;
  const msLeft = Math.max(next - now, 0);
  const min = Math.floor(msLeft / 60000);
  const sec = Math.floor((msLeft % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
 
}

function BotScreen({ user, onLogout }) {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [energy, setEnergy] = useState({ current: 0, max: 100, percent: 0, timeLeft: "1:59", lastEnergyUpdate: null });
  const [toastMessage, setToastMessage] = useState("");
  const [clickCount, setClickCount] = useState(1);
  const userId = user?.id || localStorage.getItem('userId');
  const dispatch = useDispatch();
  const progressById = useSelector(state => state.progress.byId);
  const cardsState = useSelector(state => state.cards);
  const cards = cardsState.allIds.map(id => cardsState.byId[id]);

  useEffect(() => {
    dispatch(setCardsLoading(true));
    axios.get(`${API_BASE_URL}/user-items/${userId}`)
      .then(res => {
        const cards = res.data.map(item => ({
          ...item,
          id: item._id,
        }));
        dispatch(setAllCards(cards));
       
        const progressMap = {};
        cards.forEach(card => {
          progressMap[card.id] = card.progress;
        });
        dispatch(setAllProgress(progressMap));
      })
      .catch(err => {
        console.error(err);
        dispatch(setCardsError(err.message));
      });

    fetchEnergy();
    const interval = setInterval(fetchEnergy, 2 * 60 * 1000);
    return () => clearInterval(interval);
    function fetchEnergy() {
      axios.get(`${API_BASE_URL}/energy/${userId}`)
        .then(res => {
          console.log(res.data);
          const { energy, lastEnergyUpdate } = res.data;
          setEnergy({
            current: energy,
            max: 100,
            percent: (energy / 100) * 100,
            timeLeft: calculateTimeLeft(lastEnergyUpdate, energy),
            lastEnergyUpdate
          });
          console.log(energy.timeLeft);
        })
       
        .catch(err => {
          console.error(err);
        });
    }
  }, [dispatch, userId]);

  const { lastEnergyUpdate, current } = energy;

  useEffect(() => {
    if (!lastEnergyUpdate) return;
    if (current >= 100) return;
    let fetched = false;
    const timer = setInterval(() => {
      setEnergy(prev => {
        if (!prev.lastEnergyUpdate || prev.current >= 100) return prev;
        const timeLeft = calculateTimeLeft(prev.lastEnergyUpdate, prev.current);
        if (timeLeft === "0:00" && !fetched) {
          fetched = true;
          const optimisticCurrent = Math.min(prev.current + 1, prev.max);
          setEnergy({
            ...prev,
            current: optimisticCurrent,
            percent: (optimisticCurrent / prev.max) * 100,
            timeLeft: "2:00" 
          });

          
          axios.get(`${API_BASE_URL}/energy/${userId}`)
            .then(res => {
              const { energy, lastEnergyUpdate } = res.data;
              setEnergy({
                current: energy,
                max: 100,
                percent: (energy / 100) * 100,
                timeLeft: calculateTimeLeft(lastEnergyUpdate, energy),
                lastEnergyUpdate
              });
            })
            .catch(err => {
              console.error(err);
            });
        }
        return { ...prev, timeLeft };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lastEnergyUpdate, current, userId]);

  let filteredCards = cards;
  if (selectedTab === "Sv1") {
    filteredCards = cards.filter(card => card.level === 1);
  } else if (selectedTab === "Sv2") {
    filteredCards = cards.filter(card => card.level === 2);
  } else if (selectedTab === "Max Sv") {
    filteredCards = cards.filter(card => card.level === 3);
  }

   const progressCard = (cardId) => {
    const card = cards.find(c => c.id === cardId);
    const isLevelUp = card && card.progress >= 100;
    
    if (isLevelUp) {
      axios.post(`${API_BASE_URL}/level-up`, { userId, itemId: cardId })
        .then(res => {
          if (res.data.energy !== undefined) {
            setEnergy(prev => ({
              ...prev,
              current: res.data.energy,
              percent: (res.data.energy / 100) * 100,
              timeLeft: calculateTimeLeft(prev.lastEnergyUpdate, res.data.energy),
            }));
          }
        
          dispatch(setProgress({ cardId, progress: res.data.progress }));
          dispatch(updateCard({ 
            cardId, 
            updates: { 
              level: res.data.level,
              progress: res.data.progress,
              name: res.data.name,
              description: res.data.description,
              image: res.data.image
            } 
          }));
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.error) {
            setToastMessage(err.response.data.error);
          } else {
            setToastMessage('Bir hata oluştu.');
            console.error(err);
          }
        });
      return;
    }
    
    const endpoint = clickCount > 1 ? 'progress/bulk' : 'progress';
    const payload = clickCount > 1 
      ? { userId, itemId: cardId, clicks: clickCount }
      : { userId, itemId: cardId };
    
    axios.post(`${API_BASE_URL}/${endpoint}`, payload)
      .then(res => {
        if (res.data.energy !== undefined) {
          setEnergy(prev => ({
            ...prev,
            current: res.data.energy,
            percent: (res.data.energy / 100) * 100,
            timeLeft: calculateTimeLeft(prev.lastEnergyUpdate, res.data.energy),
          }));
        }
      
        if (typeof res.data.progress !== 'undefined') {
          dispatch(setProgress({ cardId, progress: res.data.progress }));
          dispatch(updateCard({ cardId, updates: { progress: res.data.progress } }));
        }
        
        if (clickCount > 1) {
          if (res.data.warning) {
            setToastMessage(res.data.warning);
          } else {
            const processed = res.data.clicksProcessed || clickCount;
            const progressGain = res.data.progressIncreased || processed * 2;
            setToastMessage(`${processed} kez geliştirildi! +${progressGain}% ilerleme`);
          }
        }
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.error) {
          setToastMessage(err.response.data.error);
        } else {
          setToastMessage('Bir hata oluştu.');
          console.error(err);
        }
      });
  };


  return (
    <div className="botscreen-bg responsive-container">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      <div className="inner-container">
        
      <div className="user-header">
        <div className="user-info">
          <div className="username">Hoş geldin, {user?.username || 'Oyuncu'}!</div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Çıkış Yap
        </button>
      </div>
      
      <EnergyBar
        {...energy}
        
        timeLeft={energy.timeLeft}
        current={energy.current}
        percent={energy.percent}
        className="energy-bar"
      />
      <TabBar tabs={tabs} selected={selectedTab} onSelect={setSelectedTab} />
      <ClickCounter 
        clickCount={clickCount}
        setClickCount={setClickCount}
        maxClicks={Math.min(50, energy.current || 0)}
      />
      <CardGrid 
        cards={filteredCards} 
        onCardAction={progressCard}
        getActionText={(card) => card.progress >= 100 ? "Yükselt" : "Geliştir"}
        energy={energy.current}
      />
      </div>
    </div>
  );
}

export default BotScreen; 