import styled from 'styled-components';
import discordImg from 'assets/images/discord_banner.png';

const Link = styled.a`
  position: absolute;
  top: -16px;
  margin-left: 16px;
`;

const DiscordTag = (): JSX.Element => {
  return (
    <Link
      href="https://discord.gg/players-lounge"
      target="_blank"
      rel="noreferrer"
    >
      <img src={discordImg} alt="discord" width={50} />
    </Link>
  );
};

export default DiscordTag;
