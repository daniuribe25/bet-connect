import {  useEffect } from 'react';
import styled from 'styled-components';
import { Box } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { useBetTasksStyles } from 'styles/index';
import { GameModeBottomSheetStates } from 'components/game-mode-picker';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { CenterSpinner } from 'components/core/loading-spinner';
import MapBetBottomSheet from 'components/map-bet-bottom-sheet';
import { getBetAnte } from 'helpers/common';
import BetLevels from './bet-levels';
import BetColorTile from './bet-color-tile';

const OutterWrapper = styled.div`
  margin-bottom: 5rem;
`;

const InnerWrapper = styled.div`
  padding: 0 16px 16px 16px;
`;

const GreaterTeamWarning = styled.div`
  width: 100%;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #104A77;
  color: #ffffff;
  border-radius: 10px;
  margin-bottom: 8px;
`;

export const getMainBetGoalsRank = (minPrize: number): Array<number> => {
  if (!minPrize) return [];
  const rank = [minPrize];
  for (let i = 0; i < 9; i += 1) {
    rank.push(rank[i] + 1);
  }
  return rank;
};

export const TaskList = (): JSX.Element => {
  const dispatch = useDispatch();
  const styles = useBetTasksStyles({});
  const {
    bets,
    pickedCategory,
    pickedBets,
    betLevels,
    isCaptain,
    teamId,
    gameMode,
    teamUpdates,
    teamUsers,
    squadSize,
    gameModeBottomSheetStatus,
  } = useSelector(({ lobby }: RootState) => lobby);

  const handleCloseBottomSheet = (): void => {
    dispatch(setStoreProperty(['gameModeBottomSheetStatus', GameModeBottomSheetStates.closed]))
  }

  useEffect(() => {
    const newPickedBets = {
      ...pickedBets,
      main: {
        checked: true,
        level: bets?.main[1]?.level,
        value: bets?.main[1]?.goal,
        payout: bets?.main[1]?.payout,
      },
    };
    if (isCaptain) dispatch(setStoreProperty(['pickedBets', newPickedBets]));
  }, [betLevels, bets]);

  const mainAnte = getBetAnte(pickedCategory, true);
  const addonAnte = getBetAnte(pickedCategory, false);

  return bets ? (
    <>
      <OutterWrapper>
        <InnerWrapper>
          {squadSize > teamUsers.filter((x:any) => x).length && (
            <GreaterTeamWarning>
              <InfoIcon fontSize="small" />&nbsp;
              Connect party smaller than selected game mode
            </GreaterTeamWarning>
          )}
          <Box
            display="flex"
            alignItems="flex-end"
            justifyContent="space-between"
          >
            <span className={styles.betAnteText}>
              Kills{' '}
              <span className={styles.betAnteTextAmount}>{`$${mainAnte}`}</span>
            </span>
          </Box>

          <BetLevels bet={bets?.main} type="main" ante={mainAnte} />
          {bets.placement && bets.placement.length > 0 && (
            <>
              <span className={styles.betAnteText}>
                Placement{' '}
                <span className={styles.betAnteTextAmount}>{`$${addonAnte}`}</span>
              </span>
              <BetLevels bet={bets.placement} type="placement" ante={addonAnte} />
            </>
          )}
          {bets.damage && bets.damage.length > 0 && (
            <>
              <span className={`${styles.betAnteText} ${styles.betDamageAnteText}`}>
                Damage <span className={styles.betAnteTextAmount}>{`$${addonAnte}`}</span>
              </span>
              <BetLevels bet={bets?.damage} type="damage" ante={addonAnte} />
            </>
          )}
        </InnerWrapper>

        <InnerWrapper>
          <span className={styles.betAnteText}>
            Bonus bets{' '}
            <span className={styles.betAnteTextAmount}>{`$${addonAnte} each`}</span>
          </span>
          <div className={styles.grandBetsCont}>

            <BetColorTile
              anteColor="#8442F8"
              ante={addonAnte}
              amount="Finish 1st"
              payout={bets?.match && bets?.match.length > 0 ? bets?.match[bets.match.length - 1]?.payout : 2}
              type="match"
            />
          </div>
          </InnerWrapper>
        </OutterWrapper>
        <MapBetBottomSheet
          isGameMode
          gameMode={gameMode}
          pickedCategory={pickedCategory}
          teamUpdates={teamUpdates}
          show={gameModeBottomSheetStatus === GameModeBottomSheetStates.openGameMode}
          onClose={handleCloseBottomSheet}
          teamUsers={teamUsers}
          teamId={teamId}
          squadSize={squadSize}
        />
        <MapBetBottomSheet
          gameMode={gameMode}
          pickedCategory={pickedCategory}
          teamUpdates={teamUpdates}
          show={gameModeBottomSheetStatus === GameModeBottomSheetStates.openCategory}
          onClose={handleCloseBottomSheet}
          teamUsers={teamUsers}
          teamId={teamId}
          squadSize={squadSize}
        />
      </>
    ) : (
      <CenterSpinner size={80} />
    );
};

export default TaskList;
