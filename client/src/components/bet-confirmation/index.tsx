import { Slide } from '@material-ui/core';
import { FunctionComponent } from 'react';
import { getMapAndSquadSizeCopy } from 'helpers/common';
import { GameModes } from 'helpers/pl-types';
import {
  Title,
  Payout,
  ModalWrapper,
  ContentWrapper,
  CancelButton,
  ConfirmButton,
  ButtonsWrapper,
  TextContext,
  BlurredBackground,
  HighlightContext
} from './index.styles';

type BetConfirmationType = {
  onConfirm: () => void;
  betAmount: number;
  onCancel: () => void;
  show: boolean;
  payout: string;
  teamSize: number;
  gameMode: GameModes;
};

const BetConfirmation: FunctionComponent<BetConfirmationType> = ({
  onConfirm,
  betAmount,
  onCancel,
  show,
  payout,
  gameMode,
  teamSize,
}: BetConfirmationType) => {
  return (
    <ModalWrapper>
      {show && (
        <BlurredBackground
          onClick={onCancel}
          onKeyPress={onCancel}
          tabIndex={0}
          role="button"
        />
      )}
      <Slide in={show} direction="up">
      <ContentWrapper>
        <Title>Confirm ${betAmount} bet {teamSize && teamSize > 1 && `per player`}</Title>
        <Payout>{`Potential payout: $${payout}`}</Payout>
        <HighlightContext>
          You are betting on <b>{getMapAndSquadSizeCopy(gameMode, teamSize || 1)}</b>. You must play this <b>exact format</b> in Warzone or your bet will be refunded.
        </HighlightContext>

        <TextContext>
          {`$${betAmount} will be removed from each player's wallet. Once your match
          has finished, your winnings may take up to 30 minutes to appear in your
          wallet.`}
        </TextContext>
        <ButtonsWrapper>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          <ConfirmButton onClick={onConfirm}>Confirm</ConfirmButton>
        </ButtonsWrapper>
      </ContentWrapper>
      </Slide>
    </ModalWrapper>
  );
};

export default BetConfirmation;
