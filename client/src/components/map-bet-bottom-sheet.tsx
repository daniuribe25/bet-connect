import { useApolloClient } from '@apollo/client';
import { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GameModes, CategoriesType } from 'helpers/pl-types';
import {
  trackBetSize,
  trackChangedMap,
  trackSwitchGameMode,
} from 'helpers/segment-analytics';
import { createTeam, disbandTeam } from 'redux/actions/lobby-actions';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { useMapBetBottomSheetStyles } from 'styles/index';
import { getMapAndSquadSizeCopy } from 'helpers/common';
import { REACT_APP_MIN_REBIRTH_MEMBERS } from 'helpers/env';

const squadSizeOptions = [
  { text: 'Solos', value: 1 },
  { text: 'Duos', value: 2 },
  { text: 'Trios', value: 3 },
  { text: 'Quads', value: 4 },
];

const categoryOptions = [
  { text: '$3', addOnText: '$1', value: 'rookie' },
  { text: '$5', addOnText: '$3', value: 'legend' },
  { text: '$10', addOnText: '$5', value: 'diamond' },
];

const MapBetBottomSheet: FunctionComponent<any> = ({
  gameMode,
  pickedCategory,
  squadSize,
  show,
  onClose,
  teamUsers,
  teamId,
  isGameMode,
}: any) => {
  const classes = useMapBetBottomSheetStyles();
  const dispatch = useDispatch();
  const apollo = useApolloClient();
  const numPlayers = teamUsers.filter((x: any) => x).length
  const [teamUpdates, setTeamUpdates] = useState<any>({})

  const handleClose = (): void => {
    setTeamUpdates({});
    onClose();
  }

  const trackChangeEvents = (): void => {
    if (teamUpdates.gameMode && +teamUpdates?.gameMode !== gameMode) {
      trackSwitchGameMode(teamUpdates?.gameMode, teamUsers, teamId);
      trackChangedMap(teamUpdates?.gameMode);
    }

    if (
      teamUpdates?.pickedCategory &&
      teamUpdates?.pickedCategory !== pickedCategory
    ) {
      trackBetSize(teamUpdates?.pickedCategory);
    }
  };

  const handleUpdateTeam = async (): Promise<null | void> => {
    if (
      (teamUpdates?.gameMode && +teamUpdates.gameMode !== gameMode) ||
      (teamUpdates?.pickedCategory && teamUpdates.pickedCategory !== pickedCategory) ||
      (teamUpdates?.squadSize && teamUpdates.squadSize !== squadSize)
    ) {
      dispatch(setStoreProperty(['autoCreateSolo', 0]));
      trackChangeEvents();

      const disbandAnswer: any = await dispatch(disbandTeam({ apollo, showAlert: false }));
      if (disbandAnswer.payload?.step === 1) {
        setTimeout(async () => {
          await dispatch(
            createTeam({
              apollo,
              teamUsers,
              isUpdatingTeam: true,
              gameMode: teamUpdates?.gameMode ? +teamUpdates?.gameMode : gameMode,
              pickedCategory: teamUpdates?.pickedCategory || pickedCategory,
              squadSize: teamUpdates?.squadSize || squadSize
            }),
          );
        }, 1000);
      }
    }
    handleClose();
  };

  const handleChange = (key: string, value: any): void => {
    dispatch(setStoreProperty(['isProcessing', true]));
    const newTeamUpdates = { ...teamUpdates, [key]: value };
    setTeamUpdates(newTeamUpdates);
  };

  const isGameModeSelected = (gm: GameModes): boolean =>
    teamUpdates?.gameMode === gm.toString() || (!teamUpdates?.gameMode && gameMode === gm)
  const isBetFormatSelected = (battlenet: CategoriesType): boolean =>
    teamUpdates?.pickedCategory === battlenet || (!teamUpdates?.pickedCategory && pickedCategory === battlenet)

  const isSquadSizeSelected = (size: number): boolean =>
    (teamUpdates.gameMode)
      ? (teamUpdates?.squadSize === size)
      : (squadSize === size)

  const isSquadSizeOptionDisabled = (size: number): boolean => {
    return ((teamUpdates.gameMode ?
      (+teamUpdates.gameMode === GameModes.Rebirth) : gameMode === GameModes.Rebirth)
      && size < (+(REACT_APP_MIN_REBIRTH_MEMBERS || 1)))
      || numPlayers > size
    }

  const getTextColor = (size: number, isMainText: boolean): string => {
    if (isSquadSizeOptionDisabled(size)) { return '#7e8a93'; }
    return isMainText ? '#fff' : '#D4E2EC !important'
  }

  const handleClickRoot = (e: any): void => {
    dispatch(setStoreProperty(['teamUpdates', null]));
    if (e.target.className.includes('bottom-sheet')) handleClose();
  };

  useEffect(() => {
    if (teamUpdates.pickedCategory || teamUpdates.squadSize) {
      handleUpdateTeam();
    }
  }, [teamUpdates.gameMode, teamUpdates.pickedCategory, teamUpdates.squadSize])

  return (
    show && (
      <div
        className={`${classes.root} bottom-sheet`}
        onClick={handleClickRoot}
        onKeyPress={handleClickRoot}
        role="button"
        tabIndex={0}
      >
        <div className={classes.bottomSheetRoot}>
          {isGameMode ? (
            <>
              <div className={classes.section}>
                <h3>What are you playing in game?</h3>
                <div className={classes.gameModeTiles}>
                  <button className={
                    `${classes.gameModeTile}${isGameModeSelected(GameModes.Caldera) ?
                      ` ${classes.gameModeTileSelected}` : '' }`
                    }
                    type="button"
                    onClick={() => handleChange('gameMode', GameModes.Caldera.toString())}
                  >
                    <span>Caldera</span>
                  </button>
                  <button className={
                    `${classes.gameModeTile}${isGameModeSelected(GameModes.Rebirth) ?
                      ` ${classes.gameModeTileSelected}` : '' }`
                    }
                    type="button"
                    onClick={() => handleChange('gameMode', GameModes.Rebirth.toString())}
                  >
                    <span>Rebirth Island</span>
                  </button>
                </div>
              </div>

              <div className={classes.section}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {squadSizeOptions.map(sizeOption => (
                    <button
                      key={sizeOption.value}
                      type="button"
                      className={`betFormatLabel ${isSquadSizeSelected(sizeOption.value) ? 'betFormatLabelSelected' : ''}`}
                      onClick={() => !isSquadSizeOptionDisabled(sizeOption.value) ? handleChange('squadSize', sizeOption.value) : null}
                    >
                      <h4
                        style={{ color: getTextColor(sizeOption.value, true) }}
                      >
                        {getMapAndSquadSizeCopy(teamUpdates.gameMode ? +teamUpdates.gameMode : gameMode, sizeOption.value)}
                      </h4>
                      {numPlayers > sizeOption.value && <span style={{ color: getTextColor(sizeOption.value, false) }}>Too many players</span>}
                      {numPlayers < sizeOption.value && <span style={{ color: getTextColor(sizeOption.value, false) }}>Only your PL Connect team will contribute to the bet</span>}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className={classes.section}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {categoryOptions.map((categoty: any) => (
                  <button
                    key={categoty.value}
                    type="button"
                    className={`betFormatLabel ${isBetFormatSelected(categoty.value) ? 'betFormatLabelSelected' : ''}`}
                    onClick={() => handleChange('pickedCategory', categoty.value)}
                    style={{
                      borderTopLeftRadius: categoty.value === 'rookie' ? '15px' : '0',
                      borderTopRightRadius: categoty.value === 'rookie' ? '15px' : '0',
                    }}
                  >
                    <h4>{categoty.text} main bet</h4>
                    <span>{categoty.addOnText} add on bets</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default MapBetBottomSheet;
