import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import { GameState, GameAction, DMResponse } from '../types';

interface GameContextProps {
  gameState: GameState | null;
  dispatch: Dispatch<GameAction>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

const gameReducer = (state: GameState | null, action: GameAction): GameState | null => {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return action.payload;
    case 'APPEND_STORY':
      if (!state) return null;
      const { playerAction, dmResponse } = action.payload;
      
      const newStoryLog = playerAction ? [...state.storyLog, `> ${playerAction}`, dmResponse.storyText] : [...state.storyLog, dmResponse.storyText];

      let newCharacter = { ...state.character };
      if (dmResponse.characterUpdate) {
        newCharacter = { ...newCharacter, ...dmResponse.characterUpdate };
      }
      
      if (dmResponse.loot && dmResponse.loot.length > 0) {
        const updatedInventory = [...newCharacter.inventory];
        dmResponse.loot.forEach(lootItem => {
          const existingItem = updatedInventory.find(i => i.name === lootItem.name);
          if (existingItem) {
            existingItem.quantity += lootItem.quantity;
          } else {
            updatedInventory.push(lootItem);
          }
        });
        newCharacter.inventory = updatedInventory;
      }
      
      let newParty = state.party;
      if (dmResponse.newPartyMembers && dmResponse.newPartyMembers.length > 0) {
        newParty = [...newParty, ...dmResponse.newPartyMembers];
      }
      if (dmResponse.partyUpdate) {
        newParty = newParty.map(ally => {
          const update = dmResponse.partyUpdate?.find(u => u.name === ally.name);
          return update ? { ...ally, hp: update.hp, maxHp: update.maxHp } : ally;
        });
      }

      let newEnemy = state.enemy;
      if (dmResponse.newEnemy) newEnemy = dmResponse.newEnemy;
      else if (dmResponse.removeEnemy) newEnemy = null;
      
      return {
        ...state,
        character: newCharacter,
        party: newParty,
        enemy: newEnemy,
        storyLog: newStoryLog,
        ambience: dmResponse.ambience || state.ambience,
      };
    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, null);

  return (
    <GameContext.Provider value={{ gameState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextProps => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
