import { DetailProps } from 'helpers/pl-types';
import styled from 'styled-components';
import { fontSmall, } from 'styles/typography';


type TournamentDetailsProps = {
  details: DetailProps[]
}

const DetailsWrapper = styled.div`
  background-color: ${({ theme }) => theme.dark.background.primary};
  padding: 16px;
  border-radius: 8px;
`;

const MainHeader = styled.h3`
  color: ${({ theme }) => theme.dark.text.primary};
  margin: 0;
`;

const DetailDescription = styled.div`
  color: ${({ theme }) => theme.dark.text.primary};
  ${fontSmall};
`;

const DetailHeader = styled(DetailDescription)`
  font-weight: 700;
`;

const DetailWrapper = styled.div`
  margin-top: 24px;
`;

const TournamentDetails = ({ details }: TournamentDetailsProps): JSX.Element => {
  return (
    <DetailsWrapper>
      <MainHeader>Details</MainHeader>
      {details.map((detail) => {
        return (
          <DetailWrapper key={detail.header}>
            <DetailHeader>{detail.header}</DetailHeader>
            <DetailDescription>{detail.description}</DetailDescription>
          </DetailWrapper>
        )
      })}
    </DetailsWrapper>
  )
};

export default TournamentDetails;
