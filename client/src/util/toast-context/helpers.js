const secondsFromCharacters = (heading = '', subtext = '') => {
  const characters = heading.length + subtext.length;
  if (characters > 120) {
    return (Math.floor(characters / 120) + 5) * 1000;
  }
  return 5000;
};

export default secondsFromCharacters;
