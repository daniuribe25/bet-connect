defmodule PlConnect.Cod.Resource.Team.Changes.LinesSelector do
  @moduledoc """
  Ash change, delete the lobbies where the teammates are in
  """

  use Ash.Resource.Change

  def lines_selector do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.before_action(changeset, fn changeset ->
      probabilities_generated = Ash.Changeset.get_attribute(changeset, :probabilities_generated)

      use_generated = if is_nil(probabilities_generated) do
        false
      else
        bl = Map.get(probabilities_generated, :bet_lines, [])
        [:main, :kills, :placement, :damage, :match]
        |> Enum.reduce(true, fn key, acc ->
          line = Map.get(bl, key)
          if !is_nil(line) do
            length(line) < 3
            |> Kernel.!()
            |> (&(&1 and acc)).()
          else
            false
          end
        end)
      end

      changeset
      |> Ash.Changeset.force_change_attribute(:use_generated, use_generated)
    end)
  end
end
