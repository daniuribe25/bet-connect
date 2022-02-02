import pandas as pd


def get_df(fpath: str, game_mode: str, col: str) -> pd.DataFrame:
    """Return the correct dataframe, sliced by game mode and column.
    """
    df = pd.read_csv(fpath)
    if len(df[df['Type'] == game_mode][col]) > 0:
        return df[df['Type'] == game_mode][col]
    else:
        return df[col]


def mapping(fnames) -> dict:
    """Create dict for tags: filename.
    """
    directory = {}
    for f in fnames:
        tag = f.split('/')[-1].split('.')[0]  # extract tags from filename
        directory[tag] = f
    return directory


def stylize(df):
    """Pretty display on streamlit.

    # https://discuss.streamlit.io/t/change-the-way-date-get-displayed-in-a-table-from-a-pandas-dataframe/2591
    """
    styler = df.style.format({
        "Prob": lambda t: '{:.1f}%'.format(t * 100),
        "Total_Payout": lambda t: '${:.2f}'.format(t),
        "Net_Payout" : lambda t: '${:.2f}'.format(t)
        })
    return styler