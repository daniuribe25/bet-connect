import { FunctionComponent } from 'react';
import 'react-phone-input-2/lib/style.css';
import { useSelector } from 'react-redux';
import Loading from 'components/loading';
import useAlerts from 'hooks/use-alerts';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/session-slice';
import { GamerTagStep } from '../session/login/components/gamer-tag-step';

export const UpdateGamerTag: FunctionComponent = () => {
  const { loading, alerts } = useSelector(({ session }: RootState) => session);
  useAlerts(alerts, setStoreProperty);

  return (
    <>
      <Loading show={loading} />
      <GamerTagStep fromNoStats />
    </>
  );
};

export default UpdateGamerTag;
