defmodule PlConnect.Cod.Resource.Bet.Changes.ProcessLevel do
  @moduledoc """
  Processing bet
  """
  use Ash.Resource.Change

  alias PlConnect.Api

  require Ash.Query

  @main_bet %{
    rookie: 3.0,
    legend: 5.0,
    diamond: 10.0
  }

  @base_bet %{
    rookie: 1.0,
    legend: 3.0,
    diamond: 5.0
  }

  def process_selected do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.before_action(changeset, fn changeset ->
      bet_format = Ash.Changeset.get_attribute(changeset, :bet_format)
      bets_level_result = Ash.Changeset.get_attribute(changeset, :user_bets_level_result)

      team_id = Ash.Changeset.get_argument(changeset, :team_id)

      team =
        PlConnect.Cod.Team
        |> Ash.Query.filter(id == ^team_id)
        |> Ash.Query.load([:difficulty, :probabilities_calculated, :owner, teammates: [:user]])
        |> Api.read_one!()

      # calculate amounts
      level_requirements = parse_level_results(bets_level_result, bet_format, team)

      total_amount = level_requirements |> Enum.map(& &1.bet_amount) |> Enum.sum()

      changeset
      |> Ash.Changeset.force_change_attribute(:bet_total_amount, total_amount)
      |> Ash.Changeset.force_change_attribute(:required_result, level_requirements)
      |> Ash.Changeset.force_change_attribute(:owner_id, team.owner.id)
      |> Ash.Changeset.force_change_attribute(:team_id, team_id)
      |> Ash.Changeset.force_change_attribute(:difficulty, team.difficulty)
      |> Ash.Changeset.force_change_attribute(:events, [%{event: :created}])
    end)
  end

  defp parse_level_results(level_results, bet_format, %{probabilities_calculated: probabilities}) do
    base_bet = @base_bet[bet_format]
    main_bet = @main_bet[bet_format]

    Enum.map(level_results, fn result ->
      type = result.type
      bet = if type == :main, do: main_bet, else: base_bet
      line = case type do
        :match -> Map.get(probabilities.bet_lines, type) |> List.last()
        _ ->
          Map.get(probabilities.bet_lines, type)
         |> Enum.find(&(&1.level == result.level))
      end

      %{
        type: type,
        value: (if type == :match, do: 1, else: line.goal),
        bet_amount: bet,
        rewarded_amount: line.payout
      }
    end)
  end
end
