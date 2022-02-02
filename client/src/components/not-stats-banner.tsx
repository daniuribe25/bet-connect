import styled from 'styled-components';
import { FunctionComponent } from 'react';
import { useHistory } from 'react-router';

type NotStatsBanner = {
  gamerTag: string;
};

const BannerWrapper = styled.div`
  background-color: #F6BB43;
  padding: 16px;
  color: #0C273A;
  display: flex;
  flex-direction: column;
`;

const UpdateButton = styled.button`
  background-color: transparent;
  border: 1px solid #0C273A;
  padding: 2px 16px;
  border-radius: 20px;
  font-size: 12.8px;
  font-family: 'Lato';
  cursor: pointer;
  align-self: flex-start;
  margin-top: 8px;
  color: #0C273A;
`;

const Header = styled.h3`
   margin: 0 0 4px 0;
`;


const NotStatsBanner: FunctionComponent<NotStatsBanner> = ({
  gamerTag,
}: NotStatsBanner) => {
  const history = useHistory();

  const handleClickUpdate = (): void => history.push('/noStats');

  return (
    <BannerWrapper>
      <Header>COD stats not public</Header>
      <span>
        Set your COD stats to public for <b>{gamerTag}</b>. It may take up to 30 minutes for updates to be reflected.
      </span>
      <UpdateButton
        onClick={handleClickUpdate}
        onKeyPress={handleClickUpdate}
        tabIndex={0}
      >
        Update
      </UpdateButton>
    </BannerWrapper>
  );
};

export default NotStatsBanner;
