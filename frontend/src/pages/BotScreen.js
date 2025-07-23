import React, { useState, useEffect } from "react";
import EnergyBar from "../components/EnergyBar/EnergyBar";
import TabBar from "../components/TabBar/TabBar";
import CardGrid from "../components/CardGrid/CardGrid";
import "./BotScreen.css";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { setAllProgress, setProgress } from "../store/progressSlice";
import { setCardsLoading, setCardsError, setAllCards, updateCard } from "../store/cardsSlice";

const tabs = ["Tüm Seviyeler", "Sv1", "Sv2", "Max Sv"];

function BotScreen() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [energy, setEnergy] = useState({ current: 100, max: 390, percent: 100, timeLeft: "1:59" });
  const userId = "688145613ef9e2f0b072182c";
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
  }, [dispatch, userId]);

  const filteredCards = cards;

  const progressCard = (cardId) => {
    const card = cards.find(c => c.id === cardId);
    const isLevelUp = card && card.progress >= 100;
    
    const endpoint = isLevelUp ? 'level-up' : 'progress';
    
    axios.post(`${API_BASE_URL}/${endpoint}`, { userId, itemId: cardId })
      .then(res => {
        if (res.data.energy !== undefined) {
          setEnergy({
            current: res.data.energy,
            max: 100,
            percent: res.data.energy,
            timeLeft: "1:59"
          });
        }
      
        if (isLevelUp) {
          // Level up: update all card data including image, name, and description
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
        } else {
         
          if (typeof res.data.progress !== 'undefined') {
            dispatch(setProgress({ cardId, progress: res.data.progress }));
            dispatch(updateCard({ cardId, updates: { progress: res.data.progress } }));
          }
        }
      })
      .catch(err => {
        console.error(err);
      });
  };


  return (
    <div className="botscreen-bg responsive-container">
      <div className="inner-container">
      <EnergyBar {...energy} />
      <TabBar tabs={tabs} selected={selectedTab} onSelect={setSelectedTab} />
      <CardGrid 
        cards={filteredCards} 
        onCardAction={progressCard}
        getActionText={(card) => card.progress >= 100 ? "Geliştir" : "YÜKSELT"}
      />
      </div>
    </div>
  );
}

export default BotScreen; 